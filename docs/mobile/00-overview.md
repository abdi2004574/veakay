# Mobile Overview

## Product Summary

One mobile app serving two distinct user types with separate navigation stacks: Travelers and Agencies. Both share the same backend API (`backend-repo/`) and the same design language established in the client's Figma Make prototype (see `../../figma-demo/`).

## Target Platforms

iOS and Android, per the TRD's Target Platform section. No tablet or web-responsive requirement stated.

## App Structure

Two top-level experiences, chosen at sign-up/login (the reconstructed prototype calls this the "select-user" screen):

```text
Traveler App
  Onboarding (3 slides) → Sign Up / Login → Profile Setup → Home (bottom nav: Home, Explore, Campaigns, Chat, Profile)
  Screens: Campaign creation/detail, Itinerary/Package browsing, Friends & Group Trips, Reviews,
           Wallet/Withdrawal, Settings, Notifications, Social Feed, Explore/geo-map

Agency App
  Sign Up → Registration & Verification → Pending/Approved status → Dashboard (bottom nav: Home, Packages, Requests, Chat, Profile)
  Screens: Package management, Requests, Revenue/Commission, Reviews, Settings, Notifications,
           Admin & Compliance (staff, once that model is resolved)
```

The full screen list already exists as working (if not production-architected) code in `figma-demo/src/app/screens/` — a Vite/React reconstruction of the client's actual Figma Make export. Treat it as the authoritative visual/UX/copy reference: exact screen flows, exact routes, exact category lists (travel preferences, destination types), exact copy (e.g. the agency verification "2-3 business days" text). It is **not** reusable mobile app code, it's a web (Vite/React) app, not a mobile framework, but every screen, string, and flow decision in it should be treated as already-decided unless it conflicts with something the client explicitly said differently.

## Design Reference

`figma-demo/` is runnable directly: `cd figma-demo && npm run dev`, opens at `http://localhost:5173`. See the route table already established during its reconstruction (e.g. `/signup/travel-preferences`, `/agency/app/revenue`, `/app/group-campaign`) for exact screen-to-feature mapping.

## Backend Dependency

The mobile app is a pure client of `backend-repo`'s API (see `../06-api-standards.md` for the contract). No business logic duplicated client-side beyond form validation and optimistic UI updates.

## Framework — Finalized

Expo (managed workflow, EAS Build/Update), not bare React Native. See `01-tech-stack.md` for the full reasoning and library choices. `mobile-app-repo/` is ready to scaffold with `npx create-expo-app`.
