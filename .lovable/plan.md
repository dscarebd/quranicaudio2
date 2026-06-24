Make the default `npm run build` produce a flat `dist/` (no `client/` or `server/` subfolders).

Change in `package.json`:
```json
"build": "vite build && node scripts/prepare-capacitor-dist.mjs"
```

After approval, run `npm run build` (or `npm run android` / `npm run android:open`) and `dist/` will contain `index.html`, `assets/`, `manifest.webmanifest`, etc. directly.

Note: running `npx vite build` by itself will still create `client/server` — always use the npm scripts.