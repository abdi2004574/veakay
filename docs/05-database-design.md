# Database Design

## Overview

PostgreSQL with Prisma ORM. All primary keys are UUIDs. Soft deletes on campaigns, posts, comments, reviews, and messages. All timestamps are UTC. Prisma is accessed directly in services, no separate repository layer.

## Domain Overview

```text
Users & Auth       → users, social_identities, refresh_tokens, otp_codes, traveler_profiles
Agencies           → agencies, agency_documents, agency_staff
Campaigns          → campaigns, campaign_media, contributions
Packages           → packages, package_media
Groups             → group_funds, group_members, contributions (shared with Campaigns), expenses
Reviews            → reviews
Social Graph       → follows, friendships
Content            → posts, post_media, post_likes, post_comments
Chat               → chats, chat_participants, messages
Payments           → withdrawals, stripe_connect_accounts, stripe_webhook_events, subscriptions
Notifications      → notifications, notification_settings
Moderation & Audit → reports, audit_logs
```

## Users and Auth

See `04-authentication-and-rbac.md` for the full `users`, `social_identities`, `refresh_tokens`, `otp_codes` model definitions.

```text
traveler_profiles
  user_id               UUID FK → users (1:1)
  photo_media_id        UUID FK → media_assets nullable
  bio                   TEXT nullable  (open question #8 — collected here, or remove the field entirely)
  badge                 ENUM: dreamer | explorer | jetsetter  default: dreamer
  wallet_connected      BOOLEAN default: false
  created_at            TIMESTAMP
  updated_at            TIMESTAMP

destination_types  (lookup enum, resolved from the client's prototype)
  beach | mountain | city | adventure | cruise

travel_styles  (lookup enum, resolved from the client's prototype)
  luxury | budget | backpacking | family | solo | group

traveler_destination_preferences
  user_id               UUID FK → users
  destination_type      ENUM: destination_types
  PRIMARY KEY (user_id, destination_type)

traveler_travel_style_preferences
  user_id               UUID FK → users
  travel_style          ENUM: travel_styles
  PRIMARY KEY (user_id, travel_style)
```

## Agencies

```text
agencies
  id                    UUID PK
  user_id               UUID FK → users (1:1, the agency's login account / owner)
  agency_name           VARCHAR
  business_contact      VARCHAR
  business_address      VARCHAR
  status                ENUM: pending_verification | approved | rejected
  reputation_score      DECIMAL nullable  (formula undefined, open question #11)
  subscription_tier     ENUM: basic | premium | featured  default: basic
  logo_media_id         UUID FK → media_assets nullable
  description           TEXT nullable
  created_at            TIMESTAMP
  updated_at            TIMESTAMP

agency_documents
  id                    UUID PK
  agency_id             UUID FK → agencies
  type                  ENUM: business_license | certification | legal_document
  media_id              UUID FK → media_assets
  created_at            TIMESTAMP

agency_staff
  id                    UUID PK
  agency_id             UUID FK → agencies
  user_id               UUID FK → users
  permission            ENUM: owner | staff  (tiers TBD, staff account model itself is an open question)
  created_at            TIMESTAMP
  UNIQUE (agency_id, user_id)
```

## Campaigns

```text
campaigns
  id                    UUID PK
  owner_id              UUID FK → users (traveler)
  destination            VARCHAR
  trip_start_date        DATE
  trip_end_date           DATE
  goal_amount             DECIMAL
  currency                VARCHAR default: 'USD'  (single-currency MVP default)
  personal_story          TEXT
  privacy                 ENUM: public | invite_only
  invite_code              VARCHAR nullable  (mechanism for invite_only campaigns)
  is_gift_mode             BOOLEAN default: false
  status                  ENUM: draft | active | funded | booked | completed | canceled | expired
                           (the exact transition rules are open question #1 — this enum is deliberately
                           built now so the rest of the schema doesn't need reworking once they land)
  linked_package_id       UUID FK → packages nullable
  raised_amount           DECIMAL default: 0  (denormalized, kept in sync by PaymentsService on each contribution)
  is_deleted              BOOLEAN default: false
  deleted_at              TIMESTAMP nullable
  created_at              TIMESTAMP
  updated_at               TIMESTAMP

campaign_media
  id                    UUID PK
  campaign_id           UUID FK → campaigns
  media_id              UUID FK → media_assets
  type                  ENUM: image | itinerary_upload | agency_quote_upload
                          (three separate paths for "agency quotes" observed in the TRD are unified into one
                          attachment model here, regardless of entry point — manual upload, package link, or chat share)
  display_order         INTEGER default: 0

contributions
  id                    UUID PK
  campaign_id           UUID FK → campaigns nullable   (nullable because a contribution can belong to a campaign OR a group fund)
  group_fund_id         UUID FK → group_funds nullable
  contributor_id        UUID FK → users nullable  (nullable to support an anonymous-donation option)
  amount                DECIMAL
  type                  ENUM: donation | manual   (donation = paid through Stripe; manual = self-reported, unverified,
                          matches the client's own prototype behavior)
  is_anonymous          BOOLEAN default: false
  is_gift               BOOLEAN default: false
  note                  VARCHAR nullable
  stripe_payment_intent_id VARCHAR nullable  (only set for type=donation)
  created_at            TIMESTAMP

  CHECK (campaign_id IS NOT NULL OR group_fund_id IS NOT NULL)
```

## Packages

```text
packages
  id                    UUID PK
  agency_id             UUID FK → agencies
  title                 VARCHAR
  price                 DECIMAL
  currency              VARCHAR default: 'USD'
  destination_type      ENUM: destination_types nullable
  season                VARCHAR nullable
  theme                 VARCHAR nullable
  itinerary             TEXT
  is_dynamic_pricing    BOOLEAN default: false  (only meaningful once open question #2 is resolved —
                          see 00-overview.md Major Risks; a shared catalog package and a per-campaign
                          dynamic price are mutually exclusive interpretations of the same TRD line)
  status                ENUM: active | inactive | archived
  created_at            TIMESTAMP
  updated_at            TIMESTAMP

package_media
  id                    UUID PK
  package_id            UUID FK → packages
  media_id              UUID FK → media_assets
  display_order         INTEGER default: 0
```

## Groups (Group Travel Funds)

```text
group_funds
  id                    UUID PK
  creator_id            UUID FK → users
  name                  VARCHAR   (e.g. "Bali Bachelor Trip 2026")
  destination           VARCHAR
  trip_start_date       DATE
  trip_end_date         DATE
  goal_amount           DECIMAL
  currency              VARCHAR default: 'USD'
  status                ENUM: draft | active | funded | completed | canceled
  is_deleted            BOOLEAN default: false
  created_at            TIMESTAMP
  updated_at            TIMESTAMP

group_members
  group_fund_id         UUID FK → group_funds
  user_id               UUID FK → users
  role                  ENUM: creator | member  (creator has admin rights by default)
  joined_at             TIMESTAMP
  PRIMARY KEY (group_fund_id, user_id)

expenses
  id                    UUID PK
  group_fund_id         UUID FK → group_funds
  name                  VARCHAR
  amount                DECIMAL
  paid_by_user_id       UUID FK → users
  category              VARCHAR  (Transportation, Accommodation, Activities, Food — matches the client's prototype)
  created_at            TIMESTAMP
```

Note: `contributions` (raised) and `expenses` (spent) for a group fund are two independent totals, never merged into one number. This matches the client's own existing prototype (`GroupCampaignScreen.tsx`).

## Reviews

```text
reviews
  id                    UUID PK
  campaign_id           UUID FK → campaigns  (ties the review to the specific completed trip it came from)
  agency_id             UUID FK → agencies
  traveler_id           UUID FK → users
  rating                INTEGER  (1-5)
  content               TEXT nullable  (star rating alone is valid, text is optional)
  edited_at             TIMESTAMP nullable
  is_locked             BOOLEAN default: false  (set true 7 days after creation; admin can still remove regardless)
  is_deleted            BOOLEAN default: false
  created_at            TIMESTAMP
  UNIQUE (campaign_id, traveler_id)  (one review per completed trip, not one per agency lifetime)
```

## Social Graph and Content

```text
follows
  follower_id           UUID FK → users
  following_id          UUID FK → users
  created_at            TIMESTAMP
  PRIMARY KEY (follower_id, following_id)

friendships
  user_id               UUID FK → users
  friend_id             UUID FK → users
  status                ENUM: pending | accepted
  created_at            TIMESTAMP
  PRIMARY KEY (user_id, friend_id)
  (mutual friend-request model, deliberately separate from the one-way `follows` relationship)

posts
  id                    UUID PK
  author_id             UUID FK → users
  campaign_id           UUID FK → campaigns nullable  (posts can reference a campaign)
  content               TEXT
  type                  ENUM: post | journey_journal
  is_deleted            BOOLEAN default: false
  deleted_at            TIMESTAMP nullable
  created_at            TIMESTAMP
  updated_at            TIMESTAMP

post_media
  id                    UUID PK
  post_id               UUID FK → posts
  media_id              UUID FK → media_assets
  display_order         INTEGER default: 0

post_likes
  post_id               UUID FK → posts
  user_id               UUID FK → users
  created_at            TIMESTAMP
  PRIMARY KEY (post_id, user_id)

post_comments
  id                    UUID PK
  post_id               UUID FK → posts
  author_id             UUID FK → users
  content               TEXT
  is_deleted            BOOLEAN default: false
  deleted_at            TIMESTAMP nullable
  created_at            TIMESTAMP
```

## Chat

```text
chats
  id                    UUID PK
  type                  ENUM: direct_friend | group_friend | agency
  name                  VARCHAR nullable  (group chats only)
  created_by            UUID FK → users
  created_at            TIMESTAMP

chat_participants
  chat_id               UUID FK → chats
  user_id               UUID FK → users
  last_read_at          TIMESTAMP nullable
  joined_at             TIMESTAMP
  PRIMARY KEY (chat_id, user_id)

messages
  id                    UUID PK
  chat_id               UUID FK → chats
  sender_id             UUID FK → users
  content               TEXT nullable
  type                  ENUM: text | image | pdf | docx
  media_id              UUID FK → media_assets nullable
  is_deleted             BOOLEAN default: false
  created_at             TIMESTAMP
```

## Payments

```text
stripe_connect_accounts
  id                    UUID PK
  user_id               UUID FK → users nullable  (traveler payout account)
  agency_id             UUID FK → agencies nullable
  stripe_account_id     VARCHAR UNIQUE
  onboarding_complete   BOOLEAN default: false
  country               VARCHAR  (used to check Stripe Connect country coverage before onboarding)
  created_at            TIMESTAMP
  CHECK (user_id IS NOT NULL OR agency_id IS NOT NULL)

withdrawals
  id                    UUID PK
  campaign_id           UUID FK → campaigns nullable
  group_fund_id         UUID FK → group_funds nullable
  requested_by          UUID FK → users
  amount                DECIMAL
  status                ENUM: pending | processing | completed | failed
  stripe_transfer_id    VARCHAR nullable
  identity_verified     BOOLEAN default: false  (KYC gate for high-value withdrawals, threshold TBD)
  created_at            TIMESTAMP
  completed_at          TIMESTAMP nullable

stripe_webhook_events
  id                    UUID PK
  event_id              VARCHAR UNIQUE  (Stripe event id, for idempotency)
  event_type            VARCHAR
  raw_payload           JSONB
  processing_status     ENUM: pending | processed | failed
  processed_at          TIMESTAMP nullable
  created_at            TIMESTAMP

subscriptions  (agency Basic/Premium/Featured — separate from the traveler/donor side entirely)
  id                    UUID PK
  agency_id             UUID FK → agencies
  tier                  ENUM: basic | premium | featured
  billing_channel       ENUM: web  (assumed, not native IAP — see open question #28 before adding a mobile value here)
  status                ENUM: active | canceled | past_due
  started_at            TIMESTAMP
  updated_at            TIMESTAMP
```

## Notifications

```text
notifications
  id                    UUID PK
  recipient_id          UUID FK → users
  type                  ENUM: donation | milestone | agency_response | chat_message | like | comment | share |
                               review_received | verification_status | account_status | campaign_flagged
  title                 VARCHAR
  body                  TEXT
  data                  JSONB nullable  (deep link payload)
  is_read               BOOLEAN default: false
  read_at               TIMESTAMP nullable
  created_at            TIMESTAMP

notification_settings
  user_id               UUID FK → users
  type                  ENUM: (same as notifications.type)
  is_enabled            BOOLEAN default: true
  PRIMARY KEY (user_id, type)
```

Every value in the `notifications.type` enum has a corresponding row possibility in `notification_settings`, deliberately, to avoid the "Settings has fewer toggles than actual triggers" gap found repeatedly across the TRD (all three roles) during the gap review.

## Moderation and Audit

```text
reports
  id                    UUID PK
  reporter_id           UUID FK → users nullable  (nullable for system/admin-generated reports)
  target_type           ENUM: post | comment | review | message | campaign
                          (reviews and chat messages included deliberately — the TRD's own admin moderation
                          scope only names posts/blogs/photos/campaign media, but both are plausible
                          fraud/dispute surfaces, see open question #12)
  target_id             UUID
  reason                VARCHAR
  status                ENUM: pending | reviewed | actioned | dismissed
  resolved_by           UUID FK → users nullable
  resolved_at           TIMESTAMP nullable
  created_at            TIMESTAMP

audit_logs
  id                    UUID PK
  actor_user_id         UUID FK → users nullable
  actor_role            VARCHAR
  action                VARCHAR
  target_type           VARCHAR nullable
  target_id             UUID nullable
  before                JSONB nullable
  after                 JSONB nullable
  ip_address            VARCHAR nullable
  request_id            VARCHAR nullable
  created_at            TIMESTAMP
  (append-only — no update or delete path exists for this table, by design)
```

## Media

```text
media_assets
  id                    UUID PK
  uploader_id           UUID FK → users
  key                   VARCHAR  (S3/MinIO object key)
  content_type          VARCHAR
  status                ENUM: pending | uploaded
  created_at            TIMESTAMP
```

## Key Design Decisions

- **Soft deletes on campaigns, posts, comments, reviews, messages** — `is_deleted` flag with `deleted_at` timestamp, gives moderation a review window.
- **`campaigns.status` and `group_funds.status` are built now with a full enum**, even though open question #1 (exact transition rules) is unresolved — this avoids reworking the schema later, only the transition logic changes once answered.
- **`contributions` is shared between Campaigns and Group Funds** via two nullable FKs with a CHECK constraint, rather than two separate tables, since the donation/manual/anonymous/gift logic is identical for both.
- **`campaign_media.type` unifies the three separate "agency quote" entry points** (manual upload, package link, chat share) found during the TRD review into one attachment model.
- **`reviews` has a UNIQUE (campaign_id, traveler_id)`** — enforces one review per completed trip, not one per agency lifetime, resolving open question about review cardinality with the more honest model.
- **`stripe_connect_accounts.country`** is stored explicitly so a check can run before onboarding an agency in a country Stripe Connect doesn't support payouts to.
- **`reports.target_type` includes `review` and `message`** deliberately, ahead of the client's answer to open question #12, since excluding them silently would mean building a moderation system with a known gap baked in.
- **`audit_logs` is append-only** — this is a security requirement, not a business decision, so it's enforced in the schema/access layer regardless of what else is still open.
