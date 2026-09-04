# Agent Handoff Guide — Veakay

Read this file before making any changes, in any of the three repos. It is the shared source of truth for what has been decided, what has been built, and what to build next, across backend, dashboard, and mobile.

## What Is Veakay

Veakay is a travel-fundraising and agency-collaboration platform for iOS and Android. Travelers create fundraising campaigns for vacations, collaborate with verified travel agencies to plan itineraries, and share their trips socially. Travel agencies offer packages, manage traveler requests, and receive payments. A web-based Super Admin dashboard handles registration approval, fraud oversight, and platform compliance.

## Repo Layout

This project is split into three repos, all siblings under this directory:

- `backend-repo/` — NestJS API, shared by mobile app and admin dashboard
- `dashboard-repo/` — Super Admin web panel
- `mobile-app-repo/` — Traveler + Agency mobile app (Expo + Expo Router, scaffolded)

Unlike a typical multi-repo setup, **this file, `CLAUDE.md`, `HANDOFF.md`, and `docs/` are shared across all three** and live here at the project root, not duplicated per-repo. Whichever repo you're working in, read these first.

## Local-Only Files

These must never be committed, to any of the three repos:

- `docs/`
- `AGENTS.md`
- `CLAUDE.md`
- `HANDOFF.md`
- `.env` files in any repo

## Source Documents (all in `docs/`)

**Product source of truth:**
- `Veakay TRD Version 1.0.md` — full markdown transcription of the client's TRD, exact 1:1
- `Veakay_Sprint_Tracker.md` — sprint backlog generated from the team's xlsx
- `Veakay_TRD_Gaps.md` — full working gap-analysis log, section by section
- `Veakay_TRD_Open_Questions.md` — the 28 verified, TRD-grounded open questions actually sent to the client, with exact line numbers and quotes. **This is the file to check before implementing anything that touches money, campaign/trip lifecycle, or the Package/Campaign data model.**
- `PROGRESS_TRACKER.md` — real backend/dashboard/mobile status assessed from the actual codebases, not from the sprint sheet's planning assumptions
- `DEVELOPMENT_FLOW.md` — the mandatory step-by-step flow (Swagger/DTOs → unit tests → E2E → commit/deploy → blackbox on prod → update docs) every feature or bug fix follows, adapted from Miralynk's flow, in every repo, no steps skipped regardless of size
- `features/` — one doc per feature: Goal, MVP Scope, Later Scope, Roles and Permissions, Main Flows, API Endpoints, Database Models, Edge Cases, Open Questions

**Backend architecture docs** (numbered, read before implementing anything in `backend-repo/`):
- `00-overview.md` — product summary, module map, MVP scope, major risks
- `01-tech-stack.md` — full stack decisions and why
- `02-architecture.md` — module map, request lifecycle, data flow per feature area
- `03-engineering-principles.md` — SOLID/DRY/KISS as applied to this codebase
- `04-authentication-and-rbac.md` — full auth system design, traveler/agency/admin
- `05-database-design.md` — full schema across every domain
- `06-api-standards.md` — response shape, pagination, error codes, route conventions
- `07-docker-and-environments.md` — docker-compose, env vars
- `08-storage.md` — presigned upload/download flow, object key structure
- `09-logging-and-audit.md` — Pino conventions, audit log actions, retention (open question)
- `10-testing-strategy.md` — unit/E2E conventions, permission test matrix
- `11-background-jobs.md` — BullMQ queues and job definitions
- `12-real-time-and-websockets.md` — Socket.io gateways, chat events
- `13-notifications-and-push.md` — notification types, delivery channels, settings
- `14-payments-and-stripe.md` — Stripe Connect architecture (replaces the RevenueCat pattern used on Miralynk, since Veakay's money flows are fundamentally different)

**Mobile docs** (`docs/mobile/`, read before scaffolding or implementing anything in `mobile-app-repo/`):
- `mobile/00-overview.md` — app structure (Traveler + Agency experiences), `figma-demo/` as the design reference
- `mobile/01-tech-stack.md` — finalized stack: Expo, TanStack Query, Zustand, and why (chosen on merit, not by copying Miralynk)
- `mobile/02-error-handling.md` — standing requirement: error boundaries, API error-code mapping, TanStack Query retry policy, idempotency keys on money-moving mutations, crash reporting. Every screen needs loading/error/empty/success states, not just a happy path.

## Backend Stack (`backend-repo/`)

- NestJS 11 with TypeScript
- Prisma 6 ORM
- PostgreSQL 17 (Docker)
- Redis 7 (Docker), cache, BullMQ queues, Socket.io pub/sub adapter
- BullMQ + @nestjs/bullmq, background jobs (notification dispatch, campaign/badge milestone checks, scheduled reports)
- Socket.io + @socket.io/redis-adapter, real-time chat (traveler-friend, group, traveler-agency)
- Stripe Connect, donations, agency/traveler payouts, commission splitting, agency subscription billing (client-confirmed processor)
- MinIO (Docker, local) / AWS S3 (production), S3-compatible, no code change to swap. Stores campaign images, agency documents, chat media, profile photos.
- Firebase Admin SDK, push notifications only, NOT authentication
- Generic SMTP (via `nodemailer`), transactional email (OTP delivery, receipts) in prod, MailHog locally. Provider not yet chosen, provider-agnostic by design (host/port/credentials in env vars, no vendor SDK), confirmed locally as MailHog + MinIO for dev.
- Pino structured logging (nestjs-pino), pino-pretty in dev, JSON in prod
- Jest + Supertest for tests

**Deliberately different from the team's Miralynk project:**
- No Twilio/SMS OTP, the Veakay TRD only specifies email OTP + Google/Apple social login, no phone-based auth anywhere.
- No RevenueCat by default, the TRD's "subscription tiers" (Basic/Premium/Featured) belong to **agencies**, not a consumer app-store subscription. Whether this is even purchasable in-app is an open question (`docs/Veakay_TRD_Open_Questions.md` item #28); default assumption is a web-based billing page using Stripe Billing directly, sidestepping Apple/Google in-app purchase requirements entirely. Do not wire RevenueCat or native IAP until that question is answered.
- Video/audio calling vendor is TBD (the TRD requires "Audio & Video Calls with Agency" but never names a vendor). Wrap it behind an interface (`ICallProvider`) from day one so the choice is swappable.

## External Services Still Undecided — Ask Before Building, Don't Default

Some external services are deliberately left open rather than assumed. When work reaches the point of actually needing one of these, **stop and ask the user which vendor to use before wiring it in** — do not pick a default silently, even a well-reasoned one:

- **Production SMTP provider** (SendGrid, Amazon SES, Mailgun, Postmark, or otherwise). Locally, MailHog + MinIO are already confirmed and don't need to be asked about again.
- **Audio/video calling vendor** (Zoom Video SDK, Twilio Video, Agora, Daily.co, or otherwise), behind `ICallProvider`.
- **Maps API key provisioning** (Google Maps Platform, for `react-native-maps` on Android) — `react-native-maps` itself is the library choice, but the account/key is not yet provisioned.
- **Crash reporting vendor** (Sentry or otherwise), required by `docs/mobile/02-error-handling.md`.
- **Stripe Identity**, only relevant if open questions #3/#5 resolve toward needing a distinct verification step beyond Stripe Connect's own account-opening KYC.

This list should shrink over time as each is decided; when one is confirmed, update this file, `HANDOFF.md`, and whichever numbered doc references it.

## Dashboard Stack (`dashboard-repo/`)

Not started. Consumes `backend-repo`'s API. Framework not yet decided.

## Mobile Stack (`mobile-app-repo/`)

Finalized and scaffolded: Expo (SDK 57) + Expo Router + TypeScript, NativeWind (Tailwind v3), TanStack Query + Zustand. See `docs/mobile/01-tech-stack.md` for the full stack and reasoning (chosen on merit, not by copying Miralynk's bare React Native setup). The `figma-demo/` folder at the project root is a reconstructed Vite/React web prototype recovered from the client's Figma Make export — it's a visual/UX/copy reference only, not reusable mobile app code, but the mobile app's colors, logo asset, and screen copy are deliberately copied from it to stay consistent.

## Auth Architecture

The backend owns authentication end-to-end. There is no Firebase Auth for identity.

**Traveler sign-in methods:** email + password (bcrypt), email OTP, Google OAuth, Apple OAuth.

**Agency sign-in methods:** email + password only, with email OTP. No social login, confirmed intentional B2B-vs-B2C design, not an oversight.

**Admin sign-in:** email + password with mandatory 2FA. No sign-up flow exists in the TRD for admin accounts, the first Super Admin must be seeded manually; build an invite-based flow for additional admins rather than a public registration endpoint.

Token lifecycle: short-lived access JWT, long-lived refresh JWT hashed and stored in `refresh_tokens`, revoked access token JIDs blacklisted in Redis.

Authorization layers, applied in order on every authenticated request:
1. JwtAuthGuard, verifies access token, checks Redis blacklist, attaches user
2. AccountStatusGuard, blocks deactivated/deleted users
3. RoleGuard, enforces traveler / agency / admin resource ownership
4. AgencyStaffPermissionGuard, enforces staff permission tier under an agency account once staff accounts exist (open question, tied to Chat Module's multi-staff access gap)
5. PlatformRoleGuard, enforces super_admin for admin routes; built extensibly even though only one admin tier exists today

## Permission System

| Layer | Values | Stored in |
|---|---|---|
| Account role | traveler, agency, admin | users.role |
| Agency staff permission | owner, staff (tiered, TBD) | agency_staff.permission |
| Agency subscription tier | basic, premium, featured | agencies.subscription_tier |
| Platform role | user, super_admin | users.platform_role (extensible for future tiers) |

## Engineering Principles

- Controllers handle HTTP mapping only.
- Services handle business logic.
- Guards/policies handle auth, RBAC, ownership, and entitlement checks.
- DTOs validate all inputs.
- External providers (Stripe, SendGrid, Firebase, whichever call vendor is chosen) are wrapped in integration services, never called directly from feature services.
- Jobs and webhook handlers must be idempotent.
- Important business state changes (campaign approval/flag, refund, agency verification, account deactivation) must write audit logs via AuditService.
- Soft deletes on campaigns, posts, comments, reviews, and messages to support moderation review.
- All admin mutations must write audit logs.
- Prisma schema grows by migration, one migration per feature, never rewrite the full schema.
- Numeric thresholds the TRD never specified (commission %, KYC/high-value withdrawal threshold, badge milestones, OTP expiry) are environment-configurable constants or admin-configurable DB rows, never hardcoded.
- No comments that repeat what the code says. Comments only for non-obvious WHY.

## Documentation-First Workflow

Before implementing a feature, in any repo:

1. Read the relevant feature doc under `docs/features/`.
2. Check `docs/Veakay_TRD_Open_Questions.md` for unresolved product decisions.
3. If an open question affects implementation, confirm with the user before writing code. Do not guess at money, legal, or data-model-defining questions.
4. Update docs if the user makes a new architectural or product decision.
5. Then implement code following `docs/DEVELOPMENT_FLOW.md` (Swagger/DTOs first, unit tests, E2E tests, commit, blackbox-on-prod once prod exists, then update docs). This applies to every feature and every bug fix, no matter how small, no steps skipped.

## Backend Module Map

```
src/
  modules/
    auth/               → traveler + agency + admin registration, login, OTP, JWT lifecycle
    users/              → traveler profile, travel preferences, status badges, follow graph
    agencies/           → agency registration/verification, staff accounts, reputation score
    campaigns/          → campaign CRUD, privacy, gift mode, lifecycle status, donations
    packages/           → agency package/itinerary catalog, linking to campaigns
    groups/             → group travel funds, contributions, expenses ("Spend")
    reviews/            → traveler-to-agency ratings and reviews
    feed/               → social feed, posts, likes, comments, follow-based ranking
    explore/            → discovery, trending, geo-map, filters
    chat/               → 1:1 and group chat (friends + agency), Socket.io gateway
    notifications/      → notification records, settings, dispatch queue
    payments/           → Stripe Connect integration, withdrawals, commissions, refunds
    moderation/         → reports, admin review queue
    admin/              → super admin APIs (user/agency management, oversight, compliance)
    storage/            → S3/MinIO presigned URL generation
    prisma/             → global PrismaModule + PrismaService
  common/
    decorators/         → @CurrentUser(), @RequireRole(), @RequirePlatformRole()
    guards/              → JwtAuthGuard, AccountStatusGuard, RoleGuard, PlatformRoleGuard
    filters/             → GlobalExceptionFilter
    interceptors/        → ResponseInterceptor, LoggingInterceptor
    pipes/               → ValidationPipe
    interfaces/          → IStorageProvider, INotificationProvider, ICallProvider
    dto/                 → PaginationDto, CursorDto, shared response shapes
    utils/               → hash.util, pagination.util, date.util
  config/
    configuration.ts     → typed config factory for all env vars, including admin-configurable thresholds
  gateways/
    chat.gateway.ts       → Socket.io WebSocket gateway for chat
    notifications.gateway.ts → Socket.io gateway for real-time notifications
```

## API Conventions

- Global prefix: `api/v1` (health excluded)
- Pagination: cursor-based for feed, chat history, and notifications; offset for admin lists
- Response shape: `{ data, meta?, error? }`
- Auth: Bearer JWT on all routes except public auth endpoints
- Swagger/OpenAPI at `/api/v1/docs` (add when first feature module is complete)

## Prisma Migration Workflow

`prisma migrate dev` is blocked in non-interactive environments. Use this flow from `backend-repo/`:

```bash
# 1. Generate SQL for the new schema changes
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma \
  --script > /tmp/migration.sql

# 2. Create the migration folder manually
TIMESTAMP=$(date +%Y%m%d%H%M%S)
mkdir -p prisma/migrations/${TIMESTAMP}_<feature_name>
cp /tmp/migration.sql prisma/migrations/${TIMESTAMP}_<feature_name>/migration.sql

# 3. Apply it
npx prisma migrate deploy

# 4. Regenerate client
npx prisma generate
```

For a completely new schema (from empty):
```bash
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > migration.sql
```

**Gotcha:** never redirect with `2>&1` on the `prisma migrate diff` command. Prisma sometimes prints an "Update available" box to stderr, and merging it into the redirected file corrupts the SQL (breaks `prisma migrate deploy` with a syntax error partway through). Redirect stdout only (`> file.sql`, not `> file.sql 2>&1`).

**Gotcha:** step 4's `npx prisma generate` only regenerates the client in the **host's** `node_modules`. The dockerized `app` service has its own separate `node_modules` (an anonymous volume in `docker-compose.yml`, specifically so the container's native binaries don't get clobbered by the host's), so after any schema change also run `docker compose exec app npx prisma generate` — otherwise the running container keeps using a stale Prisma Client and throws `Property 'x' does not exist on type 'PrismaService'` the moment its dev-server watcher picks up the new code referencing the new model. If the container's dev server is already in a crashed/errored state from this, `docker compose restart app` after regenerating clears it.

## E2E Test Execution

Run `npm run test:e2e` from the **host**, not via `docker compose exec app` — the E2E suite talks to MailHog and the test Postgres/Redis via their host-mapped ports (`localhost:58025`, `localhost:57433`, etc.), which aren't reachable as `localhost` from inside the `app` container's network namespace.

**Gotcha:** every `*.e2e-spec.ts` file shares one test Postgres/Redis instance and calls `resetDb()`/`resetRedis()` in its own `beforeEach`. Jest parallelizes across test *files* by default, so once more than one E2E spec file exists, running without `--runInBand` causes one file's reset to truncate tables mid-test for another file, producing flaky, unrelated-looking 400/401/500 failures. `test:e2e` now always runs with `--runInBand` for exactly this reason — don't drop that flag when adding new E2E spec files.
