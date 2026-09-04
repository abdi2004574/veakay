# Real-Time and WebSockets

## Overview

Socket.io via `@nestjs/websockets`. Redis pub/sub (`@socket.io/redis-adapter`) as the adapter so multiple NestJS instances can share socket state.

## Gateways

```text
ChatGateway              → handles all chat events (1:1 friend, group friend, 1:1 agency)
NotificationsGateway     → real-time notification delivery
```

No polls/presence-heavy gateway is needed the way Miralynk has one; Veakay's real-time surface is chat + notifications only, per the TRD.

## Authentication

```text
Client connects: ws://host/socket.io?token=<access_token>
  → JwtAuthGuard on handshake verifies token
  → Token blacklist checked in Redis
  → On success: user attached to socket, connection proceeds
  → On failure: connection rejected with 401
```

## Room Strategy

```text
Personal room:    user:{userId}         → notifications, personal events
Chat rooms:       chat:{chatId}         → messages for a specific chat (friend or agency)
```

On connection, each user is joined to their personal room and all chat rooms for their active chats.

## Chat Events

### Client → Server

```text
chat.send_message
  payload: { chatId, content, type, mediaId? }
  does:
    1. Validates sender is a participant in chatId.
    2. Persists message to PostgreSQL.
    3. Publishes to Redis pub/sub for chat:{chatId}.
    4. Emits chat.new_message to all room participants.
    5. Enqueues notification.send for offline participants.

chat.mark_read
  payload: { chatId }
  does: updates chat_participants.last_read_at, emits chat.read_receipt

chat.typing_start / chat.typing_stop
  payload: { chatId }
  does: emits chat.typing / chat.typing_stopped, no database write (ephemeral)
```

### Server → Client

```text
chat.new_message      payload: { messageId, chatId, senderId, content, type, mediaUrl, createdAt }
chat.read_receipt     payload: { chatId, userId, readAt }
chat.typing           payload: { chatId, userId }
chat.typing_stopped   payload: { chatId, userId }
chat.participant_joined / chat.participant_left   payload: { chatId, userId }
```

## Notification Events

```text
notification.new
  payload: { notificationId, type, title, body, data }
  room:    user:{recipientId}
```

## Online Presence

```text
On connect:    SET presence:{userId} 1 EX 300 (5 minute TTL)
On heartbeat:  reset TTL every 60 seconds
On disconnect: DEL presence:{userId}
```

## Offline Message Delivery

If a message recipient is not connected via Socket.io, the message is delivered via Firebase push instead.

```text
ChatGateway checks presence:{recipientId} in Redis.
  → Online: emit chat.new_message to user:{recipientId} room.
  → Offline: enqueue notification.send job for Firebase push delivery.
```

## Error Handling in Gateways

```text
chat.error
  payload: { code, message }
  codes: UNAUTHORIZED | FORBIDDEN | NOT_FOUND | BUSINESS_RULE
```

## Audio/Video Calling

Not part of the Socket.io chat gateway. The TRD requires "Audio & Video Calls with Agency" but names no vendor. This is handled by a separate `CallService` behind `ICallProvider`, whichever SDK is chosen (the vendor typically handles the actual media transport client-side; the backend's role is limited to session creation/metadata, mirroring how Miralynk uses Zoom API for the same purpose).

## Testing

### Unit Tests
- `ChatGateway.handleSendMessage` rejects sender not in chat.
- Typing events do not write to database.

### E2E Tests
- Client connects with valid JWT and receives connection confirmation.
- Client connects with invalid JWT and connection is rejected.
- Client sends `chat.send_message`, message is persisted and emitted to room.
- Offline user receives Firebase push instead of a socket event.
