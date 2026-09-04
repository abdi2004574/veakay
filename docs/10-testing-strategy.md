# Testing Strategy

## Goal

Tests prove that backend services, permissions, integrations, and critical flows work correctly before the mobile app or admin dashboard depends on them.

## Testing Stack

```text
Jest              → test runner for unit and E2E tests
Supertest         → HTTP assertion for E2E tests
ts-jest           → TypeScript support in Jest
@nestjs/testing   → NestJS TestingModule for unit and integration tests
```

## Test Types

### Unit Tests

Service business logic in isolation, all external dependencies mocked. File convention: `{module}.service.spec.ts`.

Examples:

```text
- traveler can create a campaign with valid goal amount and dates
- campaign creation rejects a non-positive goal amount
- donation records a Contribution with type=donation and updates raised_amount
- group fund expense and contribution totals never merge into one number
- review is rejected if the traveler already reviewed this campaign (UNIQUE constraint)
- withdrawal is blocked if identity_verified=false above the high-value threshold
- Stripe webhook updates withdrawal status
- duplicate Stripe event_id is rejected
- deactivated user is rejected at guard level
- agency accessing traveler-only route returns 403
```

### E2E Tests

Full HTTP request → response flows against a real test PostgreSQL and Redis. External providers (Stripe, Firebase, the SMTP provider, call vendor) are mocked. File convention: `test/{feature}.e2e-spec.ts`.

Examples:

```text
- POST /api/v1/auth/register/email creates user and sends verification email
- POST /api/v1/auth/login returns access and refresh tokens
- Deactivated user receives 403 on any protected route
- POST /api/v1/campaigns creates a campaign and it appears in the owner's list
- POST /api/v1/campaigns/:id/donate records a contribution and updates raised amount
- POST /api/v1/payments/withdraw is blocked below identity verification threshold
- POST /api/v1/webhooks/stripe updates payment/withdrawal state
- GET /api/v1/admin/agencies returns 403 for non-admin
- GET /api/v1/admin/agencies returns 200 for super_admin
```

### Live Integration Tests

Separately runnable, not part of the standard `npm run test` suite:

```text
npm run test:storage      → real MinIO upload, download, metadata verification
npm run test:email        → real MailHog SMTP delivery (development only)
```

## Test Database Rules

```text
- Never use the development or production database.
- Use DATABASE_URL pointing to veakay_test.
- Run Prisma migrations before the test suite.
- Truncate all tables between test suites.
- Tests must not depend on execution order.
```

## Permission Test Matrix

Every protected route must test:

```text
unauthenticated request                       → 401
deactivated user                              → 403
traveler on agency-only route                 → 403
agency on traveler-only route                 → 403
non-admin on admin route                      → 403
super_admin on admin route                    → 200
owner accessing own resource                  → 200
non-owner accessing another user's resource   → 403 or 404
```

## Mocking External Providers

Mock in unit and E2E tests: `StripeService`, `MailService`, `FirebasePushService`, `CallProviderService`, `StorageService`.

Use real local services in E2E tests: PostgreSQL (test DB), Redis (test instance).

## Webhook Tests

```text
- valid Stripe payment_intent.succeeded event records a donation
- valid Stripe transfer.paid event marks a withdrawal completed
- valid Stripe transfer.failed event marks a withdrawal failed
- duplicate event_id is rejected (idempotent)
- invalid webhook signature returns 401
- malformed payload returns 400
```

## Coverage Expectations

```text
- Service unit tests for every module
- E2E tests for all critical user flows (auth, campaign creation, donation, withdrawal, chat, agency verification)
- Permission matrix tests for every protected route group
- Webhook tests for Stripe
- Live storage integration test for MinIO/S3 presigned URL flow
- Regression test for every bug fixed after launch
```

## Jest Configuration

```text
jest.config.ts        → unit tests: *.spec.ts pattern, ts-jest, mocks, coverage
test/jest-e2e.json    → E2E tests: *.e2e-spec.ts pattern, longer timeout (30s)
```

## Test Scripts

```text
npm run test            → unit tests only (no DB required, fast)
npm run test:e2e        → E2E tests (requires test DB and Redis running)
npm run test:storage    → live MinIO integration test
```
