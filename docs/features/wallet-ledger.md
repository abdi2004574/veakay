# Wallet Ledger & Withdrawals

## Goal

Provide a processor-agnostic wallet ledger so the eventual funding-rail decision (JazzCash / Easypaisa / bank gateway / Stripe Connect — TBD per the client's confirmation) can be wired in as a single concrete implementation of the existing `IFundingProvider` interface, without changing the service layer that owns balances, transactions, and the withdrawal state machine. The MVP ships the ledger, the interface boundary, an admin-only manual credit endpoint for ops reconciliation, and a deliberate two-stamp approval flow (`requested ? approved ? paid`) where the wallet debit is deferred to the processor's "paid" signal so a reversal cannot strand a negative balance.

## MVP Scope

- **`WalletAccount`** — one row per user, auto-created on first access, single-currency MVP default `USD`, holds a `cachedBalance` decimal updated transactionally with every credit/debit.
- **Append-only `WalletTransaction` ledger** — every credit/debit writes a row with `direction`, `amount`, `currency`, `type` (enum), `referenceType`, `referenceId`, optional `idempotencyKey` (unique), and a free-text `description`. No row is ever updated or deleted after insert; reversals are new rows.
- **Reworked `Donation`** — decoupled from Stripe-specific fields (`stripe_payment_intent_id`, `status` dropped); gains `donorDisplayName` and `walletTransactionId` (unique) so a donation is linked to the wallet credit it produced.
- **Reworked `WithdrawalRequest`** — new status flow `requested ? approved | rejected ? paid`; gains `currency`, `highValueThreshold` (stored, not yet enforced), `walletTransactionId` (unique, set when paid), `rejectionReason`; loses `stripe_payout_id`; `payoutAccountId` becomes optional (the funding-rail vendor is TBD).
- **`IFundingProvider` interface** + `FUNDING_PROVIDER` injection token — the seam where the eventual processor (JazzCash / Easypaisa / bank gateway / Stripe Connect) plugs in. Today it has one method (`deposit`) returning `{ ok, externalId?, message? }`.
- **`ManualFundingProvider` stub** — the only current implementation; always returns `{ ok: true }`. Exposes a single admin-only endpoint (`POST /admin/wallet/wallets/:userId/credit`) for ops to credit balances during reconciliation. No public money movement.
- **Idempotency-Key header** — required on every wallet-mutating endpoint, validated by `IdempotencyKeyGuard` (8-128 chars). The key is persisted on `WalletTransaction.idempotencyKey` (unique) so a retry returns the original transaction instead of double-writing.
- **Pino audit log** — every state change writes a structured JSON line via `Logger` with a stable `audit` discriminator: `wallet.transaction`, `wallet.withdrawal.requested`, `wallet.withdrawal.reviewed`, `wallet.withdrawal.paid`. Sufficient for the admin audit-trail surface area today.
- **Admin-only ops reconciliation for mark-paid** — `POST /admin/wallet/withdrawals/:id/mark-paid` exists so ops staff can manually reconcile transfers that happened outside the system. This endpoint is removed when the processor webhook replaces it.
- **`recordDonation` internal hook** — a service method called from the (TBD) processor webhook handler when a real donation completes. Atomically writes the donation row + the wallet credit + the campaign `raised_amount` increment, all in one Prisma `$transaction`. Not exposed via any HTTP endpoint by design — the public donation surface stays processor-specific and is built alongside the real provider.

## Later Scope

- Real processor integration (JazzCash / Easypaisa / bank gateway / Stripe Connect — TBD) as a concrete `IFundingProvider`.
- Commission splitting on the booking-payment wallet type (enum value reserved, no service method writes it today).
- Refund-after-withdrawal handling (TRD Open Question #4 — see Open Questions table).
- High-value threshold enforcement (TRD Open Question #3 — `withdrawal_requests.high_value_threshold` column is kept on the model for the future; no gate reads it today).
- Public donation endpoint that calls the real processor (the processor-specific surface stays stubbed today; the seam is `IFundingProvider`).
- Agency subscription billing (TRD Open Question #28 — explicitly out of scope for this feature; web-based Stripe Billing is the working assumption per AGENTS.md).
- KYC verification step for high-value withdrawals (TRD Open Questions #3 / #5).
- Webhook handler that calls `markWithdrawalPaid` automatically (currently admin-only via `POST /admin/wallet/withdrawals/:id/mark-paid`).
- Currency support beyond the MVP default `USD`. The schema accepts any 3-char currency string; multi-currency conversion, FX, and per-user currency preference are not built.

## Roles and Permissions

| Action | Allowed role | Condition |
|---|---|---|
| View own wallet / list own transactions | traveler, agency | Class-level `@RequireRole(UserRole.traveler, UserRole.agency)`; no ownership check beyond `userId === caller` |
| Request a withdrawal | traveler, agency | `@RequireRole(traveler, agency)`; service verifies balance + currency before insert |
| View own withdrawal list / detail | traveler, agency | Service throws 404 (not 403) on cross-user detail to avoid leaking existence |
| Admin credit any user's wallet | super_admin | `@RequirePlatformRole(super_admin)` + `IdempotencyKeyGuard`; service verifies `target.isActive` (404 otherwise) |
| Review a withdrawal (approve/reject) | super_admin | `@RequirePlatformRole(super_admin)` + `IdempotencyKeyGuard`; service enforces `status === requested` (422 otherwise) |
| Mark an approved withdrawal paid | super_admin | `@RequirePlatformRole(super_admin)` + `IdempotencyKeyGuard`; service enforces `status === approved` (422 otherwise); this endpoint is removed once the processor webhook lands |
| List all withdrawals across the platform | super_admin | `@RequirePlatformRole(super_admin)`; optional `?status=` filter, cursor-paginated |
| Receive an automatic donation via `recordDonation` | n/a (internal) | Called by the (TBD) processor webhook handler; not exposed via HTTP |

## Main Flows

### Admin manually credits a user wallet (ops reconciliation)

```text
1. Admin calls POST /admin/wallet/wallets/:userId/credit with Idempotency-Key and body { amount, currency, description? }.
2. IdempotencyKeyGuard validates the header (8-128 chars).
3. WalletService.adminCredit resolves the target user (404 if missing or isActive=false).
4. fundingProvider.deposit({ amount, currency, referenceType: 'manual_admin_credit', idempotencyKey }) is called.
   - ManualFundingProvider always returns { ok: true }.
   - The eventual processor will perform the external transfer and return its reference id.
5. WalletService.credit({ type: donation_received, idempotencyKey, ... }) writes a single ledger row and increments cachedBalance inside one Prisma $transaction.
   - If a row with the same idempotencyKey already exists, _writeTransaction returns it unchanged (no double credit, no double balance update).
6. The admin credit endpoint returns the resulting WalletTransaction.
```

### Traveler requests a withdrawal (requested ? approved ? paid)

```text
1. Traveler calls POST /me/wallet/withdrawals with Idempotency-Key and body { amount, currency, campaignId? }.
2. IdempotencyKeyGuard validates the header.
3. WalletService.requestWithdrawal verifies balance = amount (422 if insufficient) and currency match (422 if mismatch).
4. WithdrawalRequest row created with status=requested, high_value_threshold=null. Balance is NOT debited — debit waits on mark-paid.
5. Admin reviews via PATCH /admin/wallet/withdrawals/:id/review with { decision: 'approved' | 'rejected', reason? }.
   - Only status=requested can transition; any other status returns 422.
   - Approved: status ? approved. Balance still NOT debited (deliberate design — see Edge Cases).
   - Rejected: status ? rejected, rejectionReason stored.
6. When the (TBD) processor confirms the external transfer, its webhook handler calls POST /admin/wallet/withdrawals/:id/mark-paid (or the equivalent internal call) with Idempotency-Key.
   - WalletService.markWithdrawalPaid verifies status=approved (422 otherwise).
   - WalletService.debit({ type: withdrawal, ... }) writes a single debit ledger row and decrements cachedBalance inside one Prisma $transaction.
   - WithdrawalRequest updated to status=paid and walletTransactionId set.
7. The admin-only mark-paid endpoint is the MVP reconciliation path; it is removed once the processor webhook lands.
```

### Donation credited via the internal recordDonation hook

```text
1. The (TBD) processor webhook handler receives a `donation.completed` event.
2. The handler calls WalletService.recordDonation({ campaignId, donorUserId?, donorDisplayName?, amount, currency, isAnonymous, isGift, giftMessage?, idempotencyKey }).
3. Service opens one Prisma $transaction:
   a. Look up the campaign; 404 if missing.
   b. Look up the campaign creator; 422 if missing/inactive/admin (admin cannot receive donations).
   c. Create the Donation row (wallet_transaction_id is null at this point).
   d. Get-or-create the creator's WalletAccount; 422 on currency mismatch.
   e. Increment the creator's cachedBalance.
   f. Create the WalletTransaction row (direction: credit, type: donation_received) with the idempotency key.
   g. Increment Campaign.raisedAmount.
   h. Update the Donation row to set wallet_transaction_id.
4. If a wallet transaction with the same idempotencyKey already exists, return { donation, transaction } referencing the existing row — no double-write.
5. No HTTP endpoint exposes recordDonation. The public donation surface (the processor-specific path) is built alongside the real provider.
```

## API Endpoints

### Traveler / Agency — wallet.controller.ts, @Controller('me/wallet')

| Method | Path | Auth | Summary | Idempotency-Key |
|---|---|---|---|---|
| GET | /me/wallet | @RequireRole(traveler, agency) | Get my wallet (auto-creates on first call). | — |
| GET | /me/wallet/transactions | @RequireRole(traveler, agency) | List my transactions, cursor-paginated, optional `?type=` filter. | — |
| GET | /me/wallet/withdrawals | @RequireRole(traveler, agency) | List my withdrawal requests, cursor-paginated. | — |
| POST | /me/wallet/withdrawals | @RequireRole(traveler, agency) | Request a withdrawal (status=requested, balance unchanged). | required |
| GET | /me/wallet/withdrawals/:id | @RequireRole(traveler, agency) | Get one of my withdrawal requests (404 on another user's). | — |

### Super Admin — admin-wallet.controller.ts, @Controller('admin/wallet')

| Method | Path | Auth | Summary | Idempotency-Key |
|---|---|---|---|---|
| GET | /admin/wallet/withdrawals | @RequirePlatformRole(super_admin) | List all withdrawal requests across the platform, optional `?status=` filter, cursor-paginated, includes user email/username. | — |
| GET | /admin/wallet/withdrawals/:id | @RequirePlatformRole(super_admin) | Get one withdrawal request detail (includes user info). | — |
| PATCH | /admin/wallet/withdrawals/:id/review | @RequirePlatformRole(super_admin) | Approve or reject a `requested` withdrawal (`{ decision, reason? }`); status transitions to `approved` or `rejected`. | required |
| POST | /admin/wallet/withdrawals/:id/mark-paid | @RequirePlatformRole(super_admin) | Mark an `approved` withdrawal as paid; writes the debit ledger row and decrements balance. MVP-only ops reconciliation; replaced by processor webhook. | required |
| POST | /admin/wallet/wallets/:userId/credit | @RequirePlatformRole(super_admin) | Manually credit a user wallet (ops reconciliation); body `{ amount, currency, description? }`. | required |

## Database Models

### New / reworked models

```text
wallet_accounts
  id                UUID PK
  user_id           UUID FK ? users, UNIQUE  (one wallet per user)
  currency          VARCHAR default: 'USD'
  cached_balance    DECIMAL default: 0
  created_at        TIMESTAMP
  updated_at        TIMESTAMP

wallet_transactions
  id                 UUID PK
  wallet_account_id  UUID FK ? wallet_accounts
  direction          ENUM: credit | debit
  amount             DECIMAL
  currency           VARCHAR default: 'USD'
  type               ENUM: donation_received | withdrawal | refund | commission | booking_payment
  reference_type     VARCHAR nullable
  reference_id       VARCHAR nullable
  idempotency_key    VARCHAR nullable, UNIQUE
  description        VARCHAR nullable
  created_at         TIMESTAMP
  INDEX (wallet_account_id, created_at)

withdrawal_requests (reworked)
  id                    UUID PK
  user_id               UUID FK ? users
  campaign_id           UUID FK ? campaigns nullable
  payout_account_id     UUID FK ? payout_accounts nullable
  amount                DECIMAL
  currency              VARCHAR default: 'USD'
  status                ENUM: requested | approved | rejected | paid default: requested
  high_value_threshold  DECIMAL nullable  (stored, not yet enforced — see Open Questions)
  wallet_transaction_id UUID FK ? wallet_transactions UNIQUE nullable  (set on mark-paid)
  rejection_reason      VARCHAR nullable
  created_at            TIMESTAMP
  updated_at            TIMESTAMP

donations (reworked)
  id                    UUID PK
  campaign_id           UUID FK ? campaigns
  donor_user_id         UUID FK ? users nullable
  donor_display_name    VARCHAR nullable  (new — replaces anonymous gift rendering)
  amount                DECIMAL
  currency              VARCHAR default: 'USD'
  is_anonymous          BOOLEAN default: false
  gift_message          VARCHAR nullable
  is_gift               BOOLEAN default: false
  wallet_transaction_id UUID FK ? wallet_transactions UNIQUE nullable  (set by recordDonation)
  receipt_email_sent_at TIMESTAMP nullable
  created_at            TIMESTAMP
  updated_at            TIMESTAMP
```

### Deprecated models (kept in schema, no live code paths)

```text
stripe_connect_accounts  /// DEPRECATED / pending funding-rail decision
payment_methods           /// DEPRECATED / pending funding-rail decision
payout_accounts          /// DEPRECATED / pending funding-rail decision
stripe_webhook_events     /// DEPRECATED / pending funding-rail decision
```

These are retained so the eventual processor integration (Stripe Connect, JazzCash, Easypaisa, bank gateway — TBD) has somewhere to land without a destructive migration. They carry no live code paths in this build.

### Schema changes from migration `20260904060000_wallet_ledger`

- New enums: `WalletTransactionDirection` (credit, debit), `WalletTransactionType` (donation_received, withdrawal, refund, commission, booking_payment).
- New table: `wallet_accounts` with unique index on `user_id`, FK to `users`.
- New table: `wallet_transactions` with unique index on `idempotency_key`, composite index on `(wallet_account_id, created_at)`, FK to `wallet_accounts`.
- `donations`: dropped `stripe_payment_intent_id` and `status`; added `donor_display_name` and `wallet_transaction_id` (unique).
- `withdrawal_requests`: dropped `stripe_payout_id`; made `payout_account_id` nullable; added `currency`, `high_value_threshold`, `wallet_transaction_id` (unique), `rejection_reason`; migrated `status` from old `WithdrawalStatus` to the new flow (requested | approved | rejected | paid); re-established FK to `payout_accounts` with `SET NULL`.
- Dropped old enums `DonationStatus` and `WithdrawalStatus`.

### Media / object-key structure

Not applicable — the wallet ledger stores no media. All amounts are `DECIMAL` in the wallet account currency.

## Interface Boundary

The `IFundingProvider` interface (`src/modules/wallet/interfaces/funding-provider.interface.ts`) is the seam where the eventual processor integration lands.

```ts
export interface FundingDepositRequest {
  walletAccountId: string;
  amount: number;
  currency: string;
  referenceType: string;
  referenceId: string;
  idempotencyKey: string;
  description?: string;
}

export interface FundingProviderResult {
  ok: boolean;
  externalId?: string;
  message?: string;
}

export interface IFundingProvider {
  readonly name: string;
  deposit(request: FundingDepositRequest): Promise<FundingProviderResult>;
}

export const FUNDING_PROVIDER = Symbol('FUNDING_PROVIDER');
```

- `WalletService` is injected with `IFundingProvider` via the `FUNDING_PROVIDER` token. The service never imports a concrete provider directly.
- `ManualFundingProvider` (`src/modules/wallet/funding/manual-funding.provider.ts`) is the only current implementation. Its `deposit` always returns `{ ok: true }` — there is no external transfer.
- When the client confirms the funding rail, the new provider (JazzCash / Easypaisa / bank gateway / Stripe Connect — TBD) implements the same `deposit` signature and is registered in `WalletModule`'s providers array. `WalletService` does not change.
- The `name` field on the provider is included in every Pino audit log entry so the eventual real provider is identifiable in logs.

## Edge Cases

- **Currency mismatch (422)** — Both `credit`/`debit` and `requestWithdrawal` check `account.currency !== params.currency` and throw `AppException.businessRule('Currency mismatch.')` (HTTP 422). MVP is single-currency `USD`; multi-currency conversion is not built.
- **Insufficient balance (422)** — `debit` and `requestWithdrawal` both check `cachedBalance < amount` and throw `AppException.businessRule('Insufficient wallet balance.')` (HTTP 422). On `requestWithdrawal`, balance is unchanged because debit waits on `mark-paid`.
- **Idempotency replay** — When a request carries an `Idempotency-Key` that already exists on a `WalletTransaction`, `_writeTransaction` returns the existing row instead of inserting a new one. Balance is unchanged. This is the deliberate behavior for both same-body and different-body replays — see the test `idempotency replay: same key + different body returns ORIGINAL transaction, NOT 409` in `test/wallet.e2e-spec.ts`. The unique constraint on `idempotency_key` is the database safety net; the service-layer short-circuit is the optimization.
- **Status transition guards** — `reviewWithdrawal` rejects anything not in `requested` (422). `markWithdrawalPaid` rejects anything not in `approved` (422). `rejectWithdrawal` is invoked internally from `reviewWithdrawal` when `decision === 'rejected'`; it does not check the current status (the caller already did).
- **Two-stamp design (debit on paid, not on approve)** — Approving a withdrawal only flips the status. The wallet is debited on `mark-paid`, when the (TBD) processor signals a successful external transfer. This means a reversal between approve and paid cannot strand a negative balance. The MVP exposes `mark-paid` as an admin-only ops endpoint precisely because there is no real processor yet; when the processor lands, that endpoint is removed and `markWithdrawalPaid` is called only from the webhook handler.
- **Deactivated user** — `adminCredit` returns 404 (not 403) when the target user is `!isActive`, matching the campaign-private pattern of not leaking existence.
- **Cross-user withdrawal detail** — `getWithdrawalDetail` returns 404 when a traveler/agency tries to read another user's withdrawal (not 403), again matching the no-leak pattern.
- **Single-currency MVP** — Default currency is `USD` on `WalletAccount` and every DTO. The schema accepts any 3-char currency string, but multi-currency conversion, FX rates, and per-user currency preference are not built.
- **Audit-log emission contract** — Every state change emits a single structured Pino log line with an `audit` discriminator field (`wallet.transaction`, `wallet.withdrawal.requested`, `wallet.withdrawal.reviewed`, `wallet.withdrawal.paid`) and the actor id, withdrawal id, amount, currency, idempotency key, and provider name. The `audit` field is the stable key for log queries.
- **`recordDonation` is internal-only** — No HTTP endpoint exposes it. The processor webhook handler is the only caller in the eventual real flow. The 41 unit tests on `recordDonation` cover the internal service hook; E2E coverage of the public donation surface lands with the real processor.
- **`requestWithdrawal` does not enforce idempotency at the service layer** — The `IdempotencyKeyGuard` validates the header is present (8-128 chars), but the service currently ignores the key and `withdrawal_requests` has no `idempotency_key` column. A replay of the same key creates a duplicate row. This is a known gap; either the column is added and the service is updated to short-circuit on the key, or duplicate-detection moves upstream to the client. Tracked as a follow-up — not blocking the MVP because the only money-moving caller in this build is `adminCredit`, which IS idempotent.
- **Admin mark-paid replay** — Calling `mark-paid` on an already-`paid` withdrawal returns 422 (status guard fires). The ledger is not double-debited because `_writeTransaction` short-circuits on the idempotency key.

## Open Questions (deferred — not blocking)

| # | Question | Resolution for this feature |
|---|---|---|
| #3 | High-value withdrawal threshold | `withdrawal_requests.high_value_threshold` column is reserved on the model for the future; no service code reads it yet. Revisit when the funding rail is confirmed and the KYC step (#3/#5) lands. |
| #4 | Refund-after-withdrawal / clawback | Not built. When the funding rail lands, define whether `mark-paid` reversal creates a credit ledger row + status `refunded` (new enum value) or a separate `refunds` table. Schema-agnostic for now. |
| #5 | "Verification" overloaded across 3 concepts | The withdrawal-eligibility gate (campaign-verification, identity-verification, verified-campaign-badge) is not implemented in this pass. Service-level hook will live in `requestWithdrawal` once the verification model exists. |
| #27 | Platform fee on donations vs. commission | Full donation amount is credited to the creator's wallet; no fee is deducted. When the funding rail lands, the provider's `deposit` result can include a `fee` field that the service splits off into a separate `commission` ledger row. |

Note: TRD Open Question #28 (subscription tier purchase channel) is explicitly unrelated to this feature — it concerns agency subscription billing, not wallet/donation flows. The working assumption per AGENTS.md is a web-based Stripe Billing page.
