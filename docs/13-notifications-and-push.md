# Notifications and Push

## Overview

Two delivery channels, same as Miralynk's pattern:

```text
Socket.io   → real-time in-app delivery when user is connected
Firebase    → push notification when user is offline or app is backgrounded
```

Both triggered by the same `notification.send` BullMQ job, which checks online presence and picks the channel.

## Notification Types

```text
donation               → someone donated to your campaign
milestone              → campaign hit 25/50/100% funded
agency_response        → agency responded to your request
chat_message           → new message (delivered via chat gateway, push if offline)
like                   → someone liked your post
comment                → someone commented on your post
share                  → someone shared your post/campaign
review_received        → agency received a new review
verification_status    → agency registration approved/rejected
account_status         → account deactivated/reactivated
campaign_flagged       → campaign flagged or approved by admin
admin_broadcast        → broadcast from super admin
```

This list is deliberately built to cover every trigger described anywhere in the TRD for any role (traveler, agency, admin), including several the TRD's own Notifications sections omitted but the Settings sections implied should exist, and a few found missing entirely during the TRD review (verification_status, account_status, review_received had no notification trigger described anywhere in the original document).

## Notification Settings

Every value in the `notifications.type` enum has a corresponding toggle in `notification_settings`, one row per user per type, default enabled. This directly fixes a pattern found repeatedly during the TRD review: Settings screens in the TRD had fewer toggle categories than the actual notification triggers described, for all three roles (traveler, agency, admin) independently.

```text
notification_settings
  user_id
  type
  is_enabled   default: true
```

## Delivery Flow

```text
1. Service emits event (e.g. PaymentsService after a donation is recorded).
2. NotificationsService.enqueue() enqueues notification.send BullMQ job.
3. Worker checks notification_settings, skip if disabled.
4. Worker creates notification record in PostgreSQL.
5. Worker checks presence:{recipientId} in Redis.
   → Online: emit notification.new via Socket.io.
   → Offline: call Firebase Admin SDK to send push to users.fcm_token.
```

## Firebase Push

### Single User

```text
firebase.messaging().send({
  token: user.fcm_token,
  notification: { title, body },
  data: { type, entityId, deepLink }
})
```

### Broadcast (Admin)

```text
firebase.messaging().sendToTopic({
  topic: 'all-users' | 'all-travelers' | 'all-agencies',
  notification: { title, body },
  data: { type }
})
```

Users are subscribed to the relevant topic(s) on login based on their role.

### FCM Token Management

```text
PATCH /api/v1/me/fcm-token { fcmToken }
```

Stale tokens are removed from the user record on `messaging/registration-token-not-registered` error.

## Notification Record

```text
notifications
  id
  recipient_id
  type
  title
  body
  data          JSONB  (deep link payload)
  is_read       false by default
  read_at       null until user reads
  created_at
```

## Notification API

```text
GET   /api/v1/notifications               → paginated list for current user
POST  /api/v1/notifications/read-all       → mark all as read
PATCH /api/v1/notifications/:id/read       → mark single notification as read
GET   /api/v1/notifications/settings       → get per-type settings
PATCH /api/v1/notifications/settings       → update per-type settings
PATCH /api/v1/me/fcm-token                  → update FCM token
```

## Email Channel (Financial Events)

Donation receipts, milestone confirmations, and password-change confirmations are also sent via email (SMTP, MailHog locally / production provider TBD), not just push, matching a gap found during the TRD review where financial events had no email channel described at all, only push.

## Admin Broadcast

```text
POST /api/v1/admin/notifications/broadcast
{
  target: "all" | "role" | "user",
  role: "traveler" | "agency",
  userId: "...",
  title: "...",
  body: "...",
  data: {}
}
```

## Testing

### Unit Tests
- Notification is skipped when user has disabled that type in settings.
- Firebase push is called when user is offline, Socket.io event when online.
- Stale FCM token is cleared on delivery failure.

### E2E Tests
- A donation creates a notification record and enqueues send job.
- PATCH /api/v1/notifications/settings updates settings and is reflected in next delivery.
- GET /api/v1/notifications returns paginated list for authenticated user.
