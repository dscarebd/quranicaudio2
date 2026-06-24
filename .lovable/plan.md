**Goal:** After the Capacitor/mobile build, `dist/` should contain `index.html` and assets directly — not `dist/client/` and `dist/server/`.

**Important:** TanStack Start normally creates `dist/client` and `dist/server`. That is expected for the web app. To avoid breaking the Lovable/web deployment, I will flatten only for the Capacitor build commands.

**Plan:**

1. Add a small Node script, for example `scripts/prepare-capacitor-dist.mjs`, that runs after `vite build` and:
   - verifies `dist/client/index.html` exists
   - copies/moves everything from `dist/client/` into `dist/`
   - removes `dist/client/`
   - removes `dist/server/`
   - leaves `dist/index.html` directly in place

2. Update `capacitor.config.ts` back to:
   ```ts
   webDir: 'dist'
   ```

3. Update mobile scripts in `package.json`:
   ```json
   "build:mobile": "vite build && node scripts/prepare-capacitor-dist.mjs",
   "android": "npm run build:mobile && cap sync android",
   "android:open": "npm run build:mobile && cap sync android && cap open android"
   ```

4. Keep the normal web script unchanged:
   ```json
   "build": "vite build"
   ```
   so the hosted web app still builds correctly.

**After this, use:**
```bash
npm run android:open
```

**Result:**
```text
dist/
  index.html
  assets/
  manifest.webmanifest
  ...
```
No `dist/client` or `dist/server` after the mobile build.