# Tech Stack (Backend)

## Core Framework

**NestJS** with TypeScript. Chosen to mirror the team's Miralynk project, same module-per-domain pattern, same team muscle memory.

## Database

**PostgreSQL** via **Prisma ORM**. Prisma is accessed directly in services, no separate repository layer.

## Caching and Session Store

**Redis**. Serves:
- JWT refresh token storage and blacklisting for instant session revocation.
- BullMQ job queue backend.
- Socket.io adapter for multi-instance pub/sub.
- Unread message counters for chat.
- Feed and Explore cache per user (short TTL).

## Authentication

**Passport.js** with custom JWT strategy. Firebase Auth is not used, for the same reason as Miralynk: banning/deactivating a user must immediately revoke all active sessions, and role (traveler/agency/admin) must be embedded in the token.

Strategies used:

```text
passport-local              → email + password login (traveler + agency)
passport-google-oauth20     → Google OAuth2 login (traveler only)
passport-apple              → Apple OAuth2 login (traveler only)
passport-jwt                → JWT token validation on every protected request
```

**Not used, deliberately:** `passport-local` phone strategy, Twilio Verify, any SMS-based flow. The Veakay TRD never mentions phone numbers or SMS anywhere. Agencies have no social login strategy either, confirmed intentional B2B-vs-B2C design.

Token management:

```text
Access token     → short-lived JWT (15 minutes), carries user id, role, platform role
Refresh token    → long-lived (30 days), stored hashed in PostgreSQL
Token blacklist  → Redis set, checked on every request, populated on logout and deactivation
```

## Authorization

Custom RBAC as NestJS Guards. See `04-authentication-and-rbac.md` for the full design.

## OTP and Email

- **MailHog** — local development email catcher (SMTP server, UI at localhost:8025).
- **Generic SMTP** — production email delivery (OTP, receipts, transactional emails), via `nodemailer`'s SMTP transport rather than a vendor-specific SDK/API. Which SMTP provider (SendGrid's SMTP relay, Amazon SES, Mailgun, Postmark, a company mail server, etc.) is not fixed in code, it's just SMTP host/port/credentials in environment variables. Ask before this is actually decided, don't assume a default.

Switching from MailHog to a production SMTP provider is a single set of environment variable changes, no code changes, since MailHog itself is just a local SMTP server.

## Real-Time

**Socket.io** via `@nestjs/websockets`. Handles:
- 1:1 and group friend chat.
- 1:1 traveler-agency chat.
- Real-time notification delivery to connected clients.

Redis pub/sub is the Socket.io adapter so multiple NestJS instances can share socket state.

## Background Jobs

**BullMQ** with Redis as the queue backend. See `11-background-jobs.md` for the full job list.

## File Storage

**MinIO** in development, **AWS S3** in production. Same AWS SDK client both environments, switching is an environment variable change. Stores campaign images, agency documents (licenses/certifications), chat media, profile photos, package visuals.

Files are never served directly from the backend. Presigned URLs for client uploads and downloads.

## Push Notifications

**Firebase Admin SDK** — push delivery only, not authentication. FCM handles both iOS (via APNs bridge) and Android through a single SDK.

## Payments

**Stripe** (client-confirmed processor), specifically **Stripe Connect** for the marketplace side:

```text
Donations                    → Stripe Payments / Checkout, collected into the platform's Stripe balance
Traveler payout              → Stripe Connect transfer to traveler's connected account
Agency payout                → Stripe Connect transfer to agency's connected account
Commission split             → Stripe Connect application_fee_amount at transfer time
Agency subscription billing  → Stripe Billing, assumed web-based, NOT native in-app purchase
                                (open question #28 — confirm before building the purchase flow)
Identity verification        → Stripe Connect's onboarding KYC covers account-opening verification;
                                a stronger, threshold-triggered check (open question #3) may need Stripe Identity as a supplement
```

**Not used:** RevenueCat. Veakay's "subscription tiers" belong to agencies (B2B), not a consumer app-store subscription — there's no clean RevenueCat use case here the way Miralynk has one for its Free/Pro/Premium end-user tiers. Do not wire RevenueCat or native IAP until open question #28 is answered, and even then, the default assumption should be tested first (web billing, not IAP) since it avoids Apple/Google's revenue cut entirely.

See `14-payments-and-stripe.md` for the full payment architecture.

## Video Calling

**Vendor not yet chosen.** The TRD requires "Audio & Video Calls with Agency" (traveler-facing) and the mirrored requirement on the agency side, but never names a vendor, unlike Miralynk which explicitly specifies Zoom Video SDK. Wrap whatever is chosen behind `ICallProvider` so the choice is swappable without touching ChatModule.

## Logging

**Pino** via `nestjs-pino`. Development: `pino-pretty`. Production: raw JSON.

## Testing

```text
Jest          → test runner for unit and E2E tests
Supertest     → HTTP assertion library for E2E tests
ts-jest       → TypeScript support in Jest
```

## API Documentation

**Swagger** via `@nestjs/swagger`. Available at `/api/v1/docs`.

## Containerization

**Docker** and **Docker Compose**. See `07-docker-and-environments.md`.

Development services: `app`, `postgres`, `postgres-test`, `redis`, `minio`, `mailhog`.

## Developer Experience

```text
@nestjs/config        → environment variable management with validation on startup
class-validator       → request body validation via decorators
class-transformer     → DTO transformation
ESLint                → TypeScript linting
Prettier              → code formatting
```

## Versions (Target)

```text
Node.js         24 (LTS)
NestJS          11
Prisma          6
TypeScript      5
PostgreSQL      17
Redis           7
MinIO           latest
BullMQ          5
Socket.io       4
```
