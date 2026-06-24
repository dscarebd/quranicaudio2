I’ll fix this at the build-system level so the final `dist` cannot remain as `client/` and `server/` folders, even if Lovable or another environment runs `vite build` directly instead of `npm run build`.

## Plan

1. Add a small custom Vite plugin in `vite.config.ts` that runs after the production bundle is written.
2. In that plugin, call the existing `scripts/prepare-capacitor-dist.mjs` automatically from Vite’s `closeBundle` hook.
3. Keep `package.json` scripts as backup, but make the script safe against double-runs so it does not fail if Vite already flattened the folder.
4. Update the prepare script to be stricter:
   - render/write `dist/client/index.html`
   - move `dist/client/*` into `dist/`
   - delete `dist/client/`
   - delete `dist/server/`
   - delete Nitro-only files from `dist/`
   - fail the build if `dist/client` or `dist/server` still exists
5. Verify with a build that final output is exactly a flat static folder like:

```text
dist/
  index.html
  assets/
  favicon.ico
  logo.png
  manifest.webmanifest
  sw.js
  workbox-*.js
```

No `dist/client` and no `dist/server`.