# Mobile Tech Stack

## Framework — Finalized: Expo, not bare React Native

**Expo (with EAS Build and EAS Update), managed workflow with a dev client.** This is a deliberate deviation from Miralynk's bare React Native setup, chosen on merit for a project starting fresh today, not by default consistency.

```text
Expo SDK        latest stable
React Native    (whatever RN version the current Expo SDK pins, currently tracking the 0.83 line)
React           19.x
TypeScript      5.8.x
```

**Why not just mirror Miralynk's bare RN setup:**

- Expo is now the React Native core team's own recommended starting point for new projects, not the community/bare CLI.
- **New Architecture (Fabric/TurboModules) is the default** on current RN versions. Managing that build complexity by hand with the bare CLI is real, ongoing engineering overhead, exactly what the team's own KISS principle argues against taking on when it's avoidable. Expo's prebuild system handles it automatically and keeps it current across upgrades.
- The old "Expo can't do custom native code" objection is outdated. Config plugins plus EAS Build support Stripe, Firebase, maps, and genuinely custom native modules while still getting Expo's tooling.
- **OTA updates (EAS Update)** matter concretely for Veakay, since it touches money and compliance-sensitive flows, being able to ship a JS-level fix without a full App Store review cycle is a real operational advantage.
- **EAS Build replaces hand-maintained Fastlane/Gradle pipelines**, less CI/CD surface to own long-term.
- The team-consistency argument for bare RN specifically is weaker than it first appears: Expo apps are still 100% React Native and TypeScript, moving between an Expo repo and a bare-RN repo is a minor adjustment, nothing like the actual jump to Flutter or native would be. Miralynk's own mobile app also looks like a fresh scaffold (standard navigation plus a handful of native modules), so there isn't deep bare-RN-specific tooling investment there worth staying consistent with anyway.

## Navigation

**Expo Router** (file-based routing, built on React Navigation under the hood), Expo's own idiomatic pattern, rather than manually wiring React Navigation stacks by hand. Two route groups, selected at the "select-user" step (already mapped in `figma-demo/`):

```text
app/(traveler)/   → bottom tabs: Home, Explore, Campaigns, Chat, Profile
app/(agency)/     → bottom tabs: Home, Packages, Requests, Chat, Profile
```

## State Management and Data Fetching

Neither Miralynk nor the Expo-vs-bare-RN decision changes this reasoning, decided fresh for Veakay on its own merits:

- **TanStack Query (React Query)** for all server state. Handles caching, request deduplication, background refetching, and infinite-query pagination that maps directly onto the backend's cursor-based pagination pattern (`06-api-standards.md`). Do not hand-roll `fetch` + `useState` + `useEffect` per screen, it doesn't scale across the number of data-backed screens this app has.
- **Zustand** for client-only UI state (auth session, active role: traveler vs. agency, ephemeral UI flags). Lighter than Redux Toolkit for what's actually a handful of simple stores; Redux's ceremony (actions/reducers/slices) isn't justified by this app's actual state complexity.
- Avoid plain Context + `useState` beyond trivial local component state, it causes unnecessary re-renders at scale and can't do selective subscriptions.

## API Layer

A typed API client **generated from the backend's OpenAPI spec** (NestJS already emits Swagger/OpenAPI at `/api/v1/docs`), using a tool like `orval` to generate typed TanStack Query hooks directly from it. This keeps mobile and backend in sync automatically instead of hand-duplicating DTO types across two repos, worth the setup cost given backend and mobile are being built together feature by feature.

### Response Shape Handling

```json
{ "success": true, "data": { ... }, "meta": { "cursor": "...", "hasMore": true } }
{ "success": false, "error": { "code": "FORBIDDEN", "message": "..." } }
```

Map `error.code` values (see `../06-api-standards.md`) to consistent UI treatment (toast, inline field error, redirect to login on 401) once, in a shared API-error handler, not per-screen.

## Native Capabilities and Libraries (Expo-idiomatic picks)

```text
Payments              → @stripe/stripe-react-native (official SDK, has an Expo config plugin) —
                         PaymentSheet, Connect onboarding webview
Push notifications     → @react-native-firebase/messaging (official RN Firebase library, has an Expo
                          config plugin, matches the backend's Firebase Admin SDK choice)
Google sign-in           → expo-auth-session's Google provider (or @react-native-google-signin/google-signin
                            via an Expo config plugin) — gets a Google ID token client-side only, sent to
                            POST /api/v1/auth/social for the backend to verify directly against Google
                            (not via Firebase, Firebase is push-only here, see ../04-authentication-and-rbac.md)
Apple sign-in             → expo-apple-authentication (the official Expo module for Sign in with Apple) —
                            same pattern, token sent to the backend for direct verification, not via Firebase
Real-time chat          → socket.io-client, matches the backend's Socket.io choice
Secure token storage     → expo-secure-store (Expo's own wrapper over iOS Keychain / Android Keystore) —
                            NOT AsyncStorage, which is unencrypted and unsuitable for refresh tokens
                            in a payments app; and preferred over react-native-keychain directly since
                            it's already part of the Expo SDK with no extra native linking required
Camera / document picker → expo-image-picker + expo-document-picker
                            (agency document upload, profile photos, campaign images)
Geo-map                   → react-native-maps (Expo config plugin available; more battle-tested than
                              the newer expo-maps as of writing)
Icons                      → lucide-react-native — matches the icon set already used in figma-demo
                              (lucide-react), keeps the design language consistent between the web
                              prototype and the native app
Styling                     → NativeWind (Tailwind for React Native) — figma-demo is already built in real
                              Tailwind, NativeWind carries over the same utility-class mental model and
                              potentially the same color tokens (e.g. the --vaykae-gradient variable)
                              instead of rewriting every screen's styling from scratch as StyleSheet objects
Forms and validation         → React Hook Form + Zod — minimal re-renders, schema-based validation that
                                mirrors the backend's DTO validation conceptually
Audio/video calling            → whichever vendor is chosen for ICallProvider on the backend side, its client SDK
                                  (not yet chosen, see 00-overview.md and \.\./features/wallet-ledger.md);
                                  confirm it has (or can get) an Expo config plugin before locking it in
```

## Testing

```text
Jest + React Native Testing Library   → component and hook unit tests (jest-expo preset)
Maestro                                → E2E tests — simpler YAML-based flows than Detox, faster to write,
                                          works against an Expo/EAS build the same as a bare RN build
```

## Build and Deployment

```text
EAS Build     → cloud-based native builds for iOS and Android, replaces manually maintained
                Fastlane/Gradle CI pipelines
EAS Update     → OTA JS-level updates without an App Store/Play Store review cycle,
                useful for fast-following bug fixes in payment/campaign flows
EAS Submit     → automates store submission
```

## Linting and Formatting

ESLint + Prettier, using Expo's default ESLint config (`eslint-config-expo`) as the base.

## Environment Configuration

Uses Expo's built-in `EXPO_PUBLIC_`-prefixed env var support (inlined into the JS bundle at build time via `.env`) rather than `expo-constants`/`app.config.js` `extra` — simpler for a single-value case like this, revisit if more values are added that need per-EAS-environment overrides.

```text
EXPO_PUBLIC_API_BASE_URL   → points at backend-repo's /api/v1 (defaults to http://localhost:57800/api/v1)
```

`localhost` resolves correctly for the iOS Simulator and the Expo web target; the Android emulator needs `10.0.2.2` instead, and a physical device needs the host machine's LAN IP — not yet handled automatically (no platform-detection shim), switch it manually in `.env` for those cases.

Not yet added, will follow the same `EXPO_PUBLIC_` pattern once each feature needs it: `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`, Firebase config (FCM), `EXPO_PUBLIC_GOOGLE_OAUTH_CLIENT_ID` / `EXPO_PUBLIC_APPLE_OAUTH_CLIENT_ID` for triggering the native social sign-in prompts client-side (the backend already accepts and verifies the resulting ID token — see `04-authentication-and-rbac.md` — but the mobile client itself doesn't yet have a client ID configured to actually request one). No secrets live in the mobile app beyond publishable/client-safe keys, matching the backend's own "secrets never in code" principle.
