# API Standards

## Base URL

```text
/api/v1/
```

Swagger docs at `/api/v1/docs`.

## Authentication

Protected routes require a JWT Bearer token:

```text
Authorization: Bearer <access_token>
```

Unauthenticated requests to protected routes return `401 Unauthorized`. Public routes (login, register, OTP verify, health check, Stripe webhooks) are marked with `@Public()`.

## HTTP Methods

```text
GET     → read, list, search (never mutates state)
POST    → create, trigger actions (login, donate, withdraw)
PATCH   → partial update of a resource
DELETE  → soft or hard delete
```

## Response Shape

### Success

```json
{ "success": true, "data": { ... } }
```

### Success with pagination

```json
{
  "success": true,
  "data": [ ... ],
  "meta": { "cursor": "base64encodedcursor", "hasMore": true }
}
```

### Error

```json
{
  "success": false,
  "error": { "code": "FORBIDDEN", "message": "Agencies only" }
}
```

## HTTP Status Codes

```text
200   → successful GET, PATCH
201   → successful POST that creates a resource
204   → successful DELETE (no response body)
400   → validation error, bad request
401   → missing or invalid JWT
403   → authenticated but not authorized (wrong role, deactivated, not owner)
404   → resource not found
409   → conflict (duplicate email, duplicate review for a trip)
422   → business rule violation (campaign already funded, withdrawal below threshold)
429   → rate limit exceeded
500   → unexpected server error
```

## Pagination

Cursor-based for all list endpoints (feed, chat history, notifications, Explore). Default page size: 20, maximum 50.

```text
GET /api/v1/feed?cursor=<base64cursor>&limit=20
```

## Validation

`class-validator` decorators via the global `ValidationPipe`, `whitelist: true` (unknown fields stripped silently), `transform: true`.

## Route Naming Conventions

```text
/api/v1/auth/**                 → public auth flows (traveler, agency, admin)
/api/v1/me/**                   → current user's own resources
/api/v1/users/:userId/**        → user-scoped resources
/api/v1/agencies/**             → agency resources
/api/v1/campaigns/**            → campaign resources
/api/v1/packages/**             → agency package resources
/api/v1/groups/**                → group travel fund resources
/api/v1/reviews/**               → review resources
/api/v1/feed                      → social feed
/api/v1/explore                   → discovery, trending, geo-map
/api/v1/chats/**                  → chat resources
/api/v1/payments/**               → withdrawals, donations, commissions
/api/v1/notifications/**          → notification resources
/api/v1/webhooks/**               → external provider webhooks (Stripe)
/api/v1/admin/**                  → super admin only routes
/api/v1/health                    → health check (public)
```

## Error Codes

```text
UNAUTHORIZED          → missing or invalid JWT
FORBIDDEN              → insufficient role, or deactivated account
NOT_FOUND              → resource does not exist
CONFLICT               → duplicate resource
VALIDATION_ERROR       → request body failed validation
BUSINESS_RULE          → valid request but violates a business rule
RATE_LIMITED           → too many requests
INTERNAL_ERROR         → unexpected server error
```

## Rate Limiting

```text
Auth routes (login, OTP send, register)  → 10 requests per minute per IP
OTP resend                                → 3 requests per 5 minutes per identifier
General API                               → 100 requests per minute per user
Admin API                                 → 200 requests per minute per admin
```

## File Upload Flow

Files are never uploaded through the backend, the backend generates presigned URLs. See `08-storage.md`.

## Webhook Endpoints

```text
POST /api/v1/webhooks/stripe    → Stripe-Signature header verified
```

Webhook handlers store the raw event synchronously and enqueue processing asynchronously, always return 200 quickly.

## Swagger

All endpoints documented with `@ApiOperation`, `@ApiResponse`, `@ApiBearerAuth()`, `@ApiTags('module-name')`. DTOs have `@ApiProperty()` on all fields.
