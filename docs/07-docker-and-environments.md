# Docker and Environments

## Environments

```text
development   → local machine, docker-compose, MinIO, MailHog, Stripe test mode
test          → CI or local, separate test database and Redis logical DB, real MailHog
production    → server or container platform, AWS S3, production SMTP provider (not yet chosen), Stripe live mode
```

## Ports — deliberately uncommon

Unlike Miralynk (which uses the standard defaults — 5432, 6379, 1025/8025, etc. — via overridable env vars), Veakay uses a distinct `57xxx` block so both projects' containers can run at the same time without collisions, even on their respective defaults:

```text
Postgres (dev)   → 57432
Postgres (test)  → 57433
Redis            → 57379   (dev and test share one container — test uses logical DB index 1, dev uses 0)
MailHog SMTP     → 57025    MailHog UI → 58025
MinIO API        → 57900    MinIO console → 57901
Backend API      → 57800    Swagger docs → 57800/api/v1/docs
Expo Metro       → 57081   (mobile-app-repo, not part of this docker-compose)
```

## Docker Compose — Development

The real file is `backend-repo/docker-compose.yml`. Shape:

```yaml
services:
  postgres:
    image: postgres:17-alpine
    ports: ["${POSTGRES_PORT:-57432}:5432"]
    environment:
      POSTGRES_DB: ${POSTGRES_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: ["veakay-postgres-data:/var/lib/postgresql/data"]

  # Isolated, wiped between E2E runs — never the dev database.
  postgres-test:
    image: postgres:17-alpine
    ports: ["${POSTGRES_TEST_PORT:-57433}:5432"]
    environment:
      POSTGRES_DB: ${POSTGRES_TEST_DB}
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes: ["veakay-postgres-test-data:/var/lib/postgresql/data"]

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports: ["${REDIS_PORT:-57379}:6379"]
    volumes: ["veakay-redis-data:/data"]

  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "${MAIL_PORT:-57025}:1025"
      - "${MAILHOG_UI_PORT:-58025}:8025"

  minio:
    image: minio/minio:latest
    environment:
      MINIO_ROOT_USER: ${S3_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${S3_SECRET_KEY}
    command: server /data --console-address ":9001"
    ports:
      - "${MINIO_API_PORT:-57900}:9000"
      - "${MINIO_CONSOLE_PORT:-57901}:9001"
    volumes: ["veakay-minio-data:/data"]

  app:
    build: { context: ., target: dev }
    env_file: .env
    environment:
      # override the localhost-based .env values with in-network service names
      DATABASE_URL: postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}?schema=public
      REDIS_URL: redis://:${REDIS_PASSWORD}@redis:6379
      MAIL_HOST: mailhog
      MAIL_PORT: 1025
      S3_ENDPOINT: http://minio:9000
    ports: ["${PORT:-57800}:57800"]
    volumes: [".:/app", "/app/node_modules"] # bind-mount source, keep the image's own node_modules
    depends_on: [postgres, redis, mailhog, minio]
    command: npm run start:dev
```

Bring the whole stack up: `docker compose up -d` (from `backend-repo/`). The `app` service hot-reloads on source changes via the bind mount + `nest start --watch`; if you add/change dependencies, run `docker compose up -d --build app` (or `--force-recreate -V app` if the anonymous `node_modules` volume gets stale from a prior broken build).

Access points in development:

```text
NestJS API     → http://localhost:57800/api/v1
Swagger docs   → http://localhost:57800/api/v1/docs
Health check   → http://localhost:57800/health   (public, excluded from the /api/v1 prefix)
MinIO console  → http://localhost:57901
MailHog UI     → http://localhost:58025
PostgreSQL     → localhost:57432
Redis          → localhost:57379
```

## Docker Compose — Test

Not a separate compose file — `postgres-test` is a second service in the same `docker-compose.yml`, always running alongside dev. E2E tests point at it (and at Redis logical DB index 1) via `.env.test`, loaded by `test/setup-env.ts` before the Nest testing module boots. This keeps E2E runs fully isolated from dev data without needing a whole second container stack.

## Dockerfile

Four stages (one more than originally planned, to support hot-reload in dev):

```dockerfile
# dev: used by docker-compose.yml, source bind-mounted for hot reload
FROM node:24-alpine AS dev
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma   # must exist before `npm ci` runs, since postinstall runs `prisma generate`
RUN npm ci
COPY . .
CMD ["npm", "run", "start:dev"]

# deps: production dependencies only
FROM node:24-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci --omit=dev

# build: compile TypeScript (prisma generate already ran via postinstall)
FROM node:24-alpine AS build
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma
RUN npm ci
COPY . .
RUN npm run build

# runtime: minimal production image
FROM node:24-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY prisma ./prisma
EXPOSE 57800
CMD ["node", "dist/main"]
```

`package.json` has `"postinstall": "prisma generate"` — this is why `prisma/` must be copied into every stage before `npm ci` runs (the schema has to exist for postinstall to succeed). Both `prisma` and `@prisma/client` are regular `dependencies`, not devDependencies, so the `deps` stage's `npm ci --omit=dev` still has the CLI available.

## Environment Variables

```text
# Application
NODE_ENV=development
PORT=57800
APP_URL=http://localhost:57800

# Database
POSTGRES_USER=veakay
POSTGRES_PASSWORD=veakay_password
POSTGRES_DB=veakay_dev
POSTGRES_PORT=57432
DATABASE_URL=postgresql://veakay:veakay_password@localhost:57432/veakay_dev?schema=public
POSTGRES_TEST_DB=veakay_test
POSTGRES_TEST_PORT=57433
DATABASE_TEST_URL=postgresql://veakay:veakay_password@localhost:57433/veakay_test?schema=public

# Redis
REDIS_PASSWORD=veakay_redis_password
REDIS_PORT=57379
REDIS_URL=redis://:veakay_redis_password@localhost:57379
REDIS_TEST_URL=redis://:veakay_redis_password@localhost:57379/1

# JWT
JWT_ACCESS_SECRET=changeme_access_secret
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_SECRET=changeme_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d

# Auth — Google (traveler only). Mobile sends an ID token directly (expo-auth-session),
# verified server-side against Google — no OAuth redirect/callback flow, no client secret needed.
GOOGLE_OAUTH_CLIENT_ID=

# Auth — Apple (traveler only), same direct-token-verification pattern (expo-apple-authentication).
APPLE_OAUTH_CLIENT_ID=

# Email — MailHog (dev)
MAIL_HOST=localhost
MAIL_PORT=57025
MAIL_FROM=noreply@veakay.com
MAIL_SECURE=false
MAILHOG_UI_PORT=58025

# Email — production SMTP provider (not yet chosen, ask before setting this up)
# MailService uses nodemailer's generic SMTP transport, so any SMTP-compatible provider
# just needs these four values, no code change and no vendor-specific SDK required.
# MAIL_HOST=
# MAIL_PORT=
# MAIL_USER=
# MAIL_PASS=

# Storage — MinIO (dev). Not wired to any endpoint yet (Storage module, 08-storage.md, not built).
S3_ENDPOINT=http://localhost:57900
S3_REGION=us-east-1
S3_BUCKET=veakay-dev
S3_ACCESS_KEY=veakay_minio
S3_SECRET_KEY=veakay_minio_password
S3_FORCE_PATH_STYLE=true
MINIO_CONSOLE_PORT=57901

# Storage — AWS S3 (prod)
# S3_ENDPOINT=https://s3.amazonaws.com
# S3_BUCKET=veakay-prod
# S3_ACCESS_KEY=aws_access_key
# S3_SECRET_KEY=aws_secret_key
# S3_FORCE_PATH_STYLE=false
# CLOUDFRONT_URL=https://cdn.veakay.com

# Firebase Admin SDK — not wired to anything yet (push notifications module not built)
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

# Stripe — not wired to anything yet (Payments module not built)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Admin-configurable thresholds (env-driven defaults; move to a DB-backed
# admin-configurable value once a config UI exists — see 03-engineering-principles.md)
OTP_EXPIRY_MINUTES=10
OTP_RESEND_COOLDOWN_SECONDS=60
OTP_MAX_ATTEMPTS=5
LOGIN_LOCKOUT_THRESHOLD=5
LOGIN_LOCKOUT_MINUTES=15
THROTTLE_TTL_MS=60000
THROTTLE_LIMIT=100

# Logging
LOG_LEVEL=info

# Swagger
SWAGGER_ENABLED=true

# CORS (production only — non-production allows any origin, see main.ts)
CORS_ORIGINS=
```

Commission percentages (Basic 15%, Premium 10%, Featured 8%) aren't wired into any built module yet (Payments/Agencies-subscription work hasn't started) — captured here as a reminder for when it does, sourced from the client's existing prototype, not invented numbers, see `Veakay_TRD_Open_Questions.md`.

## Environment Validation

`src/config/env.validation.ts` (Joi schema) validates all environment variables on startup. Required (startup fails if missing): `APP_URL`, `DATABASE_URL`, `REDIS_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_FROM`, `S3_ENDPOINT`, `S3_BUCKET`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`. Everything else (Google/Apple OAuth client IDs, Firebase, Stripe) is optional and defaults to an empty string — those integrations aren't built yet, so requiring them at startup would block local dev for no reason. Tighten this list as each integration actually gets wired in.

## NPM Scripts

```text
npm run start:dev       → start NestJS in watch mode
npm run build            → compile TypeScript
npm run start:prod      → run compiled dist
npm run test             → run unit tests (Jest, no DB required)
npm run test:e2e         → run E2E tests (requires postgres-test + redis + mailhog running)
npm run prisma:migrate   → prisma migrate deploy (see AGENTS.md for the non-interactive authoring flow)
npm run prisma:generate  → prisma generate
npm run prisma:studio    → open Prisma Studio
```

(No `test:storage` or `prisma:seed` yet — Storage module isn't built, and there's no seed data defined yet beyond what E2E tests create and tear down themselves.)

## Switching Dev to Production

Only environment variables change, no code changes:

```text
MAIL_HOST=<production SMTP host>      (was localhost, provider not yet chosen)
S3_ENDPOINT=https://s3.amazonaws.com  (was http://localhost:57900)
S3_BUCKET=veakay-prod                 (was veakay-dev)
S3_FORCE_PATH_STYLE=false             (was true)
STRIPE_SECRET_KEY=sk_live_...          (was unset — Payments module not built yet)
CORS_ORIGINS=https://app.veakay.com,https://admin.veakay.com   (required in production, main.ts enforces this)
```
