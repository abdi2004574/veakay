# Logging and Audit

## Overview

```text
Pino structured logs       → runtime request, error, and job logs
audit_logs table           → admin and security-sensitive actions (append-only)
reports table              → user/system-generated content reports
stripe_webhook_events      → raw Stripe payment events
BullMQ job state           → job retries, failures, attempts
```

## Pino Logs

Via `nestjs-pino`. Development: `pino-pretty`. Production: raw JSON.

### Log Fields

```text
timestamp, level, context, request_id, user_id (if authenticated), method, path, status_code, duration_ms, message
```

### Log Levels

```text
DEBUG   → detailed tracing in development only
INFO    → request completed, job started/completed, user action
WARN    → unexpected but handled situations (OTP resend, rate limit approaching)
ERROR   → exceptions, job failures, integration errors
```

### What Is Never Logged

```text
JWT tokens or refresh tokens
Passwords or password hashes
OTP codes (plain text)
Stripe secret keys or webhook secrets
S3/MinIO credentials
Presigned URLs
FCM tokens
Agency document contents
```

## Audit Logs

Stored in `audit_logs`, readable only by super admins, append-only.

Audit log actions:

```text
user.registered
user.login
user.logout
user.deactivated
user.reactivated
user.email_verified
agency.registered
agency.approved
agency.rejected
agency.staff_added
agency.staff_removed
campaign.created
campaign.edited
campaign.deleted
campaign.flagged
campaign.approved
donation.received
withdrawal.requested
withdrawal.completed
withdrawal.failed
refund.issued
review.created
review.removed_by_admin
admin.report_resolved
admin.report_dismissed
admin.content_removed
admin.broadcast_sent
```

Business services call `AuditService.record()` after successful state changes. Technical errors stay in Pino logs, not audit logs.

Only `super_admin` can read raw audit logs via:

```text
GET /api/v1/admin/audit-logs
GET /api/v1/admin/audit-logs/:id
```

Filters: actor, role, action, target type, target id, date range, cursor pagination.

**Retention:** the exact required duration is open question #23 in `Veakay_TRD_Open_Questions.md`, since these logs cover financial actions and many jurisdictions have minimum retention requirements. Do not set an arbitrary deletion job until that's confirmed, default to indefinite retention until told otherwise.

## Reports

User-generated and system-generated content reports, feeding the admin moderation queue. See `05-database-design.md` for the `reports` table, which deliberately includes `review` and `message` as reportable target types even though the TRD's own admin moderation scope text only names posts/blogs/photos/campaign media, see open question #12.

## Provider Webhook Logs

Stripe webhook events are stored in `stripe_webhook_events` before processing:
- No event is lost if processing fails.
- Duplicate events are detected by `event_id` uniqueness.
- Failed events can be reprocessed manually via the admin dashboard.

## BullMQ Job Logs

```text
INFO   → job started (job name, job id, entity ids)
INFO   → job completed (job name, job id, duration)
WARN   → job failed attempt X of Y (reason)
ERROR  → job permanently failed (reason, final attempt)
```

High-stakes jobs (withdrawal processing, milestone notifications) also store state on the affected entity row so admins can inspect it without Redis access.

## Testing Requirements

- Every HTTP request log includes request_id.
- Admin mutation writes an audit log with correct action and target.
- Sensitive fields are absent from all logs.
- Duplicate Stripe webhook event does not create duplicate audit entries or double-process a payment.
- Failed BullMQ job logs include job name, attempt number, and failure reason.
