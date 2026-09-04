# Architecture

## Architectural Pattern

NestJS modular monolith. All domains live in one deployable NestJS application. Module boundaries are strict, modules only communicate through injected services, never by importing each other's Prisma queries directly.

## Module Map

```text
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
    guards/             → JwtAuthGuard, AccountStatusGuard, RoleGuard, PlatformRoleGuard
    filters/             → GlobalExceptionFilter
    interceptors/        → ResponseInterceptor, LoggingInterceptor
    pipes/               → ValidationPipe
    interfaces/          → IStorageProvider, INotificationProvider, ICallProvider
    dto/                 → PaginationDto, CursorDto, shared response shapes
    utils/               → hash.util, pagination.util, date.util
  config/
    app.config.ts        → config loader
    env.validation.ts    → startup env var validation
  gateways/
    chat.gateway.ts       → Socket.io WebSocket gateway for chat
    notifications.gateway.ts → Socket.io gateway for real-time notifications
```

## Request Lifecycle

### HTTP Request

```text
Incoming HTTP request
  → Global ValidationPipe (validate + transform DTO)
  → JwtAuthGuard (verify JWT, blacklist check in Redis, attach user)
  → AccountStatusGuard (block deactivated users)
  → RoleGuard (check traveler / agency / admin ownership if route requires it)
  → AgencyStaffPermissionGuard (check staff permission tier if route requires it)
  → PlatformRoleGuard (check super_admin if admin route)
  → Controller method
  → Service (business logic)
  → Prisma (database access)
  → Mapper (entity → DTO)
  → ResponseInterceptor (wrap in standard response shape)
  → Pino logs request completion
```

### WebSocket Connection

```text
Client connects to Socket.io gateway
  → JwtAuthGuard on handshake (token in query or header)
  → User joined to personal room (user:{userId})
  → User joined to chat rooms for each of their active chats (friend + agency)
  → Events dispatched to rooms via Redis pub/sub adapter
```

### Background Job

```text
Service enqueues job → BullMQ (backed by Redis)
  → Worker picks up job
  → Processor executes business logic
  → Prisma writes result
  → Pino logs job outcome
  → On failure: retry with backoff, log error, mark failed after exhaustion
```

## Data Flow by Feature Area

### Campaign Creation and Donation

```text
POST /api/v1/campaigns
  → CampaignsService validates goal amount, dates, privacy setting
  → Creates campaign with status=draft or active (lifecycle model pending, open question #1)
  → Optional: links an agency package (see Itinerary Builder flow)

POST /api/v1/campaigns/:id/donate
  → PaymentsService creates a Stripe PaymentIntent for the donation
  → On successful payment webhook: records Contribution (type=donation), updates campaign raised amount
  → Enqueues notification.send to campaign owner
  → If a milestone threshold is crossed (25/50/100%): enqueues milestone celebration job
```

### Itinerary Builder and Agency Package Linking

```text
GET /api/v1/packages?destination=&tripType=&fundingProgress=
  → PackagesService returns browsable packages (catalog vs. single-offer model TBD, open question #2)

POST /api/v1/campaigns/:id/link-package
  → CampaignsService links the chosen package to the campaign
  → Triggers a chat/consultation request to the agency (opens or reuses a Chat thread)
```

### Chat (Friend and Agency)

```text
Client sends message via Socket.io event
  → ChatGateway receives event
  → Validates sender is participant in chat
  → ChatService persists message to PostgreSQL
  → Publishes to Redis pub/sub channel for chat room
  → Socket.io adapter fans out to all connected participants
  → NotificationsService queues push for offline participants
```

### Payment and Withdrawal

```text
POST /api/v1/payments/withdraw
  → PaymentsService checks campaign status/goal completion (pending open question #1 resolution)
  → Checks identity verification requirement if amount crosses the (TBD) high-value threshold
  → Initiates Stripe Connect transfer to the traveler's connected account
  → Records withdrawal, writes audit log
  → Enqueues notification.send

POST /api/v1/webhooks/stripe
  → WebhookController stores raw event (idempotency by Stripe event id)
  → Enqueues payment.reconcile job
  → Worker updates campaign/withdrawal/subscription state accordingly
```

### Group Travel Fund

```text
POST /api/v1/groups/:id/contributions
  → GroupsService records a Contribution (type=donation via Stripe, or type=manual, self-reported)
  → Manual entries are NOT independently verified (matches the client's own prototype behavior)

POST /api/v1/groups/:id/expenses
  → GroupsService records an Expense (name, amount, paidBy, category)
  → Raised and Spent totals are tracked independently, never merged into one number
```

### Agency Registration and Verification

```text
POST /api/v1/agencies/register → Pending Verification
GET /api/v1/admin/agencies?status=pending_verification (Admin dashboard)
PATCH /api/v1/admin/agencies/:id/approve → Verified Agency Badge assigned, reputation score initialized
PATCH /api/v1/admin/agencies/:id/reject → status=rejected (resubmission flow is open question #10)
```

## External Integration Points

```text
Stripe (Connect + Billing)  → PaymentsService → donations, payouts, commission, subscription billing
SMTP (provider TBD)          → MailService → transactional emails, MailHog locally
Firebase Admin SDK          → NotificationsService → push delivery
Call vendor (TBD)           → CallService (behind ICallProvider) → traveler-agency audio/video
MinIO / AWS S3              → StorageService → presigned URL generation
```

## Environment Separation

```text
Development   → docker-compose (NestJS + PostgreSQL + Redis + MinIO + MailHog)
Test          → docker-compose.test (separate PostgreSQL + Redis instances)
Production    → single server or container platform, AWS S3, production SMTP provider (TBD), real Stripe/Firebase/call vendor
```

## Scalability Notes for Post-Launch

At small scale, a single NestJS instance on a modest VPS is sufficient. When scale requires it:

- Add a second NestJS instance behind a load balancer, Socket.io's Redis adapter already supports this.
- Move BullMQ workers to separate processes or containers.
- Add PostgreSQL read replicas for feed and Explore queries.
- Add a CDN (CloudFront) in front of S3 for media.
- Extract PaymentsModule into a dedicated service if payment volume grows significantly, given it's the most compliance-sensitive module.
