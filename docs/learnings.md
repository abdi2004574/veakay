# Learnings

## 2026-09-11

- Don't trust completed background task results with empty output; re-read the files/diff before assuming work happened.
- TRD/feature docs and tracker rows often lag the actual build; verify API function/hook names against source before documenting them.
- Labeled demo/temporary money flows must be documented as non-processor paths and kept separate from real payment surfaces.


## 2026-09-12

- Execution agents frequently return empty or truncated results; never trust a task summary that lacks file paths and verbatim output. Always re-read the actual files to confirm what changed.
- A reported blocker can be stale. Always run the actual failing command to get ground truth before acting — the "CallsService DI blocks everything" claim turned out to be real, but only after running `npm run test:e2e` did the exact error and fix become clear.
- Verified final state (2026-09-12): 539/539 unit tests (41 suites) + 239/239 E2E tests (22 suites), all green, `npm run build` clean. The CallsService DI, OTP update, test-DB schema, MinIO, dashboard auth, and mobile Jest blockers are all resolved.