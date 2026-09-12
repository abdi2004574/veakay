# Learnings

Recurring rules go here first (consolidated). Dated entries below for anything not yet consolidated.

## Recurring rules
_(none yet — will fill in as patterns repeat)_

## Log
_(entries get added here after each complex task; consolidate into "Recurring rules" above once a pattern repeats 2-3 times)_

## 2026-09-11 — Dashboard admin auth contract
- Pattern that worked: keep browser Zustand persistence and mirror the access token to a middleware-readable non-HttpOnly cookie at token lifecycle boundaries.
- What caused delay/breakage: auth types assumed `requires2FA` and `platformRole`, while a server component read a client-only store.
- Rule for next time: model responses from the verified API contract and use request cookies for server auth decisions.
