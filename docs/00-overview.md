# Overview

## Product Summary

Veakay is a travel-fundraising and agency-collaboration platform for iOS and Android. Travelers create fundraising campaigns for vacations (like GoFundMe), collaborate with verified travel agencies to plan itineraries and book trips, and share their journey socially. Travel agencies offer packages, respond to traveler requests, and receive payments. A web-based Super Admin dashboard handles registration approval, fraud oversight, content moderation, and platform compliance.

## Backend Goal

The backend provides one secure API platform for:

- Mobile app users, travelers and agencies, on iOS and Android: all authenticated flows.
- Web admin dashboard users: super admins managing the platform.
- Background workers: notification dispatch, badge/milestone checks, campaign lifecycle checks, scheduled reports, cleanup jobs.
- Real-time clients: Socket.io connections for chat (friend, group, and agency).
- External integrations: Stripe (Connect + Billing), a generic SMTP provider (MailHog locally, production SMTP provider not yet chosen), Firebase Admin SDK, MinIO/S3, a still-undecided audio/video calling vendor.

## Architectural Direction

Use a NestJS modular monolith for V1. This is the right scale for launch and keeps module boundaries clean enough to extract services later if needed.

```text
AuthModule
UsersModule
AgenciesModule
CampaignsModule
PackagesModule
GroupsModule
ReviewsModule
FeedModule
ExploreModule
ChatModule
NotificationsModule
PaymentsModule
ModerationModule
AdminModule
StorageModule
PrismaModule
```

Microservices are not needed for V1. If scale demands it later, the payments module, real-time gateway, and notification dispatch can be separated without changing the external API contract.

## System Components

```text
Mobile App (Traveler + Agency, iOS + Android)
        |
        v
NestJS Backend (single codebase)
        |
   _____|______________________________
  |          |           |            |
PostgreSQL  Redis      MinIO/S3   External APIs
(primary)  (cache,    (media      (Stripe, SMTP,
           sessions,  storage)    Firebase, call vendor TBD)
           BullMQ,
           pub/sub)
        ^
        |
Admin Dashboard (separate frontend, same backend)
```

## MVP Feature Set

All features below are in the TRD and confirmed for launch, grouped by the order they'll actually be built in (see `PROGRESS_TRACKER.md` for the live status):

1. Authentication and onboarding (traveler: email/Google/Apple + email OTP; agency: email + email OTP only).
2. Traveler profile setup, travel preferences, status badges (Dreamer/Explorer/Jetsetter).
3. Agency registration and verification, document upload, Verified Agency Badge, reputation score.
4. Chat: 1:1 and group friend chat, 1:1 and audio/video agency chat.
5. Social feed: posts, likes, comments, follow, Journey Journal.
6. Vacation campaign creation, privacy (public/invite-only), Gift Mode.
7. Itinerary Builder and agency package linking.
8. Friends & Group Trips: group travel funds, contributions, expense tracking ("Spend").
9. Agency ratings and reviews.
10. Payment and withdrawal: Stripe Connect donations, payouts, commission splitting.
11. Explore: trending, geo-map, filters.
12. Notifications: traveler and agency, push + in-app.
13. Security & Verification: identity verification for high-value withdrawals, verified campaign badges.
14. Agency dashboard, package management, marketing tools, admin & compliance tools.
15. Super Admin dashboard: user/agency management, campaign oversight, payment management, analytics, content & compliance, audit logs.

## Non-Functional Requirements

- Target scale at launch: not specified in the TRD; build for 0-10,000 users as a reasonable default, same as the team's other projects, revisit if the client gives a real number.
- Architecture must be scale-ready for growth beyond launch without a rewrite.
- API response target: under 300ms for standard reads under normal load.
- Real-time chat target: message delivery under 500ms.
- Uptime target: 99.5% monthly (default, not specified by client).
- All credentials and secrets managed via environment variables, never in code.
- Soft deletes on campaigns, posts, comments, reviews, and messages to support moderation review.
- All admin mutations must write audit logs.

## Major Risks

See `Veakay_TRD_Open_Questions.md` for the full, verified list (28 items with exact TRD line references). The ones that most affect architecture, not just business policy:

- No campaign/trip/booking lifecycle status model is defined anywhere in the TRD (open question #1). This affects nearly every module. Build every relevant entity with a flexible status enum now; do not hardcode transition rules.
- Whether a Package is a reusable catalog or a single-campaign offer (open question #2) is undecided and determines the Campaign-Package schema relationship. Resolve before building `PackagesModule`.
- Whether the agency subscription (Basic/Premium/Featured) is sold via native in-app purchase or a web billing page (open question #28) determines whether Apple/Google IAP integration is needed at all. Default assumption: web billing via Stripe, no IAP.
- Refund-after-withdrawal handling (open question #4) is a real solvency question, not just a workflow detail.
- The audio/video calling vendor is not named anywhere in the TRD. Wrap it behind an interface so the choice doesn't lock in the architecture.
