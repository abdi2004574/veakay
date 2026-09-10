# Migration Plan: super-admin-panel-repo as Canonical Admin Frontend

**Status:** READ-ONLY PLAN -- No implementation, no file edits
**Date:** 2026-09-10
**Decision:** Select \super-admin-panel-repo\ as the canonical admin frontend; preserve \dashboard-repo\ as legacy scaffold

---

## 1. Current State Assessment

### 1.1 Repository Comparison

| Aspect | dashboard-repo (Legacy) | super-admin-panel-repo (Canonical) |
|--------|------------------------|-----------------------------------|
| Framework | Next.js 15.1.2 (App Router) | Vite 5 + React 18 + React Router 6 (SPA) |
| Build System | Next.js (SSR/SSG capable) | Vite (client-only SPA) |
| Routing | File-based (App Router) | React Router v6 (declarative) |
| State | TanStack Query + Zustand | TanStack Query + Zustand |
| Forms | React Hook Form + Zod | React Hook Form + Zod |
| UI | Radix UI + Tailwind | Radix UI (via shadcn) + Tailwind |
| Testing | None configured | Vitest (unit) + Playwright (E2E) |
| Error Tracking | None | Sentry configured |
| Auth | Middleware-based (Next.js) | SPA auth context + route guards |
| API Client | Axios instance in \lib/\ | Likely in \lib/\ or \hooks/\ |
| Documentation | Minimal (README only) | ARCHITECTURE.md present |

### 1.2 Backend Admin Surface (from backend-repo/src/modules)
- \dmin-audit-log\ -- audit trail APIs
- \dmin-invites\ -- admin invitation/management
- \gencies\ -- agency verification/management
- \raud\ -- fraud oversight
- \eports\ -- scheduled/compliance reports
- \users\ -- user management (deactivation, roles)
- \payments\ -- commission/payout oversight
- \campaigns\ -- campaign moderation (flag/approve)
- \moderation\ -- content reports queue

### 1.3 Auth Requirements (per AGENTS.md)
- Admin sign-in: email + password + **mandatory 2FA**
- No public registration -- first Super Admin seeded manually
- Invite-based flow for additional admins
- PlatformRoleGuard enforces \super_admin\ for admin routes
- JWT access + refresh tokens, Redis blacklist for revoked access JIDs

---

## 2. Migration Boundaries

### 2.1 Files/Dirs to DELETE from dashboard-repo (Legacy Scaffold Preservation)
\\\
dashboard-repo/
|-- src/
|   |-- app/                    # All Next.js App Router pages/layouts
|   |-- components/             # All dashboard-specific UI components
|   |-- hooks/                  # Dashboard-specific hooks
|   |-- lib/                    # API client, auth utilities
|   |-- store/                  # Zustand stores
|   |-- types/                  # Dashboard-specific types
|-- middleware.ts               # Next.js auth middleware
|-- next.config.js
|-- tailwind.config.ts
|-- tsconfig.json
|-- .eslintrc.json
|-- .prettierrc
|-- package.json                # Keep for reference only
|-- README.md                   # Keep for reference only
|-- .env.example                # Keep for reference only
\\\

**Preserve (do not delete):**
- \dashboard-repo/\ root directory
- \dashboard-repo/node_modules/\ (for reference)
- \dashboard-repo/package-lock.json\
- \dashboard-repo/public/\ (static assets reference)
- \dashboard-repo/AGENTS.md\, \CLAUDE.md\ (shared docs)

### 2.2 Files/Dirs to CONSOLIDATE into super-admin-panel-repo
\\\
super-admin-panel-repo/ (target)
|-- src/
|   |-- lib/
|   |   |-- api/                # Consolidate: unified API client
|   |   |-- auth/               # Consolidate: auth context, 2FA flow
|   |   |-- utils/              # Shared utilities
|   |-- hooks/
|   |   |-- useAuth.ts          # Consolidate: auth hook
|   |-- stores/
|   |   |-- authStore.ts        # Consolidate: auth Zustand store
|   |-- types/
|   |   |-- api/                # Consolidate: shared API types
|   |-- features/
|   |   |-- admin/              # New: admin feature modules
|-- tests/                      # Extend with admin E2E coverage
|-- playwright.config.ts        # Extend for admin flows
|-- package.json                # Add any missing deps from dashboard-repo
\\\

### 2.3 Shared Assets to MIGRATE (Copy, Not Move)
- Tailwind design tokens (colors, spacing) -- both use Tailwind v3 + NativeWind-compatible config
- Radix UI component primitives -- both use same component library
- Icon set (lucide-react) -- identical
- Date formatting (date-fns) -- both use it

---

## 3. API Client Consolidation

### 3.1 Current State
- **dashboard-repo**: Axios instance in \src/lib/api.ts\ (likely) with interceptors for JWT
- **super-admin-panel-repo**: Likely similar Axios/TanStack Query setup in \src/lib/\ or \src/hooks/\

### 3.2 Consolidation Strategy
1. **Single source of truth**: Create \super-admin-panel-repo/src/lib/api/client.ts\ as the canonical API client
2. **Shared types**: Extract all admin-facing DTOs from backend OpenAPI/Swagger to \src/types/api/admin.ts\
3. **TanStack Query integration**: One \queryClient\ with unified error handling, retry policy, cache invalidation
4. **Idempotency keys**: Required on all money-moving mutations (per \docs/mobile/02-error-handling.md\)
5. **Auth interceptor**: Attach access token, handle 401 to refresh token flow, redirect to login on 401 after refresh fails

### 3.3 Backend Contract Alignment
- Target: backend-repo \/api/v1\ prefix (health excluded)
- Cursor pagination for lists, offset for admin tables
- Response shape: \{ data, meta?, error? }\
- Error codes: Map to UI toasts via unified error handler

---

## 4. Auth & 2FA Migration

### 4.1 Required Auth Flows (Canonical)
| Flow | Implementation Location |
|------|------------------------|
| Email + password login | \src/features/auth/LoginForm.tsx\ |
| 2FA challenge (TOTP) | \src/features/auth/TwoFactorChallenge.tsx\ |
| Invite acceptance | \src/features/admin/invites/AcceptInvite.tsx\ |
| Session management | \src/lib/auth/session.ts\ |
| Token refresh | \src/lib/api/interceptors.ts\ |
| Logout (revoke refresh token) | \src/lib/auth/logout.ts\ |
| Protected route guard | \src/components/auth/RequireSuperAdmin.tsx\ |

### 4.2 2FA Specifics
- Backend: TOTP (RFC 6238) -- QR code generation on first login or invite acceptance
- Frontend: \otplib\ or \@otplib/core\ for TOTP verification
- Recovery codes: Generate 10 on 2FA enable, store hashed (backend responsibility)
- Enforcement: \PlatformRoleGuard\ on backend requires \super_admin\; frontend route guard mirrors this

### 4.3 Session Persistence
- Access token: in memory only (not localStorage)
- Refresh token: httpOnly cookie (set by backend) OR secure localStorage with rotation
- **Decision needed**: Cookie vs localStorage for refresh token -- backend currently hashes refresh tokens in DB, so cookie approach aligns better with revocation via Redis blacklist

---

## 5. Feature Parity Checklist (super-admin-panel-repo must cover)

### 5.1 Core Admin Features (from TRD + backend modules)
- [ ] **Admin Authentication** -- Login, 2FA, invite acceptance, session management
- [ ] **User Management** -- List/search travelers/agencies, deactivate, role changes, audit log
- [ ] **Agency Verification** -- Pending/approved/rejected queue, document review, KYC status
- [ ] **Campaign Moderation** -- Flag/approve/reject, gift mode oversight, lifecycle status
- [ ] **Fraud Oversight** -- Flagged transactions, suspicious patterns, manual review queue
- [ ] **Audit Log** -- Filterable, exportable, immutable trail of all admin mutations
- [ ] **Compliance Reports** -- Scheduled reports, on-demand generation, download
- [ ] **Platform Settings** -- Commission %, KYC thresholds, badge milestones (admin-configurable DB rows)

### 5.2 UI/UX Requirements
- [ ] Responsive admin layout (sidebar + header)
- [ ] Data tables with sorting, filtering, cursor pagination
- [ ] Loading/error/empty states on every screen (per mobile error handling doc)
- [ ] Confirmation modals for destructive actions
- [ ] Audit log viewer with correlation IDs

---

## 6. Validation Steps (Pre-Merge Gates)

### 6.1 Static Analysis
\\\ash
# In super-admin-panel-repo
npm run typecheck          # TypeScript strict mode passes
npm run lint               # ESLint passes (no warnings)
npm run format --check     # Prettier formatting consistent
\\\

### 6.2 Unit Tests
\\\ash
npm run test               # Vitest: all unit tests pass
npm run test:coverage      # Coverage >= 80% on auth + API client
\\\

### 6.3 E2E Tests (Playwright)
\\\ash
npm run test:e2e           # All admin flows pass
# Critical paths:
# - Login + 2FA challenge
# - Invite acceptance + 2FA setup
# - Agency approval flow
# - Campaign flag/approve
# - Audit log filter + export
# - Session expiry + token refresh
\\\

### 6.4 Blackbox Validation (Against Live Backend)
\\\ash
# Requires backend-repo running (docker compose up)
# Requires Stripe test mode, MailHog, MinIO
# Run from super-admin-panel-repo:
npm run test:e2e -- --project=chromium --grep="admin"
\\\

### 6.5 Accessibility & Performance
- Lighthouse CI: Performance >= 90, Accessibility >= 95, Best Practices >= 90
- axe-core: Zero critical/serious violations on all admin pages

### 6.6 Security Review
- No secrets in client bundle (verify with build output grep)
- CSP headers configured (Vite + vite-plugin-csp or nginx)
- 2FA enforcement verified end-to-end
- Audit log writes on every admin mutation (spot-check via backend logs)

---

## 7. Rollout Plan

### Phase 1: Foundation (Week 1)
- [ ] Consolidate API client + types in super-admin-panel-repo
- [ ] Implement auth context + 2FA flow + route guards
- [ ] Add Playwright auth fixtures
- [ ] Pass all static analysis gates

### Phase 2: Core Features (Week 2-3)
- [ ] User management CRUD
- [ ] Agency verification queue
- [ ] Campaign moderation
- [ ] Audit log viewer

### Phase 3: Compliance & Oversight (Week 3-4)
- [ ] Fraud oversight dashboard
- [ ] Reports generation/download
- [ ] Platform settings (admin-configurable thresholds)

### Phase 4: Hardening (Week 4)
- [ ] Full E2E suite passing
- [ ] Security review
- [ ] Accessibility audit
- [ ] Performance baseline

### Phase 5: Cutover
- [ ] Deploy super-admin-panel-repo to staging
- [ ] Stakeholder UAT
- [ ] DNS/proxy switch to canonical URL
- [ ] Archive dashboard-repo (tag legacy/scaffold-v1, move to read-only)

---

## 8. Open Questions (Require Decision Before Implementation)

| # | Question | Blocking? |
|---|----------|-----------|
| 1 | Refresh token storage: httpOnly cookie vs secure localStorage? | Yes (auth impl) |
| 2 | 2FA recovery code UX: show once on setup, or allow regen? | Yes (auth impl) |
| 3 | Admin invite expiry: 24h? 7d? Configurable? | Yes (invite flow) |
| 4 | Audit log retention: TRD says open question (docs/09-logging-and-audit.md) | No (can default to 7y) |
| 5 | Real-time notifications in admin panel (Socket.io)? | No (can defer) |
| 6 | Export formats for reports: CSV only, or PDF/Excel? | No (CSV first) |

---

## 9. Reference Documents
- \AGENTS.md\ -- Auth architecture, permission system, engineering principles
- \docs/DEVELOPMENT_FLOW.md\ -- Mandatory Swagger->tests->commit->blackbox flow
- \docs/04-authentication-and-rbac.md\ -- Full auth system design
- \docs/06-api-standards.md\ -- Response shape, pagination, error codes
- \docs/mobile/02-error-handling.md\ -- Loading/error/empty states requirement
- \super-admin-panel-repo/ARCHITECTURE.md\ -- Existing panel architecture
- \ackend-repo/src/modules/admin-*\ -- Backend admin API surface

---

## 10. Sign-Off Required
- [ ] Backend lead: API contract stability confirmed
- [ ] Security lead: 2FA + audit log design approved
- [ ] Product: Admin feature scope confirmed
- [ ] DevOps: Deployment target (Vercel/Netlify/Cloudflare Pages) decided

---

**This plan is READ-ONLY. No files have been modified. Implementation begins only after all open questions are resolved and sign-offs obtained.**
