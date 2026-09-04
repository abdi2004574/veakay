# Authentication and RBAC

## Authentication Provider

Custom authentication using Passport.js and JWT. Firebase Auth is not used, for the same reasons as Miralynk: deactivating a user must immediately revoke all active sessions, and role must be embedded in the token.

## Authentication Methods

```text
Traveler:
  Email + password       → passport-local strategy
  Email OTP               → own OtpService, no Passport strategy needed
  Google OAuth2           → passport-google-oauth20 strategy
  Apple OAuth2             → passport-apple strategy

Agency:
  Email + password       → passport-local strategy
  Email OTP               → own OtpService
  (no social login — confirmed intentional)

Admin:
  Email + password + mandatory 2FA
  (no public registration endpoint)

All roles:
  JWT validation         → passport-jwt strategy (every protected request)
```

**Not implemented:** phone/SMS authentication in any form. The Veakay TRD never mentions phone numbers or SMS OTP anywhere, unlike Miralynk which explicitly supports it.

## Registration Flow

### Traveler — Email / Password

```text
1. Client sends POST /api/v1/auth/register/email with email, password, displayName.
2. Backend checks for duplicate email. Returns 409 if exists.
3. Backend hashes password with bcrypt (12 rounds).
4. Backend creates user row with role=traveler, is_email_verified=false.
5. Backend generates 6-digit OTP, hashes it, stores in otp_codes with type=email_verify.
6. Backend sends verification email via SMTP (MailHog in dev, production provider TBD).
7. Backend returns user id and a message to check email.
8. Client submits OTP to POST /api/v1/auth/verify-email.
9. Backend verifies OTP hash, marks user is_email_verified=true, deletes OTP row.
10. Backend issues access token and refresh token.
11. Client is routed to Profile Setup.
```

### Traveler — Google / Apple

```text
1. Mobile app completes OAuth with Google or Apple.
2. App sends provider token to POST /api/v1/auth/social.
3. Backend verifies token with the provider.
4. Backend looks up or creates user by provider_user_id in social_identities.
5. If a user already exists with that email via password sign-up: link the social identity to the existing account rather than creating a duplicate.
6. If new user: creates user row with role=traveler, is_email_verified=true (provider-verified, no separate email OTP step).
7. Backend issues access token and refresh token.
```

### Agency — Email / Password

```text
1. Client sends POST /api/v1/auth/agency/register with email, password, agencyName.
2. Same duplicate-check, hash, OTP pattern as traveler email registration.
3. On verification: user row created with role=agency, agency status=pending_verification.
4. Client is routed to Agency Registration & Verification (business details + document upload).
```

## Login Flow

### Email / Password (Traveler or Agency)

```text
1. Client sends POST /api/v1/auth/login with email and password.
2. passport-local strategy verifies credentials.
3. Backend checks account status. Deactivated users receive 403.
4. On 5 consecutive failed attempts: account locked for 15 minutes (standard default, not specified by the TRD).
5. Backend issues access token and refresh token.
6. Backend stores device info in user_devices.
```

### Admin Login

```text
1. Client sends POST /api/v1/admin/auth/login with email and password.
2. On success, requires a second step: POST /api/v1/admin/auth/2fa with the code.
3. Only after 2FA succeeds are tokens issued.
4. No public registration endpoint exists for admin accounts — the first Super Admin is seeded manually; additional admins are created via an invite flow, not self-registration.
```

## Token Lifecycle

```text
Access token
  - Short-lived JWT (15 minutes).
  - Carries: user_id, role, platform_role, jti (unique token id).
  - Validated by JwtAuthGuard on every protected request.
  - Checked against Redis blacklist on every request.

Refresh token
  - Long-lived (30 days).
  - Stored hashed in refresh_tokens table.
  - Sent by client to POST /api/v1/auth/refresh to get new access token.
  - One refresh token per device session.
  - Rotated on each use (old token invalidated, new token issued).

Token blacklist (Redis)
  - On logout: access token jti added to Redis blacklist until token expiry.
  - On account deactivation: all refresh tokens for user deleted, all active jtis blacklisted.
```

## Forgot Password Flow

```text
1. POST /api/v1/auth/forgot-password { email }
2. Always returns a generic message regardless of whether the email exists (no user enumeration).
3. If it exists, sends OTP + reset link via email, 60s resend cooldown, 15-minute expiry.
4. POST /api/v1/auth/reset-password { email, otp, newPassword }
5. On success: updates passwordHash, revokes all refresh tokens (forces re-login everywhere), sends a "your password was changed" email.
```

## OTP Handling

```text
- OTP codes are 6 digits, generated with crypto.randomInt.
- Stored hashed (bcrypt) in otp_codes table, never plain text.
- TTL: 10 minutes.
- Resend allowed after 60 seconds (rate limited).
- Maximum 5 attempts per OTP before it is invalidated.
- Expired OTPs are cleaned up by a background job.
```

## Local User Model

```text
users
  id                    UUID PK
  email                 VARCHAR UNIQUE
  password_hash         VARCHAR nullable (null for social-only accounts)
  role                  ENUM: traveler | agency | admin
  platform_role         ENUM: user | super_admin  default: user (extensible for future admin tiers)
  is_email_verified     BOOLEAN default: false
  is_active             BOOLEAN default: true
  deactivated_at        TIMESTAMP nullable
  fcm_token             VARCHAR nullable
  created_at            TIMESTAMP
  updated_at            TIMESTAMP
  last_login_at         TIMESTAMP nullable

social_identities
  id                    UUID PK
  user_id               UUID FK → users
  provider              ENUM: google | apple
  provider_user_id      VARCHAR
  created_at            TIMESTAMP
  UNIQUE (provider, provider_user_id)

refresh_tokens
  id                    UUID PK
  user_id               UUID FK → users
  token_hash            VARCHAR
  device_id             VARCHAR nullable
  expires_at            TIMESTAMP
  is_revoked            BOOLEAN default: false
  created_at            TIMESTAMP

otp_codes
  id                    UUID PK
  identifier            VARCHAR (email)
  code_hash             VARCHAR
  type                  ENUM: email_verify | password_reset
  attempts              INTEGER default: 0
  expires_at            TIMESTAMP
  is_used               BOOLEAN default: false
  created_at            TIMESTAMP
```

## RBAC

### Permission Layers

```text
Layer 1 — Account role (mutually exclusive)
  traveler | agency | admin

Layer 2 — Agency staff permission (once agency staff accounts exist — see open question tied to Chat Module's multi-staff access gap)
  owner | staff (tiers TBD)

Layer 3 — Agency subscription tier (affects commission rate and marketing visibility, not access control per se)
  basic | premium | featured

Layer 4 — Platform role (internal staff only)
  user | super_admin (built extensibly, only one admin tier exists in the TRD today)
```

### Guards

```text
JwtAuthGuard              → verifies JWT signature, checks Redis blacklist, attaches CurrentUser
AccountStatusGuard        → blocks users where is_active=false
RoleGuard                 → checks users.role against @RequireRole() decorator and resource ownership
AgencyStaffPermissionGuard → checks staff permission tier once agency staff accounts exist
PlatformRoleGuard         → checks users.platform_role against @RequirePlatformRole()
```

Guard chain on a typical traveler-scoped route:

```text
JwtAuthGuard → AccountStatusGuard → RoleGuard → Controller
```

Guard chain on an admin route:

```text
JwtAuthGuard → AccountStatusGuard → PlatformRoleGuard → Controller
```

### Decorators

```text
@CurrentUser()                      → injects authenticated user into handler parameter
@RequireRole('traveler' | 'agency' | 'admin')
@RequireAgencyPermission('owner' | 'staff')
@RequirePlatformRole('super_admin')
@Public()                           → marks route as unauthenticated (skips JwtAuthGuard)
```

## Account Statuses

```text
active                → normal access
deactivated           → blocked at JwtAuthGuard level, all requests return 403 (effect on live campaigns/funds is open question, see AGENTS.md)
pending_verification  → agency only, restricted from agency-side actions until approved
rejected              → agency only, resubmission flow is open question #10
```

## Super Admin

Super Admin is a separate internal account type, created manually via a one-time seed script or migration, not through a public endpoint.

Super Admin must:
- Present a valid JWT.
- Have `platform_role = super_admin`.
- Have completed 2FA for the current session.

All admin mutations write to `audit_logs` via `AuditService`.

## Testing Requirements

- Unauthenticated request to protected route returns 401.
- Invalid or expired JWT returns 401.
- Blacklisted JWT returns 401.
- Deactivated user JWT returns 403.
- Traveler accessing agency-only route returns 403.
- Agency accessing traveler-only route returns 403.
- Regular user accessing super_admin route returns 403.
- Super admin can access all admin routes only after 2FA.
- Duplicate email registration returns 409.
- OTP expires after 10 minutes, max 5 attempts.
- Refresh token rotation invalidates old token.
- Logout blacklists access token immediately.
- Social login with an existing password-based email links accounts, does not duplicate.

## Open Questions

See `Veakay_TRD_Open_Questions.md`. Directly relevant here: #10 (agency rejection flow), the still-undefined admin role tiering, and the still-undefined effect of "deactivate" on a user's live campaigns/funds.
