# Veakay — Complete Product Sprint Backlog  |  4 Sprints × 2.5 Weeks  |  20 july – 30 October 2026

## Overview

| Sprint | Dates & Scope | # Tasks | Total Story Points |
|---|---|---|---|
| Sprint 1 | 20 July – 17 August — UI Validation & Fixes, Backend Foundation, Auth (Traveler + Agency), User Profile Setup, Forgot Password | 16 | 64 |
| Sprint 2 | 18 Aug – 30 Aug — Campaign Creation, Itinerary & Agency Collaboration, Social Feed, Payment & Withdrawal, Friends & Group Trips, Chat Module | 16 | 86 |
| Sprint 3 | 01 Sep – 25 Sep 2026 — Agency Ratings & Reviews, Notifications, Explore Section, Security & Verification, My Profile (Traveler & Agency), Settings, Agency Dashboard & Analytics, Package & Itinerary Mgmt, Agency Payments & Marketing, Agency Admin & Compliance Tools | 32 | 115 |
| Sprint 4 | 26 Sep – 30 Oct — Super Admin Panel (Full), E2E QA, UAT & Bug Fixes | 20 | 89 |
| **Total** | | **84** | **354** |

> **Status update (2026-08-12):** checkboxes/Status/%Done below were cross-checked against the actual codebase and against `docs/PROGRESS_TRACKER.md`, which is the project's real, currently-maintained tracker (feature-by-feature, not VK-numbered) — see that file for full detail on what's built, what was intentionally scope-narrowed, and what's still open. This sheet was AI-generated early on and the team already moved to `PROGRESS_TRACKER.md` as the source of truth; treat these updated marks as a snapshot, not a replacement for it. `Done` = shipped with unit + E2E tests + Playwright verification; `Partial` = the row spans multiple features and only some are built (see the linked feature #); unmarked rows are genuinely untouched.

## Sprint 1 — 20 July – 17 August — UI Validation & Fixes, Backend Foundation, Auth (Traveler + Agency), User Profile Setup, Forgot Password

_16 tasks — 64 story points_

| ✓ | ID | Platform | Module | Sub-Module | Assignee | Status | Priority | Pts | Start | End | % Done |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [~] | VK-001 | Mobile | UI Validation | UI Audit |  | Partial | High | 3 | 11 May | 30 May | 70% |
| [~] | VK-002 | Mobile | UI Validation | UI Fixes |  | Partial | High | 5 | 11 May | 30 May | 70% |
| [~] | VK-003 | Mobile | UI Validation | Missing Screens |  | Partial | High | 4 | 11 May | 30 May | 70% |
| [x] | VK-004 | Backend | Infrastructure | Project Setup |  | Done | High | 5 | 11 May | 30 May | 100% |
| [x] | VK-005 | Backend | Auth (Traveler) | Sign-Up API |  | Done | High | 5 | 11 May | 30 May | 100% |
| [x] | VK-006 | Backend | Auth (Traveler) | Profile Setup API |  | Done | High | 5 | 11 May | 30 May | 100% |
| [x] | VK-007 | Backend | Auth (Traveler) | Login API |  | Done | High | 3 | 11 May | 30 May | 100% |
| [x] | VK-008 | Backend | Auth (Traveler) | Forgot Password API |  | Done | High | 3 | 11 May | 30 May | 100% |
| [x] | VK-009 | Backend | Auth (Agency) | Agency Sign-Up API |  | Done | High | 4 | 11 May | 30 May | 100% |
| [x] | VK-010 | Backend | Auth (Agency) | Agency Verification API |  | Done | High | 5 | 11 May | 30 May | 100% |
| [x] | VK-011 | Backend | Auth (Agency) | Agency Login API |  | Done | High | 3 | 11 May | 30 May | 100% |
| [x] | VK-012 | Backend | Auth (Agency) | Agency Forgot Password API |  | Done | High | 2 | 11 May | 30 May | 100% |
| [x] | VK-013 | Mobile | Auth (Traveler) | Integration |  | Done | High | 5 | 11 May | 30 May | 100% |
| [x] | VK-014 | Mobile | Auth (Agency) | Integration |  | Done | High | 5 | 11 May | 30 May | 100% |
| [~] | VK-015 | QA | QA | Sprint 1 QA |  | Partial | High | 3 | 11 May | 30 May | 70% |
| [x] | VK-016 | QA | QA | Sprint 1 QA |  | Done | High | 4 | 11 May | 30 May | 100% |

**Task details:**

- **VK-001** (Mobile) — TRD §User Interface
  [UI Fix] Conduct full mobile UI audit across all existing screens — validate against TRD design requirements, document all UI inconsistencies, missing screens, and broken layouts for iOS & Android (Traveler & Agency sides)
  _Notes: Audit all screens: Auth, Profile Setup, Campaign, Feed, Chat, Explore, Payment, Agency Dashboard, Admin; cover both iOS & Android_

- **VK-002** (Mobile) — TRD §User Interface
  [UI Fix] Fix identified UI inconsistencies — correct screen layouts, typography, spacing, button styles, navigation flows, and icon usage across all audited screens for Traveler and Agency apps
  _Notes: Address all issues found in VK-001 audit; cover Auth, Campaign, Feed, Chat, Profile, Payment screens_

- **VK-003** (Mobile) — TRD §User Interface
  [UI Fix] Implement any missing UI screens identified during audit — create new screens/components not yet built as per TRD requirements (e.g. missing modal flows, empty states, error states, gift mode screens, geo-map view, verified badge display)
  _Notes: New screens must match TRD spec; include Gift Mode modal, real-time progress bar, group fund screens, geo-map campaign view_

- **VK-004** (Backend) — TRD §Auth / Super Admin
  Backend project setup — Node.js/NestJS (or equivalent) project scaffolding, PostgreSQL/MongoDB database schema design, environment configuration, JWT authentication middleware, RBAC roles (Traveler / Agency / Admin)
  _Notes: Define all DB entities: User, Agency, Campaign, Donation, Itinerary, Package, Chat, Message, Review, Notification, Group, Withdrawal_

- **VK-005** (Backend) — TRD §Sign Up (Traveler)
  Traveler Sign-Up API — Email/Password registration with field validation, Google OAuth2 and Apple ID sign-in, OTP verification via email, auto-redirect to Traveler Profile Setup on success, Terms & Conditions and Privacy Policy acceptance enforcement
  _Notes: T&C acceptance mandatory; OTP email verification; social auth auto-account creation; redirect to profile setup on success_

- **VK-006** (Backend) — TRD §User Profile Setup
  Traveler Profile Setup API (at sign-up time) — save profile photo(s), travel preferences (destination types, travel style), previous trips photos (optional), connect wallet/payment method (PayPal, Stripe, etc.), assign default 'Dreamer' Traveler Status Badge on profile creation
  _Notes: Default badge = Dreamer; wallet connection optional at sign-up; badge milestone system (Explorer, Jetsetter) triggered later_

- **VK-007** (Backend) — TRD §Login (Traveler)
  Traveler Login API — Email/Password credential validation, Google/Apple social login, OTP-based login option, secure session handling with JWT issuance, logout endpoint (token invalidation)
  _Notes: Secure JWT; OTP login option per TRD; session management; logout invalidates token_

- **VK-008** (Backend) — TRD §Forgot Password (Traveler)
  Traveler Forgot Password API — accept registered email, generate & send OTP or reset link via email, OTP/link expiry logic, secure password update endpoint, redirect-to-login response after successful reset
  _Notes: OTP expiry per TRD; email delivery via SendGrid or equivalent; redirect to login on success_

- **VK-009** (Backend) — TRD §Sign Up (Agency)
  Agency Sign-Up API — Email/Password registration with OTP verification, agency profile creation redirect on success, Terms & Conditions acceptance enforcement, dedicated agency registration flow
  _Notes: T&C mandatory; OTP email verification; redirect to Agency Registration & Verification on success_

- **VK-010** (Backend) — TRD §Agency Registration & Verification
  Agency Registration & Verification API — agency submits: agency name, business contact details, business address; upload documents (business licenses, certifications, legal documents); agency profile set to 'Pending Verification' until Admin approval; on approval assign Verified Agency Badge; track agency reputation score (ratings & successful trips)
  _Notes: Pending status until admin approves; document upload to secure storage (S3); Verified Badge assigned post-approval; reputation score model_

- **VK-011** (Backend) — TRD §Login (Agency)
  Agency Login API — Email/Password credential validation, OTP-based login option, secure session handling with JWT issuance, logout endpoint
  _Notes: Secure JWT session; OTP optional; logout invalidates token_

- **VK-012** (Backend) — TRD §Forgot Password (Agency)
  Agency Forgot Password API — password reset via email OTP or reset link, secure password update endpoint, redirect to login on success
  _Notes: Same pattern as traveler forgot password; email delivery_

- **VK-013** (Mobile) — TRD §Auth (Traveler)
  [Integration] Traveler Auth screens integration — connect Sign-Up, Profile Setup, Login (Email/Password/Google/Apple/OTP), Forgot Password UI screens to backend APIs; handle success/error states, JWT storage, auto-redirect to Profile Setup on sign-up, dashboard redirect on login
  _Notes: Wire all traveler auth screens; secure JWT storage; T&C checkbox enforced; social login flows_

- **VK-014** (Mobile) — TRD §Auth (Agency)
  [Integration] Agency Auth screens integration — connect Agency Sign-Up, Registration & Verification form (agency name, contact, address, document uploads), Login, Forgot Password UI to backend APIs; handle Pending Verification state display, Verified Badge display post-approval
  _Notes: Pending status shown on agency app; document upload from mobile; Verified Badge reflected on approval_

- **VK-015** (QA) — TRD §User Interface
  [QA-S1] UI Audit & Fixes — validate all audited screens post-fix on iOS & Android, confirm missing screens implemented, verify no regressions on existing UI; check navigation flows, empty states, error states
  _Notes: Test on physical devices (iOS & Android); confirm all VK-001/002/003 items resolved_

- **VK-016** (QA) — TRD §Auth (Traveler & Agency)
  [QA-S1] Auth & Profile Setup — test traveler sign-up (Email/Google/Apple, OTP, T&C enforcement, profile setup redirect, Dreamer badge assignment, wallet connection); traveler login (all methods, JWT, OTP option, logout); forgot password (OTP/link expiry); agency sign-up (OTP, T&C, Pending Verification status); agency registration (document upload, pending state); agency login & forgot password on iOS & Android
  _Notes: Verify Dreamer badge auto-assignment; pending status for agency; T&C blocks registration if unchecked; social auth first-time auto-create_

## Sprint 2 — 18 Aug – 30 Aug — Campaign Creation, Itinerary & Agency Collaboration, Social Feed, Payment & Withdrawal, Friends & Group Trips, Chat Module

_16 tasks — 86 story points_

| ✓ | ID | Platform | Module | Sub-Module | Assignee | Status | Priority | Pts | Start | End | % Done |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [x] | VK-017 | Backend | Campaign | Campaign API |  | Done | High | 7 | 02 Jun | 20 Jun | 100% |
| [ ] | VK-018 | Backend | Itinerary | Itinerary API |  | To Do | High | 5 | 02 Jun | 20 Jun | 0% |
| [x] | VK-019 | Backend | Social Feed | Feed API |  | Done | High | 7 | 02 Jun | 20 Jun | 100% |
| [ ] | VK-020 | Backend | Payment | Payment API |  | To Do 🚧 blocked | High | 7 | 02 Jun | 20 Jun | 0% |
| [x] | VK-021 | Backend | Friends & Groups | Group API |  | Done | High | 6 | 02 Jun | 20 Jun | 100% |
| [x] | VK-022 | Backend | Chat | Chat API |  | Done | High | 8 | 02 Jun | 20 Jun | 100% |
| [x] | VK-023 | Mobile | Campaign | Integration |  | Done | High | 5 | 02 Jun | 20 Jun | 100% |
| [ ] | VK-024 | Mobile | Itinerary | Integration |  | To Do | High | 4 | 02 Jun | 20 Jun | 0% |
| [x] | VK-025 | Mobile | Social Feed | Integration |  | Done | High | 5 | 02 Jun | 20 Jun | 100% |
| [ ] | VK-026 | Mobile | Payment | Integration |  | To Do 🚧 blocked | High | 5 | 02 Jun | 20 Jun | 0% |
| [x] | VK-027 | Mobile | Friends & Groups | Integration |  | Done | High | 4 | 02 Jun | 20 Jun | 100% |
| [x] | VK-028 | Mobile | Chat | Integration (Traveler) |  | Done | High | 6 | 02 Jun | 20 Jun | 100% |
| [x] | VK-079 | Mobile | Chat | Integration (Agency) |  | Done | High | 5 | 02 Jun | 20 Jun | 100% |
| [~] | VK-029 | QA | QA | Sprint 2 QA |  | Partial | High | 4 | 02 Jun | 20 Jun | 50% |
| [~] | VK-030 | QA | QA | Sprint 2 QA |  | Partial | High | 4 | 02 Jun | 20 Jun | 65% |
| [x] | VK-031 | QA | QA | Sprint 2 QA |  | Done | High | 4 | 02 Jun | 20 Jun | 100% |

**Task details:**

- **VK-017** (Backend) — TRD §Vacation Campaign Creation
  Vacation Campaign Creation API — create campaign with goal amount, destination, trip dates, personal story; upload images, itineraries, or agency quotes; set privacy (Public/Invite-only); real-time donation progress bar tracking; Gift Mode allowing friends/family to contribute for special occasions; edit campaign; delete campaign; auto-record all gift contributions; donor-side gift contribution history endpoint (traveler can view all campaigns they have contributed to)
  _Notes: Gift Mode auto-records contributions; real-time progress bar % calculation; privacy settings per TRD; edit & delete endpoints; donor gift-history endpoint per TRD user story_

- **VK-018** (Backend) — TRD §Itinerary Builder & Agency Collaboration
  Itinerary Builder & Agency Collaboration API — browse trip packages from agencies; request trip packages; link chosen package directly to fundraiser campaign; auto-suggestions for affordable trips based on current funding progress; real-time chat/video consultation routing with agencies (trigger Chat Module)
  _Notes: Auto-suggest algorithm based on funding % vs package prices; link package to campaign; consultation request triggers Chat Module_

- **VK-019** (Backend) — TRD §Social Feed & Community
  Social Feed & Community API — traveler post creation (text, images, trip updates); edit own post; delete own post; like, comment, share posts and campaigns; feed algorithm displaying campaigns, trip progress, and travel memories; follow other travelers; join interest groups; Journey Journal endpoint (post trip blogs after completed trips)
  _Notes: CRUD posts; feed ranking; follow/unfollow; interest groups; Journey Journal blog post type_

- **VK-020** (Backend) — TRD §Payment & Withdrawal
  Payment & Withdrawal API — secure fund collection via Stripe, PayPal, or in-app wallet; withdrawal endpoint after campaign verification and goal completion; donation tracking with top-contributor listing; full donation history per user; campaign verification before withdrawal triggers
  _Notes: Stripe + PayPal integration; withdrawal requires campaign verification; top-contributor calculation; donation history endpoint_

- **VK-021** (Backend) — TRD §Friends & Group Trips
  Friends & Group Trips API — add friends and view their campaigns; create group travel fund (bachelor trips, family reunions, etc.); shared chat and planning within group fund; auto-record all contributions/donations from friends to group fund; allow group members to manually enter their contribution/spend amounts; update group fund progress based on manual inputs
  _Notes: Group fund = aggregated contributions; manual spend entry updates progress; auto-record all incoming donations_

- **VK-022** (Backend) — TRD §Chat Module (Traveler & Agency)
  Chat Module API — 1:1 Chat with Friends (text messages with sent/delivered/read status); Group Chat with Friends (create group, add/remove members, share images/PDFs/trip documents); 1:1 Chat with Agency (text consultation); Audio & Video Calls with Agency (WebRTC or equivalent); Document/media sharing (images, PDFs, DOCX upload/download); Agency-side: receive traveler messages, initiate/receive audio/video calls, share documents/itineraries/quotes/invoices with travelers
  _Notes: Real-time messaging via WebSocket; read receipts; media file storage (S3); WebRTC for audio/video calls; group chat member management; agency share of itineraries/quotes/invoices per TRD_

- **VK-023** (Mobile) — TRD §Vacation Campaign Creation
  [Integration] Campaign Creation screens integration — connect Create/Edit/Delete Campaign UI to backend; wire goal amount, destination, trip dates, story, image upload, itinerary/agency quote upload, privacy toggle, real-time progress bar; Gift Mode contribution flow; donor gift contribution history view (traveler sees all campaigns they have contributed to)
  _Notes: Progress bar real-time update on donation; Gift Mode modal; privacy toggle; edit/delete campaign flows; donor-side contribution history list per TRD user story_

- **VK-024** (Mobile) — TRD §Itinerary Builder & Agency Collaboration
  [Integration] Itinerary Builder & Agency Collaboration screens integration — connect Browse/Request Package UI to backend; display auto-suggested affordable trips based on funding progress; link package to campaign; initiate real-time chat/video consultation with agency from itinerary screen
  _Notes: Auto-suggest list updates dynamically with funding %; package link confirmation flow; consultation CTA launches Chat Module_

- **VK-025** (Mobile) — TRD §Social Feed & Community
  [Integration] Social Feed & Community screens integration — connect Feed UI to backend; wire post creation/edit/delete, like/comment/share actions, campaign cards in feed, follow/unfollow traveler, join interest group, Journey Journal blog post creation and display
  _Notes: Feed shows campaigns + trip progress + travel memories; Journey Journal blog type; CRUD post flows_

- **VK-026** (Mobile) — TRD §Payment & Withdrawal
  [Integration] Payment & Withdrawal screens integration — connect payment UI to Stripe/PayPal; wire donation flow, withdrawal request (post campaign verification), donation tracker, top-contributor list, full donation history display
  _Notes: Withdrawal only after goal + verification; top contributor ranking display; donation history timeline_

- **VK-027** (Mobile) — TRD §Friends & Group Trips
  [Integration] Friends & Group Trips screens integration — connect friends list, view friend campaigns, create group fund, group shared chat/planning, auto-recorded contribution display, manual spend entry and group progress update
  _Notes: Auto-record vs manual entry distinction; group fund total spend display_

- **VK-028** (Mobile) — TRD §Chat Module (Traveler)
  [Integration] Traveler-side Chat Module screens integration — wire 1:1 Friend Chat (text + read receipts), Group Friend Chat (create/add/remove members, share images/PDFs/docs), 1:1 Agency Chat (text), Audio/Video Call with Agency (start/receive), document/media share and download
  _Notes: Read receipts (sent/delivered/read); media download; agency audio/video call UI (WebRTC); group member management_

- **VK-079** (Mobile) — TRD §Chat Module (Agency)
  [Integration] Agency-side Chat Module screens integration — wire Agency app 1:1 Chat with Travelers (receive/send text messages, sent/delivered/read status), Audio/Video Calls with Travelers (start or receive calls from agency app), Document/Media Sharing from agency side (share itineraries, quotes, invoices, promotional materials with travelers)
  _Notes: Agency app chat UI: incoming traveler messages, call initiation/receive, document share — distinct from traveler-side chat integration; per TRD Agency Chat Module user stories_

- **VK-029** (QA) — TRD §Campaign / Itinerary
  [QA-S2] Campaign Creation & Itinerary — test create/edit/delete campaign (all fields, image upload, itinerary/agency quote upload, privacy toggle); Gift Mode auto-record; real-time progress bar update on donation; donor gift contribution history view (campaigns I contributed to); auto-suggested trips based on funding %; package link to campaign; consultation request triggers chat
  _Notes: Test Gift Mode contribution auto-record; progress bar real-time; donor gift history view; package linked to campaign_

- **VK-030** (QA) — TRD §Feed / Payment / Groups
  [QA-S2] Social Feed, Payment & Withdrawal, Friends & Groups — test post CRUD (create/edit/delete), like/comment/share, follow/unfollow, interest groups, Journey Journal; payment donation flow (Stripe/PayPal); withdrawal after goal + verification; donation history; top contributor; group fund creation, auto-record contributions, manual spend entry, group progress update; group shared chat/planning
  _Notes: Withdrawal blocked before goal/verification; top contributor calculation; manual vs auto contribution distinction_

- **VK-031** (QA) — TRD §Chat Module (Traveler & Agency)
  [QA-S2] Chat Module (Traveler & Agency sides) — test 1:1 friend chat (text, sent/delivered/read receipts), group chat (create/add/remove members, share images/PDFs/DOCX), 1:1 agency text chat, audio call with agency (start/receive), video call with agency (start/receive), document download; agency app: receive traveler messages, initiate calls, share itineraries/quotes/invoices; all on iOS & Android
  _Notes: Read receipts all three states; media/doc upload-download; WebRTC audio & video; agency-side chat flows tested separately_

## Sprint 3 — 01 Sep – 25 Sep 2026 — Agency Ratings & Reviews, Notifications, Explore Section, Security & Verification, My Profile (Traveler & Agency), Settings, Agency Dashboard & Analytics, Package & Itinerary Mgmt, Agency Payments & Marketing, Agency Admin & Compliance Tools

_32 tasks — 115 story points_

| ✓ | ID | Platform | Module | Sub-Module | Assignee | Status | Priority | Pts | Start | End | % Done |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [x] | VK-032 | Backend | Agency Reviews | Reviews API |  | Done | High | 4 | 23 Jun | 11 Jul | 100% |
| [ ] | VK-033 | Backend | Notifications | Notifications API |  | To Do | High | 5 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-080 | Backend | Notifications | Agency Notifications API |  | To Do | High | 4 | 23 Jun | 11 Jul | 0% |
| [x] | VK-034 | Backend | Explore | Explore API |  | Done | High | 4 | 23 Jun | 11 Jul | 100% |
| [ ] | VK-035 | Backend | Security | Security & Verification API |  | To Do | High | 4 | 23 Jun | 11 Jul | 0% |
| [x] | VK-036 | Backend | Profile (Traveler) | Profile API |  | Done | Medium | 3 | 23 Jun | 11 Jul | 100% |
| [x] | VK-037 | Backend | Settings (Traveler) | Settings API |  | Done | Medium | 3 | 23 Jun | 11 Jul | 100% |
| [ ] | VK-038 | Backend | Agency Dashboard | Dashboard API |  | To Do | High | 4 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-039 | Backend | Package Mgmt | Package API |  | To Do 🚧 blocked | High | 5 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-040 | Backend | Agency Requests | Requests API |  | To Do | High | 4 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-041 | Backend | Agency Payment | Agency Payment API |  | To Do | High | 4 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-042 | Backend | Agency Marketing | Marketing API |  | To Do | Medium | 3 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-081 | Backend | Agency Admin | Admin & Compliance API |  | To Do | Medium | 4 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-043 | Backend | Profile (Agency) | Agency Profile API |  | To Do | Medium | 3 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-044 | Backend | Settings (Agency) | Agency Settings API |  | To Do | Medium | 3 | 23 Jun | 11 Jul | 0% |
| [x] | VK-045 | Mobile | Agency Reviews | Integration |  | Done | High | 3 | 23 Jun | 11 Jul | 100% |
| [ ] | VK-046 | Mobile | Notifications | Integration (Traveler) |  | To Do | High | 4 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-082 | Mobile | Notifications | Integration (Agency) |  | To Do | High | 3 | 23 Jun | 11 Jul | 0% |
| [x] | VK-047 | Mobile | Explore | Integration |  | Done | High | 4 | 23 Jun | 11 Jul | 100% |
| [ ] | VK-048 | Mobile | Security | Integration |  | To Do | High | 3 | 23 Jun | 11 Jul | 0% |
| [x] | VK-049 | Mobile | Profile (Traveler) | Integration |  | Done | Medium | 3 | 23 Jun | 11 Jul | 100% |
| [x] | VK-050 | Mobile | Settings (Traveler) | Integration |  | Done | Medium | 3 | 23 Jun | 11 Jul | 100% |
| [ ] | VK-051 | Mobile | Agency Dashboard | Integration |  | To Do | High | 4 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-052 | Mobile | Package Mgmt | Integration |  | To Do 🚧 blocked | High | 4 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-053 | Mobile | Agency Requests | Integration |  | To Do | High | 3 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-054 | Mobile | Agency Payment | Integration |  | To Do | High | 3 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-055 | Mobile | Agency Marketing | Integration |  | To Do | Medium | 2 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-083 | Mobile | Agency Admin | Integration |  | To Do | Medium | 3 | 23 Jun | 11 Jul | 0% |
| [ ] | VK-056 | Mobile | Profile (Agency) | Integration |  | To Do | Medium | 3 | 23 Jun | 11 Jul | 0% |
| [~] | VK-057 | QA | QA | Sprint 3 QA |  | Partial | High | 4 | 23 Jun | 11 Jul | 50% |
| [~] | VK-058 | QA | QA | Sprint 3 QA |  | Partial | High | 4 | 23 Jun | 11 Jul | 50% |
| [ ] | VK-059 | QA | QA | Sprint 3 QA |  | To Do | High | 5 | 23 Jun | 11 Jul | 0% |

**Task details:**

- **VK-032** (Backend) — TRD §Agency Ratings & Reviews
  Agency Ratings & Reviews API — traveler can rate agency (1–5 stars) after a completed trip; traveler can write a text review/feedback; reviews visible on agency profile; average rating calculated and displayed; edit or delete review within 7 days; Agency profile shows review list
  _Notes: 7-day edit/delete window; average rating real-time recalculation; review list on agency profile_

- **VK-033** (Backend) — TRD §Notifications (Traveler)
  Notifications API — real-time push notifications (FCM/APNs) for Traveler: new donations on campaigns, campaign shares, agency responses; funding milestone alerts (25%, 50%, 100% funded) with milestone animations/badges; new messages, calls, or shared files in Chat; Like/Comment/Share on social feed posts; notification preferences management per category
  _Notes: Milestone badges shareable (25/50/100%); push via FCM/APNs; notification category enable/disable per user_

- **VK-080** (Backend) — TRD §Notifications (Agency) & Admin & Compliance Tools (Agency)
  Agency Notifications API — real-time push notifications (FCM/APNs) for Agency: alerts for new traveler messages; alerts for new trip requests; alerts for payments received; alerts for new traveler calls or shared files; notification category enable/disable per agency; option to integrate with CRM tools for leads and campaign management
  _Notes: Per TRD Agency Notifications: new messages/trip requests/payments/calls/shared files; CRM integration option per TRD §Admin & Compliance Tools (Agency)_

- **VK-034** (Backend) — TRD §Explore Section
  Explore Section API — discover trending destinations, popular campaigns, and agency offers; filter by location, trip type, and funding progress; geo-map endpoint returning campaigns by geographic location (world map view); sponsored/promoted campaign placement
  _Notes: Geo-map returns campaigns with lat/lng; filter combos: location + trip type + funding %; trending algorithm_

- **VK-035** (Backend) — TRD §Security & Verification
  Security & Verification API — identity verification flow for high-value withdrawals (KYC check); verified campaign badge assignment after admin review; fraud detection hooks for suspicious campaigns; admin flagging and verification status management
  _Notes: KYC for high-value withdrawals; Verified Campaign Badge; admin manual approval flow; fraud flag triggers admin alert_

- **VK-036** (Backend) — TRD §My Profile & Edit Profile (Traveler)
  Traveler My Profile & Edit Profile API — view profile (profile photo, full name, travel preferences, previous trips, status badge, total campaigns created, total trips completed); edit profile (photo, name, bio, travel preferences, previous trips); changes reflect immediately; badge display (Dreamer/Explorer/Jetsetter)
  _Notes: Status badge visible on profile; edit changes immediate; total campaigns + trips counts_

- **VK-037** (Backend) — TRD §Settings (Traveler)
  Traveler Settings API — Account Settings (change password, logout, delete account optional); Wallet & Payments (connect/disconnect payment method, view connected wallet); Privacy Settings (campaign visibility: Public/Invite-only); Notification Settings (donation alerts, campaign updates, agency messages)
  _Notes: Delete account optional; wallet connect/disconnect; privacy toggle; notification category toggles_

- **VK-038** (Backend) — TRD §Dashboard & Analytics (Agency)
  Agency Dashboard & Analytics API — central dashboard data: campaigns count, messages count, user interactions; analytics: requested destinations, user demographics, popular packages, funding trends; top packages by booking requests
  _Notes: Analytics: requested destinations + user demographics + popular packages + funding trends; all per TRD_

- **VK-039** (Backend) — TRD §Package & Itinerary Management
  Agency Package & Itinerary Management API — upload trip packages (prices, visuals, itineraries); tag packages by destination, season, or theme; allow trip customization by users; dynamic package pricing based on fundraising progress
  _Notes: Dynamic pricing tied to campaign fundraising progress; tag filtering; customization options per package_

- **VK-040** (Backend) — TRD §User Requests & Communication
  Agency User Requests & Communication API — receive trip requests from travelers; booking management (create, track, follow-up); smart reply templates for frequent inquiries; request status tracking; share quotes and documents with travelers during consultation
  _Notes: Smart reply templates stored per agency; booking lifecycle: received → in-discussion → confirmed → completed; share quotes/documents per TRD_

- **VK-041** (Backend) — TRD §Payment & Commissions (Agency)
  Agency Payment & Commissions API — receive payments for booked trips; track pending invoices; platform fee/commission deduction from transactions; optional subscription tiers (Basic, Premium, Featured) for agency visibility
  _Notes: Commission deduction logic server-side; invoice tracking; subscription tier feature gating_

- **VK-042** (Backend) — TRD §Promotional & Marketing Tools
  Agency Promotional & Marketing Tools API — promote trips in Explore feed; sponsored placement management; Top-Rated Agency leaderboard monthly feature; influencer collaboration flag
  _Notes: Sponsored placement in Explore feed; monthly Top-Rated leaderboard calculation_

- **VK-081** (Backend) — TRD §Admin & Compliance Tools (Agency)
  Agency Admin & Compliance Tools API — manage staff users under the agency profile (add/remove/manage staff accounts with agency-level access); built-in compliance system to ensure trip authenticity and user safety (trip verification checks, safety flags, compliance status tracking per booking)
  _Notes: Per TRD: staff user management under agency profile; compliance system for trip authenticity and user safety; both requirements explicitly listed in TRD §Admin & Compliance Tools_

- **VK-043** (Backend) — TRD §My Profile & Edit Profile (Agency)
  Agency My Profile & Edit Profile API — view agency profile (agency name, business description, contact details, license & certification status, verification badge, total trips completed); edit profile (logo, business name, description, contact info, upload/update licenses and certificates); changes reflect immediately
  _Notes: Verification badge visible; license status shown; edit reflects immediately_

- **VK-044** (Backend) — TRD §Settings (Agency)
  Agency Settings API — Account Settings (change password, logout); Business Settings (update business documents); Payment & Commission (view commission details, view payment history); Notification Settings (new user requests, messages, payment alerts)
  _Notes: Business document update; commission details view; notification category toggles_

- **VK-045** (Mobile) — TRD §Agency Ratings & Reviews
  [Integration] Agency Ratings & Reviews screens integration — wire post-trip rating flow (1–5 stars + text review), display reviews on agency profile, average rating display, edit/delete review within 7 days; traveler view of own past reviews
  _Notes: 7-day edit/delete window enforced on UI; average rating updated on submit_

- **VK-046** (Mobile) — TRD §Notifications (Traveler)
  [Integration] Traveler Notifications screens integration — connect traveler notification center UI to backend push system; wire donation alerts, campaign share alerts, agency response alerts, milestone notifications (25/50/100% with animations/shareable badges), chat message/call/file notifications, Like/Comment/Share feed notifications; notification preferences screen
  _Notes: Milestone animations on 25/50/100%; shareable milestone badges; all notification categories with enable/disable toggles_

- **VK-082** (Mobile) — TRD §Notifications (Agency)
  [Integration] Agency Notifications screens integration — connect agency notification center UI to backend push system; wire new traveler message alerts, new trip request alerts, payment received alerts, new traveler call or shared file alerts; notification preference screen with category enable/disable; CRM integration option display
  _Notes: Agency-specific notification triggers per TRD; all four alert types; notification category toggles; CRM option per TRD_

- **VK-047** (Mobile) — TRD §Explore Section
  [Integration] Explore Section screens integration — connect Explore UI to backend; display trending destinations, popular campaigns, agency offers; filter by location/trip type/funding progress; geo-map displaying campaigns worldwide
  _Notes: Geo-map with campaign pins; filter combinations; trending section_

- **VK-048** (Mobile) — TRD §Security & Verification
  [Integration] Security & Verification screens integration — wire identity verification flow for high-value withdrawals (KYC steps); display Verified Campaign Badge on verified campaigns; show verification status on campaign cards
  _Notes: KYC steps in withdrawal flow; Verified Badge visible on campaign card and detail screen_

- **VK-049** (Mobile) — TRD §My Profile & Edit Profile (Traveler)
  [Integration] Traveler My Profile & Edit Profile screens integration — wire profile view (photo, name, travel preferences, previous trips, status badge, campaign counts, trips completed), edit profile (photo/name/bio/preferences/past trips), badge display (Dreamer/Explorer/Jetsetter), immediate save & reflect
  _Notes: Badge visible on profile; edit reflects immediately; campaign + trips counts_

- **VK-050** (Mobile) — TRD §Settings (Traveler)
  [Integration] Traveler Settings screens integration — wire Account Settings (change password, logout, optional delete account), Wallet & Payments (connect/disconnect PayPal/Stripe, view connected wallet), Privacy Settings (campaign visibility toggle), Notification Settings (donation/campaign/agency toggles)
  _Notes: All settings categories; wallet connect/disconnect flow; privacy toggle_

- **VK-051** (Mobile) — TRD §Dashboard & Analytics (Agency)
  [Integration] Agency Dashboard & Analytics screens integration — connect Agency Dashboard UI to backend; wire campaign count, message count, interaction stats; analytics view (requested destinations, user demographics, popular packages, funding trends)
  _Notes: Analytics charts; all 4 analytics data points per TRD_

- **VK-052** (Mobile) — TRD §Package & Itinerary Management
  [Integration] Agency Package & Itinerary Management screens integration — wire package upload (prices, visuals, itineraries), tag management (destination/season/theme), user customization options, dynamic pricing display based on fundraising progress
  _Notes: Dynamic pricing updates with campaign funding %; tag-based filter_

- **VK-053** (Mobile) — TRD §User Requests & Communication
  [Integration] Agency User Requests & Communication screens integration — wire incoming request list, booking management (track/follow-up), smart reply templates, request status updates, document/quote sharing with traveler during consultation
  _Notes: Smart reply template selection; booking status lifecycle display; quote/document share from agency per TRD_

- **VK-054** (Mobile) — TRD §Payment & Commissions (Agency)
  [Integration] Agency Payment & Commissions screens integration — wire received payments, pending invoices list, commission deduction display, subscription tier view (Basic/Premium/Featured)
  _Notes: Invoice tracker; commission shown per transaction; tier upgrade CTA_

- **VK-055** (Mobile) — TRD §Promotional & Marketing Tools
  [Integration] Agency Promotional & Marketing Tools screens integration — wire promote trip in Explore feed, sponsored placement status, Top-Rated Agency leaderboard view
  _Notes: Promote button on package cards; sponsored badge display_

- **VK-083** (Mobile) — TRD §Admin & Compliance Tools (Agency)
  [Integration] Agency Admin & Compliance Tools screens integration — wire staff user management UI (add/remove/manage staff accounts with agency-level access); compliance status display per booking (trip authenticity check, safety flags, compliance status)
  _Notes: Staff management UI; compliance status per booking; both per TRD §Admin & Compliance Tools_

- **VK-056** (Mobile) — TRD §My Profile & Settings (Agency)
  [Integration] Agency My Profile, Edit Profile & Settings screens integration — wire agency profile view (name/description/contacts/license status/verification badge/trips), edit profile (logo/name/description/contacts/license upload), agency settings (password change/business docs/commission view/notification toggles)
  _Notes: Verification badge reflects approval status; license upload from mobile; immediate edit reflect_

- **VK-057** (QA) — TRD §Reviews / Notifications / Explore
  [QA-S3] Agency Reviews, Notifications & Explore — test post-trip rating (1-5 stars + text), review on agency profile, average rating, edit/delete within 7 days; traveler push notifications for all triggers (donations, milestones with animations, chat, feed actions); agency push notifications (new messages/requests/payments/calls/shared files); Explore filters (location/trip type/funding %), geo-map campaign pins
  _Notes: 7-day edit window; milestone animation at 25/50/100%; geo-map campaign display; agency notification triggers tested separately_

- **VK-058** (QA) — TRD §Security / Profile / Settings
  [QA-S3] Security, Profile & Settings — test KYC identity verification in withdrawal flow, Verified Campaign Badge display, traveler profile (all fields, badge display, counts), traveler profile edit (photo/name/bio/preferences/past trips), traveler settings (change password/wallet connect-disconnect/privacy toggle/notifications); agency profile, edit profile, and all agency settings
  _Notes: KYC blocks high-value withdrawal if not verified; badge visible; immediate edit reflect_

- **VK-059** (QA) — TRD §Agency Dashboard / Package / Payment / Marketing / Admin & Compliance
  [QA-S3] Agency Backend Features — test agency dashboard metrics (campaigns/messages/interactions), analytics (destinations/demographics/packages/funding trends), package upload (prices/visuals/tags), dynamic pricing, user customization, trip requests lifecycle, booking management, smart reply templates, quote/document sharing, payment received, invoice tracking, commission deduction, subscription tiers, promotional tools (sponsored/leaderboard), staff user management (add/remove), compliance system (trip authenticity/safety flags)
  _Notes: Dynamic pricing tied to campaign funding; commission deduction per transaction; analytics data accuracy; staff management and compliance per TRD_

## Sprint 4 — 26 Sep – 30 Oct — Super Admin Panel (Full), E2E QA, UAT & Bug Fixes

_20 tasks — 89 story points_

| ✓ | ID | Platform | Module | Sub-Module | Assignee | Status | Priority | Pts | Start | End | % Done |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [ ] | VK-060 | Backend | Admin Panel | Admin Auth API |  | To Do | High | 3 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-061 | Backend | Admin Panel | User & Agency Mgmt API |  | To Do | High | 5 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-062 | Backend | Admin Panel | Campaign Oversight API |  | To Do | High | 4 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-063 | Backend | Admin Panel | Payment Mgmt API |  | To Do | High | 5 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-064 | Backend | Admin Panel | Analytics API |  | To Do | High | 4 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-065 | Backend | Admin Panel | Content & Compliance API |  | To Do | High | 4 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-066 | Backend | Admin Panel | Admin Notifications API |  | To Do | High | 3 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-067 | Backend | Admin Panel | Audit Logs API |  | To Do | High | 3 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-068 | Web | Admin Panel | Integration |  | To Do | High | 6 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-069 | Web | Admin Panel | Integration |  | To Do | High | 5 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-070 | Web | Admin Panel | Integration |  | To Do | High | 5 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-071 | Web | Admin Panel | Integration |  | To Do | Medium | 2 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-072 | QA | QA | Sprint 4 QA |  | To Do | High | 5 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-073 | QA | QA | Sprint 4 QA |  | To Do | High | 4 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-074 | QA | QA | E2E QA |  | To Do | High | 7 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-075 | QA | QA | E2E QA |  | To Do | High | 6 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-076 | QA | QA | E2E QA |  | To Do | High | 5 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-077 | QA | QA | UAT |  | To Do | High | 5 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-078 | QA | QA | Bug Fix |  | To Do | High | 6 | 14 Jul | 18 Jul | 0% |
| [ ] | VK-084 | Backend | Agency Admin | CRM Integration API |  | To Do | Low | 2 | 14 Jul | 18 Jul | 0% |

**Task details:**

- **VK-060** (Backend) — TRD §Super Admin (Auth & Security)
  Super Admin — Authentication API: login with email & password, credential validation, JWT issuance, dashboard redirect on success, error on failure; Forgot Password (OTP or reset link, set new password, redirect to login); Two-Factor Authentication (2FA) for admin login
  _Notes: 2FA mandatory per TRD; secure admin JWT; OTP or reset link option_

- **VK-061** (Backend) — TRD §User & Agency Management (Admin)
  Super Admin — User & Agency Management API: view/approve/reject Traveler & Agency registrations; manage user accounts (deactivate/reactivate, edit profile info); assign verified badges for high-trust users or agencies; generate user/agency reports (total users, active campaigns, funding trends)
  _Notes: Deactivate/reactivate accounts; verified badge manual assignment; reports: total users + active campaigns + funding trends_

- **VK-062** (Backend) — TRD §Campaign & Trip Oversight
  Super Admin — Campaign & Trip Oversight API: view all active traveler campaigns; approve or flag campaigns for fraud prevention; monitor trip itineraries linked to campaigns; track high-value transactions and suspicious activity; flag suspicious campaigns
  _Notes: Fraud flag triggers admin alert; high-value transaction monitoring; campaign approval/reject flow_

- **VK-063** (Backend) — TRD §Payment & Transaction Management (Admin)
  Super Admin — Payment & Transaction Management API: view all payments and withdrawals; monitor platform commissions and deduct fees; refund management for cancelled or fraudulent campaigns; generate financial reports (total funds raised, fees collected, withdrawal stats)
  _Notes: Refund processing endpoint; financial report generation; commission monitoring_

- **VK-064** (Backend) — TRD §Analytics & Insights (Admin)
  Super Admin — Analytics & Insights API: platform-wide metrics dashboard (active users, campaigns, trips, top destinations); user demographics, campaign success rates, funding trends; identify top-performing agencies and travelers
  _Notes: Top agencies + travelers ranking; campaign success rate calculation; funding trend graphs_

- **VK-065** (Backend) — TRD §Content & Compliance Management
  Super Admin — Content & Compliance Management API: manage reported content (posts, blogs, photos, campaign media); ensure compliance with KYC, GDPR, and payment regulations; manage platform-wide Terms & Conditions, privacy policies, and notifications; remove inappropriate content
  _Notes: KYC/GDPR compliance hooks; content reporting workflow; T&C/Privacy Policy management from admin_

- **VK-066** (Backend) — TRD §Notifications & Alerts (Admin)
  Super Admin — Notifications & Alerts API: system alerts for unusual activity (high-value withdrawals, flagged campaigns); send targeted notifications to users and agencies (policy updates, announcements); broadcast system-wide notifications
  _Notes: System alerts for suspicious transactions; targeted + broadcast notification delivery_

- **VK-067** (Backend) — TRD §Security & Audit Logs
  Super Admin — Security & Audit Logs API: maintain audit logs for all admin actions (approvals, edits, deletions); two-factor authentication enforcement for admin login; track changes to campaigns, user accounts, and payments
  _Notes: Full audit trail: who approved/deleted/edited; 2FA enforcement; immutable logs_

- **VK-068** (Web) — TRD §Super Admin (Auth / User & Agency / Campaign)
  [Integration] Super Admin Panel — Auth (login/2FA/forgot password), User & Agency Management (approve/reject registrations, deactivate/reactivate, verified badge assignment, user/agency reports), Campaign & Trip Oversight (view/approve/flag campaigns, monitor itineraries, high-value transaction tracking)
  _Notes: 2FA on login; verified badge assignment UI; campaign approval/flag workflow; suspicious activity alert display_

- **VK-069** (Web) — TRD §Admin Payment / Analytics
  [Integration] Super Admin Panel — Payment & Transaction Management (view all payments/withdrawals, commission monitoring, refund processing, financial report generation), Analytics & Insights (platform metrics dashboard, demographics, success rates, funding trends, top agencies/travelers identification)
  _Notes: Refund management UI; downloadable financial reports; analytics charts; top performers list_

- **VK-070** (Web) — TRD §Admin Content / Notifications / Audit
  [Integration] Super Admin Panel — Content & Compliance Management (reported content review/removal, KYC/GDPR compliance tools, T&C/Privacy Policy management), Notifications & Alerts (unusual activity alerts, user/agency targeted notifications, system-wide broadcast), Security & Audit Logs (admin action log view, 2FA settings, change tracking for campaigns/users/payments)
  _Notes: Content moderation queue; compliance checklist; audit log table with filters; broadcast notification sender_

- **VK-071** (Web) — TRD §My Profile & Settings (Admin)
  [Integration] Super Admin — My Profile & Edit Profile (view admin name/email, edit name/password) and Admin Settings (change password, logout, platform system settings, notification preferences for new sign-ups/agency verification requests/reported issues)
  _Notes: Admin profile edit; system settings management; notification alert categories_

- **VK-072** (QA) — TRD §Super Admin Interface
  [QA-S4] Super Admin Panel — test admin auth (login/2FA/forgot password), user & agency management (approve/reject/deactivate/reactivate/badge assignment/reports), campaign oversight (approve/flag/monitor), payment management (view withdrawals/commissions/refunds/financial reports), analytics dashboard (all metrics/demographics/top performers)
  _Notes: 2FA enforcement; deactivate/reactivate flows; refund processing; financial report download; analytics data accuracy_

- **VK-073** (QA) — TRD §Admin Content / Notifications / Audit
  [QA-S4] Admin Content, Compliance, Notifications & Audit — test reported content review/removal, KYC/GDPR compliance tools, T&C/Privacy Policy management, unusual activity alerts, targeted and broadcast notifications, audit log completeness (all admin actions logged), 2FA on all admin sessions, admin profile edit & settings
  _Notes: Audit log: all admin actions recorded; broadcast + targeted notification delivery; compliance tools_

- **VK-074** (QA) — TRD §Full Traveler Scope
  [E2E] Full Traveler Journey — Sign Up (Email/Google/Apple, OTP, T&C) → Profile Setup (photo/preferences/wallet/Dreamer badge) → Login → Create Campaign (goal/destination/dates/story/images/privacy) → Gift Mode contribution → Donor gift contribution history view → Real-time progress bar update → Browse Agency Packages → Auto-suggestion based on funding → Link Package to Campaign → Itinerary Chat/Video with Agency → Social Feed (post/like/comment/share) → Journey Journal blog → Friends Group Fund (create/contribute/manual spend) → Payment Donation → Withdrawal (post goal + KYC) → Explore (filter/geo-map) → Notifications (milestones/chat/feed) → Profile & Settings → iOS & Android
  _Notes: End-to-end traveler journey; donor gift history view included; real-time progress bar; KYC in withdrawal; milestone animations; geo-map; all chat types_

- **VK-075** (QA) — TRD §Full Agency Scope
  [E2E] Full Agency Journey — Agency Sign-Up (OTP/T&C) → Registration & Verification (document upload, Pending status) → Admin Approval → Verified Badge received → Login → Dashboard & Analytics → Upload Package (prices/visuals/itineraries/tags/dynamic pricing) → Receive Traveler Request → Chat/Video Consultation with Traveler (agency-side) → Share quotes/invoices with traveler → Booking Management → Smart Reply Templates → Agency Rating/Review received post-trip → Payment received → Commission deducted → Promote Package in Explore → Top-Rated Leaderboard → Staff User Management → Compliance Status Check → Agency Notifications (messages/requests/payments/calls) → Agency Profile & Settings
  _Notes: Pending → Approved agency lifecycle; Verified Badge; agency-side chat; staff management; compliance; all notification triggers_

- **VK-076** (QA) — TRD §Full Admin Scope
  [E2E] Full Admin Journey — Admin Login (2FA) → Approve Agency Registration → Assign Verified Badge → Monitor Campaigns (approve/flag suspicious) → Track High-Value Withdrawal (KYC check) → Process Refund (cancelled campaign) → Generate Financial Report → View Analytics (top agencies/travelers/funding trends) → Moderate Reported Content (remove inappropriate post) → Send Broadcast Notification → View Audit Log (all actions recorded) → Admin Profile & Settings
  _Notes: 2FA; agency approval flow; KYC enforcement; refund processing; audit log completeness; broadcast notification_

- **VK-077** (QA) — TRD §Full Scope
  [UAT] User Acceptance Testing — complete app UAT with stakeholders covering all 3 platforms (Mobile Traveler App iOS & Android, Mobile Agency App iOS & Android, Super Admin Web Panel); sign-off on full traveler experience (campaign creation, fundraising, itinerary, social feed, chat, payment, group trips, gift contribution history), agency experience (dashboard, packages, requests, agency-side chat, staff management, compliance, payments, notifications), and admin controls (user management, campaign oversight, compliance, analytics); stakeholder sign-off required
  _Notes: Stakeholder sign-off mandatory before production; all 3 platforms covered; agency-side chat and staff management included in UAT scope_

- **VK-078** (QA) — TRD §Full Scope
  [BUG FIX] Critical & High severity issues from UAT & E2E testing — triage, prioritize, fix, and re-test all blocking and major issues across Traveler App, Agency App, and Admin Panel before production release
  _Notes: All Critical bugs must be resolved before release; High severity bugs triaged; regression suite re-run post-fix_

- **VK-084** (Backend) — TRD §Notifications (Agency) & Admin & Compliance Tools (Agency)
  Agency Notifications Backend integration with CRM — implement CRM integration option for agency leads and campaign management; provide webhook/API endpoint or integration hooks for external CRM tools to receive agency lead data and campaign management updates
  _Notes: TRD states 'Option to integrate with CRM tools for leads and campaign management'; low priority but must be represented; integration is optional per TRD_
