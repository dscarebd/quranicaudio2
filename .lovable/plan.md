I will convert the production build path to a standard Vite SPA output so `npm run build` creates `dist/index.html` directly instead of relying on TanStack Start server output.

Implementation plan:

1. Add a browser entry file
   - Create a normal React/Vite client bootstrap that mounts the existing TanStack Router into `#root`.
   - Keep the existing route files, UI, stores, PWA registration, and app behavior.

2. Add a real SPA `index.html`
   - Create project-root `index.html` with `<div id="root"></div>` and a module script pointing to the new browser entry.
   - Include the app title, viewport, manifest, and mobile/PWA meta tags needed for Android WebView.

3. Replace production build config with standard Vite SPA build
   - Update `vite.config.ts` so it no longer runs TanStack Start/Nitro/server build for `npm run build`.
   - Use normal Vite plugins only: React, TanStack Router file-route generation, Tailwind, path aliases, and PWA.
   - Keep output directory as `dist`.

4. Remove server-output dependency from build
   - Stop generating or depending on `dist/client` and `dist/server`.
   - Keep `scripts/prepare-capacitor-dist.mjs` only as a safety validator/cleanup step, or simplify it so it fails if server folders appear.
   - Ensure `package.json` build remains `npm run build` and final output is:

```text
dist/
├── index.html
├── assets/
```

5. Keep Capacitor pointed at the flat folder
   - Confirm `capacitor.config.ts` stays `webDir: "dist"`.
   - Ensure static assets use paths that work inside Android WebView.

6. Verify the result
   - Run a clean build after implementation.
   - Confirm `dist/index.html` exists.
   - Confirm `dist/assets/` exists.
   - Confirm these do not exist:

```text
dist/client
dist/server
```

Technical note: this changes the app’s build output from TanStack Start SSR/Nitro to a plain Vite SPA bundle for Capacitor, while preserving TanStack Router on the client.