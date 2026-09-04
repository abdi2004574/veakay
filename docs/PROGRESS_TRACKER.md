# Veakay Feature Tracker

## Context

The sprint sheet (`Veakay_Sprint_Tracker.md`) and the TRD itself are AI-generated and demonstrably inconsistent in places (confirmed by a full section-by-section gap-log review). Per project direction: **build feature-by-feature, and treat `figma-demo/`'s actual screens as the real source of truth whenever the UI shows something concrete** — TRD text and the sprint sheet are advisory, not authoritative, when they conflict with what's actually designed. This tracker is **the** tracker going forward, replacing the VK-xxx sprint numbering entirely. The standing development flow (Swagger → unit → E2E → commit → blackbox → docs) now includes updating this file's ✅ marks at the end of each feature.

Built by reading, in full: the TRD (688 lines), the section-by-section gap log (687 lines, all 30 sections + its own resolution pass), the 28-item open-questions doc, and a complete inventory of every route in `figma-demo/src/app/routes.tsx` plus every one of the 46 traveler + 23 agency screen files. Every feature cites the exact screens backing it and the exact open-question numbers still outstanding. **Open questions are not blockers** — each feature builds everything unblocked using the gap log's own resolved defaults; only genuinely open items are deferred (noted per feature, never silently dropped). Numbering is stable and cross-referenced (later features reference earlier ones as "#N") — do not renumber without updating cross-references.

**Legend:** ✅ Done · ⬜ Not started · 🔜 Building now · 🚧 Blocked (see open questions)

## At a glance

| # | Feature | Status |
|---|---|---|
| 1 | Auth & Onboarding | ✅ done |
| 2 | Social Feed, Stories & Friends | ✅ done |
| 3 | Chat / Messaging | ✅ done |
| 4 | Explore, Agency Directory & Reviews | ✅ done (scope narrowed to what's real — see below) |
| 5 | Campaign Creation & Management | ✅ done (scope narrowed to what's real — see below) |
| 6 | Payments, Wallet & Withdrawal | ⬜ not started · 🚧 most blocked |
| 7 | Traveler Settings & Account | ✅ done |
| 8 | Friends & Group Trips (remainder) | ✅ done |
| 9 | Agency Dashboard & Business Tools | ✅ Packages & Trip Requests sub-scopes built (backend + mobile) · ⬜ remaining sub-scopes not started |
| 10 | Notifications (Traveler + Agency) | ⬜ not started |
| 11 | Admin / Super Admin Panel | ⬜ not started · 🚧 heavily blocked, needs scoping pass |

---

## 9. Agency Dashboard & Business Tools — ✅ Packages & Trip Requests sub-scopes built (backend + mobile)

**Packages sub-scope — Feature #9A**

**Figma screens:** AgencyPackagesScreen.tsx (built — see Mobile sections below), ItineraryScreen.tsx (built — see traveler-side Mobile section). figma-demo has no separate `AgencyPackageDetailScreen.tsx`; the LIST card is the "detail" surface in figma. The mobile app has a real `app/(agency)/packages/[id].tsx` detail anyway since the task spec required it.

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| Package | agencyId, title, description, basePrice, currency, destinationType, season, theme, itinerary, status, isDynamicPricing (+ TODO comment for dynamic pricing formula) | ✅ |
| PackageMedia | packageId, mediaId, displayOrder | ✅ |
| PackageCampaignLink | packageId, campaignId | ✅ |
| MediaPurpose enum | + package_visual | ✅ |
| PackageStatus enum | active, inactive, archived | ✅ |

**Backend — endpoints**

| Endpoint | Status |
|---|--:|
| POST /packages | ✅ |
| GET /packages/mine | ✅ |
| GET /packages/:id | ✅ |
| PATCH /packages/:id | ✅ |
| DELETE /packages/:id | ✅ |
| GET /packages (public browse with destinationType/season/theme filters) | ✅ |
| POST /packages/:packageId/campaigns/:campaignId/link | ✅ |
| DELETE /packages/:packageId/campaigns/:campaignId/link | ✅ |

**Backend — tests**

| Test group | Status |
|---|--:|
| unit: PackagesService — 20 tests: create, listMine, getDetail (owner vs public visibility), update (ownership + media replace), remove, listPublic (filters + cursor pagination), linkToCampaign (active-only, ownership, duplicate rejection), unlinkFromCampaign | ✅ |
| E2E: packages.e2e-spec.ts — 14 tests covering agency CRUD with real media upload, public browse/filtering, active-vs-inactive visibility, link/unlink, duplicate rejection, cross-account ownership guards | ✅ 14/14 passing (run Sep 3 2026) |
| **Running totals at this point:** 231 unit tests, 88 E2E tests (14 packages + 27 trip-requests now passing), all green | ✅ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(agency)/packages/index.tsx` — real list screen replacing the in-dev placeholder. Filter pills (All / Active / Inactive / Archived), gradient pill for active tab, `PackageCard` list, FAB → create, matches figma's `AgencyPackagesScreen` visual structure. | ✅ |
| `app/(agency)/packages/create.tsx` — 4-step wizard (Basic Info → Itinerary → Media → Review) supporting both create and edit modes (driven by `editPackageId` route param, matches the existing `app/(traveler)/campaigns/create.tsx` pattern). Real photo upload via the existing `pickAndUploadFromLibrary('package_visual', ...)` storage flow (the storage backend already supported `package_visual` as a `MediaPurpose`; the mobile `MediaPurpose` union was extended to include it). | ✅ |
| `app/(agency)/packages/edit.tsx` — thin wrapper that forwards `packageId` → `editPackageId` and redirects into the create route. | ✅ |
| `app/(agency)/packages/[id].tsx` — detail screen (hero image, status pill, metadata grid, itinerary, gallery, sticky Edit + Delete bar with `showAlert` confirm). | ✅ |
| `app/(traveler)/itinerary/index.tsx` — replaced the "Packages are coming soon" placeholder with a real Browse Packages screen (search input + collapsible destination-type filter chips + `PackageSummaryCard` vertical list + cursor pagination), matching figma's `ItineraryScreen` visual structure. | ✅ |
| `app/(traveler)/package/[id].tsx` — new traveler-facing package detail (hero, agency name + reputation, price, description, metadata chips, itinerary, "Link to a campaign" section with horizontal scroll of the traveler's active campaigns + optimistic link/unlink state with revert-on-error, "Message Agency" gradient button → real `useCreateConversation({ type: 'agency' })` call). | ✅ |

**Mobile — components**

| Component | Status |
|---|---|
| `PackageCard` — matches figma's `PackageCard` (status pill in top-left, edit overlay in top-right, dark gradient overlay, price block in vaykaePink). Edit button's onPress stops propagation so it doesn't fire the card's own onPress. | ✅ |
| `PackageSummaryCard` — read-only, used by `ItineraryScreen`. Matches figma's package card (hero + title + agency + reputation + price). | ✅ |
| `RequestStatusBadge` — see #9B section (reused by inbox screens). | ✅ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/packages.ts` — `PackageInput`, `createPackage`, `updatePackage`, `deletePackage`, `listMyPackages`, `listPackages` (with destinationType/season/theme filters, cursor pagination), `getPackage`, `linkPackageToCampaign`, `unlinkPackageFromCampaign` | ✅ |
| `src/hooks/use-packages-queries.ts` — `useMyPackages`, `usePackageDirectory`, `usePackage` | ✅ |
| `src/hooks/use-packages-mutations.ts` — `useCreatePackage`, `useUpdatePackage`, `useDeletePackage` | ✅ |
| `src/hooks/use-package-link-mutations.ts` (new) — `useLinkPackageToCampaign`, `useUnlinkPackageFromCampaign` | ✅ |
| `src/api/storage.ts` extended with `'package_visual'` MediaPurpose (backend already supported it; the mobile `MediaPurpose` union just needed the literal) | ✅ |
| `src/api/types.ts` extended with `Package`, `PackageStatus`, `PackageMediaEntry`, `PackageAgency` | ✅ |

**Real bugs found and fixed while building this feature**

| Bug | Root cause | Fix |
|---|---|---|
| **`<GradientButton>` used with ReactNode children** in `app/(agency)/packages/[id].tsx`'s Edit button — `GradientButton` is typed `children: string` only, so this would fail typecheck and on web render a broken button. | The detail-screen agent used a `<View><Icon/><Text>Edit</Text></View>` pattern inside the gradient button to show the icon + label, but the existing component doesn't support ReactNode children. | Replaced with a `Pressable` + `<LinearGradient colors={vaykaeGradient}>` wrapper that achieves the same visual without the type mismatch. |
| **Stray `<AgencyBottomNav active="packages" />` rendered at the end of the create wizard** — would have put a tab bar on top of a full-screen modal-like wizard, blocking access to the back / Next buttons. | The packages-screen agent imported the bottom nav (correctly used on the LIST screen) and accidentally rendered it on the wizard and detail screens too. | Removed the nav from both `create.tsx` and `[id].tsx`. The detail screen's action bar height was also redundant with the now-removed tab bar's safe-area handling; changed it to use `insets.bottom + 16` directly. |

**Explicitly deferred (documented, not silently dropped)**

| Item | Reason |
|---|--:|
| Trip customization | Flagged Later Scope in feature doc |
| Dynamic pricing formula | isDynamicPricing field + TODO comment stored; formula deferred per explicit instruction |
| Package analytics | Later Scope |
| Max visuals per package cap | TRD silent; deferred until design specifies |
| Admin package moderation | No soft-delete; hard-delete only per MVP scope |

**Open questions (deferred — not blocking)**

| # | Question | Resolution for this feature |
|---|--|--|
| #2 | One package linked to many campaigns, or single campaign? | Resolved many-to-many via PackageCampaignLink |
| — | Max visuals per package | Not specified in TRD; MVP allows unlimited |
| — | Package edit after link | Traveler can unlink and re-link; no historical record until #6 |
| — | Package expiration / seasonality | No auto-archive; agencies manually toggle status |

**Trip Requests sub-scope — Feature #9B**

**Figma screens:** `AgencyRequestsScreen.tsx` and `AgencyRequestDetailScreen.tsx` (both built — see Mobile sections below). `CreateRequestScreen.tsx`/agency inbox variants (the existing chat thread screen handles the actual message flow, no separate detail screen invented).

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `TripRequest` | travelerId, agencyId, packageId?, campaignId?, status (TripRequestStatus: pending/in_discussion/confirmed/completed/declined/cancelled), initialMessage, conversationId?, createdAt, updatedAt | ✅ |
| `SmartReplyTemplate` | agencyId, title, body | ✅ |
| `TripRequestStatus` enum | pending/in_discussion/confirmed/completed/declined/cancelled | ✅ |

**Backend — endpoints**

| Endpoint | Status |
|---|---|
| `POST /trip-requests` (`@RequireRole(traveler)`) | ✅ |
| `GET /trip-requests/mine` (traveler’s own, status-filterable, cursor-paginated) | ✅ |
| `GET /trip-requests/:id` (ownership-checked: traveler owns OR agency owns) | ✅ |
| `POST /trip-requests/:id/cancel` (traveler, only pending/in_discussion) | ✅ |
| `GET /trip-requests` (`@RequireRole(agency)`, incoming, status-filterable) | ✅ |
| `PATCH /trip-requests/:id/status` (agency, follows `ALLOWED_TRANSITIONS` lifecycle) | ✅ |
| `GET /trip-requests/smart-replies/templates` (agency, scoped to own agency) | ✅ |
| `POST /trip-requests/smart-replies/templates` (agency) | ✅ |
| `PATCH /trip-requests/smart-replies/templates/:id` (agency, ownership-checked) | ✅ |
| `DELETE /trip-requests/smart-replies/templates/:id` (agency, ownership-checked) | ✅ |

**Backend — design decisions**

| Decision | Reasoning |
|---|---|
| Lazy `Conversation` creation on request creation | Reuses-or-creates a `Conversation` of type `agency` between traveler and agency (same lazy pattern as Group Trips’ `groupConversationId`). Initial inquiry is auto-posted as a `text` message via `MessagesService.send` so the chat thread already has context when the agency opens it. |
| Documents/quotes via existing chat, not a parallel upload path | TRD’s "share quotes and documents" requirement routes through the existing `POST /conversations/:id/messages` document-message flow from Feature #3, not a new endpoint. |
| Per-agency smart-reply templates, not per-staff | Matches the chat shared-inbox model from Feature #3 — every staff member sees the same set; per-staff is out of scope (tied to #9’s staff-management sub-scope). |
| Audit log emitted via Pino, not `AuditService` | `AuditService` is not yet implemented (Feature #11 owns it). Every status transition emits a structured Pino log entry with the exact audit contract to be replayed into `audit_logs` once the service exists. |
| `// TODO: invoicing/commission deduction pending Feature #6` at the `confirmed` transition | No Stripe PaymentIntent or commission split is wired on `confirmed`; Feature #6 is the most-blocked feature in the tracker. Comment sits at the exact hook point. |
| `getDetailForCaller` returns 404 (not 403) for cross-owner reads | Consistent with Feature #5’s private-campaign and Feature #4’s `AgencyDetail` "pending agency is 404" patterns — never leak existence. |

**Backend — tests**

| Test group | Status |
|---|---|
| unit: `TripRequestsService` — 46 tests: create (approval gate, package/campaign ownership, conversation reuse, auto-post), listMineForTraveler, listForAgency, getDetailForCaller (4 ownership branches), updateStatus (every legal transition + 6 illegal transitions, audit-log emission), cancel (4 status branches + ownership), smart-reply templates (list/create/update/delete + cross-agency rejection) | ✅ |
| E2E: `trip-requests.e2e-spec.ts` — 27 tests: creation against approved agency + pending-agency 404, package/campaign ownership rejections, traveler 403 on creation, traveler mine list with status filter, agency incoming list with filter, full status lifecycle (pending→in_discussion→confirmed→completed, pending→declined), illegal-transition 422, traveler cancel across status branches, smart-reply CRUD + cross-agency 404, detail endpoint ownership branches | ✅ 27/27 passing (run Sep 3 2026) |
| **Running totals at this point:** 277 unit tests (46 new + previous 231), 101 E2E tests (27 new + previous 74, packages 14/14 + trip-requests 27/27 now passing), all green, build clean (`tsc --noEmit`) | ✅ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(agency)/requests/index.tsx` — real "Travel Requests" inbox replacing the in-dev placeholder. 4 filter cards (All / Pending / Replied / Booked) where "Booked" = confirmed + completed (client-side merged since the backend filter only accepts one status), `RequestCard` list with absolute-positioned `<RequestStatusBadge>`, traveler avatar + name + relative time, initial-message preview, linked package/campaign hints. Matches figma's `AgencyRequestsScreen` visual structure (with the honest note that the backend has no budget/dates/traveler-count/preferences fields, so the card's "trip details" row only renders what's actually stored). | ✅ |
| `app/(agency)/requests/[id].tsx` — request detail. Traveler info card (with "Message" link → `/(agency)/inbox/${conversationId}` reusing the existing `ChatThreadScreen` — no new chat UI), linked package + campaign context cards, initial-message block, an honest "No travel preferences recorded" muted-text block (backend has no preferences field), sticky bottom action bar driven by a mirrored `ALLOWED_TRANSITIONS` map (`pending → in_discussion\|declined`, `in_discussion → confirmed\|declined`, `confirmed → completed`, terminal states) — illegal transitions don't render buttons, every transition goes through a `showAlert` confirm. "Continue Conversation" outlined button always available when `conversationId` is set. | ✅ |
| `app/(agency)/requests/smart-replies.tsx` — quick-reply template CRUD (list + create/edit slide-up modal + delete with `showAlert` confirm). `react-native` `Modal` with `animationType="slide"` and `KeyboardAvoidingView`. Save disabled while pending or on empty inputs. | ✅ |
| `src/components/ChatThreadScreen.tsx` (extended) — agency-only "Quick replies" `Zap` button added to the chat composer (between TextInput and Send, only when `convo.type === 'agency'`); tapping opens `<SmartReplyPicker>` (absolute overlay anchored above the composer with title + close + scrollable list of templates). Tapping a template appends its body to the existing text (or seeds it if empty), then closes the picker. | ✅ |

**Mobile — components**

| Component | Status |
|---|---|
| `RequestStatusBadge` — single source of truth for trip-request status colors (soft + solid variants, sm + md sizes). The 6 backend statuses (`pending` / `in_discussion` / `confirmed` / `completed` / `declined` / `cancelled`) map to 6 user-readable labels with the same color tints figma's `AgencyRequestsScreen` used (yellow / blue / green / dark-green / red / gray). | ✅ |
| `SmartReplyPicker` — absolute-positioned overlay that lives inside the chat composer area; reads from `useSmartReplyTemplates`, shows loading/error/empty states. The "Manage quick replies" entry point lives in the request detail screen's top-right settings icon → `/(agency)/requests/smart-replies`. | ✅ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/trip-requests.ts` — `createTripRequest`, `listAgencyTripRequests`, `listMyTripRequests`, `getTripRequest`, `updateTripRequestStatus`, `cancelTripRequest`, `listSmartReplyTemplates`, `createSmartReplyTemplate`, `updateSmartReplyTemplate`, `deleteSmartReplyTemplate` | ✅ |
| `src/hooks/use-trip-requests-queries.ts` — `useAgencyTripRequests` (cursor-paginated, optional status filter), `useMyTripRequests`, `useTripRequest`, `useSmartReplyTemplates` | ✅ |
| `src/hooks/use-trip-requests-mutations.ts` — `useUpdateTripRequestStatus` (invalidates `['trip-request', id]` + `['trip-requests', 'agency']` + `['trip-requests', 'mine']`), `useCancelTripRequest`, `useCreateTripRequest` (also invalidates `['conversations']` since the lazy agency conversation is created on the same call), `useCreateSmartReplyTemplate`, `useUpdateSmartReplyTemplate`, `useDeleteSmartReplyTemplate` | ✅ |
| `src/api/types.ts` extended with `TripRequest`, `TripRequestStatus`, `TripRequestTraveler`, `TripRequestAgencySummary`, `TripRequestPackageRef`, `TripRequestCampaignRef`, `SmartReplyTemplate` | ✅ |

**Real bugs found and fixed while building this feature**

| Bug | Root cause | Fix |
|---|---|---|
| **Trip-requests hook call signature mismatch** — hooks called `listAgencyTripRequests(pageParam, filter, accessToken)` but the API function signature is `listAgencyTripRequests(status, cursor, limit, accessToken)`. Would have interpreted the cursor as the status and silently passed the access token as the limit at runtime. | The api-file agent and the hooks-file agent used different parameter orders when running in parallel. | Fixed by updating both `useAgencyTripRequests` and `useMyTripRequests` to pass arguments in the API-declared order with `limit: 20`. |
| **Filter-card counts on the agency inbox would have been wrong with naive server filtering** — the backend's `?status=` only accepts one value, but the UI filter "Booked" needs both `confirmed` and `completed` together. | The two statuses need to be merged client-side, but a naive per-tab fetch would mean counts could miss records outside the current filter. | For "All" and "Booked" the screen fetches unfiltered and filters client-side. The four counts always reflect the full server response so they stay stable as the user switches tabs. |

**Real bugs found and fixed while running E2E (verification pass, Sep 3 2026)**

| Bug | Root cause | Fix |
|---|---|---|
| Trip-requests `cancel` endpoint returned 201 (POST default) instead of 200 | `@Post(':id/cancel')` had no `@HttpCode` decorator, defaulting to 201 | Added `@HttpCode(HttpStatus.OK)` |
| `registerApprovedAgency` test helper used a hardcoded email `agency-e2e@test.com`, causing 409 conflicts when called twice in the same test | Hardcoded identity in the helper | Made `email` and `agencyName` optional params with defaults |
| Status-transition E2E tests used a second agency's token to update a request owned by the first agency (got 404 instead of 200/422) | Tests registered a second agency and used its token instead of the first agency's `agencyAccessToken` | Capture and reuse `agencyAccessToken` from `registerApprovedAgency()` |
| List-endpoint E2E assertions treated `data` as a flat array, but cursor-paginated responses nest it under `data.items` | Assumed old response shape | Updated assertions to use `data.items` |
| `resetDb` did not explicitly clean `trip_requests`/`smart_reply_templates` | Tables added after the reset helper was last updated | Added explicit `deleteMany()` calls |
| Broken no-op migration `20260903063549` — entire SQL was a single comment line | Malformed migration SQL | Removed; changes already in corrected `20260903070425` |


**Explicitly deferred (documented, not silently dropped)**

| Item | Reason |
|---|---|
| Invoicing/commission on booking confirmation | Owned by Feature #6 (Payments, most-blocked) + VEAK-043 |
| Audit log via `AuditService` row inserts | Owned by Feature #11 (Admin/Super Admin Panel) |
| Multi-staff assignment of a request to a specific staff member | Owned by Feature #9’s staff-management sub-scope (later) |
| Auto-quote generation from a linked package’s `basePrice` | Later scope — requires a quote-engine surface that doesn’t exist yet |
| Traveler cancellation reason capture | Later scope — TRD does not specify |
| Per-stage SLA reminders | Later scope — TRD open question none |
| Booking calendar / agency availability | Later scope |
| Notifications on request creation/status change | Owned by Feature #10 |

**Open questions (deferred — not blocking)**

| # | Question | Resolution for this feature |
|---|---|---|
| #1 | What marks a trip/campaign as "completed"? | `TripRequest.status = completed` set explicitly by the agency. No auto-transition. |
| #26 | Can agency confirm a booking before campaign is fully funded? | Allowed — confirmation is independent of funding state. |

**Remaining Feature #9 sub-scope (not started)**

| Item | Status |
|---|--:|
| Agency dashboard home / analytics overview | ⬜ not started |
| Agency request/trip-request management | ✅ done |
| Revenue display | ⬜ not started |
| Agency staff management | ⬜ not started |

---

## 1. Auth & Onboarding — ✅ done

**Figma screens:** `SplashScreen`, `OnboardingScreen`, `SelectUserScreen`, `SignUpEmailScreen`, `OTPVerificationScreen`, `CreateProfileScreen`, `TravelPreferencesScreen`, `AddPreviousTripsScreen`, `PaymentSetupScreen`, `ProfileCompleteScreen`, `LoginScreen`, `ForgotPasswordScreen`, `AgencySignUpScreen`, `AgencyLoginScreen`, `AgencyRegistrationScreen`, `AgencyStatusScreen`, `AgencyForgotPasswordScreen`. (`SignUpScreen.tsx`/`ProfileSetupScreen.tsx` are dead/unreachable in figma-demo — correctly skipped.)

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `User` | id, email, displayName, passwordHash, role, platformRole, isEmailVerified, isActive, onboardingComplete, deactivatedAt, fcmToken, lastLoginAt | ✅ |
| `TravelerProfile` | userId, photoMediaId, bio, location, gender, dateOfBirth, badge, walletConnected, walletPaymentMethodId | ✅ |
| `TravelerDestinationPreference`, `TravelerTravelStylePreference` | — | ✅ |
| `TravelerPreviousTripPhoto` | id, userId, mediaId, name, location, startDate, endDate, travelerCount, description | ✅ (extended with full trip metadata for the wizard's rich Add Previous Trip form) |
| `SocialIdentity`, `RefreshToken`, `OtpCode` (incl. `login` type), `AdminTwoFactor` | — | ✅ |
| `Agency`, `AgencyDocument`, `AgencyStaff` | — | ✅ |

**Backend — endpoints**

| Endpoint | Status |
|---|---|
| `POST /auth/register`, `/auth/verify-email`, `/auth/resend-otp` | ✅ |
| `POST /auth/login` (password/OTP), `/auth/social`, `/auth/refresh`, `/auth/logout`, `/auth/logout-all` | ✅ |
| `POST /auth/forgot-password`, `/auth/reset-password`, `/auth/change-password` | ✅ |
| `GET /auth/sessions`, `DELETE /auth/sessions/:id` | ✅ |
| `POST /auth/admin/login`, `/auth/admin/2fa` | ✅ |
| `POST /agencies/registration` (business details + documents) | ✅ |
| `POST /me/profile-setup` (gender, DOB, bio, photo, destination/travel-style preferences, rich previous-trip entries, wallet-payment-method) | ✅ |

**Backend — tests**

| Test group | Status |
|---|---|
| 56 unit tests: AuthService/TokenService/OtpService/PasswordService/SocialAuthService/TwoFactorService/UsersService | ✅ |
| 14 E2E tests in `auth.e2e-spec.ts`: register→verify→login→profile-setup (now also asserting gender/DOB/bio/previous-trip metadata round-trips through `GET /me`), a new photo-optional/no-previous-trips variant, duplicate email, invalid OTP, login lockout, forgot/reset, refresh rotation/reuse, logout blacklisting, agency registration→pending, role guard | ✅ |
| Running totals at this point (built last, after Features 2–5): 199 unit tests, 66 E2E tests, all green (superseded — see Feature 8 for the current running total) | ✅ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(auth)/welcome.tsx`, `login.tsx`, `register.tsx`, `verify-otp.tsx`, `forgot-password.tsx` (traveler + agency variants) | ✅ |
| `app/(traveler)/index.tsx`, `app/(agency)/index.tsx` — real screens (built in #2 / #9) | ✅ |
| `app/(onboarding)/create-profile.tsx` — photo (optional), gender, DOB, bio; reuses `displayName` from registration read-only (no redundant name fields) | ✅ |
| `app/(onboarding)/travel-preferences.tsx` — destination-type + travel-style chips, both required non-empty | ✅ |
| `app/(onboarding)/add-trips.tsx` — rich previous-trip entries (photo, name, location, dates, traveler count, description); "Continue" once ≥1 trip, "Skip for Now" always enabled | ✅ |
| `app/(onboarding)/payment-setup.tsx` — card/PayPal/Stripe/Bank UI, all actions in-dev-Alert (depends on #6); "Skip for Now" performs the real final `POST /me/profile-setup` submit | ✅ |
| `app/(onboarding)/profile-complete.tsx` — success screen, "Get Started" → `router.replace('/')` | ✅ |
| `app/index.tsx` — single routing gate: authenticated traveler with `onboardingComplete: false` is redirected into the wizard; also catches app relaunch mid-wizard | ✅ |

**Mobile — components**

| Component | Status |
|---|---|
| `OnboardingStepper` | ✅ |
| `DestinationTypeChips` / `TravelStyleChips` | ✅ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/onboarding.ts` | ✅ |
| `src/hooks/use-onboarding-mutations.ts` | ✅ |
| `src/stores/onboarding-wizard-store.ts` — ephemeral Zustand store accumulating wizard state across the 5 route files, reset after successful submit | ✅ |

**Scope decisions made this pass**

| Decision | Reasoning |
|---|---|
| Dropped the figma First/Last Name fields on Create Profile | Registration already collects a single `displayName`; re-asking would be redundant data the backend has nowhere consistent to reconcile it with |
| Built the full rich Add Previous Trip form (name/location/dates/traveler count/description), not just a bare photo gallery | `TravelerPreviousTripPhoto` was extended with 5 new columns to match figma exactly, since the step is optional/skippable and the richer data has real value for a future "previous trips" display |
| `photoMediaId` on profile-setup made optional | Figma shows a fallback-icon empty state, not a hard requirement |
| Date fields (DOB, trip start/end) use plain `YYYY-MM-DD` text inputs | No date-picker package is installed; matches the existing convention already used by the Campaigns wizard rather than adding a new dependency |

**Open questions (deferred — not blocking)**

| # | Question | Default applied now |
|---|---|---|
| #7 | Badge milestone thresholds (Explorer/Jetsetter) | Dreamer-only shown, no upgrade logic; thresholds deferred |

---

## 2. Social Feed, Stories & Friends — ✅ done

**Figma screens:** `HomeScreen`, `CreatePostScreen`/`CreatePostModal`, `CommentsModal`, `ShareBottomSheet`, `CreateStoryModal`, `StoryScreen`, `ProfileScreen` (posts tab), `UserProfileViewScreen`, `FriendsScreen`, `AddFriendScreen`

Two forks resolved before this plan: (1) build **Friends** (symmetric request/accept) — figma-demo has no "Follow" UI anywhere, only Friends; pulls forward only the connection-model slice of #8. (2) Build **Stories** — never mentioned in the TRD but concretely designed on the Home screen.

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `User.username` | unique, auto-generated at registration (email/name-derived, deduped) | ✅ |
| `TravelerProfile.bio`, `.location` | — | ✅ |
| `Post` | authorId, text, imageMediaId?, location?, tags[], repostOfId? (self-relation) | ✅ |
| `PostLike` | postId, userId, `@@unique` | ✅ |
| `Comment` | postId, authorId, text | ✅ |
| `CommentLike` | commentId, userId, `@@unique` | ✅ |
| `Story` | authorId, imageMediaId?, text?, backgroundColor?, textSize?, expiresAt | ✅ |
| `StoryLike` | storyId, userId, `@@unique` | ✅ |
| `StoryView` | storyId, viewerId, viewedAt, `@@unique` | ✅ |
| `FriendRequest` | requesterId, addresseeId, status (pending/accepted/declined), `@@unique` | ✅ |
| `MediaAsset` (Storage module, built to unblock real photo uploads for #2) | ownerId, purpose, key `@unique`, contentType, status (pending/uploaded/deleted), sizeBytes? | ✅ |

**Backend — Storage module** (`src/modules/storage/`, built mid-feature once "post/story photos are still placeholders" was raised — presigned upload/confirm/view-url flow against **MinIO's own `minio` npm package client**, not `@aws-sdk/client-s3`, since there are no real AWS S3 credentials yet)

| Endpoint | Status |
|---|---|
| `POST /storage/upload-url` (validates content-type/size per purpose via `MEDIA_PURPOSE_RULES`) | ✅ |
| `POST /storage/confirm` (verifies the object actually exists in MinIO + size, ownership-checked) | ✅ |
| `GET /storage/:mediaId/view-url` (public for post/story media; ownership-gated for `agency_document`) | ✅ |
| `PostsService`/`StoriesService` batch-resolve `imageUrl` via `MediaAssetsService.resolveViewUrls` | ✅ |

**Backend — endpoints** (all `@RequireRole(traveler)` except `GET /me`/`GET /users/:id/profile`/`GET /users/search`)

| Endpoint | Status |
|---|---|
| `POST /posts`, `PATCH /posts/:id`, `DELETE /posts/:id` | ✅ |
| `GET /feed` (cursor-paginated) | ✅ |
| `GET /users/:id/posts` (own-profile + other-profile post lists — added during build, not in original endpoint list) | ✅ |
| `POST /posts/:id/like`, `DELETE /posts/:id/like` | ✅ |
| `POST /posts/:id/comments`, `GET /posts/:id/comments`, `PATCH /comments/:id`, `DELETE /comments/:id` | ✅ |
| `POST /comments/:id/like`, `DELETE /comments/:id/like` | ✅ |
| `POST /posts/:id/share` (repost to own profile) | ✅ |
| `POST /stories`, `GET /stories`, `POST /stories/:id/view`, `POST /stories/:id/like` | ✅ |
| `POST /friend-requests`, `.../:id/accept`, `.../:id/decline`, `GET /friend-requests`, `GET /friends`, `DELETE /friends/:userId` | ✅ |
| `GET /me`, `GET /users/:id/profile` | ✅ |
| `GET /users/search?q=` (added during build — "add friend" needs real search, not a stub; annotates each result with isFriend/requestSent/requestReceived) | ✅ |

**Backend — tests**

| Test group | Status |
|---|---|
| unit: `PostsService` — CRUD own-only, like/unlike, repost, feed pagination + friend-only visibility | ✅ |
| unit: `CommentsService` — CRUD own-only, comment-like | ✅ |
| unit: `StoriesService` — create (photo/text+color), 150-char cap, expiry, view/like tracking | ✅ |
| unit: `FriendsService` — send/accept/decline, `@@unique` conflicts, mutual-count, unfriend, `getConnectionStatus` | ✅ |
| unit: `UsersService` — `getMe`, `getPublicProfile`, `searchTravelers` | ✅ |
| E2E: post CRUD/like/comment/repost, feed pagination + visibility | ✅ |
| E2E: story create/view/expiry | ✅ |
| E2E: friend request send/accept/decline/unfriend | ✅ |
| E2E: `GET /me`, `GET /users/:id/profile`, `GET /users/search` | ✅ |
| unit: `MediaAssetsService` — upload-url validation, confirm (ownership/pending/size), view-url gating, batch resolve | ✅ |
| E2E (`test:storage`): reject disallowed content-type; real upload→confirm→view-url→download round-trip against live MinIO (byte-for-byte); reject confirm-before-upload; reject confirming someone else's asset; reject non-owner viewing `agency_document` | ✅ |
| E2E: post with a real uploaded photo resolves `imageUrl` in feed and actually clears it (`imageMediaId: null`) on edit — regression test locking in a Prisma `undefined`-vs-`null` fix | ✅ |
| **Totals: 123 unit tests, 36 E2E tests, all green** (up from 98/29 before this feature) | ✅ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(traveler)/index.tsx` — real feed screen (stories row, post cards, create-post FAB) | ✅ |
| `app/(traveler)/create-post.tsx` — text + real photo (camera-roll picker → direct-to-MinIO upload → preview → remove) | ✅ |
| `CommentsSheet` modal (used instead of a separate `post/[id].tsx` route — matches figma's modal pattern) | ✅ |
| `app/(traveler)/friends.tsx` — list + incoming requests tabs | ✅ |
| `app/(traveler)/add-friend.tsx` — real search (not a stub) | ✅ |
| `app/(traveler)/user/[id].tsx` — combined own-profile (interactive, Log Out) + other-profile (read-only posts, Add Friend/Message) | ✅ |
| `app/(traveler)/story/[id].tsx` — story viewer (tap-to-advance, auto-advance, auto-close, renders real uploaded photo when present) | ✅ |
| `app/(traveler)/create-story.tsx` — real photo (camera or library) + caption, or text+color+size | ✅ |

**Mobile — components**

| Component | Status |
|---|---|
| `PostCard` (interactive + read-only variants) | ✅ |
| `CommentsSheet` | ✅ |
| `ShareSheet` (matches `ShareBottomSheet`; friend-send → in-dev Alert; share-to-profile + native share wired for real) | ✅ |
| `FriendCard` | ✅ |
| `StoryRing`, `StoryProgressBar` (story viewer's per-story timer) | ✅ |
| `Avatar` (still initials-based — `TravelerProfile.photoMediaId` upload isn't wired to a picker yet; only post/story photos are, so far) | ✅ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/feed.ts`, `src/api/friends.ts`, `src/api/users.ts` (incl. `searchTravelers`) | ✅ |
| `src/hooks/use-feed-queries.ts` (first `useInfiniteQuery` in the codebase), `use-feed-mutations.ts`, `use-friend-mutations.ts`, `use-friends-queries.ts`, `use-users-queries.ts` | ✅ |
| `src/api/storage.ts` (`createUploadUrl`, `confirmUpload`), `src/utils/upload-image.ts` (`pickAndUploadFromLibrary`/`pickAndUploadFromCamera`, wraps `expo-image-picker` + direct-to-MinIO PUT) | ✅ |

**Real bugs found via Playwright verification against the live dockerized backend, and fixed:**
- Like/unlike and comment-like mutations had no cache invalidation — the backend call succeeded but the UI never reflected it. Fixed by invalidating `['feed']`/`['user-posts']`/`['comments', postId]` on success.
- **Significant, pre-existing gap**: `useAuthStore`'s `hydrate()` refreshed the access token on app relaunch/page reload but never re-populated `user` (only ever set via login/register's `setSession`) — so `user` was `null` after any reload, silently breaking anything depending on `user.id`/`user.role` (e.g. the own-profile navigation, and potentially the agency/traveler redirect in `app/index.tsx`). This was the exact gap HANDOFF.md had already flagged ("no cached user profile... until something re-fetches it"). Fixed by calling the new `GET /me` in `hydrate()` and populating `user` from it.
- Story viewer's countdown timer called `onExpire()` (which triggers navigation/`setIndex`) synchronously inside the `setProgress` state updater, causing a React "setState during render of a different component" console error. Fixed by moving the expire side-effect into its own `useEffect` keyed off `progress` reaching 1, guarded by a ref so it only fires once.
- **Presigned URLs unusable outside Docker**: `docker-compose.yml` overrides `S3_ENDPOINT` to the internal-only hostname `http://minio:9000` so the backend can reach MinIO, but that same value was getting baked into every presigned URL handed back to the browser/mobile client, which can't resolve `minio` (`net::ERR_NAME_NOT_RESOLVED`). Fixed by adding a separate `S3_PUBLIC_ENDPOINT` (defaults to `http://localhost:57900`, not overridden in `docker-compose.yml`) and a second MinIO client in `StorageService` used only for signing presigned URLs. Along the way, also had to pass `region` explicitly into both MinIO clients — without it the SDK issues a live `GetBucketLocation` call against the client's own endpoint on first use, which `ECONNREFUSED`'d for the public-endpoint client since `localhost:57900` isn't reachable from inside the container.
- **Prisma `undefined` vs `null` update semantics**: mobile sent `imageMediaId: imageMediaId || undefined` when a user removed a post's photo during edit; Prisma's `update()` treats `undefined` fields as "don't touch," so the removal silently never persisted. Fixed by widening the type to `string | null` on both sides and sending `imageMediaId ?? null`; locked in with an E2E regression test.

**Explicitly out of scope for this pass**

| Item | Reason |
|---|---|
| Interest groups | Zero UI evidence anywhere |
| Group-fund logic | Real UI exists (`GroupCampaignScreen`) but is #8's own scope |
| Journey Journal | Zero UI evidence under that name |
| Explore/trending, Notifications, Campaign/AgencyOffer feed items | Owned by #4, #10, #5 respectively |

**Open questions (deferred — not blocking)**

| # | Question | Default applied now |
|---|---|---|
| #13 | Interest groups | Zero UI evidence, nothing built, deferred until scoped |
| #24 | Friend visibility into invite-only campaigns | Moot until #5 exists; default = always explicit invite |

---

## 3. Chat / Messaging — ✅ done

**Figma screens:** `ChatListScreen.tsx`, `ChatDetailScreen.tsx` (reused as-is for both traveler and agency thread routes — figma itself has no separate agency chat-detail screen), `AgencyChatListScreen.tsx`

**Real, previously-missing gap found and fixed while building this feature**: figma-demo's `Root.tsx`/`AgencyRoot.tsx` define a persistent bottom tab bar (Home/Explore/Campaigns/Chat/Profile for travelers; Home/Packages/Requests/Chat/Profile for agencies) that neither this feature nor #2 had ever implemented — meaning there was no way to reach Chat at all once built. Added `BottomNavBar`/`TravelerBottomNav`/`AgencyBottomNav`, matching figma's active-tab gradient-pill styling exactly. Tabs for features not yet built (Explore, Campaigns, Packages, Requests, agency Profile) show the standard in-dev alert on tap rather than navigating anywhere.

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `Conversation` | type (direct/group/agency), title?, createdById, agencyId?, lastMessageAt?, agencyLastReadAt? | ✅ |
| `ConversationParticipant` (`@@unique`) | conversationId, userId, role (member/admin), joinedAt, lastReadAt?, leftAt? | ✅ |
| `Message` | conversationId, senderId, type (text/image/document), body?, mediaId?, fileName? | ✅ |
| `MessageReceipt` (`@@unique`) | messageId, userId, status (delivered/read), deliveredAt?, readAt? | ✅ |
| `MediaPurpose` extended | + `chat_image` (images, 10MB), `chat_document` (pdf/doc/docx, 20MB) — matches `08-storage.md`'s already-documented "Chat images"/"Chat documents" split | ✅ |

**Design decision — agency shared inbox**: agency-type conversations don't give every staff member an explicit `ConversationParticipant` row; only the traveler gets one. Staff are authorized via `AgencyStaff.agencyId` matching the conversation, and any staff member marking it read clears `agencyLastReadAt` for the whole team — a shared team inbox, not per-agent membership, avoiding the need to sync participant rows on staff hire/fire.

**Backend — endpoints** (`@RequireRole(traveler, agency)` — both roles use the same endpoints)

| Endpoint | Status |
|---|---|
| `POST /conversations` (direct/group/agency; find-or-reuse existing instead of duplicating), `GET /conversations` | ✅ |
| `GET /conversations/:id` (participants for group chats), `GET /conversations/unread-count` | ✅ |
| `POST /conversations/:id/participants` (admin+friend-only), `DELETE .../participants/:userId` (self-leave or admin-kick) | ✅ |
| `GET /conversations/:id/messages` (cursor-paginated, marks delivered), `POST /conversations/:id/messages` (text/image/document) | ✅ |
| `POST /conversations/:id/read` (per-participant, or team-wide via `agencyLastReadAt` for agency staff) | ✅ |

**Explicitly deferred (documented, not silently dropped)**

| Item | Reason |
|---|---|
| Smart-reply templates (`SmartReplyTemplate` CRUD) | Zero UI evidence anywhere in figma-demo — TRD-only invention, deferred until scoped |
| Websocket gateway (Socket.io) real-time delivery | Shipped with short-interval polling instead (4s messages, 6s conversation list, 10s unread count) — a deliberate, documented MVP scope call; revisit if polling proves insufficient |
| `POST /calls/agency/:conversationId` (call initiation) | Figma's own audio/video call buttons are just a JS `alert("Coming soon")`, no real backend surface — mobile matches with the standard in-dev alert, no endpoint needed |
| Group-create flow / add-member picker screen | Figma's own "+" FAB routes only to Friends (1:1 messaging) and the group panel's "+ Add" button is a dead no-op even in figma — backend `POST .../participants` exists and is tested, but no mobile picker UI exists yet since there's no design to match |
| Request/booking metadata on `Conversation` (`campaignId`/`packageId`) | Depends on #5/#9, not built yet |

**Backend — tests**

| Test group | Status |
|---|---|
| unit: `ConversationsService` — assertAccess (participant/agency-staff/forbidden), create (direct/group/agency incl. non-friend rejection + reuse-existing), addParticipants/removeParticipant (admin/self-leave guards), unreadCount | ✅ |
| unit: `MessagesService` — send (text/image/document validation, ownership/purpose checks), list (delivered-marking, read/delivered/sent status computation, pagination), markRead (participant vs. agency-wide) | ✅ |
| E2E: direct conversation reuse, non-friend rejected, send/receive/read receipts + unread counts, real photo upload→message→resolve | ✅ |
| E2E: group create/add/remove/leave with admin guards | ✅ |
| E2E: agency shared inbox — traveler↔any-staff messaging, team-wide read cursor | ✅ |
| E2E: stranger denied access to a conversation they're not part of | ✅ |
| **Totals: 160 unit tests, 45 E2E tests, all green** (up from 123/36 before this feature) | ✅ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(traveler)/chat/index.tsx` — inbox (All/Friends/Agencies/Groups tabs, search, FAB → Friends) | ✅ |
| `app/(traveler)/chat/[id].tsx`, `app/(agency)/inbox/[id].tsx` — thin route wrappers around one shared thread component (matches figma reusing one `ChatDetailScreen` for both) | ✅ |
| `app/(agency)/inbox/index.tsx` — agency inbox (flat list, no tabs, matches `AgencyChatListScreen`); lives at `/inbox` rather than `/chat` — see routing bug below | ✅ |
| `app/(traveler)/user/[id].tsx`'s Message button, `FriendCard`'s quick-message icon — both now create/open a real direct conversation instead of an in-dev alert | ✅ |

**Mobile — components**

| Component | Status |
|---|---|
| `ChatThreadScreen` (shared: text/image/document bubbles, read-receipt ticks, group members panel, agency call buttons → in-dev alert) | ✅ |
| `ChatListRow` (friend/group/agency badge, unread badge, last-message preview) | ✅ |
| `BottomNavBar`, `TravelerBottomNav`, `AgencyBottomNav` (new — see gap note above) | ✅ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/chat.ts` | ✅ |
| `src/hooks/use-chat-queries.ts` (polling-based, see deferred websocket note), `use-chat-mutations.ts` | ✅ |
| `src/utils/upload-image.ts` extended with `pickAndUploadDocument` (`expo-document-picker`, new dependency) for chat file attachments | ✅ |

**Real bugs found via Playwright verification against the live dockerized backend, and fixed:**
- **Traveler/agency chat URL collision**: `(traveler)/chat` and `(agency)/chat` both resolved to the identical bare `/chat` URL on web, since Expo Router group segments never appear in the URL. Client-side tab navigation (`router.push('/(traveler)/chat')`) always resolved correctly since it names the group explicitly, but a *fresh page load* of `/chat` (browser refresh, deep link, bookmark) was ambiguous and deterministically landed on the agency screen regardless of the real viewer's role — reproduced live: a traveler test account refreshing their own Chat tab saw the agency inbox instead. First attempted a role-checking redirect at a new top-level `app/chat/` (mirroring how `app/index.tsx` already disambiguates `/` by role) — this did not resolve the ambiguity for a nested route the way it does for the root path. Fixed properly instead by renaming the agency route directory to `app/(agency)/inbox/` so its URL (`/inbox`) no longer collides with the traveler's `/chat` at all, updating `AgencyBottomNav`'s and the agency inbox row's navigation targets to match. Re-verified: fresh loads of both `/chat` (traveler) and `/inbox` (agency) now resolve correctly regardless of prior navigation history.
- Also verified end-to-end: real photo + document attachment upload/render on both sender and recipient sides, and the full delivered→read receipt tick progression (sent → delivered → read) across two real logged-in accounts, with zero console errors throughout.

**Open questions (deferred — not blocking)**

| # | Question | Default applied now |
|---|---|---|
| — | Business-hours/SLA response time | No escalation logic built |
| — | Call recording | Not built, not scaffolded (legal/consent) |
| — | Audio/Video WebRTC + signaling | Matches figma's own stub exactly — in-dev alert, no backend surface |
| — | Multi-staff shared-inbox tiers/permissions | Any staff of the agency can see/reply to everything for now; tier rules owned by #9 |

---

## 4. Explore, Agency Directory & Reviews — ✅ done (scope narrowed to what figma actually shows as real)

**Figma screens:** `ExploreScreen.tsx`, `ItineraryScreen.tsx`, `AgencyDetailScreen.tsx`, `ReviewAgencyScreen.tsx` (canonical — `ReviewScreen.tsx` at `/review/:agencyId` is a near-duplicate composer only reachable via `AgencyDetailScreen`'s buggy "See all" link, not built), `MyReviewsScreen.tsx`

**Scope correction made while reading the real screens (not just the earlier speculative plan)**: `ExploreScreen.tsx` and `ItineraryScreen.tsx` are almost entirely Campaign/Package-driven (trending destinations, near-you, funding-progress grid, browse-packages cards) — none of that data exists yet (#5/#9). Built only what's real: the Agency Directory (`GET /agencies`, powers Explore's "Featured Agencies" section), Agency Detail, and Reviews CRUD. Explore ships as a real agency browse/search screen with an honest "Campaigns and trip packages are launching soon" banner instead of fake filter chips/map view/grid for data that doesn't exist; Itinerary ships as an honest "Packages are coming soon" screen. No dedicated "Agency Directory" screen exists in figma at all — agencies are only ever reached via Explore's list or a direct `agency/:id` link, so no separate directory screen was invented either.

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `AgencyReview` | agencyId, reviewerId, rating (1-5), body?, editableUntil (+7d), `@@unique([agencyId, reviewerId])` — one review per traveler per agency, edit/delete instead of stacking | ✅ |
| `Agency.reputationScore` | Already-scaffolded column from the Auth phase, now actually used — cached average rating, recomputed transactionally on every review create/update/delete (avoids an AVG aggregate per row on the directory list endpoint) | ✅ |
| `reviewCount` | Not cached — computed live via Prisma's `_count` relation (cheap COUNT join, no sync-drift risk) | ✅ |

**Dropped from the original speculative plan, once the real figma screens were read**: `isAnonymized` and `tripId` fields — zero UI evidence for anonymized reviews anywhere in `ReviewAgencyScreen`/`MyReviewsScreen`, and no Trip/Booking model exists yet to reference. "Quick Feedback" tag buttons (Great Communication, Professional, etc.) shown in `ReviewAgencyScreen` have no `onClick` even in figma itself (decorative, not wired) — not rebuilt.

**Backend — endpoints**

| Endpoint | Status |
|---|---|
| `GET /agencies` (`?search=`, cursor-paginated, approved-only, reputation-desc) | ✅ |
| `GET /agencies/:id` (public profile) | ✅ |
| `POST /agencies/:agencyId/reviews` — no "completed trip" gate (open question #1 undefined, no Trip model to gate against) | ✅ |
| `GET /agencies/:agencyId/reviews` (cursor-paginated, newest first) | ✅ |
| `PATCH /reviews/:id`, `DELETE /reviews/:id` (both gated by the same 7-day `editableUntil` window, matching figma's single `canEdit` flag controlling both) | ✅ |
| `GET /reviews/mine` | ✅ |

**Backend — tests**

| Test group | Status |
|---|---|
| unit: `AgenciesService` — registration (previously untested), directory listing/search/pagination, public detail (approved-only gating) | ✅ |
| unit: `ReviewsService` — create (duplicate/not-approved rejection), update/delete (ownership + 7-day window), reputation recompute, listForAgency pagination, listMine canEdit | ✅ |
| E2E: directory excludes pending agencies, search filter, public detail 404s a pending agency | ✅ |
| E2E: review create/duplicate-reject/list/edit/delete + reputation recompute at each step | ✅ |
| E2E: cross-user edit/delete rejected | ✅ |
| **Totals: 182 unit tests, 54 E2E tests, all green** (up from 160/45 before this feature) | ✅ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(traveler)/explore/index.tsx` — real agency search + "Featured Agencies" list; honest "launching soon" banner replaces the campaign/package sections | ✅ |
| `app/(traveler)/itinerary/index.tsx` — honest "Packages are coming soon" screen (no fake package cards) | ✅ |
| `app/(traveler)/agency/[id].tsx` — profile, rating, paginated reviews, "Write a Review" CTA (hidden once you've reviewed), real "Contact Agency" (creates/opens a real agency chat — closes the gap noted in #3's docs about agency conversations having no mobile entry point yet) | ✅ |
| `app/(traveler)/review-agency/[agencyId].tsx` — composer, create + edit mode (pre-filled via route params from `MyReviewsScreen`'s edit button), animated success screen on create | ✅ |
| `app/(traveler)/my-reviews/index.tsx` — average rating + count summary, edit/delete gated by `canEdit`, empty state → Explore | ✅ |
| Traveler `ProfileScreen`'s own-profile view — added a "My Reviews" quick-action row (gap found while wiring this feature: figma's real `ProfileScreen.tsx`, distinct from the `UserProfileViewScreen.tsx` used to build #2's Profile tab, has a Quick Actions menu including this link that #2 never carried over) | ✅ |

**Mobile — components**

| Component | Status |
|---|---|
| `StarRating` (interactive + readonly, 3 sizes) | ✅ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/agencies.ts`, `src/api/reviews.ts` | ✅ |
| `src/hooks/use-agencies-queries.ts`, `use-reviews-queries.ts`, `use-reviews-mutations.ts` | ✅ |

**Real, significant bug found via Playwright and fixed — affects every feature built so far, not just this one**: `react-native-web`'s `Alert.alert` is a complete no-op stub (`static alert() {}` — confirmed by reading the library source). Every `Alert.alert` call across the whole app — `showInDevelopmentAlert` (used by dozens of not-yet-wired buttons across Auth/Social Feed/Chat/this feature), `PostCard`'s edit/delete menu, `FriendCard`'s remove-friend confirmation, and this feature's own delete-review confirmation — has been silently doing **nothing** on the web target this entire project, with zero visible error. Found while testing the delete-review flow: tapping delete did nothing, no console error, no dialog, and the review was still there on reload. Fixed by adding `src/stores/alert-store.ts` + `src/components/AlertHost.tsx` (mounted once in the root layout, mirroring the existing `ToastHost` pattern) and `src/utils/show-alert.ts` (a drop-in `showAlert(title, message, buttons)` replacement), then swapping every `Alert.alert(` call to `showAlert(` across all 4 affected files. Re-verified via Playwright: both the in-dev alert and the delete-review confirmation now render a real, clickable in-app dialog and function correctly. Native (iOS Simulator) was never affected by this bug — real `Alert.alert` works fine there — but this had been silently breaking every one of these flows specifically on the web target, which is what Playwright verification runs against.

**Open questions (deferred — not blocking)**

| # | Question | Default applied now |
|---|---|---|
| #1 | "Completed trip" lifecycle gate | Review CRUD ships without the gate |
| #11 | Reputation score formula | Raw average, recomputed on every review change |
| — | Explore/Itinerary campaign & package sections | Honest "coming soon" states; real UI returns once #5/#9 ship |
| — | Sponsored-placement disclosure | Deferred until #9's marketing tools exist |
| — | Post-trip review-nudge notification | Trigger added later in #10 |

---

## 5. Campaign Creation & Management — ✅ done (scope narrowed to what figma actually shows as real)

**Figma screens:** `CampaignsScreen.tsx`, `CreateCampaignScreen.tsx`, `CampaignDetailScreen.tsx`. Real screens corrected several speculative assumptions from the original plan before building: max photos is **5**, not 10; story cap is **500 chars**, not ~2000; there is no invite-code/invite-link sharing UI anywhere (dropped entirely — private campaigns are creator-only for now, no link-sharing mechanism exists to gate); there's no profanity-filter UI evidence either (not built — no such utility exists anywhere else in the codebase, so none was added here). `CampaignDocument` was dropped as a separate table — the real screen has exactly one optional itinerary slot and one optional agency-quote slot (single file each, not a list), so those became two nullable `Campaign` columns instead of a child table.

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `Campaign` | creatorId, title, destination, goalAmount (Decimal), currency ("USD" only), story? (≤500 char), tripStartDate, tripEndDate?, status, privacy, giftMode, giftOccasion?, itineraryMediaId?, agencyQuoteMediaId?, viewsCount | ✅ |
| `CampaignPhoto` (max 5, ordered) | campaignId, mediaId, position | ✅ |
| enum `CampaignStatus` | draft/active/completed — every created campaign starts `active` (no save-draft UI exists); no auto-transitions (#1) | ✅ |
| enum `CampaignPrivacy` | public/private (no invite-only tier — dropped, no UI evidence) | ✅ |

**Backend — endpoints**

| Endpoint | Status |
|---|---|
| `POST /campaigns` — title/destination/goal/dates + ≤5 photoMediaIds + optional itinerary/quote media | ✅ |
| `GET /campaigns/mine` (flat list, not paginated — matches figma's small personal list) | ✅ |
| `GET /campaigns` — **public browse/search** (added after the "how do people view campaigns?" gap was flagged): `?search=`/`?creatorId=`/cursor pagination, mirrors `GET /agencies`'s directory shape; `privacy: public` filter only, never exposes private campaigns to non-creators | ✅ |
| `GET /campaigns/:id` — private campaigns 404 for non-creators; increments `viewsCount` for non-creator views only | ✅ |
| `PATCH /campaigns/:id`, `DELETE /campaigns/:id` — creator-only; no donation-existence delete guard yet since no Donation model exists (#6) | ✅ |
| `GET /campaigns/:id/top-contributors` — always `{items: []}` until #6 ships real donations | ✅ |

**Backend — tests**

| Test group | Status |
|---|---|
| unit: `CampaignsService` — 15 tests: date-range validation, gift-occasion clearing, ordered photo replace, ownership guards, private-campaign visibility, view-count increment (creator vs non-creator), always-empty top-contributors, `listPublic` privacy/creatorId/search filters + pagination | ✅ |
| unit: `UsersService` — updated `getMe`/`getPublicProfile` tests to cover real `campaignsCount` (own profile counts private campaigns too; another traveler's profile only counts their public ones) | ✅ |
| E2E: `campaigns.e2e-spec.ts` — 10 tests: create with a real uploaded photo, date validation, photo-cap rejection, list mine, private-campaign visibility, view-count increment, edit/delete ownership + persistence, top-contributors empty, public browse excludes private, creatorId/search filters | ✅ |
| E2E: `users-profile.e2e-spec.ts` — added a real `campaignsCount` test (own-profile count includes private, stranger's view doesn't) | ✅ |
| Backend test counts at this point: 198 unit tests, 65 E2E tests, all green (superseded — see Feature 1 for the current running total, since the onboarding-wizard pass added to `users.service.spec.ts`/`auth.e2e-spec.ts` after this feature shipped) | ✅ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(traveler)/campaigns/index.tsx` — My Campaigns (active/completed sections, real stats/progress bar) + Gifts tab (always-empty state, honest — no Donation model yet) | ✅ |
| `app/(traveler)/campaigns/create.tsx` — real 3-step wizard (Basic Details → Story & Media → Privacy & Settings); edit mode prefills via route params passed from the list/detail screens (same pattern as `create-post.tsx`'s `editPostId` convention), not a refetch-on-mount effect | ✅ |
| `app/(traveler)/campaigns/[id].tsx` — detail screen; Donate Now/Heart are honest in-dev alerts (no fake donate modal built — #6 owns that), Message wires a real `useCreateConversation` call | ✅ |
| `app/(traveler)/user-campaigns/[userId].tsx` — **new**: a traveler's public campaigns, reached by tapping the "Campaigns" stat on someone else's profile | ✅ |
| `app/(traveler)/explore/index.tsx` — **updated**: real "Campaigns" carousel (public browse, no search term) above the existing Featured Agencies list; banner text narrowed to just "Trip packages are launching soon" now that campaigns are real | ✅ |

**Mobile — components**

| Component | Status |
|---|---|
| `CampaignProgressBar` (small reusable gradient bar) | ✅ |
| `CampaignSummaryCard` — **new**, read-only card (no edit/delete) used by Explore's carousel and the new user-campaigns screen | ✅ |
| Everything else reused existing components (`GradientButton`, `Avatar`, `StarRating`-style patterns, `showAlert`/`showInDevelopmentAlert`) | ✅ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/campaigns.ts` (+ `listCampaigns` for public browse) | ✅ |
| `src/hooks/use-campaigns-queries.ts` (`useMyCampaigns`, `useCampaign`, `useTopContributors`, **`useCampaignDirectory`**), `use-campaigns-mutations.ts` (create/update/delete) | ✅ |
| `src/utils/require-access-token.ts` — **new**, shared across all 5 mutation-hook files (feed/friends/chat/reviews/campaigns), see bug fix below | ✅ |

**Real bugs found and fixed while testing this feature (via Playwright)**

| Bug | Root cause | Fix |
|---|---|---|
| **App-wide crash on logout** — tapping "Log Out" from Profile threw an uncaught `Error: Not authenticated` and crashed the whole app | `useToken()` (duplicated across 5 mutation-hook files: feed, friends, chat, reviews, campaigns) subscribed to `accessToken` via a hook and threw synchronously *during render* whenever it was null. Logging out clears `accessToken` while `ProfileScreen` (which also calls `useLikePost`/`useUnlikePost`) is still mounted for one render before `router.replace()` unmounts it — that render threw | Added `src/utils/require-access-token.ts` — reads `useAuthStore.getState().accessToken` imperatively, called lazily *inside* each `mutationFn` instead of at hook-render time. Removed the local `useToken()` definition from all 5 files; ~34 call sites updated. Confirmed via Playwright: logout now navigates cleanly with zero errors | ✅ fixed |
| **Self-message / self-navigate on own campaign** — a creator viewing their own campaign's detail page could tap "Message" (tries to DM themselves) or tap their own name (pushes a duplicate own-profile screen) | Detail screen didn't branch on the `isCreator` flag the backend already returns for exactly this purpose | Creator view now shows an "Edit Campaign" button in place of Donate/Message/Heart, and the creator-info row no-ops instead of navigating (same `viewingProfileId`-style guard used in `PostCard` from Feature #2) | ✅ fixed |

**Open questions (deferred — not blocking)**

| # | Question | Default applied now |
|---|---|---|
| #1 | Lifecycle/status model | Enum built (draft/active/completed), no auto-transitions |
| #6 | Edit/delete with existing donations | No guard yet — moot until #6 adds a Donation model |
| — | Min/max goal amount | Fully open, no cap |
| — | Campaign auto-expiry | `tripEndDate` stored; enforcement deferred to #6 |
| — | Personal-story moderation | 500-char cap only; no profanity filter (none exists anywhere in the codebase) |
| — | Invite-only / link-sharing privacy tier | Dropped — no UI evidence; private campaigns are creator-only for now |
| — | Donor-notification on change | Trigger noted for #10 |
| — | Cross-feature block: #6 not built | Donate button, Gifts tab, top-contributors all honestly empty/in-dev, never faked |

**Discovery gap found and closed (user asked "how do people view campaigns and donate?")**

Answering that question surfaced a real gap: `GET /campaigns/:id` always supported non-creator viewing, but nothing in the UI ever pointed at another traveler's campaign — "My Campaigns" only shows your own, Explore still had the placeholder banner, a profile's "Campaigns" stat was static (not tappable), and Share was an in-dev alert. Donating is still genuinely unbuilt (owned by #6) and stays an honest in-dev alert, but viewing is now real:

| Fix | Detail |
|---|---|
| `GET /campaigns` public browse/search | New endpoint (see Backend — endpoints above); `privacy: public` only, optional `?creatorId=`/`?search=` |
| Explore's Campaigns carousel | Real public campaigns now render above Featured Agencies |
| Profile "Campaigns" stat | Was previously invisible on your **own** profile (`MeProfile` never had the field at all — `getMe` simply didn't compute it) and hardcoded to `0` on others' profiles (`getPublicProfile`). Both now wired to a real `prisma.campaign.count()` — your own profile counts your private campaigns too; a stranger's profile only counts their *public* ones. Now tappable on both: self → `/campaigns` (My Campaigns), other → new `/user-campaigns/[userId]` screen |

---

## 6. Payments, Wallet & Withdrawal — ⬜ not started, 🚧 most blocked

**Figma screens:** `WalletScreen.tsx`, `WithdrawalScreen.tsx` (note: figma-demo's `/app/withdraw` and `/app/withdrawal` both route to this same screen — build ONE real route), `PaymentMethodsScreen.tsx`, donate dialog in `CampaignDetailScreen.tsx`

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `StripeConnectAccount` | userId, stripeAccountId, payoutsEnabled, chargesEnabled, detailsSubmitted, onboardingUrl? | ⬜ |
| `Donation` | campaignId, donorUserId?, amount, currency, isAnonymous, giftMessage?, isGift, stripePaymentIntentId?, status, receiptEmailSentAt? | ⬜ |
| `PaymentMethod` | userId, stripePaymentMethodId, type, brand?, last4?, expMonth?, expYear?, isDefault | ⬜ |
| `PayoutAccount` | userId, type (bank/paypal/mobile_money/card), label, maskedIdentifier, isDefault | ⬜ |
| `WithdrawalRequest` | userId, campaignId?, payoutAccountId, amount, status, stripePayoutId? — **records intent only, execution BLOCKED** | ⬜ |

**Backend — endpoints**

| Endpoint | Status |
|---|---|
| `POST /payments/connect/onboarding`, `GET .../status`, `POST .../refresh-link` — build now | ⬜ |
| `POST /payments/webhook` (Stripe events) — build now | ⬜ |
| `POST /payments/donations` — build now; commission/fee deduction BLOCKED (#27), zero fee taken | ⬜ |
| `GET /payments/donations/mine`, `/campaigns/:id/donations`, `/campaigns/:id/top-contributors` — build now | ⬜ |
| `GET /payments/wallet`, `/wallet/transactions` — build now, NO internal ledger table | ⬜ |
| `GET/POST/PATCH/DELETE /payments/methods` — build now | ⬜ |
| `GET/POST/PATCH/DELETE /payments/payout-accounts` (delete guarded if pending) — build now | ⬜ |
| `POST /payments/withdrawals` — **STUB only**, BLOCKED on #3/#4/#5/#27 | ⬜ |
| `GET /payments/withdrawals` — build now | ⬜ |

**Backend — tests**

| Test group | Status |
|---|---|
| unit: `PaymentsService` — connect onboarding, webhook handling, signature failure | ⬜ |
| unit: `DonationsService` — create, anonymous, gift, receipt dispatch, no fee deducted | ⬜ |
| unit: `WalletService` — summary aggregation, ledger | ⬜ |
| unit: `PaymentMethodsService`, `PayoutAccountsService` — CRUD + delete guard | ⬜ |
| unit: `WithdrawalsService` (stub) — intent only, no payout call | ⬜ |
| E2E: Connect onboarding flow | ⬜ |
| E2E: donation flow + receipt email | ⬜ |
| E2E: anonymous donation, gift donation | ⬜ |
| E2E: payment methods CRUD, payout-account delete-guard | ⬜ |
| E2E: withdrawal stub, webhook signature rejection | ⬜ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(traveler)/wallet.tsx` | ⬜ |
| `app/(traveler)/withdrawal.tsx` — ONE real route, execution step shows in-dev/BLOCKED message | ⬜ |
| `app/(traveler)/payment-methods.tsx` | ⬜ |
| Donate dialog (in #5's Campaign Detail) | ⬜ |

**Mobile — components**

| Component | Status |
|---|---|
| `BalanceCard`, `TransactionRow`, `PaymentMethodRow`, `PayoutAccountRow`, `WithdrawalStepper`, `AddPayoutAccountSheet`, `DonateSheet`, `TopContributorRow`, `ConnectStripeCard` | ⬜ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/payments.ts` | ⬜ |
| `src/hooks/use-payments-queries.ts`, `use-payments-mutations.ts` | ⬜ |

**Open questions (deferred — not blocking)**

| # | Question | Default applied now |
|---|---|---|
| #3 | High-value withdrawal threshold | No threshold gate wired |
| #4 | Refund-after-withdrawal/clawback | Not built |
| #5 | "Verification" overloaded across 3 concepts | Withdrawal-eligibility gate not implemented |
| #27 | Platform fee on donations vs. commission | Full amount recorded, zero fee deducted |

---

## 7. Traveler Settings & Account — ✅ done

**Figma screens:** `SettingsScreen.tsx`, `EditProfileScreen.tsx`, `ChangePasswordScreen.tsx`, `PrivacySecurityScreen.tsx`, `TermsAndConditionsScreen.tsx`, `PrivacyPolicyScreen.tsx`

Built on the **existing `UsersController`/`UsersService`** (`src/modules/users/`), not a new `travelers` module — it already owned `/me` and the exact same `User`/`TravelerProfile` rows a separate module would just re-fetch. Endpoint paths below reflect this (`/me/profile`, not `/travelers/me/profile` as originally guessed).

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `TravelerProfile.phone` | contact-only, never touched by auth/OTP | ✅ |
| `NotificationPreference` | userId, donationAlerts, campaignUpdates, agencyMessages (integration point with #10 — stored now, real delivery lands with that feature) | ✅ |
| `PrivacySetting` | userId, profileVisibility (public/friends/private, **really enforced**), activityStatusVisible, readReceiptsEnabled (both stored only, nothing to gate yet) | ✅ |
| No `twoFactorEnabled` column | Scope call: real TOTP enrollment is out of scope; the mobile row is an honest in-dev-alert stub instead of a flag nothing checks at login | ✅ (deliberately not built) |
| Reuse (no re-add) | `User.isActive`/`deactivatedAt` (Auth), `User.username`/`TravelerProfile.bio`/`location`/`gender`/`dateOfBirth` (#1/#2) | ✅ (reused) |

**Backend — endpoints**

| Endpoint | Status |
|---|---|
| `PATCH /me/profile` — partial update; only touches fields present in the request, never touches `previousTripPhotos` or `onboardingComplete` (unlike onboarding's `setupProfile`) | ✅ |
| `GET/PATCH /me/notification-preferences` | ✅ |
| `GET/PATCH /me/privacy-settings` | ✅ |
| `DELETE /me` — soft-delete (`isActive: false`, `deactivatedAt`) + revokes all refresh tokens via `TokenService`; hard-delete NOT built | ✅ |
| `GET /users/:id/profile` — **extended with real profile-visibility enforcement**: private blocks all non-self viewers, friends-only requires `isFriend`, both return the same 404 as a nonexistent user (indistinguishable, like a private GitHub repo) | ✅ |
| Reuse (no rebuild): `POST /auth/change-password`, `/logout`, `/logout-all` | ✅ (reused) |

**Backend — tests**

| Test group | Status |
|---|---|
| unit: `UsersService.updateProfile` — partial update, username conflict, previousTripPhotos untouched | ✅ |
| unit: notification/privacy preferences — schema defaults when no row exists, upsert on update | ✅ |
| unit: `deactivateAccount` — sets isActive/deactivatedAt, revokes refresh tokens | ✅ |
| unit: `getPublicProfile` — private blocks stranger, friends-only blocks non-friend but allows friend, self never blocked | ✅ |
| E2E (`test/traveler-settings.e2e-spec.ts`, 8 tests): edit-profile happy path + username conflict, notification preferences round-trip, privacy-visibility enforcement (private + friends-only, cross-account), change-password + logout-all regression, DELETE /me blocks further requests and future logins | ✅ |
| Running totals at this point: 211 unit tests, 74 E2E tests, all green (superseded — see Feature 8 for the current running total) | ✅ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(traveler)/settings.tsx` — hub: Account/Notifications/Danger Zone sections, footer legal links | ✅ |
| `app/(traveler)/edit-profile.tsx` — receives current profile via route params from Settings (not its own `useMe()` + effect — avoids the same `react-hooks/set-state-in-effect` violation hit in #1); reuses `DestinationTypeChips`/`TravelStyleChips` from #1 | ✅ |
| `app/(traveler)/change-password.tsx` — wires existing endpoint | ✅ |
| `app/(traveler)/privacy-security.tsx` — Security/Privacy/Data & History sections; 2FA row is an in-dev-alert stub | ✅ |
| `app/terms.tsx`, `app/privacy-policy.tsx` — **top-level routes** (not nested under `(auth)`/`(traveler)`), reachable both pre- and post-login | ✅ |
| `app/(auth)/register.tsx` — checkbox text now real links to the two legal pages (was plain unlinked text) | ✅ |
| `src/components/ProfileScreen.tsx` — inline "Log Out" button replaced with a "Settings" nav row; Log Out itself moved into Settings' Danger Zone | ✅ |

**Mobile — components**

| Component | Status |
|---|---|
| `SettingsRow` — nav-row/toggle-row variants, generalizes the "My Reviews" row pattern | ✅ |
| `LegalPageLayout`/`LegalSection`/`LegalParagraph`/`LegalBullet`/`LegalContactCard` — shared gradient-hero + sections shell for the two legal pages | ✅ |
| Not built: `DeleteAccountConfirmSheet` — reused the existing `showAlert` pattern instead (same as `FriendCard`'s remove-friend confirm) | — (intentionally not needed) |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/users.ts` — extended (not a new `travelers.ts`, since the backend stayed on `/me/*`): `updateProfile`, notification/privacy get+update, `deactivateAccount` | ✅ |
| `src/api/auth.ts` — added `changePassword`, `logoutAll` (endpoints existed since Auth, never called from mobile until now) | ✅ |
| `src/hooks/use-users-mutations.ts` (new), `use-users-queries.ts` (extended with notification/privacy queries), `use-auth-mutations.ts` (extended) | ✅ |

**A real bug found and fixed via Playwright**: `SettingsRow`'s outer `Pressable` had `disabled={isToggle}` to suppress its own tap handler on toggle rows — but on web this cascades `pointer-events: none` down through the DOM, making the nested `Switch` genuinely unclickable (confirmed via a Playwright timeout: "element is not enabled"). Fixed by dropping `disabled` entirely (an `onPress={undefined}` Pressable is already inert without it).

**Open questions (deferred — not blocking)**

| # | Question | Default applied now |
|---|---|---|
| #8 | Bio field | Resolved upstream via #2 |
| #9 | Delete-account scope | Soft-delete only; hard-delete/anonymize deferred |

---

## 8. Friends & Group Trips (remainder — group-fund money logic only) — ✅ done

**Figma screens:** `GroupCampaignScreen.tsx`. (Friend connection model shipped with #2 — this pass is only the group-fund money logic.)

Built entirely as a new `src/modules/group-campaigns/` module depending on the already-built `CampaignsService` (via plain Prisma, no cross-module ownership calls needed), `FriendsService.areFriends` (member-add gate), and `ConversationsService` (group chat, exported from `ChatModule` for the first time this pass). "Open Group Chat" is real now that Chat/#3 exists — the tracker's original "in-dev Alert until #3" note is resolved.

**Three scope calls, one confirmed with the user, two decided and documented:**
- **Group campaigns are always excluded from public discovery** (confirmed with the user) — `CampaignsService.listPublic` filters `isGroup: false`; `POST /campaigns` forces `privacy: private` server-side whenever `isGroup: true`, regardless of what's sent. The mobile create wizard hides its Public/Private switch once "Group Trip" is toggled on, since it wouldn't do anything.
- **No withdrawal endpoint at all, not even a stub** — a stub with nothing behind it (no #6 payment rails) is ceremony; there's also no such affordance anywhere in the actual figma screen, so nothing needed building or stubbing.
- **Expense deletion is admin-only**, not "whoever logged it" (undefined in the static figma demo) — matches this codebase's house style of restricting destructive actions to an owner/admin.

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `Campaign.isGroup`, `.groupConversationId` | group flag + link to the lazily-created group `Conversation` (nullable until the first member is added — `ConversationsService.create` requires ≥1 participant besides the caller, so it can't exist at solo-creator time) | ✅ |
| `GroupMember` (`@@unique[campaignId,userId]`) | campaignId, userId, role (admin/member), joinedAt — creator seeded admin in the same transaction as campaign creation | ✅ |
| `GroupContribution` | campaignId, memberUserId, amount, type (manual/donation, only `manual` ever written), note?, donationId? (nullable, ready for #6) | ✅ |
| `GroupExpense` | campaignId, name, amount, category (transportation/accommodation/activities/food/other), paidByUserId, spentAt | ✅ |

**Backend — endpoints**

| Endpoint | Status |
|---|---|
| `POST /campaigns` (extended) — `isGroup` field forces private + seeds creator as admin member | ✅ |
| `GET /campaigns/:id/group/overview` — member-only; totalRaised/totalSpent/goal + per-member contributed amount and % | ✅ |
| `GET/POST /campaigns/:id/group/members`, `DELETE .../members/:userId` — admin-only add/remove, friend-only add, creator can't be removed, syncs the group conversation | ✅ |
| `GET/POST /campaigns/:id/group/contributions` — self-attributed only, never a selectable member | ✅ |
| `GET/POST /campaigns/:id/group/expenses`, `DELETE .../expenses/:expenseId` — any member logs, `paidByUserId` must be a current member, admin-only delete | ✅ |
| `GET /campaigns/group-trips/mine` — campaigns you created OR are a member of (separate from `GET /campaigns/mine`, which stays creator-only) | ✅ |
| `POST /campaigns/:id/group/withdraw` | not built — see scope call above |

**Backend — tests**

| Test group | Status |
|---|---|
| unit (`group-campaigns.service.spec.ts`, 16 tests): member/admin gating, friend-gate on add, creator can't be removed, lazy conversation creation vs. append, self-only contribution attribution, paidByUserId must be a member, admin-only expense delete, overview totals/percentage math | ✅ |
| unit (`campaigns.service.spec.ts`, +1): `create` forces privacy private + seeds admin membership when `isGroup: true`; `listPublic` excludes group campaigns (3 existing tests updated) | ✅ |
| E2E (`group-campaigns.e2e-spec.ts`, 9 tests): privacy forced + admin seeded, never in public browse, non-friend/non-admin add rejected, group chat created on first add and kept in sync, non-member blocked from every group endpoint, contribution self-attribution + overview math, expense lifecycle + admin-only delete, paidByUserId-must-be-member, `group-trips/mine` listing | ✅ |
| **Current running totals: 228 unit tests, 83 E2E tests, all green** (full E2E suite passed clean on the first run, no flakiness) | ✅ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(traveler)/group-campaign/[id].tsx` — gradient overview card (members/destination/raised/goal/progress, Total Contributions + Total Spent tiles), Add Contribution/Expense, real Open Group Chat, Group Members (admin-only + Add / remove), Recent Contributions (latest 5), Expenses & Spending (admin-only delete) | ✅ |
| `app/(traveler)/campaigns/create.tsx` (extended) — new "Group Trip" `Switch` in step 3; hides the Public/Private switch when on; navigates to the group-campaign screen instead of My Campaigns on success | ✅ |
| `app/(traveler)/friends.tsx` (extended) — new third "Group Trips" tab (`useMyGroupTrips`), "+ Create Group Trip" row pre-toggling the wizard via a `groupMode=1` param | ✅ |

**Mobile — components**

| Component | Status |
|---|---|
| `GroupMemberRow`, `GroupContributionRow`, `GroupExpenseRow`, `GroupTripCard` | ✅ |
| `AddContributionSheet`, `AddExpenseSheet` (name/amount/category pills/paid-by pills), `AddGroupMemberSheet` (friend search + tap-to-add-immediately, reusing `ShareSheet`'s friend-list pattern) — all three reuse the `CommentsSheet`/`ShareSheet` bottom-sheet shell | ✅ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/group-campaigns.ts` | ✅ |
| `src/hooks/use-group-campaigns-queries.ts`, `use-group-campaigns-mutations.ts` | ✅ |

**Verified live via Playwright** against the real dev backend (not just the test suite, using the same fetch-from-page-context photo-upload workaround as #1/#5/#7 since `expo-image-picker` still can't be driven through Playwright's web file chooser): created a group trip, added a friend as a member (UI sheet), added a self-attributed contribution, logged an expense paid by the other member, confirmed totals/percentages updated live, opened a real group chat reachable from both accounts, confirmed the trip appears under Friends → Group Trips for both the creator and the added member, confirmed a third unrelated traveler gets a 403 on every group endpoint and never sees the campaign in public browse, and confirmed the non-admin member gets a 403 trying to add someone else.

**Open questions (deferred — not blocking)**

| # | Question | Default applied now |
|---|---|---|
| #24 | Friend status → invite-only visibility | No, always explicit invite |
| #25 | Who withdraws pooled group funds | No endpoint built at all — see scope call above |
| — | Manual-vs-auto reconciliation | Fully trust-based, no verification |
| — | "Spend" tracking interpretation | Built as real expense-splitting per figma UI, confirmed working |

---

## 9. Agency Dashboard & Business Tools — ⬜ not started, 🚧 Packages sub-scope blocked on #2

**Figma screens:** `AgencyDashboardScreen`, `AgencyPackagesScreen`, `AgencyCreatePackageScreen`, `AgencyRequestsScreen`, `AgencyRequestDetailScreen`, `AgencyProfileScreen`, `AgencyEditProfileScreen`, `AgencyRevenueScreen`, `AgencyReviewsScreen` (display-only, data from #4), `AgencySettingsScreen` + subpages, `AgencyStatusScreen`. (`AgencyChatListScreen`/`AgencyNotificationsScreen` referenced only — owned by #3/#10.)

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `Package`, `PackageImage`, `PackageInclusion`, `PackageItineraryDay` | **⚠️ ALL BLOCKED by #2 — do not create** | 🚧 |
| `TripRequest` (not blocked) | agencyId, travelerId, packageId?, status, budgetMin?/Max?, dates, travelerCount, preferences, declineReason? | ⬜ |
| `TripBooking` (not blocked) | tripRequestId (`@@unique`), agencyId, travelerId, status, commissionAmount? | ⬜ |
| `AgencyStaff` (extend) | + permissionTier (owner/admin/support), invitedById?, invitedAt?, acceptedAt?, status | ⬜ |
| `AgencyStaffAuditLog` (new) | agencyId, staffId, action, metadata?, createdAt | ⬜ |
| `AgencyDocument` (extend) | + documentType, status, expiryDate?, rejectionReason? | ⬜ |
| `AgencySubscription` (display-only) | agencyId, tier, commissionRate, active | ⬜ |
| `SupportTicket` (new) | agencyId?, userId, category, subject, message, status | ⬜ |

**Backend — endpoints**

| Group | Endpoints | Status |
|---|---|---|
| Dashboard & Analytics | `GET /agency/dashboard/{kpis,funding-trends,top-destinations,traveler-distribution,export}` (⚠️ #17 default: preference distribution not demographics) | ⬜ |
| Package & Itinerary | `GET/POST/PATCH/DELETE /agency/packages(/:id)`, `PUT .../images,inclusions,itinerary`, `GET /packages/:id` | 🚧 blocked #2 |
| Requests/Bookings | `GET/POST /agency/requests(/:id)`, accept/decline, `GET/PATCH /agency/bookings(/:id/status)` | ⬜ |
| Profile | `GET/PATCH /agency/profile` | ⬜ |
| Documents | `GET/POST/DELETE /agency/documents(/:id)` | ⬜ |
| Staff | `GET/POST/PATCH/DELETE /agency/staff(/:id)`, accept-invite, audit-log | ⬜ |
| Revenue (display-only, #28) | `GET /agency/revenue/{ledger,subscription,export}` | ⬜ |
| Reviews (display-only, #4) | `GET /agency/reviews` | ⬜ |
| Status / Support / Legal | `GET /agency/status`, `POST/GET /agency/support/tickets`, `GET /agency/support/faq`, `GET /legal/agency/{terms,privacy}` | ⬜ |

**Backend — tests**

| Test group | Status |
|---|---|
| unit: `PackageService` | 🚧 blocked #2 |
| unit: `TripRequestService`, `TripBookingService` | ⬜ |
| unit: `AgencyDashboardService`, `AgencyStaffService`, `AgencyDocumentService`, `AgencyProfileService`, `AgencyRevenueService`, `SupportTicketService` | ⬜ |
| E2E: dashboard KPIs+export; package lifecycle (skip until #2); request→accept→booking→completed; decline-with-reason | ⬜ |
| E2E: profile edit+document upload; staff invite/tier-guard/audit; revenue+subscription display; reviews proxy; status; support tickets | ⬜ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(agency)/dashboard` | ⬜ |
| `app/(agency)/packages`, `create-package`, `edit-package/[id]` — UI built to design, backend wiring deferred (#2) | ⬜ |
| `app/(agency)/requests`, `request-detail/[id]` | ⬜ |
| `app/(agency)/profile`, `edit-profile` | ⬜ |
| `app/(agency)/revenue` — upgrade CTA → in-dev Alert (#28) | ⬜ |
| `app/(agency)/reviews` | ⬜ |
| `app/(agency)/settings` + subpages (terms, privacy, change-password, privacy-security, update-documents, support) | ⬜ |
| `app/(agency)/status` — approved transition depends on #11 | ⬜ |
| Fix figma-demo bug: pre-auth terms/privacy links must route to real nested static routes | ⬜ |

**Mobile — components**

| Component | Status |
|---|---|
| `KpiCard`, `FundingLineChart`, `TopDestinationsBarChart`, `TravelerPreferencePieChart`, `RangeSelector` | ⬜ |
| `PackageCard`, `PackageBuilderStepper`, `InclusionListEditor`, `ItineraryDayEditor`, `AddPhotoTile` | ⬜ |
| `RequestCard`, `TravelerPreferenceBlock`, `AcceptDeclineBar` | ⬜ |
| `AgencyProfileHeader`, `DocumentStatusRow`, `RevenueLedgerRow`, `SubscriptionTierCard`, read-only `ReviewCard` | ⬜ |
| `PasswordRequirementsChecklist`, `ActiveSessionRow`, `SupportTicketForm`, `FaqAccordion`, `StaffMemberRow` | ⬜ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/agency-{dashboard,packages,requests,bookings,profile,documents,staff,revenue,reviews,status,support}.ts` | ⬜ |
| matching `use-agency-*-queries.ts`/`-mutations.ts` hooks | ⬜ |

**Open questions (deferred — not blocking, except #2)**

| # | Question | Default applied now |
|---|---|---|
| #2 | Package entity model | **HARD BLOCK** on Package/Itinerary backend + mobile wiring; rest of feature proceeds |
| #10 | Agency rejection flow | Basic reject-with-reason field |
| #11 | Reputation score formula | Raw average displayed |
| #14 | Influencer collaborations | Not built |
| #16 | "Manage campaigns" wording | Package/request management only |
| #17 | User demographics | Travel-preference distribution shown instead |
| #19 | Compliance system | No automated checks built |
| #28 | Subscription IAP vs. web billing | Display-only, no purchase flow |
| — | Promotion purchase mechanism | Not built |
| — | Package pre-publish review | Fully self-service (ties to #21) |
| — | Top-performing-travelers metric | Not built here — #11's dependency |

---

## 10. Notifications (Traveler + Agency) — ⬜ not started, "trigger sink" for most other features

**Figma screens:** `NotificationsScreen.tsx` (traveler), `AgencyNotificationsScreen.tsx` (agency)

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `Notification` | userId, type, title, body, read, deepLinkTarget?, deepLinkEntityId?, metadata?, channel | ⬜ |
| `NotificationPreference` (`@@unique`) | userId, type, inAppEnabled, pushEnabled, emailEnabled — one row per user per trigger | ⬜ |
| `PushDevice` (`@@unique`) | userId, fcmToken, platform, lastSeenAt? | ⬜ |
| `MilestoneNotificationLog` (`@@unique`) | campaignId, milestone (p25/p50/p100), notifiedAt — depends on #5 | ⬜ |

**Backend — endpoints**

| Endpoint | Status |
|---|---|
| `GET /notifications`, `/unread-count`, `PATCH .../:id/read`, `/read-all`, `DELETE .../:id` | ⬜ |
| `GET/PATCH /notifications/preferences` | ⬜ |
| `POST/DELETE /notifications/devices(/:token)` | ⬜ |
| `POST /admin/notifications/broadcast`, `GET .../segments/preview` — platform-role admin | ⬜ |
| (internal) `NotificationService.create()` — respects preferences, fans out in-app+push+email | ⬜ |

**Backend — trigger integration points** (each owned by another feature)

| Trigger | Owning feature | Status |
|---|---|---|
| donation, milestone, withdrawal, payment_received | #6 Payments | ⬜ |
| agency_response, new_request, booking_update | #9 Agency Dashboard | ⬜ |
| like, comment, share, friend_request | #2 Social Feed | ⬜ |
| new_message, new_call, shared_file | #3 Chat | ⬜ |
| review_received | #4 Reviews | ⬜ |
| account_deactivated, agency_registration_approved/rejected, system_alert | #11 Admin | ⬜ |
| admin_broadcast | this feature | ⬜ |

**Backend — tests**

| Test group | Status |
|---|---|
| unit: `NotificationService` — preference respect, channel skip, push fan-out | ⬜ |
| unit: `NotificationPreferenceService`, `PushDeviceService`, `NotificationBroadcastService`, `MilestoneNotificationService` | ⬜ |
| E2E: in-app lifecycle, preference toggle, push register/unregister, admin broadcast, milestone dedupe | ⬜ |

**Mobile — screens/routes**

| Screen/Route | Status |
|---|---|
| `app/(traveler)/notifications` — fuller trigger set than figma reference | ⬜ |
| `app/(agency)/notifications` | ⬜ |
| `app/(traveler\|agency)/settings/notification-preferences` | ⬜ |
| Milestone celebration + shareable badge (reuses #2 Share) | ⬜ |

**Mobile — components**

| Component | Status |
|---|---|
| `NotificationListItem`, `NotificationTypeIcon`, `UnreadBadge`, `NotificationPreferenceRow`, `MilestoneCelebration`, `ShareableBadge`, `EmptyNotificationsState` | ⬜ |

**Mobile — api & hooks**

| File | Status |
|---|---|
| `src/api/notifications.ts`, `admin-notifications.ts` | ⬜ |
| `src/hooks/use-notifications-queries.ts`, `use-notifications-mutations.ts`, `use-push-registration.ts` | ⬜ |

**Open questions (deferred — not blocking)**

| # | Question | Default applied now |
|---|---|---|
| #15 | CRM integration | Not built, explicitly low-priority |
| — | Milestone donor-notification audience | Owner full, donor optional lighter; wiring depends on #5/#6 |
| — | Email channel for financial notifications | Gated on `emailEnabled`, depends on #6 |
| — | Broadcast segmentation | Basic role/region/activity filters built here |

---

## 11. Admin / Super Admin Panel — ⬜ not started, 🚧 heavily blocked — dedicated scoping pass required

**⚠️ SCOPING NOTICE:** largest concentration of unresolved open questions (#3, #5, #12, #17, #18, #19, #20, #21, #22, #23) and **zero UI reference** anywhere in figma-demo. Only the "not blocked" group below should be implemented before a dedicated scoping conversation with the user.

**Figma screens:** NONE — must be designed from scratch.

**Already built (from Auth module)**

| Item | Status |
|---|---|
| Admin login + 2FA (`@RequirePlatformRole`) | ✅ |

**Backend — Prisma models**

| Model | Fields | Status |
|---|---|---|
| `User.platformRole` | extend existing enum (don't replace) | ⬜ |
| `AdminInvite` | email, platformRole, token, invitedById, status, expiresAt, acceptedAt? | ⬜ |
| `AdminAuditLog` (append-only) | actorId, action, targetType, targetId?, reason?, metadata?, createdAt only | ⬜ |
| `TermsVersion`, `TermsAcceptance` (`@@unique`) | documentType/version/content/publishedAt/active; userId+termsVersionId+acceptedAt | ⬜ |
| `ContentReport` | reporterId, targetType (post/review/chat_message/blog/photo/campaign_media), targetId, reason, status, resolvedById?, resolutionNote? | ⬜ |
| `VerifiedBadge` | subjectType (user/agency), subjectId, assignedById, assignedAt, revokedAt? | ⬜ |
| Fraud-flag, refund, KYC, threshold-config models | **⚠️ intentionally NOT modeled — depends on scoping answers** | 🚧 |

**Backend — endpoints — not blocked, build now**

| Endpoint | Status |
|---|---|
| `POST/GET /admin/invites`, `POST .../:id/revoke`, `POST /admin/invites/accept` | ⬜ |
| (script) `seed-super-admin` — closes HANDOFF.md's known gap | ⬜ |
| `GET /admin/roles`, `PATCH /admin/users/:id/platform-role` | ⬜ |
| `GET /admin/audit-log` | ⬜ |
| `GET/POST /admin/terms`, `GET /terms/current`, `POST /terms/accept` | ⬜ |
| `POST /admin/notifications/broadcast` (delegates to #10) | ⬜ |
| `GET /admin/reports`, `GET .../:id`, `PATCH .../:id` | ⬜ |
| `POST/DELETE /admin/badges(/:id)` | ⬜ |
| `POST /reports` — cross-feature flag button, added to #2/#3/#4's UI | ⬜ |
| `GET/PATCH /admin/profile`, `GET/PATCH /admin/settings/notification-preferences` | ⬜ |

**Backend — endpoints — BLOCKED, scope with user first**

| Item | Blocked by |
|---|---|
| Registration approve/reject workflow specifics | #5, #10 |
| Campaign fraud-flagging, auto-pause, pre- vs. post-moderation | #21, #22 |
| Payment/transaction oversight: refunds, high-value flags, reports | #3, #20, #23 |
| KYC/GDPR/payment-regulation enforcement + retention period | #23 |
| Analytics & Insights: platform metrics, demographics, top-performers | #17, #18 |
| "Deactivate" semantics on live campaigns/funds | #20 |
| Built-in compliance/trip-authenticity checks | #19 |

**Backend — tests**

| Test group | Status |
|---|---|
| unit: `AdminInviteService`, `AdminAuditLogService` (append-only), RBAC assignment, `TermsVersionService`, `TermsAcceptanceService`, `ContentReportService`, `VerifiedBadgeService` | ⬜ |
| E2E: seed→login→invite→accept→role-restricted; audit immutability; T&C publish→re-acceptance; report→queue→action; badge assign/revoke; broadcast | ⬜ |
| E2E (BLOCKED, deferred until scoped) | 🚧 |

**Mobile/Web — screens/routes**

| Screen/Route | Status |
|---|---|
| NONE from figma — admin web dashboard designed during scoping pass | 🚧 |
| Buildable now: moderation queue, audit-log viewer, admin invite management, T&C version manager, verified-badge assignment, broadcast composer, admin profile/settings | ⬜ |

**Mobile/Web — components**

| Component | Status |
|---|---|
| `ReportQueueRow`, `ReportDetailPanel`, `AuditLogRow`, `AdminInviteForm`/`Row`, `TermsVersionEditor`, `VerifiedBadgeAssigner`, `BroadcastComposer`, `ReportFlagButton` (cross-feature), `AdminNotificationSettingsList` | ⬜ |

**Mobile/Web — api & hooks**

| File | Status |
|---|---|
| `src/api/admin-{invites,roles,audit,terms,reports,badges,broadcast,profile}.ts` | ⬜ |
| matching `use-admin-*-queries.ts`/`-mutations.ts` hooks | ⬜ |

**Open questions (deferred — blocking the "BLOCKED" group above)**

| # | Question |
|---|---|
| #3 | High-value transaction threshold |
| #5 | "Verification" terminology collision |
| #12 | Does moderation scope include reviews + chat? (default now: `ContentReport` supports all types, flag for confirmation) |
| #17 | User demographics (zero data collected) |
| #18 | No "top-performing traveler" metric defined |
| #19 | "Built-in compliance system" has zero operational detail |
| #20 | "Deactivate" effect on live campaigns/funds undefined |
| #21 | Pre-moderation vs. post-hoc campaign review (contradictory TRD readings) |
| #22 | No fraud-detection criteria |
| #23 | KYC/GDPR/payment-regulation + audit-log retention (real legal exposure) |

