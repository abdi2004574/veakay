# Handoff — Veakay

This file is local-only and must not be committed, in any of the three repos. Update it whenever work changes direction, a feature is completed, a decision is made, or something is left for the next agent. It covers `backend-repo/`, `dashboard-repo/`, and `mobile-app-repo/` together, not one per repo.

## Agent Instructions

- Read AGENTS.md first, then this file.
- Update this file at the end of meaningful sessions, in any repo.
- Do not commit this file, docs/, CLAUDE.md, or AGENTS.md.
- Do not commit any repo's .env.
- Never commit without the user explicitly asking.

## Tracking has moved to a feature-based tracker

`docs/PROGRESS_TRACKER.md` was rewritten from the VK-xxx sprint-numbered format to a feature-based tracker (11 features, table format with ✅/⬜/🔜/🚧 status per item) — the sprint sheet and even the TRD itself are AI-generated and demonstrably inconsistent in places, so `figma-demo/`'s actual screens are now treated as the real source of truth wherever the UI shows something concrete. Check that file first for what's done/next; this section here just summarizes.

## Current Project State (as of 2026-09-03)

The Auth module (traveler + agency + admin, including the post-signup onboarding wizard), the Social Feed/Stories/Friends module (including the Storage module built mid-feature to unblock it), the Chat / Messaging module, Explore/Agency Directory/Reviews, Campaign Creation & Management, Traveler Settings & Account, Friends & Group Trips (the group-fund money logic), **and Agency Packages (#9A) + Trip Requests & Communication (#9B)** are all built end to end, backend and mobile together, and manually + automatically verified against a live, fully dockerized stack. Both E2E suites were unblocked (Docker running locally) and are now passing - Packages 14/14, Trip Requests 27/27.

**Backend (`backend-repo/`)**: NestJS 11 + Prisma 6 + PostgreSQL 17 + Redis 7, scaffolded and running. Fully dockerized via `docker-compose.yml` on an uncommon port block (chosen so this stack never collides with other local projects like Miralynk, which uses the standard defaults):

```
Postgres (dev)   → localhost:57432
Postgres (test)  → localhost:57433
Redis            → localhost:57379
MailHog SMTP     → localhost:57025      MailHog UI → localhost:58025
MinIO API        → localhost:57900      MinIO console → localhost:57901
Backend API      → localhost:57800      Swagger docs → localhost:57800/api/v1/docs
```

Bring the whole stack up from `backend-repo/`: `docker compose up -d`. The `app` service hot-reloads on source changes (bind-mounted, runs `npm run start:dev` inside the container). `.env` (gitignored) has real dev values; `.env.example` documents them.

**Mobile (`mobile-app-repo/`)**: Expo (SDK 57) + Expo Router + TypeScript, scaffolded fresh. NativeWind (Tailwind v3, not v4 — NativeWind 4.2.6 doesn't support Tailwind v4 yet) reuses figma-demo's actual color tokens and logo asset. TanStack Query + Zustand wired up per `docs/mobile/01-tech-stack.md`. Run it from `mobile-app-repo/`: `npm run start` (or `:ios`/`:android`/`:web`), Metro on port 57081. Points at the backend via `EXPO_PUBLIC_API_BASE_URL` in `.env` (defaults to `http://localhost:57800/api/v1`; Android emulator needs `10.0.2.2` instead of `localhost`, physical devices need the host's LAN IP — not yet handled automatically).

Mobile is **not** dockerized — Expo/React Native can't meaningfully run in a container, so it runs natively via Expo CLI on the host.

## What Has Been Built

See `docs/PROGRESS_TRACKER.md` for the full per-feature breakdown. Summary of work-done, backend-by-backend:

- **Auth** (`src/modules/auth/`, `src/modules/users/`): traveler/agency/admin registration, login (password/OTP/social), onboarding wizard, sessions, password reset, 2FA for admin. 56 unit + 14 E2E tests, all green.
- **Social Feed/Stories/Friends** (`src/modules/feed/`, `src/modules/friends/`, `src/modules/storage/`): posts/comments/likes/reposts, stories, friend requests, presigned MinIO uploads. 123 unit + 36 E2E tests, all green.
- **Chat/Messaging** (`src/modules/chat/`): direct/group/agency conversations, text/image/document messages, delivered/read receipts, shared agency team inbox. 160 unit + 45 E2E tests, all green.
- **Explore/Agency Directory/Reviews** (`src/modules/reviews/`, agency-directory endpoints in `src/modules/agencies/`): public agency browse, agency detail, one-per-traveler reviews with reputation-score cache. 182 unit + 54 E2E tests, all green.
- **Campaign Creation & Management** (`src/modules/campaigns/`): campaign CRUD, ordered photos, public browse, privacy. 198 unit + 65 E2E tests, all green.
- **Traveler Settings & Account** (extends `src/modules/users/`): profile edit, notification prefs, privacy (with real private-profile enforcement), change-password, delete-account. Tests included in Auth totals.
- **Friends & Group Trips** (`src/modules/group-campaigns/`): group-trip mode on campaigns, members, contributions, expenses, lazy group-chat creation. Tests included above; running totals ~211 unit + 74 E2E.
- Running totals (2026-09-04, after wallet ledger pass): **252 unit + 112 E2E tests, all green across 7 features** (Auth, Social Feed, Chat, Explore, Campaigns, Settings + Group Trips, Packages #9A + Trip Requests #9B). The wallet ledger pass added 41 wallet unit tests and 32 new wallet E2E tests on top of those baselines.
- **Package & Itinerary Management (Feature #9A)** (`src/modules/packages/`): agency package CRUD, public browse with filters, many-to-many PackageCampaignLink. 20 unit + 14 E2E tests, all unit green, E2E blocked on Docker.
- **Trip Requests & Communication (Feature #9B, built 2026-09-03)** (`src/modules/trip-requests/`): traveler→agency trip requests, lifecycle `pending → in_discussion → confirmed → completed` (+ declined/cancelled), smart-reply template CRUD per agency, lazy agency-chat fan-out. 46 unit tests all green, 27 E2E tests written/type-clean (blocked on Docker). `// TODO: invoicing/commission deduction pending Feature #6` at the `confirmed` transition; no Stripe PaymentIntent or commission split is wired.
- **Agency Packages mobile UI (Feature #9A, built 2026-09-03)**: `app/(agency)/packages/` (list + 4-step create/edit wizard + detail with Edit + Delete), `app/(traveler)/itinerary/` (real Browse Packages screen replacing the placeholder), `app/(traveler)/package/[id].tsx` (new: package detail + link-to-campaign). Reusable `PackageCard` and `PackageSummaryCard` components. All real TanStack-Query-wired, no mocks. Photo upload uses the existing `pickAndUploadFromLibrary('package_visual', ...)` storage flow.
- **Smart-reply picker + Quick Replies CRUD + Agency Inbox (Feature #9B, mobile built 2026-09-03)**: `app/(agency)/requests/index.tsx` (incoming trip requests inbox with All / Pending / Replied / Booked filter cards), `app/(agency)/requests/[id].tsx` (request detail with legal-only status transitions + lazy agency-chat link), `app/(agency)/requests/smart-replies.tsx` (template CRUD with slide-up modal). Reusable `RequestStatusBadge` and `SmartReplyPicker` components. `SmartReplyPicker` integrated into the existing `ChatThreadScreen` as an agency-only "Quick replies" Zap button in the composer. Real TanStack-Query-wired, no mocks. The "Booked" filter is a client-side merge of `confirmed` + `completed` because the backend's `?status=` only accepts one value; counts always reflect the full unfiltered server response so they stay stable as the user switches tabs.
- **Payments / Wallet ledger core (Feature #6, processor-agnostic pass, 2026-09-04)** (`src/modules/wallet/`): `WalletAccount` + append-only `WalletTransaction` ledger with idempotency-keyed writes, reworked `Donation` decoupled from Stripe fields, reworked `WithdrawalRequest` with status flow `requested → approved | rejected → paid` (debit deferred to `mark-paid`). `IFundingProvider` interface + `FUNDING_PROVIDER` injection token; current implementation is `ManualFundingProvider` (admin-only `POST /admin/wallet/wallets/:userId/credit` for ops reconciliation). Admin endpoints: review, mark-paid (MVP-only ops path, replaced by processor webhook once the funding rail is confirmed), platform-wide list. No external money movement in this build; `recordDonation` is an internal service hook called by the (TBD) processor webhook, no public HTTP endpoint by design. Deprecated Stripe-specific models retained in schema with `/// DEPRECATED` markers for the eventual processor integration. **41 unit tests + 38 E2E tests, all green.** Per-feature doc: `docs/features/wallet-ledger.md`.

## Notable Cross-Cutting Gaps

- **Payments, Wallet & Withdrawal (#6)** — ledger core is built (processor-agnostic pass, 2026-09-04): 41 unit + 38 E2E tests green. Remaining blockers are the client funding-rail decision (JazzCash / Easypaisa / bank gateway / Stripe Connect — TBD) and TRD open questions #3 (high-value threshold), #4 (refund-after-withdrawal), #5 (verification terminology), #27 (donation fee). No real Stripe / payment-processor credentials needed for the ledger layer; they're only needed when the real `IFundingProvider` implementation lands. The `mark-paid` admin endpoint is an MVP-only ops reconciliation path that is removed when the processor webhook replaces it.
- **Storage module** `getViewUrl` now enforces purpose-based access control. Private campaign photos, friends-only posts/stories, profile privacy settings, agency approval status, and chat participant checks are all gated server-side. Content-type re-validation added to `confirmUpload`. 16 new unit tests + 8 new E2E regression tests added.
- **Admin seed script** — first Super Admin has no creation path yet (no public registration for admins). Tracked in tracker feature #11.
- **Agency approve/reject admin endpoints** — shipped (Feature #11). `GET /admin/agencies/pending`, `POST /admin/agencies/:id/approve`, `POST /admin/agencies/:id/reject` with `@RequirePlatformRole(super_admin)` guard, Pino audit logs (`agency.verification.approved` / `agency.verification.rejected`), and email notifications via `MailService.sendAgencyApprovedEmail` / `sendAgencyRejectedEmail`.
- **Manual API tester page** — open question; not built, not decided either way yet.

## Development Flow (now reflects actual practice across 5 features)

`docs/DEVELOPMENT_FLOW.md` documents the standing flow: backend is Swagger → unit → E2E → commit (only when explicitly asked) → docs; mobile is screens matching figma exactly → real TanStack Query wiring → manual Playwright verification against the live dockerized backend → docs. Steps 4/5 of the backend flow (deploy, blackbox-on-prod) remain deferred since no CI/CD or production environment exists yet.

## Open Questions

See `docs/Veakay_TRD_Open_Questions.md` (28 items, verified line-by-line against the TRD and the existing Figma Make prototype). Do not guess at any of these while implementing; confirm with the user first if a feature touches one.

## Known Issues

1. **OTP delivery to MailHog**: OTP emails are correctly sent to MailHog (localhost:58025), not to a real SMTP inbox. `.env` had a misleading "Production SMTP (Gmail)" comment that confused the initial tester - fixed by correcting the comment. `.env.example` had duplicate `MAIL_HOST`/`MAIL_PORT` keys (production section shadowing the MailHog section) - fixed by merging into one section.
2. **Broken trip-request migration `20260903063549`**: was a no-op (entire SQL on one comment line) - removed; the corrected `20260903070425` migration is the canonical version.
3. **Test DB was missing all 3 trip-request migrations**: applied via `prisma migrate deploy` after verifying the test database had none of the trip-request schema changes.
