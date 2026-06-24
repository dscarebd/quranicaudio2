## Goal
When a surah is playing and the user leaves the app, show a media notification (notification panel + lock screen) with title, reciter, app artwork, and play/pause/prev/next controls.

## Approach
Web Media Session is already wired in `src/hooks/use-audio.ts` (metadata + play/pause/prev/next/seek/position). Android's Chromium WebView turns this into a real MediaStyle notification automatically — it just needs **artwork** to render properly, and the native project needs the **foreground-service permission** so playback isn't killed when the app backgrounds.

## Changes

1. **`src/hooks/use-audio.ts`** — add artwork to `MediaMetadata`
   - `import logoUrl from "@/assets/logo.png"`.
   - In the metadata effect, compute `const artworkUrl = new URL(logoUrl, window.location.href).toString();`.
   - Pass `artwork: [{ src: artworkUrl, sizes: "512x512", type: "image/png" }]` inside the `new MediaMetadata({...})` call.
   - No other behavior change; existing action handlers stay as-is.

2. **Closing instructions for the Android project** (no file changes here — the `android/` folder is generated on the user's machine by `npx cap add android`)
   - Add to `android/app/src/main/AndroidManifest.xml`:
     - `<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />`
     - `<uses-permission android:name="android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK" />` (Android 14+)
     - `<uses-permission android:name="android.permission.WAKE_LOCK" />`
   - Then run `npm run build && npx cap sync android`.

## Out of scope
- No new Capacitor plugin (`capacitor-music-controls-plugin`, Media3, etc.). The Web Media Session API in Chromium WebView is enough for Android 8+ to render the notification + lock-screen widget.
- No PWA / service-worker changes.
- No new UI in the app.

## Files touched
- `src/hooks/use-audio.ts`
