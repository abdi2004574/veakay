# Test Strategy: Admin Panel Integration

**Status:** Read-only strategy. No implementation files inspected or edited.
**Date:** 2026-09-10
**Scope:** Canonical admin panel integration — unit tests for API clients/state/components, Playwright auth and core admin workflows, backend contract checks.

---

## 1. Backend Contract Checks (Existing)

**Target file:** `backend-repo/test/admin-panel.e2e-spec.ts` (12 tests, all green as of 2026-09-08).

**Endpoints exercised:**
| Endpoint | Tests |
|---|---|
| `POST /api/v1/admin/invites` | create (201), non-admin 403, list (200), revoke (201 ? status `revoked`) |
| `POST /api/v1/reports` | create (201), self-report (422) |
| `GET /api/v1/reports/admin/reports` | list (200, array) |
| `POST /api/v1/admin/badges` | assign (201), list (200) |
| `GET /api/v1/admin/audit-log` | list (200, array) |
| `POST /api/v1/admin/wallet/wallets/:userId/credit` | seed credit |
| `POST /api/v1/me/wallet/withdrawals` | high-value 422 |
| `POST /api/v1/campaigns/:id/group/contributions` | add contribution |
| `POST /api/v1/campaigns/:id/group/withdraw` | withdraw (201, status `requested`) |

**Pass criteria:** `npm run test:e2e` exits 0 with 12/12 passing, run with `--runInBand`.

---

## 2. Backend Unit Tests (Existing)

**Targets:**
- `backend-repo/src/modules/admin-invites/admin-invites.service.spec.ts`
- `backend-repo/src/modules/admin-audit-log/admin-audit-log.service.spec.ts`
- `backend-repo/src/modules/verified-badges/verified-badges.service.spec.ts`
- `backend-repo/src/modules/reports/reports.service.spec.ts`

**Pass criteria:** `npm run test` exits 0.

---

## 3. Dashboard Unit Tests (New)

### 3a. API Client (`src/lib/api.ts`)
- request interceptor attaches `Authorization: Bearer <token>`
- 401 response triggers refresh queue (single-flight)
- refresh failure clears auth state
- `apiGet`/`apiPost`/`apiPatch`/`apiDelete` unwrap `response.data.data`

### 3b. Auth Store (`src/store/auth.store.ts`)
- `setTokens` sets `isAuthenticated: true`
- `clearAuth` resets all fields
- `persist` partialize shape matches persisted keys

### 3c. Auth Hook (`src/hooks/useAuth.ts`)
- returns store values

### 3d. Auth Lib (`src/lib/auth.ts`)
- `login` returns `{ pendingToken, requires2FA }`
- `verify2FA` returns `{ user, accessToken, refreshToken }`
- `logout` calls `clearAuth`

### 3e. Types (`src/types/index.ts`)
- `ApiResponse<T>` shape
- `User`, `Agency`, `Campaign`, `AuditLog` shapes

**Pass criteria:** all unit tests green.

---

## 4. Playwright E2E (New)

**Prereqs:** `docker compose up -d` (backend), dashboard dev server.

### 4a. Auth
- login page renders
- valid admin login redirects to `/dashboard`
- invalid credentials show error
- 2FA page renders, valid code redirects
- invalid 2FA shows error
- unauthenticated dashboard access redirects to `/login`

### 4b. Core Workflows
- Overview renders KPI cards + quick actions
- Agencies page placeholder
- Users page placeholder
- Moderation page placeholder
- Audit log page placeholder
- Invites page placeholder
- Sidebar nav active state
- Logout clears auth

**Pass criteria:** zero console errors, no 404/500, all assertions pass.

---

## Pass Criteria Summary

- Backend E2E: 12/12 green
- Backend unit: existing specs green
- Dashboard unit: new specs green
- Playwright: all scenarios pass
