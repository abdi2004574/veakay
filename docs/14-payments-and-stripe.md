# Payments and Stripe

## Overview

Stripe is the client-confirmed payment processor for all money movement: donations, traveler/agency payouts, commission splitting, and agency subscription billing. Specifically, **Stripe Connect** is the marketplace product that makes this possible, plain Stripe Payments alone is not enough once money needs to be split and paid out to two different kinds of accounts (travelers and agencies).

This replaces the RevenueCat pattern used on Miralynk. Veakay's "subscription tiers" belong to agencies (B2B), not a consumer app-store subscription tied to the mobile app the way Miralynk's Free/Pro/Premium tiers are, so RevenueCat doesn't have a clean use case here.

## Why Not Apple/Google In-App Purchase for Everything

Apple and Google require that digital goods and subscriptions consumed *inside* a native mobile app go through their own billing systems if the purchase happens in-app. This is exactly the constraint that pushes Miralynk to RevenueCat.

Veakay is different in two ways that matter:

1. **Donations are not a digital in-app purchase.** They're money given for a real-world purpose (someone's trip), the same category Apple exempts for apps like GoFundMe and Kickstarter, and the same reasoning Uber/Airbnb rely on to use their own payment processors instead of IAP for real-world services. Stripe directly for donations is standard practice for this category.
2. **The agency subscription (Basic/Premium/Featured) is genuinely ambiguous** (open question #28). If it's purchased *inside* the native agency app, Apple/Google IAP rules likely apply and Stripe cannot be used directly for that specific transaction. The default assumption in this project is to sell the subscription via a **web-based billing page** (a browser view, not the native app's purchase UI), which sidesteps IAP requirements entirely. Do not build an in-app purchase flow for the subscription until this is confirmed with the client; if confirmed as web-based, standard Stripe Billing applies with no special handling needed.

## Subscription Tiers

Already resolved from the client's existing prototype, not invented:

```text
basic      → $0/month,  15% commission per booking
premium    → $49/month, 10% commission per booking (marked "recommended" in the prototype)
featured   → $99/month, 8% commission per booking, plus top-of-search placement
```

## Money Flows

### Donation

```text
1. Traveler-side app calls POST /api/v1/campaigns/:id/donate.
2. Backend creates a Stripe PaymentIntent for the donation amount.
3. Client confirms payment via Stripe's client SDK (Payment Sheet / Elements).
4. Stripe sends payment_intent.succeeded webhook.
5. Webhook handler stores the raw event (idempotency by event id), enqueues payment.reconcile.
6. Worker records a Contribution (type=donation), updates the campaign's raised_amount.
7. Worker checks for a milestone crossing (25/50/100%), enqueues a celebration notification if so.
```

### Traveler Withdrawal

```text
1. Traveler onboards a Stripe Connect account (once, via a hosted onboarding link) before their first withdrawal attempt.
2. POST /api/v1/payments/withdraw is called once the campaign is eligible
   (eligibility rules pending open question #1 — lifecycle status model).
3. If the withdrawal amount crosses the (still-undefined) high-value threshold, an identity verification
   step gates the request (open question #3) — Stripe Connect's own onboarding KYC covers the account-opening
   check, but a threshold-triggered extra check may need Stripe Identity as a supplement.
4. Backend initiates a Stripe Connect transfer to the traveler's connected account.
5. Stripe sends transfer.paid or transfer.failed webhook, updates the withdrawal record accordingly.
6. Writes an audit log entry.
```

### Agency Payout (Booking Commission)

```text
1. Agency onboards a Stripe Connect account before receiving their first payout.
2. When a booking is paid, the transfer to the agency's connected account is created with
   application_fee_amount set to the commission percentage for their current subscription tier
   (15% Basic, 10% Premium, 8% Featured).
3. Stripe automatically routes the fee portion to the platform's own balance, the rest to the agency.
```

### Agency Subscription (Basic / Premium / Featured)

```text
Default assumption (pending open question #28 confirmation):
1. Agency visits a web billing page (not the native app) to select or change tier.
2. Stripe Billing handles the recurring charge directly, no App Store/Play Store involved.
3. Stripe subscription webhook updates agencies.subscription_tier and the local subscriptions table.
4. Next commission calculation on a booking uses the updated tier's rate immediately.

If the client confirms native in-app purchase is required instead:
  Do not build this without first evaluating RevenueCat or a direct Apple/Google IAP integration,
  since Stripe cannot be used directly for an in-app-purchased subscription. This is a real
  architecture fork, not a small config change, treat it as a fresh planning conversation if it comes up.
```

### Refund

```text
1. Admin (or an automated fraud-flag process, once open question #21/#22 land) triggers a refund
   for a canceled/fraudulent campaign.
2. If the funds are still in the platform's Stripe balance (not yet withdrawn): a standard Stripe refund is issued.
3. If the funds were already transferred out to the traveler's connected account and further to their bank:
   Stripe cannot claw this back automatically. This exact scenario is open question #4 and is a real
   solvency/legal question, not an engineering one — do not build automatic bank-level recovery logic
   without an explicit policy decision from the client.
4. Whichever policy is chosen, the refund event and its outcome (recovered / written off / pursued externally)
   must be written to audit_logs.
```

## Stripe Connect Country Coverage

Stripe Connect only supports payouts in a defined list of countries. Given the app's destinations (Bali, Dubai, and others shown in the client's own designs), check `stripe_connect_accounts.country` against Stripe's supported list **before** onboarding an agency, not after they've already gone through document verification. See `05-database-design.md`.

## Database Structures

See `05-database-design.md` for `stripe_connect_accounts`, `withdrawals`, `stripe_webhook_events`, `subscriptions`, and `contributions`.

## API Endpoints

```text
POST /api/v1/payments/connect/onboard        → generate Stripe Connect onboarding link (traveler or agency)
GET  /api/v1/payments/connect/status         → check onboarding completion
POST /api/v1/campaigns/:id/donate             → create a donation PaymentIntent
POST /api/v1/payments/withdraw                → request a withdrawal
GET  /api/v1/me/withdrawals                    → withdrawal history
POST /api/v1/webhooks/stripe                    → Stripe webhook (public, signature-verified)

GET  /api/v1/admin/payments                     → all payments/withdrawals (super_admin)
POST /api/v1/admin/payments/:id/refund          → issue a refund (super_admin)
POST /api/v1/admin/stripe-events/:id/reprocess  → reprocess a failed webhook event (super_admin)
```

## Idempotency

`stripe_webhook_events.event_id` is unique. Duplicate events are rejected without processing. `payment.reconcile` checks `processing_status` before processing.

## Logging and Audit

```text
Pino:
  INFO  → webhook received { eventId, eventType }
  INFO  → payment reconciled { campaignId, amount, type }
  WARN  → duplicate event_id rejected { eventId }
  ERROR → reconcile failed { eventId, reason }

Audit logs:
  donation.received
  withdrawal.requested / withdrawal.completed / withdrawal.failed
  refund.issued
  subscription.tier_changed
```

## Testing

### Unit Tests
- `payment_intent.succeeded` event creates a Contribution and updates campaign raised_amount.
- `transfer.failed` event marks withdrawal failed and notifies the user.
- Duplicate event_id is rejected without side effects.
- Commission calculation uses the agency's current subscription tier rate.
- Withdrawal above the high-value threshold requires identity_verified=true.

### E2E Tests
- POST /api/v1/webhooks/stripe with a valid payload updates campaign/withdrawal state in the DB.
- Withdrawal request below the threshold succeeds without identity verification.
- Withdrawal request above the threshold is blocked pending verification.

## Open Questions

Directly relevant here: #1 (lifecycle model, gates withdrawal eligibility), #3 (high-value threshold), #4 (refund-after-withdrawal), #5 (whether "campaign verification" = KYC), #27 (fee on donations, separate from agency commission), #28 (in-app purchase vs. web billing for agency subscription). See `Veakay_TRD_Open_Questions.md` for the full detail on each.
