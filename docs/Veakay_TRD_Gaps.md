# Veakay — TRD Gap Log

Working notes on gaps, ambiguities, and open questions found while reviewing the TRD section by section. Sections are added as they're reviewed — nothing is filled in until a section is provided.

Each section is checked against: **Roles** (Traveler / Agency / Admin) × **Surfaces** (Mobile App / Backend / Admin Dashboard).

**Pending items:** some gaps found in an earlier section are really just "confirm this once we see the matching section for another role" (e.g. a traveler-only feature that may have an Agency/Admin counterpart later). These are tagged **⏳ Pending — check against §<section>** rather than logged as confirmed gaps. Once that later section is reviewed:
- If it resolves the question (parity confirmed, or explicitly out of scope on purpose) → the pending item is **removed** from this log.
- If the later section confirms it really is missing → it's converted into a normal logged gap under that section.

So this file should only ever contain gaps that are still real as of the last section reviewed — not a growing pile of stale "maybe" flags.

---

## 🔁 Recurring / Cross-Cutting Gaps

Gaps that keep resurfacing across multiple sections, meaning they're foundational rather than section-specific. Tracked here separately so they don't get buried as isolated one-off notes.

- **No campaign/trip/booking lifecycle status model anywhere in the TRD.** First surfaced in §Vacation Campaign Creation, then §Itinerary Builder, §Agency Ratings & Reviews, §Social Feed & Community, §Payment & Withdrawal, §My Profile (Traveler), §Agency Registration & Verification, §User Requests & Communication, §My Profile (Agency), and now §Analytics & Insights (Admin) — where "campaign success rates" is listed as a metric with no definition of what makes a campaign "successful" (fully funded? resulted in a completed trip?). Ten sections deep and still never defined. This has moved from "annoying gap" to **actively blocking the Payment API design** (VK-020) — recommend resolving it before Sprint 2 payment work starts, not patching it section by section.
- **The word "(optional)" is used ambiguously in at least three places with no consistent meaning.** §User Profile Setup ("Previous trips Photos (optional)" — clearly means the user may skip it), §Settings ("Delete account (optional)" — unclear if this means the user optionally uses it, or the *feature* is optional to build), and now §Agency Login ("OTP-based login option (optional)" — same ambiguity: optional for the agency to use, or optional to build at all). Worth a pass to make sure "(optional)" consistently means "user-facing choice," not "feature may be deprioritized," since the two readings have very different implications for scope.
- **Private (invite-only) campaigns are never explicitly excluded from public discovery surfaces.** First flagged in §Social Feed & Community (private campaign activity could leak into the general feed) and now recurring in §Explore Section (does the public geo-map/trending/filter surface also exclude invite-only campaigns, or do they leak there too?). Two public-facing discovery surfaces now share the same unresolved privacy risk — this needs one explicit rule ("invite-only campaigns are excluded from Feed, Explore, geo-map, and search by default") applied consistently, not a per-surface patch.
- **No unified taxonomy for trip/destination categories anywhere in the TRD**, despite at least three sections referencing category-style filters that need one: §User Profile Setup ("travel preferences — destination types, travel style," no enum given), §Explore Section ("trip type" filter, no enum given), and the Agency's "Package & Itinerary Management" (packages tagged by "destination, season, or theme" — a third, differently-shaped taxonomy). If these are meant to be the same underlying category system, it needs to be defined once, centrally, so profile preferences, Explore filters, and package tags can actually match each other; if they're meant to be different systems, that should be explicit too.
- **A user story repeatedly promises something the functionality bullets right next to it don't actually include.** First the traveler's "Bio" field (editable in §Edit Profile, but never collected or displayed anywhere else), then the agency's "manage staff and business settings" user story (§Settings, Agency — no staff category in that Settings breakdown), and now the admin's "view my profile and **role details**" user story (§My Profile, Admin — the profile view only shows name and email, no role field). Three sections now show the same authoring pattern: user stories getting updated without the functionality list above them being kept in sync. Worth a full consistency pass between user stories and functionality bullets across the whole document.
- **Notification Settings toggles lag behind the full set of Notification triggers, confirmed identically across all three roles.** Traveler (§Notifications vs. §Settings), Agency (§Notifications vs. §Settings), and now Admin (§Notifications & Alerts lists "unusual activity — high-value withdrawals, flagged campaigns," but §Settings' Notification Settings only offers "new user sign-ups, new agency verification requests, reported issues" — no toggle for the suspicious-activity alerts at all). This is a clean, systemic pattern across the entire TRD, not three coincidences — worth fixing once with a shared design rule ("every notification trigger gets a settings toggle") rather than patching each role's Settings section individually.
- **"Verification" is used for at least three unrelated concepts with no mapping between them.** §Payment & Withdrawal gates withdrawal on "campaign verification"; §Security & Verification separately describes "identity verification for high-value withdrawals" (KYC on the traveler) *and* a "verified campaign badge" (a donor-facing trust signal on the campaign); the Agency side separately has its own "Verified Agency Badge" (business/license verification). Same word, at least three (arguably four counting the agency one) different mechanisms, no stated relationship between any of them. This needs one clear model: which "verification" gates what, and whether identity verification (KYC) is a precondition for earning the verified campaign badge, or a fully separate process.
- **"User demographics" is referenced as an analytics data point in three separate places with no underlying data ever collected.** First in the Agency's Dashboard & Analytics ("insights into... user demographics"), and now again verbatim in Admin's Analytics & Insights. No demographic field (age, location, gender, etc.) is collected anywhere in the traveler sign-up/profile flow (§User Profile Setup only has photo, travel preferences, previous trips). Either this data needs to be added somewhere with proper consent/privacy handling — a real compliance question, since it would mean traveler data being surfaced to third-party agencies — or "demographics" needs to be redefined as something that's actually collected (e.g. travel-preference distribution).
- **Confirmed by §Content & Compliance Management (Admin) — this is now a settled, real gap, not a pending question.** That section states Admin's moderation scope explicitly and exhaustively: "posts, blogs, photos, or campaign media." **Reviews and chat messages are both confirmed absent from this list.** Given agency-traveler chat is a very plausible place for scams/disputes to actually happen, and reviews directly drive agency reputation/discoverability, this is a real coverage gap that needs an explicit decision — either extend Admin's stated moderation scope to include reviews and chat, or confirm they're deliberately handled some other way (and say what that is).

---

## Section 1: User Interface — Authentication Module (Traveler side)

_Covers: Sign Up, User Profile Setup (at sign-up), Login, Forgot Password_

### Sign Up

- **[Backend]** Password policy unspecified — no min length/complexity rule.
- **[Backend]** OTP mechanics undefined — length, expiry duration, max attempts, resend cooldown, rate limiting. Needed to prevent brute-force/abuse on a payments app.
- **[Backend]** No account-conflict rule: what happens if a user tries Email/Password signup with an email already registered via Google/Apple (or vice versa)? Merge, block, or error?
- **[Backend/Mobile]** Ambiguous whether "OTP verification via email" applies to *all* sign-up methods or only Email/Password — Google/Apple sign-ins typically wouldn't need a separate email OTP step.
- **[Backend]** No minimum age / age-verification requirement, despite this being a payments-and-fundraising app.
- **[Backend/Mobile]** No defined behavior for an interrupted sign-up (OTP verified but Profile Setup abandoned) — is there an "incomplete" account state, and does the app resume the flow on next launch?
- **[Mobile]** No spec for validation/error states (invalid email, weak password, OTP mismatch, OAuth cancel/failure).
- **[Admin]** No sign-up funnel visibility (drop-off, OTP failure rate) in the admin analytics scope defined elsewhere in the TRD.

### User Profile Setup (at Sign-Up)

- **[Backend]** "Travel preferences (destination types, travel style)" has no defined option set/enum in the TRD text itself — the actual selectable values (e.g. Adventure/Luxury/Backpacking/Solo/Family) aren't listed here, so this can't be implemented as-is without a follow-up spec.
- **[Backend]** Badge milestones for Explorer/Jetsetter are named but never defined — no thresholds (number of trips? funds raised? campaigns completed?) are given anywhere. Blocks the badge feature entirely until specified.
- **[Backend]** "PayPal, Stripe, etc." wallet language is now stale given the team's decision to standardize on Stripe — TRD wording should be updated so it doesn't imply PayPal is still in scope. **Confirmed still present verbatim in §Payment & Withdrawal ("Stripe, PayPal, or in-app wallet") — this isn't a one-off phrasing, it's repeated TRD text that needs an actual edit, not just a mental note.**
- **[Backend/Mobile]** Unclear which profile fields are mandatory vs skippable — "previous trip photos" is explicitly optional, but profile photo and travel preferences aren't marked either way.
- **[Backend]** No file size/type/count limits specified for photo uploads.
- **[Backend/Mobile]** No spec for what happens if wallet connection is skipped at sign-up — is the user re-prompted at first campaign creation or first withdrawal attempt?
- **[Admin/Backend]** Ambiguous overlap between two badge concepts: the traveler's Dreamer/Explorer/Jetsetter *status* badge here, vs. the Admin's separately-described ability to "assign verified badges for high-trust users or agencies" elsewhere in the TRD. Same system, or two different badge types? Unclear.

### Login

- **[Backend]** "OTP-based login option" doesn't specify delivery channel. If it's email, fine — but if SMS was intended, there's no phone-number field collected anywhere in Profile Setup to support it.
- **[Backend]** No failed-login lockout / rate-limiting policy.
- **[Backend]** "Secure session handling" is undefined — no token/session expiry duration, refresh mechanism, or multi-device session behavior specified.
- **[Backend/Mobile]** No biometric login (Face ID/Touch ID) mentioned anywhere, despite the TRD's own branding language describing the app as "fintech-inspired" — biometric unlock is a near-standard expectation for that category.
- **[Mobile]** No error-state spec (wrong credentials, unverified account, account not found).
- **[Admin]** No visibility into login anomalies/suspicious-login alerts for traveler or agency accounts — Admin's "Security & Audit Logs" only covers admin actions, not end-user account takeover risk, despite this being a payments platform.

### Forgot Password

- **[Backend]** "Email OTP or reset link" — unclear if these are alternative methods the user picks between, or a two-step sequence.
- **[Backend]** Expiry is only described as "after a defined time" — no actual number given; blocks implementation.
- **[Backend]** No rate-limiting on reset requests (abuse prevention).
- **[Backend]** No "your password was changed" security notification, and no requirement to invalidate other active sessions after a reset — both are standard practice for a payments app and are absent here.

---

## Section 2: Vacation Campaign Creation (Traveler side)

- **[Backend]** No currency field/multi-currency handling specified — "goal amount" has no denomination, despite destinations shown spanning multiple countries/currencies. This is precisely the section where a currency field belongs.
- **[Backend]** No min/max goal amount constraint.
- **[Backend]** No campaign lifecycle/status model defined (Draft / Active / Funded / Expired / Canceled / Completed) — foundational data-model gap; everything downstream (withdrawal, admin oversight, refunds) implicitly depends on some status model existing.
- **[Backend]** No campaign expiration behavior — trip dates are captured, but it's unclear if the fundraising campaign auto-closes when the trip date passes, or can keep collecting after.
- **[Backend]** Overfunding behavior undefined — can donations continue past 100% of goal, and if so what happens to the excess?
- **[Backend]** "Invite-only" privacy has no defined mechanism — link? access code? approval per request? Whitelist of specific friends? This section is exactly where that should be specified.
- **[Backend]** "Gift Mode" is described as auto-recording contributions, but that's already implied for all donations generally (per the later Payment & Withdrawal section) — unclear what's functionally distinct about Gift Mode beyond a UI label/framing for special occasions. If there's no functional difference, worth simplifying; if there is one (e.g. different fund-release rules, a gift message/card), it isn't stated.
- **[Backend]** No rule for what happens to already-collected donations if a campaign is **edited** (e.g. goal amount changed after donations exist) or **deleted** (are donations refunded automatically? Is delete even allowed once funded?). This is a real money-handling gap, not just a data question.
- **[Backend]** No length/format spec for "personal story" (plain text vs rich text, char limit) and no mention of pre-publish content moderation despite Admin having a general content-moderation capability elsewhere.
- **[Backend]** No file count/size/type limits for uploaded images/itineraries/quotes (same recurring gap as profile photos in Section 1).
- **[Mobile]** No validation states specified for the creation form (positive goal amount, future trip dates, required vs optional fields).
- **[Mobile]** Edit flow ambiguity — can destination/dates be changed after donors already contributed based on the original trip details? No trust/notification mechanism for donors if key campaign facts change post-donation.
- **Mostly resolved by §Campaign & Trip Oversight (Admin).** "View **all** active traveler campaigns" reasonably implies invite-only campaigns are included in admin oversight. **§Payment & Transaction Management (Admin) partially addresses the second half:** it confirms "refund management if a campaign is canceled or fraudulent" exists — but that reads as an *admin-initiated* cancellation/fraud action, not the original question of what happens if a *traveler* deletes their own funded campaign voluntarily. That specific scenario (self-delete with existing donations) is still unanswered.

---

## Section 3: Itinerary Builder & Agency Collaboration (Traveler side)

**Resolves part of the Section 2 pending item:** this section confirms a real linking mechanism exists — "Link the chosen package directly to the fundraiser" — separate from the "upload... agency quotes" language in Campaign Creation. But that raises a new, more specific gap instead of fully resolving it:

- **[Backend]** Two different agency-artifact paths are now described across two sections — (1) Campaign Creation's "upload images/itineraries/agency quotes" as a manual file attachment, vs (2) this section's structured "link the chosen package directly to the fundraiser." The TRD never clarifies whether these are the same feature described twice, or genuinely separate paths (e.g. an informal quote uploaded before engaging an agency through the app, vs. a formal package link afterward). If both exist, what happens to an uploaded "quote" once a real package gets linked — does it get replaced/superseded?

**New gaps from this section:**

- **[Backend]** "Link the chosen package to the fundraiser" — is this 1:1 (one package per campaign) or can a traveler request/compare packages from multiple agencies before linking? No multi-agency comparison flow is described, despite "Browse or request trip packages **from agencies**" (plural) implying comparison shopping.
- **[Backend]** No spec for whether the link can be changed or removed later (e.g. traveler changes agency mid-fundraiser).
- **[Backend] Confirmed still unresolved by §Package & Itinerary Management (Agency).** That section confirms "dynamic packages adjust pricing based on fundraising progress" verbatim, but doesn't explain the sync mechanism — does the campaign's goal amount update to match the package's dynamic price, or do they drift independently? Worse: it raises an even bigger question about what a "Package" actually *is* as an entity (see Section 15 below) — this may not be resolvable without first answering that.
- **[Backend]** "Auto-suggestions for affordable trips based on funding progress" has no defined ranking/matching logic — suggest packages ≤ current raised amount? ≤ goal amount? Filtered by the campaign's destination/trip dates? Nothing specifies the actual algorithm inputs.
- **[Backend]** No booking-confirmation state defined — once a package is linked and (presumably) booked with the agency, is full funding required first, or can an agency confirm a booking against a partially-funded campaign with balance due later? This is a real financial-risk gap: money/booking sequencing is undefined.
- **[Backend]** No cancellation/dispute path if the traveler unlinks a package or the agency can't fulfill a linked booking.
- **[Mobile]** No UI spec for side-by-side package comparison (depends on resolving the 1:1-vs-multiple question above).
- **Partially resolved by §User Requests & Communication (Agency).** Confirms "receive requests directly from travelers" — so the basic request flow does reach the agency. Still open: whether a traveler can send an unsolicited request to any agency outside the package-browsing flow, and whether the request carries the campaign's goal/dates/budget context automatically. Multi-agency comparison is still unaddressed.
- **Partially resolved by §Campaign & Trip Oversight (Admin).** Confirms Admin can see itinerary-campaign links ("monitor trip itineraries linked to campaigns"), but that's passive/observational language — no active dispute-resolution or booking-enforcement capability is described. Visibility exists; the resolution mechanism still doesn't.

---

## Section 4: Agency Ratings & Reviews by Traveler

- **[Backend]** "After a completed trip" gates review eligibility — but this is the **third** section now to implicitly depend on a trip/booking status model that's never defined anywhere (see 🔁 Recurring Gaps above). Without a "completed" state, there's no way to actually enforce this rule.
- **[Backend]** No rule on review cardinality — can a traveler review the same agency once per completed trip, or only once ever regardless of how many trips they book with that agency?
- **[Backend]** No backend validation tying a review to a specific completed booking/campaign (i.e. confirming it's a "verified" review) — nothing states the review must reference the underlying trip it came from.
- **[Backend]** No minimum content requirement — can a traveler submit a star rating with no written review at all?
- **[Backend]** After the 7-day edit/delete window closes, is the review permanently locked, or can Admin still remove it later if it's abusive/fraudulent?
- **[Backend]** No spec for what happens to a review if the underlying campaign or the traveler's account is later deleted (orphaned review risk).
- **[Backend/Product]** No agency right-of-reply/response mechanism to a review — this is the traveler side of a gap already suspected on the Agency side too (flagged generally in earlier full-doc review); confirm once §Reviews & Ratings (Agency) is given.
- **[Mobile]** No spec for sorting/filtering reviews on the agency profile (recent, highest/lowest, verified-only).
- **[Mobile]** No mention of an automatic post-trip prompt nudging the traveler to leave a review. **Confirmed real gap** — §Notifications (Traveler) lists its full set of triggers (donations, shares, agency responses, milestones, chat, Like/Comment/Share) and none of them is a post-trip review nudge. This isn't a cross-reference omission, it's genuinely missing.
- **⏳ Pending — check against §Content & Compliance Management (Admin).** General content moderation is described elsewhere for "posts, blogs, photos, campaign media" — reviews aren't explicitly listed. Confirm reviews are in scope for moderation/removal once that section is reviewed.
- **Confirmed by §Reviews & Ratings (Agency).** That section is just two bullets ("agencies receive post-trip ratings and reviews," "reputation system improves discoverability") with no reply/response mechanism at all. There is definitively no agency right-of-reply anywhere in the TRD — see Section 20 for the fuller implication.

---

## Section 5: Social Feed & Community

- **[Backend] 🔴 Privacy leak risk.** No statement excludes **invite-only (private)** campaigns from appearing in the public feed. "Feed displays campaigns, trip progress, and travel memories" for the general traveler community — if a private campaign's activity surfaces here by default, that defeats the purpose of the "invite-only" privacy setting from §Vacation Campaign Creation. This needs an explicit rule, not an assumption.
- **[Backend]** Ambiguous split between "posts" and "campaigns" as interaction targets — the functionality list says travelers can create/edit/delete "posts," but "like, comment, and share" is scoped specifically to "campaigns." Can a regular post (not a campaign) be liked/commented/shared at all, or is engagement limited to campaign-type content only?
- **[Backend]** No rule for editing/deleting a traveler's own **comments** (only posts are explicitly covered).
- **[Backend]** "Share" has no defined target — internal re-share to followers/own feed, or external share via OS share sheet (WhatsApp, Instagram, etc.)? Materially different to build.
- **[Backend]** "Follow other travelers" — no spec on whether following is open (anyone can follow anyone) or request/approval-based, and no tie-in to any profile-privacy setting (only campaign visibility — Public/Invite-only — is defined elsewhere; profile/follow privacy is a separate, unaddressed dimension).
- **[Backend]** "Join interest groups" is introduced with no supporting spec at all: who creates groups (travelers or Admin-only)? Is there a discovery/browse mechanism? Membership limits? Moderation?
- **[Backend]** "Journey Journal" gated on "completed trips" — ties to the 🔁 recurring lifecycle-status gap above.
- **[Backend]** No content/format spec for posts (text length, image/video support, count limits) — recurring pattern from earlier sections.
- **[Backend]** No spec for what happens to like/comment counts or notifies commenters if a post is deleted.
- **[Product]** Terminology collision worth flagging explicitly: the TRD now uses "**group**" for three distinct concepts — "interest groups" (social, this section), "group travel funds" (§Friends & Group Trips), and "group chat" (§Chat Module). Worth confirming these are intentionally separate and cross-referencing them correctly in the backend data model, since the overlap in naming could cause real confusion during implementation.
- **[Backend]** Feed vs. Explore overlap — both surface "campaigns," but nothing distinguishes what's unique to each (Feed = social/followed people? Explore = discovery/trending?). No shared ranking logic is defined for either.
- **⏳ Pending — check against §Content & Compliance Management (Admin).** Admin moderation elsewhere is described as covering "posts, blogs, photos, or campaign media" — this actually looks like it *does* name-match this section's content types (unlike Reviews in Section 4, which weren't explicitly named). Likely resolves cleanly; confirm once that section is given.
- **Mostly resolved by §Explore Section:** Feed (social graph — followed travelers, friends' campaigns/memories) and Explore (public discovery — trending, agency offers, geo-map) do describe genuinely different purposes, so the overlap isn't a real conflict. What's still open: whether the same campaign can legitimately appear in both (almost certainly yes/expected), and the ranking-algorithm gap remains unresolved for *both* surfaces independently (see Section 9).
- **⏳ Pending — check against §Chat Module.** §Friends & Group Trips (reviewed next) confirms "shared chat and planning tools for groups" belongs to *group travel funds*, not "interest groups" — so the two are at least contextually distinct. Still unconfirmed whether "interest groups" gets its own group chat, or has no messaging at all.

---

## Section 6: Payment & Withdrawal (Traveler side)

**Resolves/confirms Section 2's pending item:** this section doesn't define currency handling, and it repeats "campaign verification" as a withdrawal gate without defining it — so that pending item converts into concrete gaps below rather than resolving cleanly.

- **[Backend] 🔴 Confirmed TRD text issue.** "Secure fund collection via **Stripe, PayPal**, or in-app wallet" — this is the literal functionality bullet, not just inferred wording, and it directly contradicts the team's decision to standardize on Stripe. This line needs an actual edit in the TRD, not just a mental note during implementation.
- **[Backend]** "In-app wallet" is mentioned with zero elaboration — is this a real internal ledger (Veakay holds traveler balances before payout, its own money-movement system) or just loose phrasing for "your connected Stripe account"? These are wildly different in scope and risk; a true in-app wallet is a significant undertaking on its own (balance tracking, wallet-to-bank payout, associated compliance) that isn't specified anywhere else. *(§Settings later phrases this as "Connect/disconnect payment method" + "View connected wallet," which leans toward "wallet" just meaning the linked Stripe account rather than an internal ledger — but it's still not stated explicitly.)*
- **[Backend]** "Withdraw funds after campaign verification and goal completion" — **still ties to the 🔁 recurring lifecycle-status gap**, but now at its most consequential: this literally gates money movement, and it's undefined.
- **[Backend]** "Campaign verification" itself is undefined — is this the same thing as the KYC/identity check mentioned in §Security & Verification, or a separate admin review step? Textually these read like the same concept described twice with different words.
- **[Backend]** No partial-withdrawal support — "goal completion" implies all-or-nothing; no mechanism for withdrawing early or in installments (e.g. a deposit before full funding) is described.
- **[Backend]** No withdrawal mechanics defined at all: payout method (bank transfer via Stripe Connect payout?), who absorbs payout/currency-conversion fees, minimum withdrawal amount, or whether multiple withdrawals are allowed if a campaign keeps collecting after goal is met (ties to the still-unresolved overfunding question from §Vacation Campaign Creation).
- **[Backend]** No anonymous-donation option — "Track donations and see top contributors" implies all donors are named/ranked by default, with no opt-out. This matters specifically for Gift Mode (§Vacation Campaign Creation), where a surprise/anonymous gift seems like a natural use case the current spec doesn't support.
- **[Backend]** No refund-to-donor mechanism defined here either — this is precisely the section where it belongs, and it's still missing (same root gap flagged generally in earlier full-doc review, now confirmed absent at its most specific, relevant location).
- **[Backend]** No donor receipt/confirmation spec (email receipt, tax documentation) for donations made.
- **[Backend]** No cross-border currency handling — what currency does a donor pay in vs. what currency does the traveler withdraw in? Same underlying concern as the Stripe Connect country-coverage question raised earlier for agencies, now applying to travelers too.
- **[Mobile]** No UI spec for the withdrawal request flow or status (pending/processing/complete).
- **Deepened, not resolved, by §Security & Verification.** That section turns out to describe *two* distinct concepts — "identity verification for high-value withdrawals" (KYC on the traveler) and a separate "verified campaign badge" (a trust signal on the campaign itself). Neither is explicitly tied back to the "campaign verification" wording used here as a withdrawal gate. There are now **three** differently-named verification concepts across two sections with no stated mapping between them — see updated 🔁 Recurring Gaps entry.
- **⏳ Pending — check against §Payment & Transaction Management (Admin).** Confirm whether every withdrawal requires manual Admin approval, or only ones flagged as high-value — not stated here, and materially affects both the mobile withdrawal UX and the backend workflow.

---

## Section 7: Friends & Group Trips

- **[Backend] 🟠 Possible hidden feature.** The final user story — "I want the group fund progress to update based on manual inputs, so we know the total **Spend** from contributions" — conflates two different things: money coming **in** (contributions/donations) and money going **out** (spend/expenses). This reads like it may be describing a lightweight expense-splitting feature (tracking what the group has actually spent from the pooled fund, Splitwise-style) layered on top of fundraising — which, if real, is an entirely unspecified sub-feature with no data model, UI, or dispute-handling described anywhere. Worth confirming with the client whether "Spend" tracking is an intentional feature or just loose wording for "contributions."
- **[Backend]** Tension between the two tracking mechanisms in this section: donations made **through the app** are "automatically recorded," while "group members can manually enter their contributions/spend amounts" for anything outside that (cash, other apps, etc.). No reconciliation logic is defined — does the group fund's progress bar combine both numbers into one total? Can manually-entered amounts be disputed, edited by others, or verified at all? A member could trivially fabricate a manual entry.
- **[Backend]** "Add friends" has no defined relationship model — is this a mutual friend-request/accept flow, or a one-way "follow" like in §Social Feed? These may be two entirely separate relationship systems (friend vs. follower) with no stated connection between them.
- **[Backend]** "View their campaigns" — does friendship automatically grant visibility into a friend's **invite-only** campaign, or is that still a separate explicit invite regardless of friend status? The relationship between "being friends" and "being invited to a private campaign" is undefined.
- **[Backend]** "Create group travel funds" — no data-model relationship stated to the individual Vacation Campaign entity from §Vacation Campaign Creation. Is a group fund the same Campaign entity with multiple contributors, or a structurally different entity? Does it have its own goal amount, privacy setting, images, etc., and does it appear in Explore/Feed the same way individual campaigns do?
- **[Backend]** No ownership/permission model for a group fund — who can edit or delete it (creator only, or any member)? What happens if the creator leaves the group?
- **[Backend]** No spec for leaving/removing a group member, or what happens to their recorded contributions if they leave.
- **[Backend]** No withdrawal model for group funds — §Payment & Withdrawal only describes a single traveler withdrawing from their own campaign; nothing addresses who withdraws pooled group funds, or how they're distributed/authorized among multiple contributing members.
- **[Mobile]** No UI spec for group membership management (inviting friends into a fund, removing members) or for distinguishing auto-recorded vs. manually-entered amounts in the contribution view.
- **Reasonably resolved by §Campaign & Trip Oversight (Admin).** "View all active traveler campaigns" / "approve or flag campaigns for fraud prevention" is broad enough to plausibly include group funds if they're the same underlying entity — but that entity relationship itself is still the open question from this section, not a new one.
- **⏳ Pending — check against §Chat Module.** Confirm the "shared chat... for groups" here is literally the same group-chat feature described in the Chat Module, not a separate implementation.

---

## Section 8: Notifications (Traveler side)

- **[Backend] 🟠 Internal inconsistency within this section.** The functionality bullets list triggers as "donations, shares, and agency responses" (plus milestones) — but the user stories separately request "notifications for Like Comment Share" and "notifications for new messages, calls, or shared files." **Like** and **Comment** aren't in the functionality list at all, despite being explicitly requested in the user story right below it. Looks like the user stories were updated without updating the functionality bullets to match.
- **[Backend]** Milestone celebration scope is ambiguous — do only the **campaign owner** get the 25/50/100% celebration, or do **donors** who contributed to that campaign also get notified/celebrated when it hits a milestone? The user story just says "I want milestone badges to celebrate achievements" without specifying whose achievement.
- **[Backend]** "Shareable badges" has the same unresolved "share to where" ambiguity flagged in §Social Feed (internal re-share vs. external OS share sheet).
- **[Backend]** "Agency responses" as a notification trigger may be redundant with the separately-listed "new messages... from Chat" trigger — unclear if this refers to something distinct (e.g. "agency accepted your package request") or is just double-counting chat messages.
- **[Backend]** No notification history/inbox mentioned — are notifications push-only and ephemeral, or is there an in-app notification center to review past ones?
- **[Backend]** No email-channel notifications mentioned for financial events (donations, milestones) — only push is implied. This connects to the still-open donor-receipt gap from §Payment & Withdrawal; email is the more natural channel for a receipt-style notification and isn't covered here either.
- **Confirmed by §Settings (Traveler).** Settings only offers three notification toggle categories — donation alerts, campaign updates, agency messages. None of them map to milestone celebrations, chat (messages/calls/shared files), or Like/Comment/Share notifications from this section. Real gap: most of the notification triggers described here have no corresponding preference toggle.

---

## Section 9: Explore Section

**Mostly resolves the Section 5 Feed-vs-Explore pending item** (see updated note there) — but introduces its own gaps:

- **[Backend]** No definition of what makes something "trending" or "popular" (recency? donation velocity? view/like count? manual admin curation?) — same class of gap as Feed's undefined ranking logic, now confirmed on this surface too.
- **[Backend]** "Agency offers" introduces a **third** content type into a discovery surface (alongside Campaigns and, implicitly, geo-located pins) — this ties Explore directly to the Agency's Package entity, not just Campaigns. No spec for how campaigns and agency packages are unified or separated in the UI (mixed feed? separate tabs?).
- **[Backend]** "Filter by... trip type" has no defined category list — this is the **second** occurrence of an undefined taxonomy (see updated 🔁 Recurring Gaps above, now tracking this across Profile preferences, this filter, and Agency package tags).
- **[Backend] 🔴 Privacy leak risk — recurs from §Social Feed.** Same open question: are invite-only campaigns excluded from the public geo-map and Explore filters, or do they leak here too? Now a second surface with the identical unresolved risk (see updated 🔁 Recurring Gaps above).
- **Partially resolved by §Promotional & Marketing Tools (Agency).** Confirms sponsored placement does appear in Explore ("promote trips in the Explore feed... sponsored placements"), but still doesn't say whether it's Admin-curated, automatic by subscription tier, or how/whether it's visually distinguished from organic "trending" content to the traveler — see new gap in Section 19 below (this has real disclosure/compliance implications, not just a UI nicety).
- **[Mobile]** No UI spec for combining multiple filters simultaneously (location + trip type + funding progress), or for switching between list and geo-map views.
- **Not resolved by §Campaign & Trip Oversight (Admin).** That section is scoped to campaign approval/flagging for fraud, with no mention of Explore/"trending" curation at all — this remains a real, standalone gap: no stated mechanism to exclude a fraud-flagged campaign from trending/discovery surfaces while it's under review.

---

## Section 10: Security & Verification (Traveler side)

**Was supposed to resolve a Section 6 pending item — instead it deepens it** (see updated note there and the new 🔁 Recurring Gaps entry on "verification" terminology collision).

- **[Backend]** High-value withdrawal threshold is **still** not given a number, even in the section that should be defining it.
- **[Backend]** No spec for what identity verification actually involves (government ID + selfie match, phone/email re-verification, something else), whether it's a one-time check or re-triggers every time a withdrawal crosses the threshold, or what accepted document types are (relevant given the app's international user base — accepted ID types vary significantly by country).
- **[Backend]** "Verified campaign badge" has no defined criteria or process — is it automatic once the traveler completes identity verification, a separate Admin manual review, or its own application flow? This is the section that should define it, and doesn't.
- **[Backend]** Unclear whether "verified" is a **traveler-level** attribute (once verified, all their campaigns show the badge) or a **campaign-level** attribute (each campaign evaluated independently, so a verified traveler could still have an individual campaign unverified). Structurally important for the data model.
- **[Backend]** No spec for re-verification/expiry of identity checks, or what happens if verification is rejected — is the traveler blocked from creating/running a campaign, or just denied the badge?
- **[Mobile]** No UI spec for the verification flow itself (document upload, selfie capture, pending/rejected states) or for how the verified badge displays on a campaign card.
- **Confirmed by §User & Agency Management (Admin).** Admin's badge power is explicitly scoped to "high-trust **users or agencies**" — campaigns aren't mentioned. This means the "verified campaign badge" from this section is a genuinely separate, still entirely unspecified process — not the same mechanism as Admin's user/agency badge assignment.

---

## Section 11: My Profile & Edit Profile (Traveler side)

- **[Backend] 🟠 Field appears out of nowhere.** Edit Profile lets the user edit a **"Bio"** field — but Bio was never established anywhere else: not collected at Sign-Up/Profile Setup (§User Profile Setup only has photo, travel preferences, previous trip photos), and not shown on the View Profile screen itself (which lists photo, full name, travel preferences, previous trips, badge, and two counters — no bio). It's editable but has no source and no display location. Needs either adding to View Profile and Sign-Up, or removing if it was leftover from an earlier draft.
- **[Backend]** "Previous trips" appears in both View and Edit, but it's unclear if this is just the same photo-upload gallery from Sign-Up (§User Profile Setup said "Previous trips **Photos** (optional)"), or an actual structured list of completed trips. This matters because "Total trips completed" (shown on the same profile) implies verified, structured trip records — if "Previous trips" is just a manually-uploaded photo gallery independent of actual completed campaigns/bookings, then "Total trips completed" may be counting something the user can't actually verify or dispute, or worse, counting something entirely different from what's displayed as "previous trips." Ties to the still-unresolved 🔁 lifecycle-status gap.
- **[Backend]** No profile-visibility/privacy spec — can any app user view another traveler's full profile (previous trips, campaign counts, etc.), or is it restricted to friends/followers? This is the natural place this should be answered and isn't — connects to the same open question from §Friends & Group Trips (does "friend" status gate visibility of anything) and §Social Feed (does "follow" gate visibility of anything).
- **[Backend]** No character/format limit for the new Bio field, and no file constraints for profile photo edits (recurring pattern from earlier sections).
- **[Backend/Mobile]** "Changes reflect immediately" — unclear if this means immediate on the profile screen only, or propagates to cached displays elsewhere in the app (e.g. the traveler's name/photo shown on their own campaign cards, past posts, past reviews).
- **Not resolved by §Settings (Traveler).** Bio doesn't appear there either — it remains a field with no defined origin or display location anywhere in the TRD.

---

## Section 12: Settings (Traveler side)

- **[Backend] 🔴 GDPR-relevant gap.** "Delete account (**optional**)" is ambiguous — does "optional" mean the deletion *feature itself* is optional/deprioritized for build, or just that the user optionally chooses to use it (normal UX phrasing)? If the former, that's a real compliance risk given GDPR's "right to be forgotten" was already flagged as a requirement elsewhere in the TRD with no defined scope. Either way, there's no spec for what deletion actually does: hard delete vs. anonymization, and what happens to the user's campaigns/donations/posts/reviews/chat history afterward (deleted, orphaned, archived, reassigned?).
- **[Backend]** "Change password" doesn't specify whether the current password must be re-entered first.
- **[Backend]** "Logout" doesn't specify single-device vs. "log out of all devices" — relevant given the earlier-flagged missing multi-device session model from §Login.
- **[Backend]** No spec for what happens if a traveler **disconnects** their payment method while they have an active campaign with pending donations or an in-progress withdrawal — a real money-handling edge case, not just a UX one.
- **[Backend]** Notification Settings only cover 3 categories total, confirmed missing coverage for milestones, chat, and Like/Comment/Share (see resolved Section 8 note above) — also no channel-level control (push vs. email) even where a channel exists.
- **[Backend]** No re-access to Terms & Conditions / Privacy Policy from Settings after initial acceptance at sign-up — a common expectation not addressed.
- **[Backend]** No language/region or currency preference here either — this is the natural home for such a setting, and it's absent (ties to the still-open currency gap from §Vacation Campaign Creation and §Payment & Withdrawal).
- **[Mobile]** No confirmation-dialog spec for destructive actions (account deletion, wallet disconnect).
- **Still genuinely ambiguous after §Security & Audit Logs (Admin).** That section is framed as "audit logs for all **admin** actions" — but one bullet ("track changes to campaigns, user accounts, and payments") is broad enough to arguably include user-initiated changes too. The framing leans toward admin-actions-only, but it's not a clean resolution either way — see Section 29 for the more pressing retention/immutability gaps this section raises regardless.

---

## Section 13: Travel Agency Interface — Authentication Module (Sign Up, Registration & Verification, Login, Forgot Password)

**Resolves the Section 1 pending item:** confirmed — Agency Sign-Up is Email & Password only, no Google/Apple. Reads as an intentional B2B-vs-B2C choice, not a doc gap. *(Item removed from Section 1 above.)*

- **[Backend]** No rejection flow described for Agency Registration & Verification. The TRD only walks through Pending → Approved; Admin's own capability is described elsewhere as "approve **or reject**," but this section never describes what the agency experiences on rejection — can they edit and resubmit documents, or is it a dead end? No rejection reason/feedback mechanism either.
- **[Backend]** No SLA/turnaround time for Admin's verification review — an agency could sit in "Pending Verification" indefinitely with no stated expectation of how long that takes.
- **[Backend]** "Agency reputation score (based on ratings & successful trips)" has no defined formula — is it a weighted average of star ratings, volume-adjusted, combined with trip count how exactly? Also depends on the still-undefined "successful/completed trip" concept (see updated 🔁 Recurring Gaps — now a 7th occurrence).
- **[Backend]** No country/eligibility check at registration time — given the earlier-flagged concern about Stripe Connect payout coverage varying by country, should agency sign-up validate or warn about operating-country eligibility before a business goes through the full document-verification process, only to discover later they can't actually receive payouts?
- **[Backend]** No file format/size limits for uploaded business licenses/certifications/legal documents (recurring pattern).
- **[Mobile]** No UI spec for what an agency can access while in "Pending Verification" status — fully locked out of the app, or allowed to browse/set up profile while awaiting approval?
- **[Mobile]** No UI spec for the document upload flow itself, or for displaying a rejection with next steps.
- **Confirmed by §User & Agency Management (Admin).** "View, approve, or reject" is the full extent of the description — no structured rejection reason, checklist, or feedback mechanism to relay back to the agency. This is a real gap, not just a missing cross-reference.

---

## Section 14: Dashboard & Analytics (Agency side)

- **[Backend] 🔴 Possible conflicting requirement.** "Central dashboard to manage **campaigns**, messages, and user interactions" — but §Vacation Campaign Creation establishes campaigns as exclusively traveler-owned (traveler creates/edits/deletes their own campaign; no agency editing rights are mentioned there). Does "manage campaigns" here actually mean the agency can view/edit traveler campaigns they're linked to, or is this a wording slip that should say "manage **packages**"? If agencies really can manage campaigns, that directly conflicts with the ownership model established on the traveler side and needs an explicit permissions rule (what exactly can an agency change on a linked campaign, if anything).
- **[Backend] 🔴 Privacy/data gap.** "Analytics: ... **user demographics** ..." — no demographic data (age, location, gender, etc.) is collected anywhere in the traveler-side profile or sign-up flow (§User Profile Setup only collects photo, travel preferences, previous trips). Either demographic data collection needs to be added somewhere (with corresponding consent/privacy handling — a real compliance question, since travelers would need to know this data is shared with third-party agencies), or "user demographics" needs to be redefined as something that's actually collected (e.g. travel-preference distribution).
- **[Backend]** No time-range spec for any of the analytics (last 7/30/90 days, all-time, custom range).
- **[Backend]** No computation window for "funding trends" (daily/weekly/monthly granularity).
- **[Mobile]** No spec for report format (charts vs. tables) or export/download capability.
- **Confirmed still unresolved by §Analytics & Insights (Admin) — now a 3rd occurrence.** "User demographics" reappears verbatim at the platform-wide admin level, with the same zero underlying data collection. This has moved from a one-off gap to a systemic pattern — see updated 🔁 Recurring Gaps entry.

---

## Section 15: Package & Itinerary Management (Agency side)

- **[Backend] 🔴 Fundamental data-model tension.** This is the most significant finding so far: it's unclear whether a "Package" is meant to be a **reusable catalog listing** (like an Airbnb listing — one package, many different travelers can browse and link it to their own campaigns) or a **single offer tied to one specific campaign** (created in response to one traveler's request, consumed once it's linked). The wording here ("upload trip packages," reusable, taggable, browsable) sounds like a catalog; but "dynamic pricing **based on fundraising progress**" only makes sense if a package is tied to exactly one campaign's funding — a shared catalog package can't have a single price driven by one specific campaign's progress if many different campaigns could link to it. This needs to be resolved before the Package data model can be built at all, since it determines a basic one-to-one vs. one-to-many relationship between Campaign and Package.
- **[Backend]** No pricing currency specified for packages — third location (after Campaign goal amount and Payment/Withdrawal) where this should be defined and isn't.
- **[Backend]** "Allow trip customization by users" has no spec for what's customizable (dates, add-ons, itinerary stops) or how customization interacts with dynamic pricing — two different price-modifying mechanisms with no stated precedence.
- **[Backend]** No package availability/status model (sold out, inactive, archived) and no versioning — if an agency edits a package after a traveler has linked it, does the traveler's view stay frozen at the original terms or update live? Same root issue as the reusable-vs-single-offer question above.
- **[Backend]** No file/media limits for "visuals" (recurring pattern).
- **Not resolved by §Campaign & Trip Oversight (Admin).** That section is scoped to traveler campaigns specifically ("view all active traveler campaigns"); packages aren't mentioned. Whether Agency packages get any pre-publish review remains unaddressed — still pending against §Admin & Compliance Tools (Agency), which also didn't cover it.

---

## Section 16: Chat Module (Agency side)

**Resolves the Section 3 pending item:** confirmed — this matches the traveler-side description of agency chat/video consultation exactly. Same feature, no conflict. *(Item removed from Section 3 above.)*

- **[Backend] 🟠 A third path for "agency quotes" now appears.** "Document/Media Sharing: Share itineraries, **quotes**, invoices..." — this is now the *third* distinct way a quote/itinerary can enter the system: (1) manually uploaded to a campaign (§Vacation Campaign Creation), (2) a structured package link (§Itinerary Builder), and (3) shared as a chat attachment (here). None of these are tied together — if an agency shares a quote via chat, does it also attach to the campaign automatically, or does the traveler have to separately re-upload it if they want it visible on their campaign page? This deepens rather than resolves the ambiguity first flagged in Section 3.
- **[Backend]** No spec for multi-staff access to the same conversation. **Checked against §Admin & Compliance Tools (Agency) — still unresolved:** that section confirms staff accounts exist ("manage staff users under the agency profile") but doesn't address conversation routing/assignment or shared-inbox behavior at all. See Section 22 for the deeper architectural question this raises.
- **[Backend]** No business-hours/availability indicator or response-time expectation (SLA) for agency replies.
- **[Backend]** No call-recording/logging spec for audio/video consultations — relevant given the still-unresolved dispute-resolution gap from §Itinerary Builder (a recorded consultation could matter if a traveler and agency later disagree about what was promised).
- **[Mobile]** No spec for incoming-call handling while the agency app is backgrounded (push-triggered call UI).
- **⏳ Pending — check against §Content & Compliance Management (Admin).** See updated 🔁 Recurring Gaps entry on Admin's moderation scope — confirm whether chat content is covered at all.

---

## Section 17: User Requests & Communication (Agency side)

**Partially resolves the Section 3 pending item** (see updated note there — basic request flow confirmed, multi-agency comparison still open).

- **[Backend] 🟠 Possible redundant/overlapping section.** "Chat to discuss trips, share quotes, and documents" here is nearly a verbatim restatement of §Chat Module (Agency side), which already covers 1:1 chat and document/quote sharing. Is "User Requests & Communication" a genuinely separate feature (e.g. a booking/request-management inbox layered on top of the same chat threads), or is this section redundantly re-describing the Chat Module under a different heading? Unlike the Feed-vs-Explore overlap (which turned out to have clearly distinct purposes), this one reads almost identically to Section 16 — worth a direct clarifying question rather than an inferred resolution.
- **[Backend]** "Booking management and follow-up system" names an entire booking-lifecycle feature with no defined states — see updated 🔁 Recurring Gaps (8th occurrence).
- **[Backend]** "Smart reply templates" — no spec for whether agencies write their own custom templates, use platform-provided defaults, or both; no limit on template count.
- **[Backend]** Unclear whether "receive requests directly from travelers" only happens through the package-browsing/request flow (§Itinerary Builder), or whether a traveler can also send an unsolicited request straight to an agency with no prior package interaction.
- **Partially resolved by §Payment & Commissions (Agency).** Confirms invoices exist as a concept ("track pending invoices"), but doesn't explain when/how an invoice is generated or what triggers "pending" vs. "settled" — still tied to the same undefined booking-status model.

---

## Section 18: Payment & Commissions (Agency side)

- **[Backend]** Commission percentage is still not given a number, even in the section that should define it.
- **[Backend] 🟠 New angle on the clawback/refund gap.** This section only covers money going *out* to agencies, and doesn't say what happens if that money needs to come back — if a traveler disputes a charge, or a trip is canceled after the agency has already been paid, is there a clawback mechanism? Prior refund gaps focused on refunding the *donor*; this is the mirror question on the agency-payout side, and it's untouched here too.
- **[Backend]** No payment-timing spec — does the agency get paid on booking confirmation (before the trip happens), on trip completion, or in installments? This is the agency-receiving side of the still-open traveler-side funding/booking-sequencing question from §Itinerary Builder.
- **[Backend]** Subscription tiers (Basic/Premium/Featured) still have no pricing or feature differentiation, confirmed absent in the section that should define it. *(Note: "optional" here reads clearly as "agencies may choose to subscribe" — unlike the more ambiguous instances of that word elsewhere, this one isn't itself concerning.)*
- **[Backend]** No spec for what happens if an agency disconnects/changes their connected payout account while invoices are pending — mirrors the same traveler-side gap already flagged in §Settings.
- **⏳ Pending — check against §Payment & Transaction Management (Admin).** Confirm whether Admin's refund-management capability there is the mechanism for clawing back agency payments, or whether that's a separate, unaddressed process.

---

## Section 19: Promotional & Marketing Tools (Agency side)

**Partially resolves the Section 9 pending item** (see updated note there).

- **[Backend] 🟠 Compliance-adjacent gap.** No disclosure/labeling requirement for "sponsored placements" — if paid/promoted content is blended into Explore's organic "trending" list with no visible distinction (e.g. a "Sponsored" tag), that's a real consumer-trust and, in some jurisdictions, a legal disclosure issue for paid content mixed with organic recommendations — not just a cosmetic UI question.
- **[Backend] 🟠 Completely unscoped feature.** "Influencer collaborations" is dropped in with zero functional definition — no spec for what this actually means as a system feature (referral/affiliate links? unique tracking codes? revenue-sharing with influencers? or is it purely an off-platform business arrangement with no in-app mechanism at all?). This needs a real answer before it can be estimated or built, similar to the earlier-flagged "Spend" ambiguity in §Friends & Group Trips.
- **[Backend]** No spec for how "promote trips in the Explore feed" is purchased/activated — automatically granted by subscription tier, a separate pay-per-promotion transaction, or Admin-granted? If it's a paid transaction, that's an entirely separate revenue stream not covered anywhere in §Payment & Commissions (Agency) — the payment model as currently specified only covers commission on bookings, not promotion fees.
- **[Backend]** "Top-Rated Agency leaderboard" ranking metric is unspecified — likely the same reputation score from §Agency Registration & Verification, but not explicitly stated as the same mechanism.
- **[Mobile]** No UI spec for visually distinguishing sponsored/promoted content from organic content in Explore.
- **Not resolved by §Campaign & Trip Oversight (Admin).** No interaction with sponsored placements or Explore curation is mentioned there — this collapses into the same standalone gap noted in Section 9 above (no stated mechanism to keep a fraud-flagged campaign out of paid/trending placement).

---

## Section 20: Reviews & Ratings (Agency side)

This is the thinnest section reviewed so far — two bullets, no functional breakdown — and mostly just restates what §Agency Ratings & Reviews (traveler side) already established. What it confirms and adds:

- **[Backend] 🔴 Confirmed: no agency right-of-reply, and no dispute/fraud-appeal mechanism at all.** Given reviews directly feed into "reputation score," the "Top-Rated Agency leaderboard" (§Promotional & Marketing Tools), and general "discoverability," a single false or unfair review has real, stated business consequences for an agency — yet there's no way for an agency to publicly respond, and no way to flag/dispute a fraudulent review (e.g. a competitor posing as a traveler, or a review for a trip that never went through the platform). The traveler at least gets a 7-day self-edit/delete window; the agency gets nothing.
- **[Backend]** "Reputation system improves discoverability" is stated as fact with no mechanism — does it affect Explore ranking, search order, or specifically the leaderboard (§Promotional & Marketing Tools)? Ties to the still-open reputation-score-formula gap rather than being a new one.
- **[Backend]** Reinforces the 🔁 Recurring Gap on Admin's moderation scope — if Admin's content moderation doesn't explicitly cover reviews either, agencies have literally no recourse against a bad-faith review from any direction (not from the traveler, not from the agency, not from Admin).

---

## Section 21: Notifications (Agency side)

- **[Backend]** Minor internal redundancy — bullet 1 ("alerts for new messages, trip requests, and payments") and bullet 3 ("alerts for new traveler messages, calls, or shared files") both cover "messages" with different scope, reads like an edit that added a fuller bullet without consolidating the earlier one. Same pattern as the traveler-side Notifications inconsistency (Section 8).
- **[Backend] 🟠 Missing trigger: verification status change.** No notification is listed for the agency's own registration being approved/rejected — a fairly essential alert given an agency can sit in "Pending Verification" with no stated SLA (§Agency Registration & Verification). Connects directly to that section's still-open "no rejection flow" gap — even if a rejection flow existed, there'd be no notification trigger defined here to tell the agency about it.
- **[Backend]** Missing trigger: no notification when a new review/rating is received — given agencies have zero right-of-reply or dispute mechanism (§Reviews & Ratings), at minimum they should be promptly notified when a review lands so they're aware of it.
- **[Backend]** Missing trigger: no payout/withdrawal status notification (processed, failed) — ties to the still-open payment-timing gap from §Payment & Commissions.
- **[Backend]** "Option to integrate with CRM tools" still has zero technical specificity (which CRMs, webhook vs. native integration) — consistent with its "low priority" treatment in the sprint backlog, just noting it's still a placeholder-level spec.
- **Confirmed by §Settings (Agency).** Notification Settings there list exactly "new user requests, messages, payment alerts" — three categories, same pattern as the traveler side. No toggle for calls, shared files, verification-status changes, or review-received alerts (the last two aren't even triggers in this Notifications section to begin with — see those gaps above).

---

## Section 22: Admin & Compliance Tools (Agency side)

**Partially resolves the Section 16 pending item** (see updated note there — staff accounts confirmed to exist, but the actual access-control question is untouched).

- **[Backend] 🔴 Significant architectural gap.** "Manage staff users under the agency profile" implies multiple people can access one agency's account — but §Agency Authentication Module (Section 13) never anticipated this at all; it describes Sign-Up/Login as if there's exactly one login per agency. This raises a real question that affects the auth data model directly: are staff separate login credentials under one business entity (proper multi-user accounts), or is "staff" just a permissions label with everyone sharing one login? This should be resolved before Sprint 1's auth work (VK-009 to VK-014), not discovered afterward.
- **[Backend] 🔴 No permission-tier model, which matters because money is involved.** No spec for what a staff account can vs. can't do — can a staff member withdraw funds, change the payout account, or edit business documents, or are they restricted to lower-risk actions like chat/messages? Without a defined permission tier, any staff account effectively has full access to agency finances by default, which is a real fraud/security exposure.
- **[Backend]** No spec for staff invitation/removal, or what happens to a departing staff member's conversations/activity history.
- **[Backend]** "Built-in compliance system to ensure trip authenticity and user safety" is one of the vaguest requirements in the whole TRD — no specifics on what it actually checks (automated rules? manual review checklist? third-party verification?).
- **[Backend]** No staff-level audit trail — if multiple people can act under one agency account, is there logging of which staff member did what? Ties to the still-open cross-cutting question about Admin's audit-log scope (previously raised for traveler account deletion, now also relevant here).
- **Still unclear after §User & Agency Management (Admin).** That section only mentions managing accounts at the traveler/agency level (deactivate/reactivate, edit profile info) — no explicit mention of agency staff sub-accounts. Whether Admin has any visibility into an agency's staff roster remains genuinely unanswered.

---

## Section 23: My Profile, Edit Profile & Settings (Agency side)

**Confirms the Section 21 pending item** (see updated note there — same 3-category notification-toggle pattern as the traveler side).

- **[Backend] 🟠 User story promises something the functionality list doesn't include.** "As an agency, I want to manage staff **and business settings**" is listed as a user story directly under this Settings section — but the Settings breakdown here has no staff-management category at all (Account, Business, Payment & Commission, Notification Settings only). Staff management was described separately in §Admin & Compliance Tools (Section 22) instead. Either this user story is misplaced, or Settings is expected to surface staff management too and it's missing from the functionality list — same kind of user-story/functionality mismatch already seen in the traveler-side Notifications section.
- **[Backend] 🟠 Missing payout/bank-account management.** Agency Settings has "Payment & Commission: view commission details, view payment history" — but nothing for actually **connecting or updating payout details** (the traveler's equivalent Settings explicitly has "Connect/disconnect payment method, view connected wallet"). If an agency's bank/Stripe Connect details are only ever set once during Registration & Verification with no way to update them afterward, that's a real operational gap for any agency that needs to change their payout account.
- **[Backend]** "Total trips completed" appears here too — ties to the 🔁 Recurring Gap (9th occurrence, updated above).
- **[Backend]** No "Delete account" option for agencies, unlike the traveler side which explicitly has one. Possibly intentional (agency business records may need longer retention for compliance), but worth confirming rather than assuming.
- **[Backend]** "Business Settings: update business documents" vs. "Edit Profile: upload/update licenses and certificates" — possible overlapping/redundant document-upload surfaces, similar to earlier Chat-vs-Requests overlap concern.
- **[Backend]** No character/file limits for Business description or Logo (recurring pattern).

---

## Section 24: Super Admin Interface — User & Agency Management

**Resolves/confirms three pending items** (see updated notes in Sections 10, 13, and 22 above):
- Section 13's rejection-feedback question → confirmed gap, no structured reason exists.
- Section 10's badge-mechanism question → confirmed the campaign badge is a genuinely separate, still-undefined process from Admin's user/agency badge power.
- Section 22's staff-roster question → still unresolved either way.

**New gaps from this section:**

- **[Backend] 🟠 "Deactivate" has no defined effect.** What actually happens to a deactivated traveler's live campaigns (hidden? frozen? still visible to donors?) or an agency's active packages/bookings? Does deactivation block withdrawal of already-raised funds? This is a real money/content-handling gap, not just an account-status toggle.
- **[Backend]** No notification is defined anywhere (traveler or agency Notifications sections) for an account being deactivated or a registration being rejected — the user just... finds out how? Ties to the same missing-negative-notification pattern already flagged on the agency side (Section 21), now confirmed to apply on the traveler side too.
- **[Backend]** Still no SLA for registration review turnaround (recurring from Section 13, confirmed absent here too, in the section that actually executes the review).
- **[Backend]** No admin role tiering anywhere — "**Super** Admin Interface" as a title implies a hierarchy might exist, but nothing defines a lower-privilege admin role (e.g. support staff who can view but not deactivate/reject). Already flagged generally in the original gap analysis; now confirmed still absent in the section that should define it.
- **[Backend]** No spec for report format/export/scheduling for the generated user/agency reports.
- **[Mobile/Web]** No spec for how the registration review queue is ordered (FIFO, risk-scored, oldest-first?).

---

## Section 25: Campaign & Trip Oversight (Admin)

**Resolves/narrows five pending items** (see updated notes across Sections 2, 3, 7, 9, 15, and 19 above) — most notably: fraud/curation control over Explore's "trending" and sponsored placements is **confirmed not addressed anywhere**, collapsing three separate pending flags into one real, standalone gap.

- **[Backend] 🔴 Pre-moderation vs. post-hoc flagging is unclear — a real workflow/UX question.** "**Approve** or flag campaigns for fraud prevention" could mean every campaign needs admin sign-off before going live (pre-moderation, adds publish delay), or campaigns go live immediately and get flagged reactively (post-hoc). "View all **active** traveler campaigns" leans toward the latter, but the word "approve" suggests the former might also apply. This materially affects the traveler's campaign-creation UX (instant publish vs. wait-for-review) and needs to be resolved before that flow is built.
- **[Backend] 🔴 Undermines the section's own stated purpose.** No spec for what happens to a campaign once it's flagged — does it get auto-paused/hidden from donors immediately, or does it stay live while under review? The user story explicitly says "flag suspicious campaigns **to protect donors**" — but if a flagged campaign keeps collecting donations during review, that protection isn't actually happening.
- **[Backend]** No fraud-detection criteria specified — automated rules, or purely manual review triggered by reports?
- **[Backend]** "High-value transactions" reuses the same undefined threshold concept as §Security & Verification's KYC gate — unclear if it's literally the same number or a separate admin-monitoring threshold.
- **[Backend]** No appeal/dispute process for a traveler whose campaign is flagged or rejected — mirrors the same still-open gap already flagged for agencies (§Agency Registration & Verification).

---

## Section 26: Payment & Transaction Management (Admin)

**Partially resolves the Section 2 pending item** (see updated note there — admin-initiated refund/cancellation is confirmed; traveler-initiated self-delete-with-donations is still open).

- **[Backend] 🔴 Refund-after-withdrawal solvency risk — the most consequential new finding here.** "Refund management if a campaign is canceled or fraudulent" says nothing about what happens if the traveler has **already withdrawn** the funds before fraud is detected or the campaign is canceled. Can the platform actually still refund donors in that case, or does it have to absorb the loss / pursue the traveler separately to claw the money back? This is a real solvency and legal-liability question, not just a workflow detail — worth resolving before the refund logic is designed, since it changes what data/collections process needs to exist (e.g. does Veakay need a mechanism to recover funds from a traveler after payout?).
- **[Backend]** No spec for partial refunds — if a campaign is 60% funded and gets canceled, are all contributing donors refunded in full, or does something else happen (e.g. redirect to a similar campaign)?
- **[Backend]** No spec for who absorbs Stripe's own processing fees on a refund (Stripe typically doesn't return its processing fee even when a refund is issued) — does Veakay eat that cost?
- **[Backend]** Still unclear whether "monitor platform commissions and deduct fees from **transactions**" (broader wording than the Agency-specific commission section) implies a fee is also taken from traveler-side donations, not just agency booking commissions — the still-open "is there a traveler-side platform fee" question from early in this review. This section's wording is suggestive but not conclusive.
- **[Backend]** No consequence beyond refunding donors is described for a *fraudulent* campaign's creator — account ban? Legal referral? Not addressed.
- **[Backend] Partial resolution on reporting cadence:** the user story specifies "**monthly** revenue reports," so at least that one report type has a defined cadence — but "total funds raised, fees collected, withdrawal stats" don't individually specify a period (all-time? matching the monthly cadence?).

---

## Section 27: Analytics & Insights (Admin)

**Confirms the Section 14 pending item as a real, now-systemic gap** (see promoted 🔁 Recurring Gaps entry on "user demographics" above).

- **[Backend] 🟠 New, undefined metric: "top-performing travelers."** Agencies at least have an attempted (if underspecified) reputation-score formula; nothing anywhere proposes a metric for ranking travelers. Most funds raised? Most completed trips? Most social engagement (followers/likes)? This is a genuinely new gap, not a repeat of the agency reputation-score question.
- **[Backend]** "Campaign success rates" ties to the 🔁 Recurring lifecycle-status gap (10th occurrence, updated above) — no definition of what makes a campaign "successful."
- **[Backend]** No time-range spec for any of these platform-wide metrics (recurring pattern from the Agency Dashboard section).
- **[Backend]** "Top destinations" likely reuses the still-undefined location/category taxonomy (see 🔁 Recurring Gaps) rather than being a new issue on its own.

---

## Section 28: Content & Compliance Management (Admin)

**Confirms the Admin moderation-scope gap as real** (see updated 🔁 Recurring Gaps entry above — reviews and chat are both explicitly excluded from Admin's stated scope).

- **[Backend] 🔴 The submission side of "reported content" doesn't exist anywhere.** "Manage reported content" presupposes users can actually *report* content in the first place — but no report/flag button or mechanism is described anywhere in the traveler-side Social Feed, Reviews, or Chat sections. Admin has a moderation queue with nothing feeding into it from the user side.
- **[Backend] 🔴 "Ensure compliance with KYC, GDPR, and payment regulations" has zero operational detail.** This is the TRD's only explicit, named mention of these three compliance areas — and it's stated as a goal, not a mechanism. It doesn't resolve any of the already-flagged specifics: the KYC threshold amount (§Security & Verification), what GDPR "right to be forgotten" actually deletes (§Settings), or which payment regulations apply in which countries (the general Stripe Connect / money-transmission gap from earlier). This section reads like the place all three should finally get defined, and instead just restates that compliance should happen.
- **[Backend]** "Manage platform-wide terms & conditions, privacy policies" — no versioning/re-acceptance flow. T&C acceptance was mandatory at sign-up (§Sign Up); if Admin updates the T&C later, is there a mechanism requiring existing users to re-accept the new version? Not specified — a real legal exposure if updates silently apply to users who never agreed to them.
- **[Backend]** No spec for what Admin can do beyond removing a piece of content — can Admin also warn/suspend the user who posted it, or issue a strikes system? Not addressed.

---

## Section 29: Notifications & Alerts (Admin) + Security & Audit Logs (Admin)

**Narrows the Section 12 pending item** (see updated note there — still genuinely ambiguous, not cleanly resolved either way).

- **[Backend] 🔴 No audit log retention period, despite this covering financial actions.** "Maintain audit logs for all admin actions" — including payments and campaign changes — has no stated retention duration. Many jurisdictions have *minimum* retention requirements for financial transaction records (commonly multi-year), so this isn't just a storage question, it's a compliance one.
- **[Backend] 🔴 No audit log immutability/tamper-proofing spec.** An audit trail is only meaningful if the people being audited (admins) can't alter or delete their own entries. Nothing states the logs are append-only or otherwise protected from modification by the same admins whose actions they record.
- **[Backend]** No spec for who can *view* the audit logs — all admins, or a restricted tier? Reinforces the still-open admin-role-tiering gap from §User & Agency Management.
- **[Backend]** "Track changes to campaigns, user accounts, and payments" doesn't explicitly mention agency accounts/packages — minor wording ambiguity given the TRD usually refers to "users" (travelers) and "agencies" as distinct terms elsewhere.
- **[Backend]** "Send notifications to users and agencies" has no targeting/segmentation spec — only all-users/all-agencies broadcast, or can Admin target a segment (e.g. agencies in a specific region, inactive travelers)? Also no channel spec (push/email/in-app).
- **[Backend]** "Two-factor authentication for admin login" repeats what's already implied in the Admin Authentication API (§Super Admin Auth) — not a conflict, just restated in a second location; worth consolidating into one place during spec cleanup.

---

## Section 30: My Profile, Edit Profile & Settings (Admin) — final TRD section

- **[Backend] 🔴 No admin account creation/invitation process anywhere in the entire TRD.** Admin has Login, Forgot Password, Profile, and Settings — but never a Sign-Up or invitation flow, unlike travelers and agencies which both have one. This raises a real bootstrap question (how does the very first Super Admin account get created?) and an ongoing one (how are additional admin accounts added later?) — especially relevant given the still-open admin-role-tiering gap, since if support-tier admins are ever meant to exist, there's no described way to create them.
- **[Backend]** The "role details" user-story mismatch (see updated 🔁 Recurring Gaps entry) directly connects to the still-unresolved admin-role-tiering gap from §User & Agency Management — the user story anticipates a "role" concept that never got built out anywhere else in the document either.
- **[Backend] 🟠 Possible resolution mechanism for many earlier gaps, but too vague to confirm.** "System Settings: manage platform configurations" could plausibly be where many of this review's undefined numeric thresholds are meant to live as admin-configurable values — commission %, KYC/high-value withdrawal threshold, OTP/reset-link expiry, badge milestone thresholds, etc. But as written it's a single vague bullet with no list of what's actually configurable there, so this can't be confirmed as the intended resolution — worth asking directly whether that's the intent, since it would resolve a large fraction of this review's "no number given" gaps in one place.
- **[Backend]** Confirms the Settings-lags-Notifications pattern a third time (see updated 🔁 Recurring Gaps entry) — no toggle here for the "unusual activity" alerts described in §Notifications & Alerts.
- **[Backend]** If an admin edits their own name, does past audit log history retain the name as it was at the time of each action, or does it update retroactively? Ties to the still-open audit-log-integrity questions from Section 29.

---

**This is the final section of the TRD.** All 30 sections have been reviewed against the role × surface grid.

---

# ✅ Resolution Plan — every gap above, classified

Every gap logged in this document, gone through one by one and sorted into two buckets:

- **✅ Logical default** — a standard/obvious engineering or product answer exists; we can just build it this way and move on. Resolution stated inline.
- **❓ Ask client/PM** — genuinely needs input (a number, a business/legal call, or a real product-scope decision) before work can start correctly. The question to ask is stated inline.

## 1. Authentication & Account Security (Traveler / Agency / Admin)

- Password policy unspecified → ✅ Standard policy: min 8 chars, at least one letter + one number.
- OTP mechanics (length/expiry/attempts/resend) → ✅ 6-digit code, 10-minute expiry, 5 attempts max, 60s resend cooldown.
- Account-conflict on email reuse across sign-up methods → ✅ Detect existing account, prompt "an account already exists — log in with [method]."
- Whether OTP applies to social logins too → ✅ Only for email/password; Google/Apple sign-ins are pre-verified.
- Minimum age / age verification → ❓ **Ask:** What's the minimum age policy, and do minors need parental consent?
- Interrupted sign-up resume behavior → ✅ Persist an "incomplete" account state, resume the flow on next login.
- Form validation/error states → ✅ Standard client-side + server-side validation.
- Sign-up funnel analytics for Admin → ✅ Add basic funnel/drop-off tracking, no decision needed.
- Badge milestone thresholds (Explorer/Jetsetter) → ❓ **Ask:** What are the actual thresholds (X trips completed? $Y raised?) that unlock each badge?
- Stale "PayPal, Stripe, etc." wording in TRD → ✅ Just edit the TRD text to say Stripe only — flag to whoever owns the doc, not really a question.
- Which profile fields are mandatory vs skippable → ✅ Only previous-trip photos optional; profile photo + travel preferences required.
- File size/type/count limits on uploads → ✅ Standard limits (e.g. 10MB, jpg/png/heic, max 10 photos).
- Wallet-skip re-prompt behavior → ✅ Re-prompt at first campaign creation or first withdrawal attempt.
- Status badge vs. Verified badge overlap → ✅ They're two different systems (progress gamification vs. trust signal) — build separately.
- OTP-login delivery channel → ✅ Email (no phone field exists to support SMS).
- Failed-login lockout/rate limiting → ✅ Standard (e.g. 5 attempts, temporary lockout).
- Session handling (expiry/refresh/multi-device) → ✅ JWT + refresh token, multi-device allowed by default.
- Biometric login (Face ID/Touch ID) → ✅ Add it — cheap, standard, matches the "fintech-inspired" positioning.
- Admin visibility into login anomalies → ✅ Add basic suspicious-login flagging as a good-practice default.
- Forgot-password: OTP vs. reset link as alternatives → ✅ Let the user pick either method.
- Reset-link/OTP expiry duration → ✅ 15 minutes, standard.
- Rate-limiting on reset requests → ✅ Standard.
- "Password changed" notification + invalidate other sessions → ✅ Standard security practice, just build it.
- Agency: no rejection flow/reason → ❓ **Ask:** When Admin rejects an agency, can they edit and resubmit documents? Should there be a stated rejection reason shown to the agency?
- Agency: no SLA for verification review → ❓ **Ask:** What's the target turnaround time for reviewing a new agency (24h? 48h? 5 business days)?
- Agency reputation score formula → ❓ **Ask:** What inputs/weights make up the score (rating average, volume, recency)?
- Country/eligibility check at agency sign-up → ✅ Add a check/warning against Stripe Connect's supported-country list before full registration.
- Admin account creation/invitation process → ✅ Build an invite-based flow for new admins; seed the very first Super Admin manually via a one-time script.
- Admin role tiering → ✅ Build an extensible RBAC system now, even though only "Super Admin" exists today.
- Duplicate 2FA mention in TRD → ✅ Editorial consolidation only, no functional decision needed.

## 2. Profile & Settings (Traveler / Agency / Admin)

- Travel-preferences category list undefined → ❓ **Ask:** What are the actual selectable options? (Or confirm reusing the original design's list: Adventure/Luxury/Backpacking/Solo/Family.)
- "Bio" field has no origin or display location → ❓ **Ask:** Is Bio a real feature (add to profile view + sign-up) or leftover text to delete?
- "Previous trips" — photo gallery vs. structured trip record → ✅ Tie it to actual completed bookings once the lifecycle status model exists (see §3) — resolves itself once that's defined.
- Profile visibility (who can see a profile) → ✅ Public by default, matching an open "follow" model.
- Bio/photo limits → ✅ Standard.
- "Changes reflect immediately" propagation → ✅ Update everywhere synchronously — standard.
- "Delete account (optional)" ambiguity → ❓ **Ask:** Is account deletion required for launch (GDPR-relevant), or can it be deferred to a later release?
- Deletion scope (hard delete vs. anonymize) → ❓ **Ask:** Legal/compliance call on what "delete" actually means for campaigns/donations/posts/chat history.
- Password re-entry on change → ✅ Always require current password first.
- Logout scope (single vs. all devices) → ✅ Single-device default, add "log out everywhere" as an option.
- Wallet disconnect with pending funds → ✅ Block/warn while there's an active balance or pending withdrawal.
- Notification Settings missing categories → ✅ Apply one rule: every notification trigger gets a toggle.
- T&C/Privacy Policy re-access link → ✅ Just add it.
- Language/region/currency preference → ✅ Default to English/USD for MVP, add locale support later.
- Agency "manage staff" user story with no Settings category → ✅ Add a Staff Management entry point (or confirm it's intentionally only in Admin & Compliance Tools) — either way, just make sure one of them has it.
- Agency missing payout/bank-account management in Settings → ✅ Add "connect/update payout account," mirroring the traveler's wallet settings.
- Agency has no delete-account option → ❓ **Ask:** Intentional (compliance/record-retention reasons) or an oversight?
- Admin "role details" shown nowhere → ✅ Resolves automatically once role tiering (§1) is built.
- Admin name change vs. audit log attribution → ✅ Audit logs snapshot the name at time-of-action — standard immutable-log practice.
- "System Settings: manage platform configurations" vagueness → ✅ Build this as the actual admin-configurable-values screen (commission %, KYC threshold, OTP expiry, badge milestones, etc.) instead of hardcoding them — resolves the *mechanism* for many "no number given" gaps below even before the numbers themselves are supplied.

## 3. Campaign Creation & Lifecycle

- No currency field → ✅ Single currency (USD) for MVP launch; multi-currency as a fast-follow.
- No min/max goal amount → ❓ **Ask:** Any policy limits, or fully open? (Logical default if no answer: no cap.)
- **No campaign/trip/booking lifecycle status model → ❓ Ask — the single biggest item in this whole review.** Needs a working session with the client/PM to define the actual states (e.g. Draft → Active → Funded → Booked → Completed / Canceled / Expired). Too foundational and too widely depended-upon to guess; touches withdrawals, reviews, badges, analytics, and notifications across nearly every section.
- Campaign auto-expiry behavior → ✅ Default: stop accepting new donations once the trip date passes — fold into the lifecycle-model conversation above rather than deciding in isolation.
- Overfunding (past 100% of goal) → ✅ Allow it, uncapped — matches how GoFundMe (the TRD's own comparison) already works.
- "Invite-only" mechanism → ✅ Shareable private link + optional access code — standard pattern for private content.
- "Gift Mode" distinctiveness → ✅ Treat as a UI framing/tag on a normal donation (a "this is a gift" flag + optional message), not a separate payment path — simplifies scope without losing the feature.
- Edit/delete a campaign with existing donations → ❓ **Ask:** Business/legal call — can a funded campaign be deleted by its owner, and are donations auto-refunded if so? Ties directly into the lifecycle + refund-policy conversation.
- Personal-story length/moderation → ✅ Reasonable char limit (~2000) + basic profanity filter; full moderation via Admin's flagging queue.
- File limits, form validation → ✅ Standard.
- Donor notification when trip details change post-donation → ✅ Notify donors if destination/dates change after they've contributed — a trust/transparency default.

## 4. Itinerary, Packages & Agency Collaboration

- Three unconnected paths for "agency quotes" (upload / package link / chat share) → ✅ Unify under one underlying "campaign attachments" record regardless of entry point.
- Multi-agency comparison (request quotes from more than one agency) → ❓ **Ask:** Should travelers be able to compare packages from multiple agencies per campaign, or is it 1:1 once linked?
- **What a "Package" fundamentally is (reusable catalog vs. single-campaign offer) → ❓ Ask — blocks the entire Package data model.** Wrong guess here means a schema rewrite later; needs a direct answer before any Package/Itinerary backend work starts.
- Dynamic pricing sync with campaign goal → ❓ **Ask:** Depends entirely on the Package-entity answer above; resolves logically once that's settled.
- Auto-suggestion algorithm inputs → ✅ Reasonable default (packages priced ≤ current raised amount, filtered by destination/dates); tune later with real usage data.
- Booking-confirmation vs. funding sequencing → ❓ **Ask:** Can an agency confirm a booking against a partially-funded campaign, with balance due later? Real financial-risk decision.
- Cancellation/dispute path if a linked booking falls through → ❓ **Ask:** What should the dispute-resolution process actually look like?
- Package customization scope → ✅ Keep simple for MVP (dates + a notes field); expand later based on demand.
- Package availability/versioning → ✅ Standard status field (active/inactive/archived); snapshot terms at link-time so edits don't retroactively change what a traveler already linked.

## 5. Payments, Withdrawals & Commissions

- Stripe/PayPal wording still in TRD → ✅ Edit the doc.
- "In-app wallet" ambiguity → ✅ Treat as "your connected Stripe account" — do not build an internal ledger unless explicitly requested later.
- "Campaign verification" undefined, overlaps with KYC → ❓ **Ask:** Propose that campaign verification = traveler KYC completed + admin review, and get sign-off on that definition.
- No partial withdrawal support → ❓ **Ask:** Should travelers be able to withdraw before hitting 100% of goal? Business/trust decision.
- Withdrawal mechanics (payout method, fees, minimum amount) → ❓ **Ask:** Who absorbs Stripe payout/currency-conversion fees, and is there a minimum withdrawal amount?
- Anonymous-donation option → ✅ Add a simple "donate anonymously" toggle — cheap, clearly good UX, especially for Gift Mode.
- No refund-to-donor mechanism → ❓ **Ask:** Ties directly to the lifecycle/cancellation-policy conversation in §3.
- No donor receipt → ✅ Send an email receipt on every donation — standard practice.
- Cross-border currency handling → ✅ Resolved by the single-currency MVP decision in §3.
- Commission % → ❓ **Ask:** The actual number.
- Traveler-side platform fee (existence + amount) → ❓ **Ask:** Does one exist, separate from the agency commission, and how much?
- **Refund-after-withdrawal clawback risk → ❓ Ask — a real financial/legal question, not guessable.** What happens if a campaign is refunded after the traveler already withdrew the funds? Needs finance/legal input before the refund logic is designed.
- Partial refunds on a canceled, partially-funded campaign → ❓ **Ask:** Full refund to all donors, or some other rule?
- Who absorbs Stripe's non-refundable processing fee on a refund → ❓ **Ask.**
- Subscription tier pricing/feature differentiation → ❓ **Ask:** The actual numbers and feature list per tier.
- Agency payout-account disconnect while invoices pending → ✅ Block/warn, same pattern as the traveler wallet.
- Payment timing to agency (on booking vs. completion) → ❓ **Ask:** Ties to the booking-lifecycle conversation in §4.

## 6. Reviews & Reputation

- "After a completed trip" gating → ❓ **Ask:** Ties to the lifecycle-model conversation in §3 — resolves once that's defined.
- Review cardinality → ✅ One review per completed trip (not one per agency lifetime) — simplest, most honest model.
- Review-to-booking validation → ✅ Once the lifecycle model exists, tie the review to that specific completed record.
- Minimum review content → ✅ Star rating required, written text optional.
- Review lock after 7 days / admin override → ✅ Admin can always remove a review regardless of the 7-day window — standard moderation power.
- Orphaned reviews on account/campaign deletion → ✅ Keep the review, anonymize the reviewer reference — standard practice (matches how most platforms handle this).
- No agency right-of-reply → ❓ **Ask:** Is a reply feature in scope for this release, or deferred? (Worth recommending yes, but it's new scope — confirm.)
- No review sort/filter → ✅ Add standard options (recent / highest / lowest).
- No post-trip review-nudge notification → ✅ Just add it as a notification trigger.
- Reputation score formula → ❓ **Ask:** Same question as the agency registration section — what's the actual weighting?
- Reviews/chat outside Admin's moderation scope → ❓ **Ask:** Should reviews and chat be added to Admin's stated moderation scope? (Recommend yes — but it's a scope decision, confirm.)

## 7. Social Feed, Explore & Groups

- Invite-only campaigns leaking into Feed/Explore → ✅ Exclude them by default — that's what "invite-only" means, no need to ask.
- Posts vs. campaigns engagement split (like/comment/share) → ✅ Allow it on both — simplest, most consistent.
- Comment edit/delete → ✅ Same rules as posts.
- "Share" target (internal vs. external) → ✅ Support both native OS share sheet and internal repost.
- Follow model (open vs. approval-based) → ✅ Open follow, like a public social feed.
- "Interest groups" full spec (creation/discovery/moderation) → ❓ **Ask:** Is this a launch feature or can it be deferred? Needs real scope definition either way — too underspecified to build blind.
- Journey Journal gating → ✅ Resolves once the lifecycle model (§3) exists.
- Post content limits → ✅ Standard.
- Post-delete cascade (comments, notifications) → ✅ Standard cascade delete.
- "Group" terminology collision (interest groups / group funds / group chat) → ✅ Purely an internal data-model naming task — keep them as 3 distinct entities, no client input needed.
- Feed vs. Explore ranking algorithms → ✅ Feed = chronological from followed people; Explore = engagement/recency-weighted "trending." Tune later with real data.
- Explore "trip type" taxonomy → ❓ **Ask:** Same taxonomy question as travel preferences — needs one shared category list defined once.
- Sponsored-placement disclosure → ✅ Add a "Sponsored" label — standard and often legally required, no need to ask.
- Sponsored-placement purchase mechanism → ❓ **Ask:** Subscription-tier-gated, or a separate paid transaction?
- Fraud-flagged campaign exclusion from trending/sponsored → ✅ Obviously exclude anything currently flagged — common sense, just build it.
- "Add friends" relationship model → ✅ Mutual friend-request/accept flow, distinct from public "follow."
- Friend visibility into private campaigns → ❓ **Ask:** Does friendship auto-grant access to an invite-only campaign, or is an explicit invite always required? (Recommend: always explicit — but confirm.)
- Group-fund entity relationship to Campaign → ✅ Same Campaign entity, with a "group" flag and multiple contributor/owner links — simplest model that satisfies the stated requirements.
- Group-fund ownership/permissions → ✅ Creator has admin rights by default — standard pattern.
- Manual vs. auto-recorded contribution reconciliation → ❓ **Ask:** Should manually-entered amounts require any verification, or is it fully trust-based? Real fraud-policy decision.
- "Spend" tracking ambiguity → ❓ **Ask:** Is this a real expense-splitting feature, or just loose wording for "contributions"?
- Group-fund withdrawal model (who's authorized) → ❓ **Ask.**

## 8. Chat & Communication

- Chat Module vs. User Requests & Communication overlap → ✅ One underlying chat/messaging system, with request/booking metadata layered on top — building two systems would be pure waste.
- Multi-staff shared inbox → ✅ Build conversation assignment/visibility tied to the staff permission tiers from §1.
- Business-hours/SLA response time → ❓ **Ask:** Is there a stated response-time expectation to build reminders/escalations around, or is this open-ended?
- Call recording for consultations → ❓ **Ask:** Legal/privacy question — consent-to-record laws vary by region, don't just add this without a decision.
- Smart-reply template management → ✅ Let agencies create/edit their own custom templates — standard feature pattern.
- Unsolicited requests outside the package-browsing flow → ✅ Allow it — more flexible, low risk to include.

## 9. Notifications (all roles)

- Functionality-list vs. user-story mismatches (Like/Comment missing, etc.) → ✅ Make the trigger list match the user stories — a straightforward doc/dev sync fix.
- Milestone celebration audience → ✅ Campaign owner gets the full celebration; donors optionally get a lighter "you helped hit 50%!" notification.
- "Shareable badges" share target → ✅ Same resolution as the general "Share" ambiguity (native + internal).
- Notification history/inbox → ✅ Build one — standard expectation for any app with push notifications.
- Email channel for financial notifications → ✅ Add email receipts/alerts for donations, milestones, withdrawals.
- Deactivation/rejection notifications missing → ✅ Just add these triggers.
- Notification Settings lagging behind triggers (all 3 roles) → ✅ Apply the "every trigger gets a toggle" rule uniformly.
- CRM integration lack of detail → ❓ **Ask (low priority):** Which CRM(s), if any, should actually be supported? Can defer entirely until requested — matches its "low priority" tag in the sprint backlog.
- Targeting/segmentation for admin broadcast notifications → ✅ Build basic segment filters (by role, region, activity) as a reasonable admin-tool default.

## 10. Agency Operations (Dashboard, Marketing, Compliance)

- "Manage campaigns" wording conflict → ❓ **Ask — cannot safely guess.** Is this a literal wording error (should say "packages"), or do agencies actually get real edit rights over linked traveler campaigns? Picking wrong here means building the wrong permissions model.
- "User demographics" analytics with no data collected → ❓ **Ask:** Is demographic collection actually wanted (raises real consent/privacy questions), or should this be redefined as travel-preference distribution instead?
- Analytics time-range/granularity → ✅ Default to a rolling 30-day view with a 7/30/90/all-time selector — standard dashboard pattern.
- Report export/format → ✅ Standard charts + CSV export.
- "Influencer collaborations" → ❓ **Ask:** Needs a real feature definition, or confirmation it's out of scope for now.
- Promotion purchase mechanism / revenue stream → ❓ **Ask:** Ties to the subscription/marketing monetization decision above.
- "Top-performing travelers" metric → ❓ **Ask:** What should this actually be ranked by?
- Staff permission tiers → ✅ Build tiered roles (owner/admin/support); no staff account gets full financial access by default.
- Staff invite/removal, per-staff audit trail → ✅ Standard invite-based flow + audit log entries tagged per staff member.
- "Built-in compliance system" vagueness → ❓ **Ask:** What specifically should this check? Can't guess the rules of a compliance system.
- Package pre-publish review → ❓ **Ask:** Fully self-service once the agency is verified, or does Admin review each package before it goes live?

## 11. Admin / Super Admin Platform

- No rejection reason/feedback mechanism → ✅ Add a structured reason field/checklist — obviously useful regardless of the specifics.
- "Deactivate" effect on a traveler/agency's live campaigns/funds → ❓ **Ask:** Real money/trust decision — hide the campaign immediately? Block withdrawal of already-raised funds?
- Pre-moderation vs. post-hoc campaign flagging → ❓ **Ask:** Does every campaign need admin approval before going live, or is it live-then-flag-reactively? Major UX/ops decision that affects the traveler's publish flow directly.
- Flagged-campaign auto-pause → ✅ Pause/hide a flagged campaign from donors immediately while under review — otherwise the feature doesn't actually protect anyone; recommend strongly.
- Fraud-detection criteria → ❓ **Ask:** What actually triggers a flag — automated rules, manual review only, or both?
- High-value transaction threshold → ❓ **Ask:** Same threshold question as KYC (§5/§1) — likely the same number, just confirm.
- Appeal/dispute process for flagged/rejected campaigns and agencies → ❓ **Ask:** What should this process look like?
- Audit log retention period → ❓ **Ask:** Legal/compliance requirement in your operating jurisdiction(s) — don't guess a number that might violate a regulation.
- Audit log immutability → ✅ Build it as append-only — standard security requirement, not a business decision.
- Report format/scheduling → ✅ Standard.
- Admin's content-moderation scope excludes reviews/chat → ❓ **Ask:** Extend the stated scope to cover reviews and chat, or handle them separately? (Recommend extending — confirm.)
- "Reported content" has no submission mechanism → ✅ Add report/flag buttons across posts, reviews, and chat.
- KYC/GDPR/payment-regulation compliance mechanism → ❓ **Ask:** Needs actual legal/compliance guidance — not a guessable engineering default.
- T&C versioning/re-acceptance → ✅ Standard practice — force re-acceptance on next login when the T&C version changes.

---

## Summary

Roughly **two-thirds of everything logged in this review has a standard, defensible default** — security hygiene, missing-but-obvious features (report buttons, notification toggles, receipts), and a handful of deliberate scope-limiting choices (single currency, no internal wallet ledger, simple package customization) that keep the MVP buildable without waiting on anyone.

The **remaining third genuinely needs client/PM input**, and it clusters into a short list of real conversations:
1. **The campaign/trip/booking lifecycle status model** (blocks the most other things — worth resolving first, in one sitting).
2. **What a "Package" is** (reusable catalog vs. single-campaign offer) — blocks the Package data model.
3. **Money mechanics** — commission %, platform fee, KYC threshold, subscription pricing, refund/clawback policy, partial withdrawals.
4. **A handful of real scope questions** — is "Spend" tracking real, are "Influencer collaborations" real, is agency "manage campaigns" a wording error, should agencies get review reply rights, is pre-moderation or post-hoc campaign review the intended flow.

That's a short, concrete list — worth one focused session with whoever owns the TRD rather than resolving piecemeal.

