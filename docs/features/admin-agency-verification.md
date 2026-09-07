# Admin Agency Verification

## Goal

Allow super admins to review pending agency registrations and transition them to approved or rejected states, with structured audit logging and email notifications to the agency owner. This closes the TRD open question #10 (agency rejection flow) and unblocks the agency onboarding pipeline.

## MVP Scope

- List all agencies in `pending_verification` status.
- Approve a pending agency: transitions to `approved`, sends confirmation email, emits Pino audit log.
- Reject a pending agency: requires a reason string, transitions to `rejected` with `rejectionReason` stored, sends rejection email with the reason, emits Pino audit log.
- Guard all endpoints with `@RequirePlatformRole(super_admin)`.

## Later Scope

- Verification checklist / document validation UI (admin dashboard — not yet scoped).
- Bulk approve/reject.
- Auto-approval rules based on document completeness.
- Webhook/notification to agency on status change (email is MVP; push notification deferred to Feature #10).

## Roles and Permissions

| Action | Allowed role | Condition |
|---|---|---|
| List pending agencies | super_admin | Platform role guard |
| Approve agency | super_admin | Agency must be `pending_verification` |
| Reject agency | super_admin | Agency must be `pending_verification`; `reason` field required |

## Main Flows

### Admin approves an agency

1. Admin calls `GET /admin/agencies/pending`.
2. Admin calls `POST /admin/agencies/:id/approve`.
3. Backend validates agency is `pending_verification`.
4. Backend updates status to `approved`.
5. Backend emits Pino audit log: `agency.verification.approved`.
6. Backend sends confirmation email via `MailService.sendAgencyApprovedEmail`.
7. Backend returns the updated agency record.

### Admin rejects an agency

1. Admin calls `GET /admin/agencies/pending`.
2. Admin calls `POST /admin/agencies/:id/reject` with `{ reason: string }`.
3. Backend validates agency is `pending_verification`.
4. Backend updates status to `rejected`, sets `rejectionReason`.
5. Backend emits Pino audit log: `agency.verification.rejected`.
6. Backend sends rejection email via `MailService.sendAgencyRejectedEmail`.
7. Backend returns the updated agency record.

## API Endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| GET | /admin/agencies/pending | @RequirePlatformRole(super_admin) | List pending agencies with nested user info. |
| POST | /admin/agencies/:id/approve | @RequirePlatformRole(super_admin) | Approve a pending agency. |
| POST | /admin/agencies/:id/reject | @RequirePlatformRole(super_admin) | Reject a pending agency with a reason. |

## Database Models

### Existing models used (no schema changes required)

- `Agency`: `status` (ENUM: pending_verification | approved | rejected), `rejectionReason` (string, nullable), `reputationScore`, `subscriptionTier`, `logoMediaId`, `agencyName`, `businessContact`, `businessAddress`
- `AgencyDocument`: `agencyId`, `type`, `mediaId`
- `User`: `email`, `displayName`, `username`, `role`

The `rejectionReason` column already exists on the `Agency` model — no migration needed.

## Edge Cases

- **Already approved/rejected**: Attempting to approve or reject an agency that is no longer `pending_verification` returns 422 `BUSINESS_RULE`.
- **Missing reason**: Rejecting without a `reason` field returns 400 `VALIDATION_ERROR`.
- **Non-existent agency**: Returns 404 `NOT_FOUND`.
- **Non-admin access**: Returns 403 `FORBIDDEN`.
- **Email delivery failure**: `MailService.send` throws; the agency status is still updated in the same transaction (mail is sent after the DB update). If mail delivery fails, the admin can retry or the agency can contact support. A future improvement would be to queue emails via BullMQ for retry.

## Open Questions

| # | Question | Resolution for this feature |
|---|---|---|
| #10 | Agency rejection flow | Resolved: admin provides a reason string stored in `rejectionReason`; rejection email includes the reason. |
| — | Verification checklist categories | Deferred — TODO left in code for future admin dashboard implementation. |