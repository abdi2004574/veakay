# Engineering Principles

## Overview

Veakay's backend follows KISS, DRY, and SOLID, same as the team's Miralynk project. These are enforced through code review and architectural decisions, not just aspirational.

## SOLID

### Single Responsibility

Each class does exactly one thing.

```text
PaymentsService      → orchestrates the payment flow
StripeService        → Stripe API calls only (Connect, Billing, PaymentIntents)
WithdrawalService    → withdrawal eligibility + Stripe transfer only
TokenService         → JWT creation, validation, refresh, revocation only
OtpService           → OTP generation and verification only
MailService          → email sending only
```

Not one large PaymentsService that does all of the above.

Controllers handle HTTP only. Services handle business logic only. Prisma queries live in services, not in controllers, not in gateways.

### Open/Closed

```text
IStorageProvider    → MinioStorageProvider (dev) → S3StorageProvider (prod)
ICallProvider       → whichever audio/video vendor is chosen, swappable without touching ChatModule
INotificationProvider → FirebasePushProvider
```

When a new storage backend or call vendor is needed, a new class implementing the interface is added. The consuming service never changes.

### Liskov Substitution

Any implementation of an interface must be a valid substitute. `MinioStorageProvider` and `S3StorageProvider` both implement `IStorageProvider`, swapping via environment variable never breaks consuming services.

### Interface Segregation

Interfaces are small and specific.

```text
ICampaignReader     → getById(), list(), search()
ICampaignWriter     → create(), update(), delete()
ICampaignModerator  → flag(), approve(), suspend()

AdminService implements all three.
Regular CampaignsService implements only ICampaignReader + ICampaignWriter.
```

### Dependency Inversion

Services depend on abstractions, not concrete implementations.

```text
// Correct
class PaymentsService {
  constructor(private stripe: IPaymentProvider) {}
}

// Wrong
class PaymentsService {
  constructor(private stripeSdk: Stripe) {}
}
```

## DRY (Don't Repeat Yourself)

### Shared Guards

```text
@UseGuards(JwtAuthGuard, RoleGuard)
@RequireRole('agency')
@Get('agency/dashboard')
```

### Shared DTOs

```text
PaginationDto       → reused across feed, explore, chat history, notifications
CursorPaginationDto → reused for infinite scroll endpoints
MediaUploadDto      → reused across campaigns, posts, chat, profile photo, agency documents
```

### Shared Utilities

```text
src/common/utils/
  hash.util.ts        → bcrypt hashing, used in auth and OTP
  pagination.util.ts  → cursor pagination logic, used everywhere
  date.util.ts        → date helpers for campaign expiry, milestone checks
  money.util.ts       → currency formatting, commission calculation, shared between Payments and Admin reporting
```

### Shared Verification Logic

The reputation-score calculation is written once in `AgenciesService.calculateReputationScore(agencyId)` and used by the agency profile, Explore ranking, and the Top-Rated leaderboard. Never duplicated.

## KISS (Keep It Simple, Stupid)

### No Premature Abstractions

Do not build a plugin system for something that has one implementation today. Build `StripePaymentProvider` directly; extract an `IPaymentProvider` interface only when (if) a second payment processor is actually needed.

### Flat Module Structure

```text
CampaignsService handles campaign CRUD.
PaymentsService calls CampaignsService to check lifecycle status.
PaymentsService does not extend CampaignsService or inherit from it.
```

### Environment-Based Config

```text
STORAGE_PROVIDER=minio  → dev
STORAGE_PROVIDER=s3     → prod
```

One env var, no feature flags framework.

### Simple Pagination First

Cursor-based pagination everywhere. Not a custom pagination framework.

### Admin-Configurable Values Instead of Hardcoding Undefined TRD Numbers

Several thresholds the TRD never specifies (commission %, KYC/high-value withdrawal threshold, badge milestones, OTP expiry) are stored as admin-configurable DB rows or environment-configurable constants, not hardcoded. This unblocks development without waiting on exact numbers, and lets the client tune them later without a code change.

## Additional Practices

### No Business Logic in Controllers

```text
// Correct
@Post()
async createCampaign(@Body() dto: CreateCampaignDto, @CurrentUser() user: AuthUser) {
  return this.campaignsService.create(user.id, dto);
}

// Wrong — business logic in controller
@Post()
async createCampaign(@Body() dto: CreateCampaignDto, @CurrentUser() user: AuthUser) {
  if (dto.goalAmount <= 0) {
    throw new BadRequestException('Goal amount must be positive');
  }
  // ...
}
```

### No Business Logic in Gateways

WebSocket gateways route events to services, just as controllers route HTTP requests.

### DTO Validation at the Boundary

Every request body is validated using `class-validator` decorators before the service layer sees it. The global `ValidationPipe` with `whitelist: true` strips unknown fields automatically.

### Soft Deletes

Campaigns, posts, comments, reviews, and messages are never hard deleted immediately. An `is_deleted` flag and `deleted_at` timestamp allow admins to review content before permanent removal.

### Consistent Error Handling

A single `GlobalExceptionFilter` handles all unhandled exceptions and returns a consistent error shape. Services throw typed NestJS exceptions. No raw `Error` objects escape to the HTTP layer.

### Consistent Response Shape

```json
{
  "success": true,
  "data": { ... },
  "meta": { "cursor": "..." }
}
```

Error responses follow the same structure via `GlobalExceptionFilter`.

### Idempotent Webhooks and Money-Moving Endpoints

Stripe webhooks are stored before processing. Duplicate event IDs are rejected. Processing is safe to retry.

This same idempotency requirement extends to every endpoint that moves money, not just webhooks: donations, withdrawals, and subscription changes must accept an `Idempotency-Key` header from the client and pass it through to Stripe's own idempotency support. Without this, a client-side retry after a lost response (e.g. the mobile app times out waiting for a response that actually succeeded) can double-charge a donor or double-process a withdrawal. This is a two-sided contract with the mobile app, see `mobile/02-error-handling.md`, which deliberately disables client-side auto-retry on money-moving mutations and instead relies on this key. Requests missing the header on a money-moving route should be rejected, not silently accepted without protection.

### Consistent Error Handling Everywhere, Not Just Business Logic

"Proper error handling everywhere" is a standing project requirement, not a per-feature judgment call. Concretely: every service method that can fail has a typed, deliberate failure path (a specific NestJS exception, not a generic 500); every controller/gateway/job handler that touches an external provider (Stripe, the SMTP provider, Firebase, the call vendor) wraps it so a provider outage degrades gracefully (e.g. a failed push notification does not fail the request that triggered it) instead of surfacing as an unhandled exception; and no `catch` block is empty, at minimum it logs via Pino with enough context to debug, per `09-logging-and-audit.md`.

### Secrets Never in Code

All credentials, API keys, and connection strings live in environment variables. `.env` is git-ignored. `.env.example` documents every required variable with placeholder values.

### Environment Validation on Startup

`env.validation.ts` validates all required environment variables when the app starts. If a required variable is missing or malformed, the app fails fast before accepting any traffic.

### Audit Logging for Admin Mutations

Every state change made by a super admin (agency approval/rejection, campaign flag, refund, deactivation) writes a row to `audit_logs` via `AuditService.record()`. This is a requirement, not optional.
