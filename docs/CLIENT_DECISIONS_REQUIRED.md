# Client Decisions Required Before Feature #6 (Payments/Wallet/Withdrawal)

This document lists the **7 critical open questions** that require client decisions before the Payments/Wallet/Withdrawal feature can be completed. Each decision blocks specific implementation paths.

---

## Summary Table: What'"'"'s Blocked

| # | Decision | Blocks |
|---|----------|--------|
| 1 | Campaign/Trip/Booking Lifecycle Status Model | Withdrawal eligibility, review triggers, badge milestones, analytics events, notification triggers |
| 2 | High-Value Withdrawal Threshold | KYC enforcement in wallet service, Stripe Identity integration decision |
| 3 | Refund-After-Withdrawal Policy | Refund handling logic, platform liability, traveler clawback flow, Stripe dispute handling |
| 4 | "Verification" Terminology Unification | Campaign verification gate, KYC flow, verified badge display, API/data model clarity |
| 5 | Agency Subscription Purchase Channel | RevenueCat vs. Stripe Billing integration, Apple/Google 30% fee exposure, web billing page |
| 6 | Commission % & Platform Fee | Agency payout calculation, donation fee collection, Stripe Connect account configuration |
| 7 | Package Entity Model | PackageCampaignLink table, agency catalog UI, campaign-package linking flow, explore/discovery |

---

## 1. Campaign/Trip/Booking Lifecycle Status Model (Open Question #1)

**What marks a campaign/trip as "completed" or "successful"?**

**Required for:** withdrawals, reviews, badges, analytics, notifications

**Proposed State Machine:**
```
Draft -> Active -> Funded -> Booked -> Completed
                    |
                 Canceled / Expired
```

**Questions for Client:**
- Is "Funded" a distinct state (campaign hit goal but trip not yet booked)?
- Does "Booked" mean agency confirmed itinerary + traveler accepted?
- What triggers "Completed" -- travel end date? Traveler confirmation? Agency mark-complete?
- Can a campaign go Active -> Canceled directly (never funded)?
- Is "Expired" time-based (campaign end date passed without funding)?

**Current Implementation Assumption:** The 5-state model above with transitions enforced by `CampaignStatusGuard`. Need client sign-off before locking in guards, withdrawal eligibility checks, and notification triggers.

---

## 2. High-Value Withdrawal Threshold (Open Question #3)

**Dollar amount that triggers KYC requirement**

**Current Enforcement:** $1,000 (hardcoded in `WalletService.canWithdraw()` but flagged as needs-client-confirmation)

**Questions for Client:**
- Confirm $1,000 USD? Or different amount/currency?
- Is this per-withdrawal or cumulative across campaign?
- Does threshold apply to agency payouts too, or only traveler withdrawals?
- If threshold changes, does it apply retroactively to pending withdrawals?

**Blocked:** KYC gate in withdrawal flow, Stripe Identity integration decision (Open Question #5 dependency), test cases for threshold boundary.

---

## 3. Refund-After-Withdrawal Policy (Open Question #4)

**What happens if a campaign is refunded after the traveler already withdrew funds?**

**Options:**
- **Platform absorbs loss** -- Platform pays refund from own funds, traveler keeps withdrawn amount
- **Clawback from traveler** -- Platform initiates debit from traveler'"'"'s linked account / future withdrawals
- **Hybrid** -- Platform covers up to $X, traveler liable for remainder

**Questions for Client:**
- Which policy? (Legal/financial decision -- cannot default)
- If clawback: automated via Stripe Connect `reverse_transfer`? Manual invoice? Collections process?
- What if traveler has no linked bank account / Stripe account balance insufficient?
- Does this differ for agency payouts vs. traveler withdrawals?

**Blocked:** Entire refund handling flow in `PaymentsService`, Stripe webhook handlers for `charge.refunded`, audit log entries, notification templates.

---

## 4. "Verification" Terminology Unification (Open Question #5)

**Three different "verification" concepts currently exist:**

| Concept | Purpose | Current Gate |
|---------|---------|--------------|
| **a) Campaign Verification** | Withdrawal gate -- campaign must be verified to withdraw | `Campaign.verification_status` enum |
| **b) Identity Verification / KYC** | High-value withdrawal gate -- traveler identity confirmed | `User.kyc_status` + Stripe Identity |
| **c) Verified Campaign Badge** | Donor trust signal -- shows on campaign card/feed | `Campaign.is_verified_badge` boolean |

**Questions for Client:**
- Are these **one unified process** (single verification = all three)?
- Or **three separate processes** with different triggers/audiences?
- If separate: Does KYC (b) imply campaign verification (a)? Does campaign verification (a) grant badge (c)?
- Who initiates each? (Auto on funding? Manual admin review? Traveler request?)

**Blocked:** Data model (`Campaign`, `User` fields), API endpoints, UI labels, notification copy, admin review queue design.

---

## 5. Agency Subscription Purchase Channel (Open Question #28)

**Basic/Premium/Featured tiers -- purchased via iOS/Android IAP or web billing?**

**Current Assumption:** Web-based Stripe Billing (sidesteps Apple/Google 30% fee)

**Questions for Client:**
- Confirm web-only billing via Stripe Billing Portal?
- If yes: No RevenueCat, no native IAP implementation needed
- If no (requires IAP): Need RevenueCat + App Store Connect / Play Console setup, 30% fee modeling
- Hybrid? (Web for new, IAP for existing?) -- adds complexity

**Blocked:** Agency subscription module, billing UI, Stripe Connect account onboarding for agencies, commission calculation (tier-dependent), webhook handlers for subscription events.

---

## 6. Commission % & Platform Fee (Open Questions #23, #27)

**Agency commission % per tier + platform fee on donations**

**Questions for Client:**

| Tier | Commission % (agency takes from traveler payment) | Platform Fee (on donations) |
|------|---------------------------------------------------|----------------------------|
| Basic | ?% | ?% or flat? |
| Premium | ?% | ?% or flat? |
| Featured | ?% | ?% or flat? |

- Is platform fee **separate** from agency commission? (e.g., donor pays $100 -> agency gets $90 (10% commission) -> platform takes $2 (2% fee) -> traveler receives $88)
- Or is platform fee **included** in commission? (agency gets $88, platform keeps $12 total)
- Are these percentages **admin-configurable** (DB rows) or env constants?
- Do they apply to **group travel funds** (Feature #4) the same way?

**Blocked:** `PaymentsService.calculatePayout()`, Stripe Connect `application_fee_amount`, agency onboarding flow, admin settings UI, financial reports.

---

## 7. Package Entity Model (Open Question #2)

**Is a Package a reusable catalog listing (many campaigns) or single-campaign offer?**

**Current Implementation:** Many-to-many via `PackageCampaignLink` -- **catalog model** (one package -> many campaigns)

**Alternative:** 1:1 -- each campaign gets its own package/itinerary

**Questions for Client:**
- Confirm catalog model (Package = agency'"'"'s reusable product, linked to multiple campaigns)?
- Or 1:1 (Package = bespoke itinerary for one campaign)?
- If catalog: Can multiple travelers book the same package simultaneously? (Group booking?)
- If catalog: How does pricing work -- fixed per package, or per-campaign override?
- Does "Package" map to "Itinerary" in TRD, or are they distinct?

**Blocked:** `PackageCampaignLink` table, agency package catalog UI, campaign creation flow (select existing package vs. create new), explore/discovery filters, analytics (package performance vs. campaign performance).

---

## Next Steps

1. **Client reviews this document** and provides decisions for all 7 items
2. **Decisions recorded** in this file (update status column)
3. **Implementation unblocked** -- each decision maps to specific code paths in `backend-repo/src/modules/payments/`, `campaigns/`, `agencies/`, `wallet/`
4. **Update `Veakay_TRD_Open_Questions.md`** to mark resolved items
5. **Run `DEVELOPMENT_FLOW.md`** for each affected module (Swagger/DTOs -> unit tests -> E2E -> commit -> blackbox)

---

*Last updated: 2026-09-11*  
*Source: `docs/Veakay_TRD_Open_Questions.md` items #1, #2, #3, #4, #5, #23, #27, #28*