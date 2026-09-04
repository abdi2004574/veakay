# Auth and Onboarding

## Goal

Allow travelers and agencies to register, verify their identity, log in, and complete onboarding before accessing the platform. Prevent duplicate accounts. Enforce email verification before full access. Assign the default traveler status badge on profile creation. Route agencies through a registration and verification flow before they can operate on the platform. Give admins a secure, 2FA-protected login with no public sign-up.

## MVP Scope

**Traveler:**
- Email + password registration with email OTP verification.
- Google OAuth2 login.
- Apple OAuth2 login.
- Profile setup at sign-up: profile photo, travel preferences (destination type + travel style, using the resolved category list below), optional previous-trip photos, optional wallet connect.
- Default "Dreamer" status badge assigned on profile creation.
- Login via email/password, social, or OTP.
- Forgot password via email OTP or reset link.
- Change password (re-enter current password first), single-device logout by default with a "log out of all devices" option.
- Biometric login (Face ID/Touch ID) on top of the JWT session — cheap to add, matches the app's fintech-inspired positioning, not blocked by anything.

**Agency:**
- Email + password registration with email OTP verification, no social login (confirmed intentional).
- Registration & Verification: agency name, business contact details, business address, document upload (business license, certifications, legal documents).
- Pending Verification status until Admin approves.
- Verified Agency Badge on approval.
- Login via email/password or OTP, forgot password via email OTP or reset link.

**Admin:**
- Email + password login with mandatory 2FA.
- No public sign-up — see Edge Cases for how the first Super Admin account gets created.

## Later Scope

- Agency rejection flow (resubmission, rejection reason shown to the agency) — open question #10, build the Pending → Approved path now, add Rejected once answered.
- Badge milestone thresholds for Explorer/Jetsetter beyond the initial Dreamer badge — open question #7, build the assignment mechanism now with an admin-configurable threshold, do not hardcode a number.
- Agency staff sub-accounts and permission tiers — not part of this feature, tracked separately, but the auth data model must support more than one login per agency business entity from the start so this isn't a retrofit later.
- Admin invite flow for additional admin accounts beyond the seeded first one.

## Roles and Permissions

- All registration and login endpoints are public (no JWT required).
- Traveler profile setup requires a valid JWT (user must be registered) and a verified email.
- Unverified travelers can log in but are restricted from campaign creation and donations until verified.
- Agencies restricted from all agency-side actions (packages, requests, payments) until `status = approved`.
- Admin routes require `platformRole = super_admin` in addition to a valid JWT and 2FA-confirmed session.

## Resolved Category List (from the existing prototype)

Destination types: Beach, Mountain, City, Adventure, Cruise.
Travel styles: Luxury, Budget, Backpacking, Family, Solo, Group.

Store as two lookup enums (`DestinationType`, `TravelStyle`), not free text, so Explore filters and Package tags (a later feature) can reuse the same values.

## Main Flows

### Traveler Email Registration

```text
1. POST /api/v1/auth/register/email { email, password, displayName }
2. Backend checks for duplicate email → 409 if exists.
3. Backend hashes password (bcrypt, 12 rounds).
4. Backend creates user with role=traveler, isEmailVerified=false.
5. Backend generates 6-digit OTP, hashes and stores in otp_codes (10-minute expiry).
6. Backend sends OTP email via SMTP (MailHog in dev, production provider not yet chosen).
7. Returns { userId, message: "Check your email" }.
8. POST /api/v1/auth/verify-email { userId, otp }
9. Backend verifies OTP hash, checks expiry (10 min) and attempts (max 5).
10. On success: isEmailVerified=true, issues access + refresh tokens.
11. Client redirects to Profile Setup.
```

### Traveler Social Login (Google / Apple)

```text
1. POST /api/v1/auth/social { provider: "google" | "apple", idToken }
2. Backend verifies token with provider.
3. If no existing user with that email: create one, role=traveler, isEmailVerified=true (provider already verified it, no separate email OTP step).
4. If a user already exists with that email via password sign-up: link the social identity to the existing account rather than creating a duplicate (do not silently merge without this explicit check).
5. Issues access + refresh tokens.
```

### Traveler Profile Setup

```text
1. POST /api/v1/me/profile-setup { photoMediaId, destinationTypes[], travelStyles[], previousTripPhotoIds?[], walletPaymentMethodId? }
   (requires JWT + isEmailVerified)
2. Backend validates destinationTypes/travelStyles against the DestinationType/TravelStyle enums.
3. Backend assigns default badge = "Dreamer".
4. If walletPaymentMethodId omitted, no error — re-prompt at first campaign creation or first withdrawal attempt instead (client-side flow, not enforced server-side here).
5. Returns updated profile.
```

### Traveler Login

```text
1. POST /api/v1/auth/login { email, password } OR { email, otp } OR social
2. On 5 consecutive failed password attempts, lock the account for 15 minutes (standard rate-limit default, not specified in the TRD).
3. Issues access + refresh tokens on success.
```

### Traveler Forgot Password

```text
1. POST /api/v1/auth/forgot-password { email }
2. Always returns a generic message regardless of whether the email exists (no user enumeration).
3. If it exists, sends OTP + reset link via email, 60s resend cooldown, 15-minute expiry.
4. POST /api/v1/auth/reset-password { email, otp, newPassword }
5. On success: updates passwordHash, revokes all refresh tokens (forces re-login everywhere), sends a "your password was changed" email.
```

### Agency Registration & Verification

```text
1. POST /api/v1/auth/agency/register { email, password, agencyName }
2. Email OTP verification, same pattern as traveler (no social option).
3. POST /api/v1/agency/registration { businessContactDetails, businessAddress, documents[] }
4. Agency status = pending_verification.
5. Admin reviews via GET /api/v1/admin/agencies?status=pending_verification (see Admin & Compliance feature doc).
6. On approval: status = approved, Verified Agency Badge assigned, reputation score initialized.
7. On rejection: status = rejected (open question #10 — no resubmission/reason UX defined yet; build the state now, refine the agency-facing experience once answered).
```

### Admin Login

```text
1. POST /api/v1/admin/auth/login { email, password }
2. On success, requires a second step: POST /api/v1/admin/auth/2fa { code } before issuing tokens.
3. No public registration endpoint exists for admin accounts.
```

## API Endpoints

- `POST /api/v1/auth/register/email`
- `POST /api/v1/auth/verify-email`
- `POST /api/v1/auth/resend-otp`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/social`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/logout-all`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/change-password`
- `GET /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions/:tokenId`
- `POST /api/v1/me/profile-setup`
- `POST /api/v1/auth/agency/register`
- `POST /api/v1/agency/registration`
- `POST /api/v1/auth/agency/login`
- `POST /api/v1/auth/agency/forgot-password`
- `POST /api/v1/admin/auth/login`
- `POST /api/v1/admin/auth/2fa`

## Database Models

- `User` — id, email, passwordHash, role (traveler/agency/admin), isEmailVerified, createdAt
- `TravelerProfile` — userId, photoMediaId, destinationTypes[], travelStyles[], badge (Dreamer/Explorer/Jetsetter), walletPaymentMethodId
- `Agency` — id, userId, agencyName, businessContactDetails, businessAddress, status (pending_verification/approved/rejected), reputationScore
- `AgencyDocument` — agencyId, type (license/certification/legal), mediaId
- `OtpCode` — userId, codeHash, type (email_verify/password_reset), expiresAt, attempts
- `RefreshToken` — userId, tokenHash, deviceId, createdAt, expiresAt, revokedAt
- `SocialIdentity` — userId, provider, providerUserId (for linking social logins to an existing account)

## Background Jobs

- OTP cleanup: delete expired `OtpCode` rows daily.
- Badge milestone check: recurring job that evaluates whether a traveler's activity crosses the (admin-configurable) Explorer/Jetsetter threshold once that's defined.

## Notifications

- Email: OTP code, password-changed confirmation, agency approval/rejection.
- No push notifications in this feature; those start with the Notifications module.

## Error Handling

- 409 on duplicate email at registration.
- 401 on invalid credentials, expired/invalid tokens.
- 400 on invalid/expired OTP.
- 429 on rate-limited OTP resend or reset requests.
- Generic response on forgot-password regardless of email existence (no enumeration).

## Tests

### Unit Tests
- Password hashing/verification, OTP generation/hashing/expiry, JWT issuance/verification, social token verification, badge assignment on profile setup.

### E2E Tests
- Full register → verify → profile-setup → login flow (traveler).
- Full register → verify → registration → pending → (mocked) approve flow (agency).
- Forgot password → reset → old sessions revoked.
- Duplicate email registration rejected.
- Rate limits enforced on OTP resend and login attempts.

## Edge Cases

- Interrupted sign-up: OTP verified but profile setup abandoned. Store an explicit `onboardingComplete: false` flag; client resumes the flow on next login rather than re-registering.
- Social login with an email that already has a password-based account: link, do not duplicate (see Social Login flow above).
- First Super Admin account: no self-serve path exists. Seed it via a one-time script/migration outside the API, not a public endpoint.

## Open Questions

- #7 — Explorer/Jetsetter badge milestone thresholds.
- #10 — Agency rejection flow and resubmission experience.
- #11 — Agency reputation score formula.
- See `../Veakay_TRD_Open_Questions.md` for the full list and source references.
