The screenshot shows your downloaded/local `dist` folder still contains only:

```text
dist/
  client/
  server/
```

In this workspace, the current `dist` is flat, but your screenshot proves the build/export path you received is still the original TanStack/Nitro output before flattening.

Plan to fix it properly:

1. Remove the fragile `beforeExit` hook from `vite.config.ts` because it may not run in every export/download path.
2. Keep the flattening script as the source of truth.
3. Make the build scripts run the flattening step explicitly after Vite finishes.
4. Add a hard final validation: if `dist/client` or `dist/server` exists, the build exits with failure.
5. Verify the final downloadable `dist/` contains `index.html` and assets directly, with no `client` or `server` folders.

Technical details:

- `dist/client` and `dist/server` are normal framework build folders.
- For your static/offline package, `dist/client/*` must be moved up into `dist/`, and `dist/server/` must be deleted.
- The safest fix is to make the command itself produce the flattened result, not rely on a lifecycle hook that can be skipped.