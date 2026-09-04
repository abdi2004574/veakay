---
# User Requests & Communication

## Goal

Let travelers send trip-planning requests to approved agencies, track them through a booking lifecycle, and let agencies respond, manage those requests, and reuse canned replies — all anchored to the existing Chat module so quotes/documents actually move through the same conversation the traveler already has open. Build the trip-request / booking sub-scope of Feature #9 (Agency Dashboard & Business Tools). Does **not** touch agency profile, staff management, revenue display, or support tickets.

## MVP Scope

- `TripRequest` model linking a traveler to an agency, optionally referencing an existing `Package` and/or a `Campaign` (the campaign is the traveler's own; the package is the agency's). Lifecycle: `pending → in_discussion → confirmed → completed`, with `declined` and `cancelled` as terminal off-ramps.
- Traveler-facing `POST /trip-requests` to start a request against an agency (optional `packageId`/`campaignId` references).
- Agency-facing list with optional status filter, detail view, and status transitions.
- `SmartReplyTemplate` model scoped to an agency: CRUD for reusable canned responses the agency staff can insert into chat replies.
- On request creation, lazily create or reuse a `Conversation` of type `agency` between the traveler and the agency (same `ConversationsService.create` lazy-fan-out pattern as Group Trips).
- Documents/quotes are **not** a parallel upload path — agencies send them through the existing Chat module's document-message flow. The request itself only stores the request metadata; chat attachments handle file sharing.
- Booking confirmation does **not** trigger invoicing/commission. Payment/commission logic is owned by Feature #6 + VEAK-043, both blocked. A `TODO: invoicing/commission deduction pending Feature #6` marker sits at the transition point for future work.

## Later Scope

- Per-stage SLA reminders (no time-based escalation logic, per TRD open question none, deferred).
- Booking calendar / agency availability calendar.
- Request assignment to a specific agency staff member (tied to #9's staff-management sub-scope, not built here).
- Auto-quote generation from a linked package's `basePrice`.
- Traveler-initiated cancellation reason capture.
- Read receipts / unread tracking on a request list (chat already tracks conversation unread).

## Roles and Permissions

| Action | Allowed role | Condition |
|---|---|---|
| Create trip request | traveler | Target agency must be `approved`; references must be owned by the caller (own campaign) |
| List my requests (traveler view) | traveler | Caller is the request's `travelerId` |
| View request detail | traveler, agency | Traveler is the request's `travelerId`, or the request is for an agency the caller owns/staffs |
| Update request status | agency | Caller is staff of the request's agency; transition follows the lifecycle rules |
| Cancel a request | traveler | Caller is the request's `travelerId`; only allowed while status is `pending` or `in_discussion` |
| List smart-reply templates | agency | Caller is staff of the owning agency |
| Create/update/delete a smart-reply template | agency | Caller is staff of the owning agency; CRUD scoped to own agency only |

## Main Flows

### Traveler creates a request

```text
1. Traveler calls `POST /trip-requests` with `agencyId`, `message` (the initial inquiry), and optional `packageId`/`campaignId`.
2. Backend verifies the target agency is `approved`.
3. If `packageId` provided: must exist and belong to the target agency. If `campaignId` provided: must exist and be owned by the caller.
4. Backend creates the `TripRequest` row in `pending` status.
5. Backend reuses-or-creates a `Conversation` of type `agency` for `(traveler, agency)` (mirrors Group Trips' lazy `groupConversationId` pattern).
6. Backend auto-posts the request's `message` into that conversation as a `text` message from the traveler, so the chat thread already has the inquiry context when the agency opens it.
7. Backend returns the request with `conversationId` populated.
```

### Agency lists and filters requests

```text
1. Agency staff call `GET /trip-requests?status=pending&cursor=...&limit=20`.
2. Backend filters to requests where `agencyId = callerAgencyId`.
3. Cursor-paginated by `createdAt desc`.
```

### Agency transitions a request

```text
1. Agency staff call `PATCH /trip-requests/:id/status` with a new status.
2. Backend verifies the caller is staff of the request's agency.
3. Backend verifies the transition is allowed by the lifecycle (see Edge Cases).
4. Backend updates status, writes an audit log via `AuditService` (status transitions are an important business state change, per `03-engineering-principles.md`).
5. // TODO: invoicing/commission deduction pending Feature #6 — when status transitions to `confirmed`, this is where the booking-invoice trigger would normally fire.
```

### Traveler cancels a request

```text
1. Traveler calls `POST /trip-requests/:id/cancel`.
2. Backend verifies caller owns the request and status is `pending` or `in_discussion`.
3. Backend sets status to `cancelled`. The underlying Chat conversation is left intact (history preserved) — no separate close.
```

### Agency manages smart-reply templates

```text
1. `GET /trip-requests/smart-replies/templates` — list own agency's templates.
2. `POST /trip-requests/smart-replies/templates` — create `{ title, body }`.
3. `PATCH /trip-requests/smart-replies/templates/:id` — update title/body.
4. `DELETE /trip-requests/smart-replies/templates/:id` — delete.
5. CRUD is scoped to the caller's agency; ownership is enforced on every operation.
```

## API Endpoints

All endpoints are `@ApiBearerAuth()`. `@RequireRole(...)` is enforced via the existing global guard chain.

### Traveler endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| POST | `/trip-requests` | `@RequireRole(traveler)` | Create a trip request against an agency. |
| GET | `/trip-requests/mine` | `@RequireRole(traveler)` | List my own trip requests (filterable by `status`, cursor-paginated). |
| GET | `/trip-requests/:id` | traveler or agency (ownership-checked) | Get a trip request detail. |
| POST | `/trip-requests/:id/cancel` | `@RequireRole(traveler)` (ownership-checked) | Cancel a request I created (only `pending`/`in_discussion`). |

### Agency endpoints

| Method | Path | Auth | Summary |
|---|---|---|---|
| GET | `/trip-requests` | `@RequireRole(agency)` | List incoming trip requests for my agency (filterable by `status`, cursor-paginated). |
| PATCH | `/trip-requests/:id/status` | `@RequireRole(agency)` (ownership-checked) | Transition a request's status. |

### Smart-reply template CRUD (agency)

| Method | Path | Auth | Summary |
|---|---|---|---|
| GET | `/trip-requests/smart-replies/templates` | `@RequireRole(agency)` | List my agency's templates. |
| POST | `/trip-requests/smart-replies/templates` | `@RequireRole(agency)` | Create a template. |
| PATCH | `/trip-requests/smart-replies/templates/:id` | `@RequireRole(agency)` (ownership-checked) | Update a template. |
| DELETE | `/trip-requests/smart-replies/templates/:id` | `@RequireRole(agency)` (ownership-checked) | Delete a template. |

The "respond with a quote/document" requirement from the TRD is **not** a separate endpoint — it routes through the existing `POST /conversations/:id/messages` endpoint (`type: 'document'`), reusing the chat document-sharing flow already in place from Feature #3.

## Database Models

### New models

```text
trip_requests
  id                UUID PK
  traveler_id       UUID FK → users
  agency_id         UUID FK → agencies
  package_id        UUID FK → packages nullable
  campaign_id       UUID FK → campaigns nullable
  status            ENUM: pending | in_discussion | confirmed | completed | declined | cancelled
  initial_message   TEXT  (the traveler's opening message, also auto-posted to the chat)
  conversation_id   UUID FK → conversations nullable  (set on creation; chat threads continue to live independently afterwards)
  created_at        TIMESTAMP
  updated_at        TIMESTAMP

  INDEX (agency_id, status)
  INDEX (traveler_id, status)

smart_reply_templates
  id                UUID PK
  agency_id         UUID FK → agencies
  title             VARCHAR
  body              TEXT
  created_at        TIMESTAMP
  updated_at        TIMESTAMP

  INDEX (agency_id)
```

### Schema changes to existing models

- `Agency` model: add `tripRequests TripRequest[]`, `smartReplyTemplates SmartReplyTemplate[]`.
- `User` model: add `tripRequests TripRequest[]` (traveler side).
- `Package` model: add `tripRequests TripRequest[]` (optional reference).
- `Campaign` model: add `tripRequests TripRequest[]` (optional reference).
- `Conversation` model: add `tripRequests TripRequest[]` (back-reference for the request that opened the chat).

### Status lifecycle

```
pending ──→ in_discussion ──→ confirmed ──→ completed
   │              │                │
   └──→ declined  └──→ declined    └──→ cancelled (only from pending/in_discussion)
                  └──→ cancelled
```

Legal transitions:

```text
pending        → in_discussion, declined, cancelled
in_discussion  → confirmed, declined, cancelled
confirmed      → completed
completed      → (terminal)
declined       → (terminal)
cancelled      → (terminal)
```

No back-transitions (e.g. `declined → pending`) are allowed.

## Edge Cases

- **Agency approval gate**: Travelers can only create requests against `approved` agencies. Targeting a `pending_verification` or `rejected` agency returns 404 (consistent with the public directory hiding non-approved agencies).
- **Reference ownership**: A `packageId` reference must belong to the target agency. A `campaignId` reference must be owned by the requesting traveler. Mismatches return 404.
- **Status-transition guards**: Status updates outside the legal transitions above return `BUSINESS_RULE` (422).
- **Traveler cancel scope**: A traveler can only cancel while status is `pending` or `in_discussion`. Once an agency has `confirmed`, cancellation is agency-side only (decline the booking).
- **Conversation reuse**: Creating a request for an agency when the traveler already has an open agency conversation with them reuses the existing `Conversation` — does not create a duplicate chat. The auto-posted `initial_message` still lands in that conversation (creates a new chat turn, not a new conversation).
- **Smart-reply template scope**: Templates are per-agency, not per-staff. A staff member sees and edits only their own agency's templates.
- **Confirmed booking without payment**: When a request transitions to `confirmed`, a `// TODO: invoicing/commission deduction pending Feature #6` comment marks the hook point. No invoice, commission call, or payout side-effect is created here.
- **Chat detachment**: The request row's `conversationId` is a snapshot/reference. Deleting the request must NOT delete the underlying conversation — they are independent entities linked by id, not by cascade.
- **Audit logging on status change**: Every status transition performed by an agency writes a row to `audit_logs` via `AuditService.record` (action: `trip_request.status_changed`, with before/after statuses). Per `03-engineering-principles.md`'s "important business state change" rule.
- **Soft-delete policy**: Trip requests are hard-deleted only by an admin (not built in this pass; out of scope). No soft-delete column on this model — the underlying conversation keeps the chat history regardless. If admin soft-delete becomes a requirement later, migrate then.
- **Cursor pagination**: `limit` defaults to 20, max 50, same convention as the rest of the API.
- **No new notifications wired yet**: Triggering a notification on request creation/update is owned by Feature #10 — this pass emits no notifications itself. The chat conversation already creates the obvious "new message" notification surface via the existing chat send pipeline.

## Open Questions

| # | Question | Resolution for this feature |
|---|---|---|
| #1 | What marks a trip/campaign as "completed"? | `TripRequest.status = completed` is set explicitly by the agency. No automatic transition (TRD open question #1 still unresolved). |
| #26 | Can an agency confirm a booking before the campaign is fully funded? | Allowed — a request can transition to `confirmed` regardless of campaign funding state. Booking confirmation is a separate workflow from funding. (TRD open question #26) |
| — | Max message length on `initial_message` | 2000 chars, matching figma-demo's message-length cap observed elsewhere. |
| — | Multi-staff assignment per request | Out of scope; tied to Feature #9's staff-management sub-scope. |
| — | Smart-reply template per-staff vs per-agency | Per-agency (matches the chat shared-inbox model from Feature #3 — every staff member sees the same set). |

---
