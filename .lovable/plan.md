## Problem

Current downloads rely on the service worker's `CacheFirst` rule (`quran-audio-full` cache) to silently store each surah as the app fetches it. On Android in the Capacitor WebView this isn't reliable:

- The SW often isn't registered (or doesn't intercept cross-origin `mode: "no-cors"` requests the same way), so `caches.open("quran-audio-full")` ends up empty.
- The download sheet only counts successful `fetch()` calls, so it cheerfully shows "Download complete" even though nothing was actually cached.
- `getAllCached()` on the Downloads page reads from that empty Cache Storage, so the list stays empty.

## Fix

Switch the offline-download layer to write real files on native (Capacitor) and keep the Cache API path for the web PWA. The UI doesn't change — only the storage backend behind `offline-download.ts`.

### 1. Add Capacitor Filesystem
- Install `@capacitor/filesystem`.
- User will run `npx cap sync` after pulling.

### 2. Rework `src/lib/offline-download.ts`
Detect platform with `Capacitor.isNativePlatform()`.

Native path (Android/iOS):
- For each surah, `fetch(url)` (normal CORS — mp3quran serves it; if blocked, fall back to `CapacitorHttp` plugin already bundled in core), read as `Blob` → base64.
- `Filesystem.writeFile({ path: \`quran-audio/${reciterId}/${surahId}.mp3\`, data, directory: Directory.Data, recursive: true })`.
- Mark surah as `done` only after the write resolves — this fixes the false "complete" toast.
- `getCachedSurahIds` → `Filesystem.readdir` on `quran-audio/${reciterId}` and parse filenames.
- `getAllCached` → `Filesystem.readdir('quran-audio')` then per-reciter readdir.
- `removeCachedSurah` / `removeReciterDownloads` → `Filesystem.deleteFile` / `rmdir({ recursive: true })`.
- Expose a helper `getLocalSurahUri(reciterId, surahId)` returning a `Capacitor.convertFileSrc(uri)` URL for the player to use when the file exists.

Web path: keep current Cache Storage logic unchanged.

### 3. Player playback fallback
In `src/routes/player.tsx` (and wherever the `<audio>` `src` is set), before using the CDN URL, check `getLocalSurahUri`; if present, use that file URL so playback works fully offline on Android.

### 4. Downloads page
No structural changes — it already calls `getAllCached` / `removeReciterDownloads`. Once the backend writes real files, the page will populate.

### 5. Verification
- In the preview (web), confirm Cache API path still works.
- Ask the user to `git pull`, `npm install`, `npx cap sync`, rebuild the Android app, download one surah, and check:
  - "Download complete" only appears after the file write succeeds.
  - Settings → Downloads lists the reciter and surah.
  - Airplane mode → surah still plays.

## Files touched
- `package.json` (add `@capacitor/filesystem`)
- `src/lib/offline-download.ts` (rewrite with platform split)
- `src/routes/player.tsx` (use local file URI when available)
- No UI/markup changes to `DownloadSheet.tsx` or `downloads.tsx`.
