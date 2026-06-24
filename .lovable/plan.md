## Root cause

The PWA service worker added in the "native device caching" step is intercepting navigations to `/privacy` and serving a stale cached shell from before the Privacy route existed. The route file, registration, and Settings link are all correct — TypeScript passes and `src/routeTree.gen.ts` includes `/privacy`. The issue is purely the service worker cache.

Evidence:
- `vite.config.ts` registers `VitePWA` with `runtimeCaching` using `StaleWhileRevalidate` on `request.mode === "navigate"` into a `html-shell` cache.
- `src/routes/__root.tsx` registers `sw.js` on load.
- `src/routes/privacy.tsx` exists and is wired in the generated route tree.

## Fix

1. Update the SW config in `vite.config.ts`:
   - Add `skipWaiting: true` and `clientsClaim: true` so a new SW activates immediately instead of waiting for all tabs to close.
   - Add `cleanupOutdatedCaches: true` to purge old precache entries on activation.
   - Move the HTML navigation handler from `StaleWhileRevalidate` to `NetworkFirst` (with a short timeout + offline fallback to cache). This way new routes always reach the network first and only fall back to cache when offline — fixing the "new route returns stale 404" problem permanently.

2. Bump the SW filename or add a versioned cache name suffix so existing installs invalidate the old `html-shell` cache once.

3. In `src/pwa/register-sw.ts`, on `updatefound` → `controllerchange`, call `window.location.reload()` once so the user sees the new content immediately after the SW updates (guarded by a flag to prevent reload loops).

No changes needed to `src/routes/privacy.tsx`, `src/routes/profile.tsx`, or `src/routeTree.gen.ts` — those are already correct.

## After the fix

The user should hard-refresh once (or close/reopen the preview). The new SW activates, drops the stale `html-shell` cache, and `/privacy` loads correctly. Future new routes will also load instantly without this issue.