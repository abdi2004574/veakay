# Veakay Super Admin Panel — Architecture

## Overview

The Super Admin Panel is a web-only, authenticated dashboard that consumes the existing NestJS backend API at `/api/v1/`. It provides oversight, moderation, and compliance tools for the Veakay platform.

## Tech Stack

- **Framework:** Vite + React 18 + TypeScript
- **UI Primitives:** shadcn/ui (Radix + Tailwind CSS v3)
- **Server State:** TanStack Query v5
- **Client State:** Zustand v5
- **Routing:** React Router v6
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Dates:** date-fns
- **HTTP:** Native `fetch` API (wrapped once)
- **Testing:** Vitest (unit) + Playwright (E2E)
- **Error Reporting:** Sentry (@sentry/react)

## Directory Structure

```
src/
+-- main.tsx                          # Application entry point
+-- App.tsx                           # Route definitions + providers
+-- styles/                           # Global CSS + Tailwind
+-- lib/                              # Pure utilities (no React dependency)
+-- types/                            # Shared TypeScript contracts
+-- utils/                            # Side-effectful helpers (fetch, auth, formatters)
+-- hooks/                            # Custom React hooks
+-- stores/                           # Zustand global state (auth, UI)
+-- components/
¦   +-- ui/                           # shadcn/ui primitives
¦   +-- layout/                       # App shell, sidebar, header, navigation
¦   +-- shared/                       # Cross-feature components
+-- features/                         # Feature-based modules
¦   +-- auth/                         # Login, 2FA, forgot password
¦   +-- dashboard/                    # Metrics, charts, overview
¦   +-- users/                        # User management
¦   +-- agencies/                     # Agency oversight
¦   +-- campaigns/                    # Campaign moderation
¦   +-- payments/                     # Withdrawal review, refunds
¦   +-- content/                      # Moderation queue, terms editor
¦   +-- notifications/                # Broadcast composer, history
¦   +-- audit/                        # Audit log viewer
¦   +-- settings/                     # Admin profile, preferences
+-- tests/                            # Unit + E2E tests
```

## State Architecture

| State | Owner | Storage | Rationale |
|---|---|---|---|
| Auth token + user | `auth-store.ts` (Zustand) | `localStorage` | Needs to survive page refresh; accessed outside React tree |
| Server data (lists, details) | TanStack Query cache | Memory | Auto-garbage-collected; stale-time 30s |
| UI toggles (sidebar, theme) | `ui-store.ts` (Zustand) | `localStorage` | Fast synchronous access |
| Form state | React Hook Form | Component-local | Disposed on unmount |

## API Client Layer

All API calls flow through `src/utils/api.ts`:

- Injects `Authorization: Bearer <token>`
- Parses the `{ success, data, error }` envelope
- Throws typed `ApiError` on `success: false`
- Handles 401 by clearing auth state and redirecting to `/login`
- Supports cursor pagination via `parseCursorMeta`

## Permission Model

The admin panel has exactly one tier: `super_admin`. The `usePermissions` hook returns an object with all permissions enabled for `super_admin`. Future extensibility: if TRD adds tiered admin roles, extend the `AdminPermission` type in `src/hooks/use-permissions.ts`.

## Backend Integration

| Admin Feature | Backend Endpoint |
|---|---|
| Admin Login | `POST /admin/auth/login` |
| 2FA Verify | `POST /admin/auth/2fa` |
| Forgot Password | `POST /auth/forgot-password` |
| User List | `GET /admin/users` |
| User Detail | `GET /admin/users/:id` |
| Deactivate/Reactivate | `PATCH /admin/users/:id` |
| Assign Badge | `POST /admin/badges` |
| Agency List | `GET /admin/agencies` |
| Approve/Reject Agency | `PATCH /admin/agencies/:id` |
| Campaign List | `GET /admin/campaigns` |
| Flag Campaign | `PATCH /admin/campaigns/:id/flag` |
| Withdrawal List | `GET /admin/wallet/withdrawals` |
| Review Withdrawal | `PATCH /admin/wallet/withdrawals/:id/review` |
| Mark Paid | `POST /admin/wallet/withdrawals/:id/mark-paid` |
| Audit Logs | `GET /admin/audit-log` |
| Broadcast | `POST /admin/notifications/broadcast` |
| Reports | `GET /admin/reports` |
| Terms Management | `GET/POST /admin/terms` |

## Development Flow

Per `DEVELOPMENT_FLOW.md`:

1. Swagger/DTOs first (backend owns this; admin panel consumes the contract)
2. Unit tests (Vitest)
3. E2E tests (Playwright)
4. Commit + deploy
5. Blackbox test on production (when prod exists)
6. Update docs (PROGRESS_TRACKER.md, HANDOFF.md)

## Environment Variables

| Variable | Purpose | Required |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | Yes |
| `VITE_APP_TITLE` | Browser tab title | No |
| `VITE_ENABLE_2FA` | Show 2FA flow (future toggle) | No |

## CORS

Backend must allow the admin panel origin in production:

```text
CORS_ORIGINS=https://admin.veakay.com,https://app.veakay.com
```

## Blockers and Deferred Work

| Area | Status | Blocking Question |
|---|---|---|
| Auth (login + 2FA) | ? Buildable | None |
| User/Agency Management | ? Buildable | None |
| Campaign Oversight | ? Buildable | None |
| Content Moderation | ? Buildable | None |
| Audit Logs | ? Buildable | None |
| Analytics | ?? Partial | OQ #17 (demographics), OQ #18 (top-performer metric) |
| Payment Oversight | ?? Partial | OQ #3 (threshold), OQ #4 (refund-after-withdrawal), OQ #27 (fee vs commission) |
| Fraud Detection | ?? Blocked | OQ #21 (pre/post moderation), OQ #22 (fraud criteria) |
| KYC/GDPR Compliance | ?? Blocked | OQ #23 (jurisdictions + retention) |
