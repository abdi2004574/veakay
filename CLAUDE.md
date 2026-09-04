# Claude Instructions — Veakay

Read `AGENTS.md` in this directory before doing any work, regardless of which repo (`backend-repo/`, `dashboard-repo/`, `mobile-app-repo/`) you're currently working in. Then read `HANDOFF.md` for current state.

This project has three repos sharing one set of docs, one AGENTS.md, one CLAUDE.md, and one HANDOFF.md, all living here at the project root, not duplicated per-repo.

Key reminders:

- Backend: NestJS 11 + TypeScript + PostgreSQL 17 + Prisma 6, mirroring the team's Miralynk project.
- Mobile stack: not yet decided (React Native vs. Expo vs. other), do not scaffold `mobile-app-repo/` until confirmed.
- Custom JWT auth, backend owns registration, login, OTP, refresh tokens. No Firebase Auth.
- No SMS/phone auth, the TRD only specifies email OTP + Google/Apple social for travelers, email OTP only for agencies.
- Stripe Connect for donations, payouts, commission splitting. Agency subscription billing likely happens on the web, not via native in-app purchase, confirm before building an in-app subscribe flow (see `docs/Veakay_TRD_Open_Questions.md` item #28).
- Firebase Admin SDK for push notifications only (not auth).
- Before implementing any feature, check `docs/Veakay_TRD_Open_Questions.md`, do not guess at money, legal, or data-model-defining decisions.
- Never commit `AGENTS.md`, `CLAUDE.md`, `HANDOFF.md`, or any `docs/` content to any of the three repos.
- Never commit before asking the user explicitly.
