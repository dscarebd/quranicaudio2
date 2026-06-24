Bundle every image and font into `dist/` so the app runs fully offline as a Capacitor Android app.

## What changes

**1. Local images (downloaded, replacing CDN pointers)**
- `src/assets/logo.png` (1.1 MB)
- `src/assets/annur-digital.png` (80 KB)
- `src/assets/telegram-icon.png` (3.6 KB)
- Removed: `logo.png.asset.json`, `annur-digital.png.asset.json`, `telegram-icon.png.asset.json`

**2. Self-hosted Anek Bangla font (downloaded woff2 chunks)**
- `src/assets/fonts/anek-bangla-bengali.woff2` (152 KB)
- `src/assets/fonts/anek-bangla-latin.woff2` (42 KB)
- `src/assets/fonts/anek-bangla-latin-ext.woff2` (3 KB)

## Code edits to apply

- `src/components/TopBar.tsx` — `import logoUrl from "@/assets/logo.png"`; use `src={logoUrl}`.
- `src/components/NowPlayingCard.tsx` — same swap; collapse duplicated idle/playing branches that used the same image.
- `src/routes/developer-info.tsx` — switch `annurLogo` and `appLogo` imports to the PNG files; use `src={annurLogo}` / `src={appLogo}`.
- `index.html` — remove the 3 lines that preconnect to / load Google Fonts.
- `src/styles.css` — add `@font-face` blocks for Anek Bangla 400/500/600/700/800 using `url("/src/assets/fonts/anek-bangla-*.woff2")` with the same `unicode-range` chunks Google uses, so Vite hashes them into `dist/assets/`.
- `vite.config.ts` — remove the now-unused `fonts.googleapis.com` / `fonts.gstatic.com` runtime cache entry from the PWA workbox config.

## Result

After `npm run build`:

```
dist/
├── index.html
└── assets/
    ├── index-*.js
    ├── index-*.css
    ├── logo-*.png
    ├── annur-digital-*.png
    ├── telegram-icon-*.png
    └── anek-bangla-*.woff2
```

Zero references to `/__l5e/`, `fonts.googleapis.com`, or `fonts.gstatic.com` in the built output. Ready for `npx cap sync android` — works offline in Android WebView.

## Memory update

Replace the locked-logo rule with: header logo is locked to `src/assets/logo.png` (bundled), rendered in `src/components/TopBar.tsx`. Do not substitute alternative artwork.