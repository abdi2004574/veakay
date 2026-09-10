# Payments & Wallet Architecture

## Overview

Veakay uses a **processor-agnostic wallet ledger** as the single source of truth
for all monetary movements. The wallet ledger is already implemented in the
backend (WalletAccount, WalletTransaction, WalletEntry).

External payment processors are plugged in via the IFundingProvider
interface. Today only one provider exists: ManualFundingProvider, used for
admin-initiated test flows and as a reference implementation.

**RevenueCat** is used exclusively for **agency subscription tiers**
(Basic / Premium / Featured). It does not handle donations, traveler
withdrawals, or agency payouts.

**The funding rail for donations and withdrawals is OPEN.** No processor has
been selected. Do not wire Stripe, PayPal, or any other provider until the
client confirms the decision. See docs/Veakay_TRD_Open_Questions.md items
#3, #5, #14, #23.

---

## Apple / Google In-App Purchase (IAP)

**Not used** for any money flow in Veakay.

- Agency subscription tiers are billed via RevenueCat's web-based Stripe
  Billing integration (sidesteps App Store / Play Store commissions).
- Traveler donations and withdrawals flow through the wallet ledger +
  the yet-to-be-decided funding rail, not through IAP.
- If the client later requires IAP for any reason, it must be added behind
  IFundingProvider and approved via open question #28.

---

## Agency Subscription Tiers (RevenueCat)

| Tier     | Monthly Price | Platform Commission | RevenueCat Product ID (sandbox) |
|----------|---------------|---------------------|---------------------------------|
| Basic    |             | 15%                 | gency_basic_monthly          |
| Premium  |            | 10%                 | gency_premium_monthly        |
| Featured |            | 8%                  | gency_featured_monthly       |

- Commission percentages are **configurable** via environment variables
  (AGENCY_COMMISSION_BASIC, etc.), not hardcoded.
- Subscription state is synced from RevenueCat webhooks ? gencies.subscription_tier,
  gencies.subscription_status, gencies.revenuecat_customer_id.
- Downgrades/upgrades/cancellations are handled by RevenueCat; the backend
  only reflects the resulting tier in gencies.subscription_tier.
- The first Super Admin must manually seed the first agency's RevenueCat
  customer record if needed; no self-serve agency sign-up creates a RevenueCat
  customer automatically.

---

## Money Flows

### 1. Donation (Traveler ? Campaign)

`
Traveler calls POST /api/v1/campaigns/:id/donate
  ? WalletService.createDonationIntent(campaignId, amount, travelerId)
  ? Returns { fundingIntentId, provider: "manual" | "<chosen>" }
  ? Frontend redirects to provider checkout (or shows manual instructions)
  ? Provider webhook / admin confirmation ? WalletService.confirmFunding(fundingIntentId)
  ? Wallet ledger entries:
      DEBIT  traveler WalletAccount (type: DONATION_OUT)
      CREDIT campaign WalletAccount (type: DONATION_IN)
  ? Campaign.current_amount += amount
  ? Notification to traveler + campaign owner
`

**Idempotency:** Idempotency-Key header required; stored on WalletTransaction.idempotency_key.

### 2. Withdrawal (Campaign Owner ? Bank)

`
Campaign owner calls POST /api/v1/campaigns/:id/withdraw
  ? WalletService.createWithdrawalIntent(campaignId, amount, ownerId)
  ? Validates: campaign.status = FUNDED, amount <= available_balance,
    KYC complete (if threshold exceeded), bank account on file
  ? Returns { withdrawalIntentId, provider: "manual" | "<chosen>" }
  ? Provider processes payout ? webhook / admin confirmation
  ? Wallet ledger entries:
      DEBIT  campaign WalletAccount (type: WITHDRAWAL_OUT)
      CREDIT platform fee WalletAccount (type: PLATFORM_FEE_IN)
  ? Campaign.withdrawn_amount += amount
  ? Notification to campaign owner
`

**Thresholds:** WITHDRAWAL_KYC_THRESHOLD (env var, default ) triggers
enhanced KYC check before release.

### 3. Agency Payout (Platform ? Agency)

Triggered automatically when a campaign linked to an agency package reaches
FUNDED status, or manually via admin action.

`
? WalletService.createAgencyPayout(agencyId, campaignId, netAmount)
  ? netAmount = campaign.total_raised * (1 - agency_commission_rate)
  ? Wallet ledger entries:
      DEBIT  platform revenue WalletAccount (type: AGENCY_PAYOUT_OUT)
      CREDIT agency WalletAccount (type: AGENCY_PAYOUT_IN)
  ? Agency.available_balance += netAmount
  ? Agency can later withdraw via withdrawal flow (same as traveler)
`

Commission rate derived from gencies.subscription_tier at time of payout.

### 4. Subscription Payment (Agency ? Platform via RevenueCat)

`
RevenueCat webhook: INITIAL_PURCHASE | RENEWAL | CANCELLATION
  ? RevenueCatService.handleWebhook(event)
  ? Updates agencies.subscription_tier, .subscription_status,
    .revenuecat_customer_id, .current_period_end
  ? Wallet ledger entries (on INITIAL_PURCHASE / RENEWAL):
      DEBIT  agency WalletAccount (type: SUBSCRIPTION_FEE_OUT)
      CREDIT platform revenue WalletAccount (type: SUBSCRIPTION_FEE_IN)
  ? Amount = tier monthly price (from config)
`

### 5. Refund

`
Admin calls POST /api/v1/admin/refunds
  ? WalletService.createRefund(originalTransactionId, reason, adminId)
  ? Validates: original transaction refundable, within window
  ? Wallet ledger entries (reversing entries):
      DEBIT  original recipient WalletAccount (type: REFUND_OUT)
      CREDIT original sender WalletAccount (type: REFUND_IN)
  ? Original WalletTransaction.refunded = true
  ? Notification to both parties
`

---

## Wallet Ledger Architecture

### Core Principle

Every monetary movement is a **double-entry** WalletTransaction with two
WalletEntry rows (one debit, one credit) that sum to zero. No money moves
outside the ledger without a corresponding transaction.

### Models (Prisma)

`prisma
model WalletAccount {
  id            String             @id @default(cuid())
  ownerType     WalletOwnerType    // TRAVELER, AGENCY, CAMPAIGN, PLATFORM
  ownerId       String             // userId, agencyId, campaignId, or "platform"
  balance       Decimal            @default(0) @db.Decimal(19, 4)
  currency      String             @default("USD")
  version       Int                @default(1) // optimistic locking
  createdAt     DateTime           @default(now())
  updatedAt     DateTime           @updatedAt
  transactions  WalletTransaction[]

  @@unique([ownerType, ownerId])
  @@index([ownerType, ownerId])
}

enum WalletOwnerType {
  TRAVELER
  AGENCY
  CAMPAIGN
  PLATFORM
}

model WalletTransaction {
  id              String             @id @default(cuid())
  type            WalletTransactionType
  status          WalletTransactionStatus @default(PENDING)
  amount          Decimal            @db.Decimal(19, 4) // positive, direction in entries
  currency        String             @default("USD")
  idempotencyKey  String?            @unique
  referenceType   String?            // CAMPAIGN, AGENCY, SUBSCRIPTION, etc.
  referenceId     String?
  description     String?
  metadata        Json?
  createdAt       DateTime           @default(now())
  updatedAt       DateTime           @updatedAt
  completedAt     DateTime?
  entries         WalletEntry[]
  refunded        Boolean            @default(false)
  refundedAt      DateTime?
}

enum WalletTransactionType {
  DONATION_IN
  DONATION_OUT
  WITHDRAWAL_OUT
  WITHDRAWAL_IN        // platform fee
  AGENCY_PAYOUT_IN
  AGENCY_PAYOUT_OUT
  SUBSCRIPTION_FEE_IN
  SUBSCRIPTION_FEE_OUT
  REFUND_IN
  REFUND_OUT
  PLATFORM_FEE_IN
  ADJUSTMENT           // admin corrections
}

enum WalletTransactionStatus {
  PENDING
  COMPLETED
  FAILED
  CANCELLED
}

model WalletEntry {
  id              String    @id @default(cuid())
  transactionId   String
  transaction     WalletTransaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  accountId       String
  account         WalletAccount @relation(fields: [accountId], references: [id], onDelete: Cascade)
  direction       EntryDirection
  amount          Decimal   @db.Decimal(19, 4) // always positive
  createdAt       DateTime  @default(now())

  @@index([accountId])
  @@index([transactionId])
}

enum EntryDirection {
  DEBIT
  CREDIT
}
`

### Stripe-Era Models (Retained, Unused)

These models exist in the schema but are **not written to** by current code.
They are kept for potential future migration or reference.

`prisma
model StripeConnectAccount {
  id                String   @id @default(cuid())
  agencyId          String   @unique
  stripeAccountId   String   @unique
  chargesEnabled    Boolean  @default(false)
  payoutsEnabled    Boolean  @default(false)
  requirementsJson  Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model PaymentMethod {
  id              String   @id @default(cuid())
  travelerId      String
  type            String   // card, us_bank_account, etc.
  stripePaymentMethodId String @unique
  detailsJson     Json?
  isDefault       Boolean  @default(false)
  createdAt       DateTime @default(now())
}

model PayoutAccount {
  id                  String   @id @default(cuid())
  agencyId            String   @unique
  stripeBankAccountId String   @unique
  last4               String
  bankName            String?
  currency            String   @default("USD")
  createdAt           DateTime @default(now())
}

model StripeWebhookEvent {
  id              String   @id @default(cuid())
  stripeEventId   String   @unique
  type            String
  processed       Boolean  @default(false)
  payloadJson     Json
  error           String?
  createdAt       DateTime @default(now())
  processedAt     DateTime?
}
`

---

## IFundingProvider Interface

`	ypescript
// src/common/interfaces/ifunding-provider.ts

export interface FundingIntent {
  id: string;
  provider: string;           // "manual" | "stripe" | "paypal" | ...
  clientToken?: string;       // token for frontend SDK
  redirectUrl?: string;       // full checkout URL
  instructions?: string;      // human-readable for manual provider
  expiresAt: Date;
  metadata?: Record<string, unknown>;
}

export interface FundingResult {
  success: boolean;
  providerTransactionId?: string;
  errorCode?: string;
  errorMessage?: string;
  metadata?: Record<string, unknown>;
}

export interface IFundingProvider {
  readonly providerName: string;

  /**
   * Create a funding intent for a donation.
   * Returns data the frontend needs to complete the payment.
   */
  createDonationIntent(params: {
    amount: number;
    currency: string;
    campaignId: string;
    travelerId: string;
    idempotencyKey: string;
    metadata?: Record<string, unknown>;
  }): Promise<FundingIntent>;

  /**
   * Create a withdrawal intent for a campaign owner or agency.
   */
  createWithdrawalIntent(params: {
    amount: number;
    currency: string;
    walletAccountId: string;   // the campaign or agency wallet
    destinationId: string;     // bank account / payout method ID
    idempotencyKey: string;
    metadata?: Record<string, unknown>;
  }): Promise<FundingIntent>;

  /**
   * Verify a webhook / callback from the provider.
   * Returns the provider's transaction ID if valid.
   */
  verifyWebhook(payload: unknown, headers: Record<string, string>): Promise<{
    providerTransactionId: string;
    status: 'succeeded' | 'failed' | 'pending';
    amount: number;
    currency: string;
  }>;

  /**
   * Optional: refund a completed transaction.
   */
  refund?(providerTransactionId: string, amount?: number): Promise<FundingResult>;
}
`

### ManualFundingProvider (Reference Implementation)

`	ypescript
// src/payments/providers/manual-funding.provider.ts

@Injectable()
export class ManualFundingProvider implements IFundingProvider {
  readonly providerName = 'manual';

  async createDonationIntent(params) {
    const intentId = manual_;
    return {
      id: intentId,
      provider: this.providerName,
      instructions: Send {params.amount} to campaign  via bank transfer. Reference: ,
      expiresAt: addMinutes(new Date(), 60),
      metadata: { ...params.metadata, idempotencyKey: params.idempotencyKey },
    };
  }

  async createWithdrawalIntent(params) {
    const intentId = manual_;
    return {
      id: intentId,
      provider: this.providerName,
      instructions: Admin: process withdrawal of {params.amount} to destination . Reference: ,
      expiresAt: addDays(new Date(), 7),
      metadata: { ...params.metadata, idempotencyKey: params.idempotencyKey },
    };
  }

  async verifyWebhook(payload, headers) {
    // Manual provider has no webhook; admin confirms via POST /api/v1/admin/funding/confirm
    throw new BadRequestException('Manual provider does not support webhooks');
  }
}
`

**Registration:** Providers are registered in PaymentsModule via a dynamic
providers array keyed by providerName. The active provider for donations
and withdrawals is selected by env var FUNDING_PROVIDER (default: manual).

---

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/v1/campaigns/:id/donate | Traveler | Create donation intent |
| POST | /api/v1/campaigns/:id/withdraw | Campaign owner | Create withdrawal intent |
| POST | /api/v1/agencies/:id/withdraw | Agency owner | Create agency withdrawal intent |
| GET | /api/v1/wallet/me | Traveler/Agency | Get wallet balance + recent transactions |
| GET | /api/v1/wallet/:accountId/transactions | Owner/Admin | Paginated transaction history |
| POST | /api/v1/admin/funding/confirm | Super Admin | Confirm manual funding intent |
| POST | /api/v1/admin/refunds | Super Admin | Create refund |
| POST | /api/v1/webhooks/revenuecat | Public (verified) | RevenueCat subscription events |
| POST | /api/v1/webhooks/funding | Public (verified) | Active funding provider callbacks |

All mutation endpoints require Idempotency-Key header (UUID v4).
Duplicate keys return 409 Conflict with the original transaction.

---

## Idempotency

- Every money-moving mutation **must** accept Idempotency-Key header.
- Key stored on WalletTransaction.idempotency_key (unique index).
- On duplicate key: return existing transaction with 200 OK (or 201 on
  first request), never create a second transaction.
- Keys expire after 24 hours (cleanup job removes PENDING transactions
  older than 24h with no completion).

---

## Logging & Audit

- Every WalletTransaction creation, completion, failure, and refund writes
  an audit log via AuditService.log() with action:
  WALLET_TRANSACTION_CREATED, WALLET_TRANSACTION_COMPLETED,
  WALLET_TRANSACTION_FAILED, WALLET_TRANSACTION_REFUNDED.
- Audit payload includes: 	ransactionId, 	ype, mount, currency,
  romAccount, 	oAccount, idempotencyKey, initiatorId, initiatorRole.
- Pino structured logs at info level for state changes, error for failures.
- Retention: 7 years (configurable via AUDIT_RETENTION_DAYS).

---

## Testing

### Unit Tests (*.spec.ts)

- WalletService: double-entry invariant (sum of entries = 0), optimistic
  locking on WalletAccount.version, idempotency key deduplication.
- ManualFundingProvider: intent shape, expiry, metadata pass-through.
- RevenueCatService: webhook signature verification, tier mapping,
  wallet entry creation on renewal.

### E2E Tests (*.e2e-spec.ts)

- Full donation flow: create intent ? confirm ? verify ledger entries +
  campaign amount updated.
- Full withdrawal flow: KYC threshold enforcement, fee deduction, ledger.
- Agency payout: commission calc per tier, ledger entries on both sides.
- Subscription renewal: webhook ? tier update ? wallet fee entry.
- Refund: reverses original entries, marks efunded = true.
- Concurrent donations to same campaign: no lost updates (version check).

### Load / Soak (Manual)

- 100 parallel donations to one campaign ? final balance = sum, no deadlocks.
- 50 parallel withdrawals from one agency ? serialized by row lock, all succeed.

---

## Open Questions

| # | Question | Status | Blocker |
|---|----------|--------|---------|
| 3 | Which processor for traveler donations? | Open | Client decision |
| 5 | Which processor for withdrawals/payouts? | Open | Client decision |
| 14 | KYC provider for high-value withdrawals? | Open | Tied to #3/#5 |
| 23 | Platform commission % per tier (final)? | Open | Client decision |
| 28 | Is IAP required for any flow? | Open | Client decision |

**Do not implement any funding provider other than ManualFundingProvider
until the corresponding open question is resolved and recorded in
HANDOFF.md.**
