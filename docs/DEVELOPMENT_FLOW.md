# Veakay Development Flow

Every feature or bug fix, no matter how small, follows these steps in order, in every repo. No steps skipped. Adapted from the team's Miralynk development flow, with paths and provider specifics changed to match Veakay's actual setup.

## Backend (`backend-repo/`)

### 1. Swagger (DTOs first)

Write DTOs with `@ApiProperty` decorators and controller endpoints with `@ApiOperation` / `@ApiResponse` before writing any business logic. This is the contract everything else is built against. Matches `06-api-standards.md`.

### 2. Unit tests

Write `*.service.spec.ts` files. Mock every external provider the service touches, not just Prisma: Redis, Stripe, SMTP/mail, Firebase, storage (S3/MinIO), and the call vendor once one exists. Cover the happy path, all error cases, and edge cases. Matches `10-testing-strategy.md`.

### 3. E2E tests

Write `test/*.e2e-spec.ts` files. Hit the real HTTP stack against the local dev database (`docker compose up -d`). No mocks, real Prisma, real Redis, real NestJS requests, against the `veakay_test` database, never dev or prod.

### 4. Commit + deploy

Stage only the relevant files, write a descriptive commit message, no Co-Authored-By line. Push, trigger the deploy workflow, confirm it goes green.

**Currently deferred**: no CI/CD pipeline or hosting exists yet for `backend-repo/`. Until that's set up, this step is just "commit with a descriptive message," nothing to push/deploy against. When we do set up hosting, mirror Miralynk's pattern (a `deploy.yml` GitHub Actions workflow) unless there's a reason not to.

### 5. Blackbox test (on production)

Curl directly against the real production API. Test the full happy path plus key error cases. Reuse an existing prod test account, don't register new users for this.

**Currently deferred, explicitly, per instruction**: there is no production environment yet. Until one exists, step 3's local E2E pass is the closest verification available, and is not a substitute for this step once prod exists, it's a placeholder until it does. This step must be reinstated the moment a real prod URL exists, not skipped indefinitely.

### 6. Update docs (after the prior steps pass)

Update all of these:

- **`docs/PROGRESS_TRACKER.md`** (project root, not `backend/docs/` since Veakay's docs are shared at the project root, see `AGENTS.md`), flip ticket status, update totals, add a date note.
- **`HANDOFF.md`** (project root), update "What Has Been Built," add new endpoints, update test counts, remove from "Things Not Implemented Yet" if done.
- **A manual API tester**, mirroring `backend/docs/manual-test/miralynk-tester/index.html`. **Not yet created for Veakay, open question**: given backend and mobile are being built side by side here (unlike Miralynk, where mobile lagged behind), the mobile app itself may end up serving much of the manual-verification role a standalone tester serves on Miralynk. Ask the user whether a Veakay-specific equivalent is still wanted before assuming it's needed, don't build it silently and don't skip it silently either.

A backend task is not done until docs are updated (and, once production exists, until the blackbox test passes on prod).

## Mobile (`mobile-app-repo/`)

Established across three real features (Auth, Social Feed/Stories/Friends + Storage, Chat/Messaging) — this is what's actually been done each time, not a placeholder guess:

```text
1. Screens/components, matching figma-demo exactly → layout, copy, icons, colors pulled from the
   actual reference screen, not improvised. Every screen gets real loading/error/empty states, not
   just the happy path. Anything genuinely not wired up yet (no backend, no design reference, or
   deliberately deferred) shows the honest in-development alert — never a silent no-op, never omitted.
2. Real wiring, no separate mock-data phase → API client functions (src/api/*.ts) + TanStack Query
   hooks (src/hooks/use-*-queries.ts / use-*-mutations.ts) call the real backend from the start.
3. No dedicated mobile unit-test framework in active use yet (Jest + React Native Testing Library
   was an earlier guess, never actually exercised) — flag to the user if this should change.
4. Manual verification via Playwright against the Expo web target talking to the live, fully
   dockerized backend (not Maestro/EAS Build, an earlier unconfirmed guess) — script the real user
   flow end to end, screenshot key steps, check for console/page errors. This is what's actually
   caught every real bug found in mobile code so far (cache invalidation gaps, session rehydration,
   React render-timing violations, infra endpoint mismatches).
5. Commit — only when the user explicitly asks, no Co-Authored-By line.
6. Update docs → docs/PROGRESS_TRACKER.md, HANDOFF.md.
```

No EAS Build / production mobile distribution exists yet — step 5's "confirm it succeeds" from the original draft doesn't apply until that's set up.

## Standing Rule

This flow applies to every feature and every bug fix, regardless of size, in every repo, for the entire duration of this project, not just for the current sprint or session. Steps are not skipped because a change feels small.
