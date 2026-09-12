const fs = require('fs');
let content = fs.readFileSync('C:/Users/LENOVO/Desktop/veakay-handoff/HANDOFF.md', 'utf8');
content = content.replace('Mobile lint + typecheck passed; **mobile now has 2 passing tests**', 'Mobile: new wallet/donation code passed focused lint/typecheck; **repo-wide mobile typecheck/lint remain blocked by the pre-existing malformed e2e/app.spec.ts and unrelated lint debt**. Mobile now has 2 passing tests');
content = content.replace('mobile uses eact-native-purchases with platform API keys. Stripe is NOT the agency subscription path.', 'mobile uses eact-native-purchases with platform API keys. Stripe is NOT the agency subscription path. **RevenueCat mobile verification was via Expo web build and focused tests, not a native iOS/Android/dockerized mobile build.**');
content = content.replace('**Verified final state: 539/539 unit tests (41 suites) and 239/239 E2E tests (22 suites), all green, 
pm run build clean.**', '**Prior verified full-suite state (2026-09-12): 539/539 unit tests (41 suites) and 239/239 E2E tests (22 suites), all green, 
pm run build clean.**\n\n**New focused verification (2026-09-12, RevenueCat + wallet regression):**\n- Backend RevenueCat unit: 30/30 passed\n- Backend RevenueCat E2E: 14/14 passed\n- Wallet production regression E2E: 1/1 passed\n- Backend build: clean\n- Mobile RevenueCat tests: 44/44 passed\n- Mobile focused RevenueCat lint: clean\n- Expo web build: passed\n- Native iOS/Android builds: **not run** (verification was via Expo web build and focused tests, not a native iOS/Android/dockerized mobile build).');
fs.writeFileSync('C:/Users/LENOVO/Desktop/veakay-handoff/HANDOFF.md', content, 'utf8');
console.log('HANDOFF.md updated');
