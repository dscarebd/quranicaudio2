Make the build output a fully self-contained `dist/` (static `index.html` + assets) that runs offline inside Capacitor — no live URL required.

## Approach: render `/` once at build time and save the HTML

TanStack Start is SSR-only, so `vite build` never produces an `index.html`. Instead of restructuring the project into a SPA, render the homepage once at the end of the build by invoking the just-built server bundle in Node, capture the HTML response, write it to `dist/client/index.html`, then flatten as before.

## Changes

1. **Update `scripts/prepare-capacitor-dist.mjs`** — before the existing flatten logic:
   - Dynamically `import()` the built server entry (`dist/server/index.mjs`).
   - Call its `fetch(new Request("http://localhost/"))` to get the SSR-rendered HTML.
   - Rewrite absolute asset URLs if needed (e.g. `/assets/...` stays relative-safe because Capacitor serves from the file root).
   - Write the response body to `dist/client/index.html`.
   - Then run the existing flatten step (move `dist/client/*` → `dist/`, delete `dist/server/`).

2. **Fallback for Worker-only globals** — if the SSR module touches Cloudflare-only APIs at import or fetch time and crashes in Node, stub the minimum needed (`caches`, env bindings) with empty objects in the script. The app is mostly browser-rendered after hydration, so the SSR pass only needs to produce a shell.

3. **No changes to `vite.config.ts`, `package.json`, or `capacitor.config.ts`** — `capacitor.config.ts` already has `webDir: 'dist'`, and `npm run build` already chains the flatten script.

## Result

After `npm run build` (or `npm run android`):

```
dist/
  index.html          ← rendered shell, hydrates client-side
  assets/             ← JS / CSS chunks
  favicon.ico
  logo.png
  manifest.webmanifest
  sw.js
  workbox-*.js
```

`npx cap sync android` succeeds, and the Android app loads `index.html` from the APK with no network dependency for the app shell.

## Risk / fallback

If the server bundle can't be executed in plain Node (Cloudflare-only API at fetch time), I'll fall back to **plan B**: write a minimal hand-crafted `dist/index.html` that references the existing client entry chunk from `dist/client/assets/` (the file matching `index-*.js` + its CSS) and mounts the router client-side only. This loses SSR for the first paint but still works offline.

I'll try the SSR-capture approach first and only fall back if it fails during the build.