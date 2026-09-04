# Background Jobs

## Overview

BullMQ with Redis as the queue backend. All async processing that should not block an HTTP response is handled by BullMQ workers.

## Queue Configuration

```text
Queue name             Priority   Concurrency   Retry attempts
payments               highest    5             3
notifications          high       10            3
campaigns              normal     3             2
badges                 normal     3             2
moderation             low        3             2
cleanup                low        1             1
```

## Jobs

### payment.reconcile

Trigger: Stripe webhook received.

```text
Input:   { webhookEventId, eventType, payload }
Does:
  1. Load stripe_webhook_events row by webhookEventId.
  2. If already processed: return early (idempotent).
  3. Apply event:
     payment_intent.succeeded → record Contribution, update campaign raised_amount
     transfer.paid            → mark withdrawal completed
     transfer.failed          → mark withdrawal failed, notify user
     charge.refunded          → record refund, update campaign state
  4. Mark stripe_webhook_events.processing_status = processed.
  5. Write to audit_logs.
Retry:   3 attempts.
```

### campaign.milestone_check

Trigger: after every donation.

```text
Input:   { campaignId }
Does:
  1. Recalculate funding percentage.
  2. If a 25/50/100% threshold was just crossed: enqueue notification.send with celebration payload for the campaign owner.
  3. (Open question: whether donors also get a lighter celebration notification — build the owner-side trigger now, add donor-side once confirmed.)
Retry:   2 attempts.
```

### campaign.expiry_check

Trigger: daily cron.

```text
Does:
  1. Query campaigns where trip_end_date has passed and status is still active.
  2. Transition status per the (still-undefined) lifecycle rules — this job is a placeholder until
     open question #1 is answered; do not hardcode a transition target yet.
```

### badge.milestone_check

Trigger: recurring job, evaluates traveler activity against the (admin-configurable, still-undefined) Explorer/Jetsetter thresholds.

```text
Input:   { userId }
Does:
  1. Reads the admin-configured threshold values.
  2. Compares against the traveler's actual trip/campaign history.
  3. Upgrades traveler_profiles.badge if crossed.
  4. Enqueues a celebration notification.
Retry:   2 attempts.
Note:    Threshold values themselves are open question #7 — this job is fully buildable now,
         only the numbers are pending.
```

### agency.verification_reminder

Trigger: daily cron.

```text
Does:
  1. Query agencies with status=pending_verification older than the review SLA
     (the prototype's own copy says "2-3 business days" — safe to adopt as the reminder threshold).
  2. Notify admins of the backlog.
```

### moderation.report_intake

Trigger: a report is created (post, comment, review, or message).

```text
Input:   { targetType, targetId, reporterId }
Does:
  1. Creates a report record with status=pending.
  2. Enqueues admin notification for the moderation queue.
```

### cleanup.orphaned_media

Trigger: daily cron.

```text
Does:
  1. Query media_assets with status=pending older than 24 hours.
  2. Delete objects from S3/MinIO, delete media_assets rows.
```

### cleanup.expired_otps

Trigger: hourly cron.

```text
Does:
  1. Delete otp_codes rows where expires_at < now() OR is_used = true.
```

### cleanup.expired_tokens

Trigger: daily cron.

```text
Does:
  1. Delete refresh_tokens rows where expires_at < now() OR is_revoked = true.
  2. Clean expired JWT blacklist entries from Redis.
```

## Job Logging

Every job processor logs job started/completed/failed with job name, job id, and duration. High-stakes jobs (payment.reconcile) also write state to the affected row in PostgreSQL.

## Testing

### Unit Tests
- `payment.reconcile` processor handles each Stripe event type correctly and rejects duplicates.
- `campaign.milestone_check` fires exactly once per threshold crossed, not repeatedly.
- `badge.milestone_check` is idempotent (does not re-upgrade an already-upgraded badge).

### E2E Tests
- Stripe webhook receipt enqueues `payment.reconcile`.
- A donation crossing 50% funding enqueues a milestone notification.
