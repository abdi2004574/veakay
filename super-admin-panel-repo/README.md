# Veakay Super Admin Panel

Web-based Super Admin dashboard for the Veakay platform. Handles registration approval, fraud oversight, agency verification, and platform compliance. Consumes the shared NestJS backend API used by the mobile app.

## Overview

This dashboard is one of three sibling repos under the Veakay monorepo handoff:

- `backend-repo/` — NestJS API (shared source of truth for auth, data, business rules)
- `dashboard-repo/` — this repo: Super Admin web panel
- `mobile-app-repo/` — Traveler + Agency mobile app (Expo)

The shared product, architecture, and workflow docs (`AGENTS.md`, `HANDOFF.md`, `docs/`) live at the project root, not duplicated per-repo.

## Tech Stack

- **Vite 5** + **React 18** + **TypeScript 5** (strict)
- **React Router 6** — client-side routing
- **TanStack Query 5** — server state, caching, retries
- **Zustand 5** — lightweight client state
- **React Hook Form** + **Zod** + `@hookform/resolvers` — typed forms and shared validation
- **Recharts 2** — dashboard charts and metrics
- **Tailwind CSS 3** + **shadcn/ui** + CSS variables — design system
- **lucide-react** — icon set
- **date-fns** — date math
- **Vitest** + **@testing-library/react** — unit tests
- **Playwright** — E2E tests
- **Sentry** — error and crash reporting (vendor-agnostic init behind `@sentry/react`)

## Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template and edit if needed
cp .env.example .env

# 3. Start the dev server (http://localhost:5173)
npm run dev

# 4. Build for production
npm run build
```

The Vite dev server proxies `/api/**` requests to the backend at `VITE_API_URL` (defaults to `http://localhost:57800/api/v1`). Start the backend's Docker stack before logging in here.

## Project Structure

Feature-based, not type-based. Every feature owns its components, hooks, types, and tests.

```
src/
  features/           # one folder per feature (auth, users, agencies, moderation, ...)
    auth/
      api/            # TanStack Query hooks (useLogin, useMe, ...)
      components/     # feature-scoped components
      hooks/          # non-data hooks (useRequireRole, ...)
      pages/          # route components
      types.ts
      schemas.ts      # zod schemas
      index.ts        # public surface
  components/
    ui/               # shadcn/ui primitives (button, input, dialog, ...)
    layout/           # app shell, nav, headers
  lib/
    utils.ts          # cn() and shared helpers (from shadcn)
    api.ts            # axios/fetch client with interceptors
    auth.ts           # token storage, refresh, JWT helpers
  stores/             # Zustand stores (UI-only state)
  styles/             # tailwind.css, globals.css
  main.tsx
  App.tsx
  router.tsx
tests/
  unit/               # Vitest + Testing Library
  e2e/                # Playwright
```

## Development Flow

Per `../DEVELOPMENT_FLOW.md`, every feature and every bug fix follows the same six-step cycle, no steps skipped regardless of size:

1. **Swagger / DTOs** — define types from backend OpenAPI or hand-written DTOs first
2. **Unit tests** — write tests for the happy path and edge cases before implementation
3. **Implementation** — make the tests pass
4. **E2E test** — Playwright spec covering the user-visible flow
5. **Commit + deploy** — small commits, deploy to a preview environment
6. **Blackbox on prod** — manually verify the deployed feature, then update docs

Before implementing anything that touches **money, the campaign/trip lifecycle, or the Package/Campaign data model**, check `docs/Veakay_TRD_Open_Questions.md` for unresolved product decisions and confirm with the team.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Start Vite dev server on http://localhost:5173 |
| `npm run build` | Type-check (`tsc`) and produce a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Run Vitest in watch mode |
| `npm run test:e2e` | Run Playwright E2E tests (auto-starts the dev server) |
| `npm run lint` | Run ESLint over `src/` and `tests/` |
| `npm run format` | Format with Prettier |
| `npm run typecheck` | `tsc --noEmit`, type-check only |

## Environment Variables

Defined in `.env` (copied from `.env.example`):

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | yes | Base URL of the backend API. Used by the Vite dev proxy and by the API client. Defaults to `http://localhost:57800/api/v1`. |
| `VITE_APP_TITLE` | no | Document title shown in `<title>` and the header. Defaults to `Veakay Super Admin`. |
| `VITE_ENABLE_2FA` | no | Boolean flag (`"true"` / `"false"`) controlling whether the Super Admin login flow shows a mandatory TOTP step. Per the TRD, admin sign-in always requires 2FA; this flag is for local dev convenience only and must be `"true"` in production. |

Never commit `.env` files. Only `.env.example` is tracked.

## Backend API Conventions

The backend (`backend-repo/`) follows the conventions documented in `docs/06-api-standards.md`. The dashboard''s API client must implement them as defaults:

- **Auth:** `Authorization: Bearer <access JWT>` on every route except public auth endpoints. Refresh via the `refresh_tokens` rotation flow.
- **Global prefix:** all routes live under `/api/v1`. The Vite dev proxy strips `/api` and re-adds `/api/v1` so the client can call `/api/...` without repeating the version.
- **Response envelope:** `{ success: boolean, data: T, error?: { code, message, details? }, meta?: { ... } }`. Treat `success === false` as a typed error.
- **Pagination:**
  - **Cursor-based** for feed, chat history, notifications (`{ cursor, limit }` in, `{ nextCursor, items }` out)
  - **Offset-based** for admin lists (`{ page, pageSize }` in, `{ total, page, pageSize, items }` out)
- **HTTP status codes:** 200/201 success, 400 validation, 401 missing/invalid token, 403 forbidden/role, 404 not found, 409 conflict (e.g. already approved), 422 business rule violation, 429 rate-limited, 500 server error.
- **Idempotency keys:** send `Idempotency-Key: <uuid>` header on every money-moving mutation (approvals, refunds, manual payouts, suspensions). Backend retries are safe.
- **Errors:** every error response includes a stable machine-readable `code` (e.g. `AGENCY_ALREADY_VERIFIED`). Map codes to user-facing copy centrally; never inline `error.message` strings into UI text.

## Contributing

- Branch off `main`, prefix branches with `feat/`, `fix/`, `chore/`, or `docs/`.
- One PR per feature or fix. Small PRs ship faster.
- Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run test:e2e` before opening a PR.
- All admin mutations write audit logs on the backend; this dashboard just calls the APIs that produce them. Do not bypass the API.
- Never commit secrets, `.env`, or generated build artifacts.
