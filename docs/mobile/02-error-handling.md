# Mobile Error Handling and Resilience

This is a standing requirement, not a per-feature decision: every screen and every network call must have deliberate error handling, no silent failures, no unhandled promise rejections, no bare try/catch that swallows an error without surfacing or logging it.

## Layers of Error Handling

### 1. Render-Time Crashes — Error Boundaries

A top-level `ErrorBoundary` component wraps the app (and a second one wraps each major navigator, traveler/agency) so a render error in one screen shows a recoverable fallback UI ("Something went wrong, try again") instead of a full white-screen crash. Every boundary reports the caught error to crash reporting (see below) before rendering its fallback.

### 2. Network/API Errors — Centralized, Not Per-Screen

Every API error follows the same envelope (`06-api-standards.md`):

```json
{ "success": false, "error": { "code": "FORBIDDEN", "message": "..." } }
```

`error.code` is mapped to UI treatment **once**, in a shared handler, not reimplemented per screen:

```text
UNAUTHORIZED       → silent token refresh attempt, then force logout + redirect to login if refresh also fails
FORBIDDEN          → inline message, no retry (retrying won't fix a permissions problem)
NOT_FOUND          → inline "not found" state, no retry
VALIDATION_ERROR    → inline field-level errors on the form that submitted
BUSINESS_RULE        → inline message using error.message (these are meaningful to show verbatim,
                        e.g. "campaign already funded")
RATE_LIMITED          → toast + respect Retry-After if present, disable the retry button until then
CONFLICT               → inline message, no auto-retry (retrying a duplicate action isn't safe)
INTERNAL_ERROR          → toast with a generic message + a manual retry action, log to crash reporting
```

A network failure with no response at all (device offline, timeout) is a **distinct case** from a server-returned error, and must say so explicitly to the user ("You're offline" is a different message than "Something went wrong"), not be collapsed into the same generic error state.

### 3. TanStack Query Configuration

Global defaults set once on the `QueryClient`, not per-hook:

```text
Queries (GET):
  - Safe to retry automatically (idempotent by nature). Default: 2 retries with exponential backoff.
  - onError: log to crash reporting with the query key, do not necessarily surface a toast for background
    refetch failures if cached data is still being shown (stale data > no data).

Mutations (POST/PATCH/DELETE) that do NOT move money:
  - Retries disabled by default. A failed mutation should surface to the user explicitly and let them
    decide to retry, not retry silently behind their back.

Mutations that DO move money (donations, withdrawals, subscription changes):
  - Retries disabled entirely, and additionally require an idempotency key generated client-side and sent
    with the request (Stripe supports idempotency keys natively on its API). This is the critical
    payments-specific rule: without an idempotency key, a client-side retry after a lost response could
    double-charge a donor or double-process a withdrawal. This must be enforced on the backend side too,
    see ../14-payments-and-stripe.md and ../03-engineering-principles.md.
```

### 4. Crash Reporting and Error Logging

A crash reporting service (Sentry or equivalent) captures:
- Uncaught JS exceptions and unhandled promise rejections.
- Errors caught by `ErrorBoundary` components.
- API errors with `code = INTERNAL_ERROR` (these represent unexpected backend states worth investigating, unlike `VALIDATION_ERROR` or `NOT_FOUND` which are normal user-facing outcomes, not bugs).

Never logged, matching the backend's own logging rules (`09-logging-and-audit.md`): access/refresh tokens, passwords, OTP codes, full card details, Stripe secrets.

### 5. Loading and Empty States, Not Just Error States

Every data-backed screen has four states it must explicitly render, not just "happy path + spinner":

```text
loading   → skeleton or spinner, never a blank screen
error     → per the error.code mapping above, with a retry action where retrying is actually safe
empty     → a real empty state (e.g. "No campaigns yet, create one"), not a blank list that looks broken
success   → the actual content
```

### 6. Form Validation Errors

React Hook Form + Zod (`01-tech-stack.md`) surface validation errors inline, at the field level, before submission is even attempted where possible. Server-side `VALIDATION_ERROR` responses (the backend is the final authority, client-side validation is a UX convenience, not a substitute) map back onto the same fields by name.

## What "Proper Error Handling Everywhere" Means in Practice

- No screen ships without its error and empty states designed, not just its happy path.
- No mutation that moves money ships without an idempotency key.
- No `catch (e) {}` that does nothing. At minimum, log it; in most cases, also surface something to the user.
- No generic "Something went wrong" for every failure type, the error.code mapping above exists specifically to avoid that.
- Code review should treat a missing error/empty state the same as a missing test, a real gap, not a nice-to-have.
