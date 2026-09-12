# Test Plan: Provider-Neutral Wallet Funding Selection

**Status:** Read-only test plan (no implementation changes)  
**Scope:** Backend wallet module � IFundingProvider` resolution, default provider behavior, explicit provider override, and configuration validation  
**Reference docs:** `docs/features/wallet-ledger.md`, `docs/Veakay_TRD_Open_Questions.md`  
**Current implementation snapshot (2026-09-10):** `WalletModule` hardcodes `FUNDING_PROVIDER` to `useExisting: StripeFundingProvider`. No runtime provider selection mechanism exists.

---

## 1. Objectives

1. Verify that the `FUNDING_PROVIDER` injection token resolves to the correct concrete `IFundingProvider` implementation based on configuration, without changing `WalletService`.
2. Validate that the **default** (no explicit config) behavior uses `ManualFundingProvider`.
3. Validate that an **explicit** `FUNDING_PROVIDER=stripe` selection uses `StripeFundingProvider`.
4. Validate that invalid or unsupported provider values produce deterministic startup or runtime failures rather than silent fallback.

---

## 2. Prerequisites

- Backend runs via `docker compose` or `npm run start:dev` from `backend-repo/`.
- Test database and Redis are available (see `backend-repo/test/utils/`).
- `ManualFundingProvider` and `StripeFundingProvider` both implement `IFundingProvider` and are registered in `WalletModule` providers.
- A `FUNDING_PROVIDER` env var is read by `WalletModule` (currently absent � this plan documents the intended contract).

---

## 3. Test Categories

### 3.1 Module Resolution Tests

These tests verify that NestJS DI resolves the correct provider class for the `FUNDING_PROVIDER` token.

| ID | Test | Expected Result |
|---|---|---|
| MOD-01 | **Default (no env var)** � Start the app with no `FUNDING_PROVIDER` set. Inject `FUNDING_PROVIDER` into a test controller/host module. Assert the resolved instance is `ManualFundingProvider`. | `instanceof ManualFundingProvider === true`, `provider.name === 'manual'` |
| MOD-02 | **Explicit manual** � Start the app with `FUNDING_PROVIDER=manual`. Resolve the token. Assert the instance is `ManualFundingProvider`. | `instanceof ManualFundingProvider === true` |
| MOD-03 | **Explicit stripe** � Start the app with `FUNDING_PROVIDER=stripe`. Resolve the token. Assert the instance is `StripeFundingProvider`. | `instanceof StripeFundingProvider === true`, `provider.name === 'stripe'` |
| MOD-04 | **Case-insensitive value** � Start the app with `FUNDING_PROVIDER=Manual` or `FUNDING_PROVIDER=STRIPE`. Resolve the token. Assert the value is normalized and the correct provider is selected. | Correct provider selected regardless of case |
| MOD-05 | **Unknown value** � Start the app with `FUNDING_PROVIDER=paypal`. Assert the module fails to initialize with a clear error message naming the unsupported value. | NestJS startup throws / module initialization fails with message containing `paypal` |
| MOD-06 | **Provider name matches token** � For each resolved provider, assert `provider.name` equals the string the env var would use (`manual`, `stripe`). | `provider.name` is the stable, documented identifier |
| MOD-07 | **Both providers registered but only one bound** � Assert both `ManualFundingProvider` and `StripeFundingProvider` are in the module `providers` array, but only one is bound to `FUNDING_PROVIDER`. | Two providers registered; one token binding |

**Suggested test file:** `backend-repo/test/wallet-provider-resolution.e2e-spec.ts` (or unit tests in `backend-repo/src/modules/wallet/wallet.module.spec.ts`).

---

### 3.2 Manual Provider Default Behavior

These tests verify end-to-end behavior when the default `ManualFundingProvider` is active.

| ID | Test | Expected Result |
|---|---|---|
| MAN-01 | **Admin credit uses manual provider** � With default config, call `POST /admin/wallet/wallets/:userId/credit`. Assert the audit log contains `provider: 'manual'`. | Audit log line has `"provider":"manual"` |
| MAN-02 | **Manual deposit always succeeds** � Call `adminCredit` with valid params. Assert the `FundingProviderResult` from `ManualFundingProvider.deposit()` returns `{ ok: true }`. | `result.ok === true` |
| MAN-03 | **No external network call** � Mock `stripe` module. With manual provider active, assert no Stripe SDK method is called during `adminCredit`. | Zero Stripe SDK invocations |
| MAN-04 | **External ID format** � Assert the returned `externalId` from `ManualFundingProvider.deposit()` starts with `manual-` and contains a timestamp. | `externalId` matches `/^manual-\d+$/` |
| MAN-05 | **Balance increments correctly** � Seed a wallet with balance 0. Call `adminCredit` for 250 USD. Assert balance becomes 250 and a single ledger row is written. | Balance = 250, ledger count = 1 |
| MAN-06 | **Idempotency with manual provider** � Replay the same `Idempotency-Key` to `adminCredit`. Assert no second ledger row is created and balance is unchanged. | Ledger count unchanged, original transaction returned |

---

### 3.3 Explicit Stripe Selection Behavior

These tests verify behavior when `FUNDING_PROVIDER=stripe` is explicitly set.

> **Note:** These tests require valid Stripe test credentials or a mocked Stripe SDK. The plan documents both approaches.

| ID | Test | Expected Result |
|---|---|---|
| STR-01 | **Admin credit uses stripe provider** � With `FUNDING_PROVIDER=stripe`, call `POST /admin/wallet/wallets/:userId/credit`. Assert the audit log contains `provider: 'stripe'`. | Audit log line has `"provider":"stripe"` |
| STR-02 | **Stripe PaymentIntent created** � With Stripe mocked, call `adminCredit`. Assert `stripe.paymentIntents.create` is called with the expected amount (in cents), currency, and metadata (`walletAccountId`, `referenceType`, `referenceId`, `idempotencyKey`). | `paymentIntents.create` called once with correct args |
| STR-03 | **Idempotency key passed to Stripe** � Assert the Stripe call includes `idempotencyKey: deposit-${request.idempotencyKey}` in the options (second arg). | Options object contains prefixed idempotency key |
| STR-04 | **Stripe failure propagates** � Mock `paymentIntents.create` to throw. Call `adminCredit`. Assert the endpoint returns 422 (or the configured business-rule status) with the Stripe error message. | HTTP 422, error message from Stripe |
| STR-05 | **Stripe non-succeeded status** � Mock `paymentIntents.create` to return `{ status: 'requires_payment_method' }`. Assert `adminCredit` returns 422 with a message indicating the PaymentIntent status. | `result.ok === false`, HTTP 422 |
| STR-06 | **Successful Stripe intent** � Mock `paymentIntents.create` to return `{ status: 'succeeded', id: 'pi_test_123' }`. Assert `adminCredit` returns 200 and the ledger row is written. | Balance incremented, ledger row exists, `externalId` = `pi_test_123` |
| STR-07 | **No manual fallback on Stripe failure** � When Stripe throws, assert `ManualFundingProvider.deposit()` is NOT called. | `ManualFundingProvider` not invoked |

---

### 3.4 Config Validation

These tests verify that misconfiguration is caught early and reported clearly.

| ID | Test | Expected Result |
|---|---|---|
| CFG-01 | **Missing FUNDING_PROVIDER env var** � Start the app without `FUNDING_PROVIDER`. Assert the app starts and defaults to `manual` (no crash). | App starts, provider = `manual` |
| CFG-02 | **Empty FUNDING_PROVIDER env var** � Start the app with `FUNDING_PROVIDER=`. Assert the app treats this as missing and defaults to `manual`, or fails with a clear error. | Default to `manual` OR fail with clear message (document the chosen behavior) |
| CFG-03 | **Invalid FUNDING_PROVIDER value** � Start the app with `FUNDING_PROVIDER=bitcoin`. Assert the app fails to start (or the module fails to initialize) with a message listing valid options (`manual`, `stripe`). | Startup fails, error mentions `bitcoin` and valid options |
| CFG-04 | **Stripe selected but STRIPE_SECRET_KEY missing** � Start the app with `FUNDING_PROVIDER=stripe` and no `STRIPE_SECRET_KEY`. Assert the app fails at module init or first use with a clear message. | Startup or first-use failure, message about missing Stripe key |
| CFG-05 | **Stripe selected with valid keys** � Start the app with `FUNDING_PROVIDER=stripe` and valid test keys. Assert `StripeFundingProvider` is instantiated without error. | Provider instantiated, Stripe SDK initialized |
| CFG-06 | **Config value is case-insensitive** � Assert `FUNDING_PROVIDER=Stripe` and `FUNDING_PROVIDER=STRIPE` both resolve to `StripeFundingProvider`. | Correct provider selected |

---

## 4. Edge Cases & Negative Tests

| ID | Test | Expected Result |
|---|---|---|
| EDGE-01 | **Provider swap at runtime** � (If hot-reload is supported) Change `FUNDING_PROVIDER` and assert the new provider is picked up on next request without app restart. Document whether this is supported or explicitly not supported. | Documented behavior |
| EDGE-02 | **Null/undefined FUNDING_PROVIDER in ConfigService** � Assert `ConfigService.get('FUNDING_PROVIDER')` returns `undefined` when unset, and the module defaults to `manual`. | Default to `manual` |
| EDGE-03 | **Whitespace in env var** � `FUNDING_PROVIDER=  stripe  `. Assert the value is trimmed before resolution. | Correct provider selected |
| EDGE-04 | **Provider name collision** � If a future provider is registered with `name = 'manual'`, assert the system resolves by token binding, not by `name` string. | Token binding takes precedence |

---

## 5. Audit Log Contract

Every wallet mutation must emit a Pino structured log line with the `audit` discriminator and the active provider name.

| ID | Test | Expected Result |
|---|---|---|
| AUD-01 | **Default provider audit tag** � With `ManualFundingProvider` active, perform `adminCredit`. Assert the log line contains `"provider":"manual"`. | Log contains `"provider":"manual"` |
| AUD-02 | **Stripe provider audit tag** � With `StripeFundingProvider` active, perform `adminCredit`. Assert the log line contains `"provider":"stripe"`. | Log contains `"provider":"stripe"` |
| AUD-03 | **Audit discriminator stability** � Assert the `audit` field value is `wallet.transaction` for credits and debits regardless of provider. | `audit: "wallet.transaction"` |

---

## 6. Manual Verification Checklist (for QA / staging)

These are steps that cannot be fully automated in E2E tests and should be verified manually in a staging environment.

| ID | Step | Expected Observation |
|---|---|---|
| M-01 | **Start backend with no `FUNDING_PROVIDER` env var.** Call `POST /admin/wallet/wallets/:userId/credit`. Check Pino logs. | Logs show `provider: 'manual'`. No Stripe traffic in network monitor. |
| M-02 | **Start backend with `FUNDING_PROVIDER=manual`.** Repeat the credit flow. | Same as M-01. |
| M-03 | **Start backend with `FUNDING_PROVIDER=stripe`.** Repeat the credit flow with Stripe test keys. | Logs show `provider: 'stripe'`. Stripe dashboard shows a test PaymentIntent. |
| M-04 | **Start backend with `FUNDING_PROVIDER=stripe` but omit `STRIPE_SECRET_KEY`.** | Backend fails to start or fails on first request with a clear error about missing Stripe key. |
| M-05 | **Start backend with `FUNDING_PROVIDER=paypal` (unsupported).** | Backend fails to start with an error listing valid options (`manual`, `stripe`). |
| M-06 | **Verify `WalletService` has no direct Stripe import.** Open `wallet.service.ts` and confirm it only imports `IFundingProvider` and `FUNDING_PROVIDER`. | No `stripe` import in `WalletService`. |

---

## 7. Mapping to Current Implementation Gaps

The following gaps exist in the current codebase as of this plan's creation. Tests in Section 3 will fail until these are addressed.

| Gap | Location | Required Change |
|---|---|---|
| No runtime provider resolution | `backend-repo/src/modules/wallet/wallet.module.ts:28-30` | Replace `useExisting: StripeFundingProvider` with a factory or conditional provider that reads `FUNDING_PROVIDER` from `ConfigService`. |
| No `FUNDING_PROVIDER` env var in config | `backend-repo/src/config/configuration.ts` | Add `fundingProvider: string` to `AppConfig` and read `process.env.FUNDING_PROVIDER`. |
| No `FUNDING_PROVIDER` in `.env.example` | `backend-repo/.env.example` | Document `FUNDING_PROVIDER=manual` (default) or `FUNDING_PROVIDER=stripe`. |
| Hardcoded Stripe as default | Same as first row | Default must be `manual` per `docs/features/wallet-ledger.md`. |

---

## 8. Test Execution Notes

- Run E2E tests with `npm run test:e2e -- --runInBand` from `backend-repo/` to avoid cross-file DB resets (per project convention).
- Stripe-dependent tests should mock the `stripe` SDK (see existing pattern in `test/payments.e2e-spec.ts:11-82`).
- Provider resolution tests should use NestJS's `createTestingModule` or the existing `createTestApp` helper with overridden env vars.
- Each test file must call `resetDb()`, `resetRedis()`, and `clearMailhog()` in `beforeEach`.

---

## 9. Definition of Done

This test plan is considered complete when:

1. All automated tests in Sections 3.1�3.4 pass against the intended provider-neutral implementation.
2. Manual verification checklist (Section 6) is signed off by QA.
3. The implementation gaps in Section 7 are resolved and the code matches the feature doc contract (`docs/features/wallet-ledger.md`).
4. `docs/features/wallet-ledger.md` is updated if any behavior deviates from the documented contract.

