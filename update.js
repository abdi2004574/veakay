const fs = require('fs');
let content = fs.readFileSync('C:/Users/LENOVO/Desktop/veakay-handoff/HANDOFF.md', 'utf8');
const knownIssuesEnd = '3. **Test DB was missing all 3 trip-request migrations**: applied via prisma migrate deploy after verifying the test database had none of the trip-request schema changes.\n\n';
const newKnownIssue = '3. **Test DB was missing all 3 trip-request migrations**: applied via prisma migrate deploy after verifying the test database had none of the trip-request schema changes.\n\n4. **Backend E2E tests blocked - Docker Desktop/daemon not running**: PostgreSQL, Redis, MailHog, and MinIO containers are unavailable because Docker Desktop/daemon is not running on this environment. Unit tests (
pm run test:unit) and TypeScript build (
pm run build) pass. E2E tests (
pm run test:e2e) cannot run without the dockerized infrastructure.\n5. **Mobile native builds blocked on Windows**: Android SDK, JAVA_HOME, and Xcode are not available in this Windows environment. JavaScript-level checks (typecheck, lint, Expo web build) pass, but expo run:android and expo run:ios cannot execute.\n\n';
content = content.replace(knownIssuesEnd, newKnownIssue);
const crossCuttingGapsEnd = '- **Manual API tester page** ? open question; not built, not decided either way yet.\n\n';
const newGap = '- **Manual API tester page** ? open question; not built, not decided either way yet.\n- **2026-09-16**: Removed unused getAgency() call from super-admin frontend (GET /admin/agencies/:id was not backed by a backend endpoint). Removed lint-stub test files from super-admin-panel-repo.\n\n';
content = content.replace(crossCuttingGapsEnd, newGap);
fs.writeFileSync('C:/Users/LENOVO/Desktop/veakay-handoff/HANDOFF.md', content);
console.log('Done');