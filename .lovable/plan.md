## Goal
On the Capacitor Android app, downloaded surahs persist to device storage and play in airplane mode. The existing UI (DownloadSheet, /downloads page) stays the same — only the storage layer changes when running natively.

## Approach
Add `@capacitor/filesystem`. Build a thin **offline store** that abstracts over two backends:
- **Native (Capacitor)**: write MP3 bytes to `Directory.Data/audio/{reciterId}/{padded}.mp3` and resolve playback via `Capacitor.convertFileSrc(fileUri)`.
- **Web/PWA**: keep the current Workbox `CacheFirst` path; the same API surface returns `null` for "local URL" so callers fall through to the remote URL the SW will intercept.

All call sites use the same async helpers, so React components don't branch on platform.

## Changes

### 1. New `src/lib/offline-store.ts`
Single source of truth for "is this surah saved offline, and where?".
- `isNative()` — small wrapper around `Capacitor.isNativePlatform()`.
- `saveSurahToDisk(reciterId, surahId, remoteUrl, signal)` — native only: `fetch(remoteUrl)` → `blob.arrayBuffer()` → base64 → `Filesystem.writeFile({ path: 'audio/{rid}/{pad}.mp3', directory: Data, data, recursive: true })`. Throws on web (callers won't call it on web).
- `hasLocal(reciterId, surahId)` — native: `Filesystem.stat(...)` returns true/false; web: checks `caches.open('quran-audio-full')` for the URL (uses existing `fullSurahUrl`).
- `getLocalPlaybackUrl(reciterId, surahId)` — native: `Filesystem.getUri(...)` → `Capacitor.convertFileSrc(uri)`; web: `null` (caller uses the remote URL and SW serves it).
- `removeLocal(reciterId, surahId)` — native: `Filesystem.deleteFile(...)`; web: `cache.delete(remoteUrl)`.
- `listLocal()` → `Record<reciterId, surahId[]>` — native: `Filesystem.readdir('audio')`, then per-reciter `readdir`; web: existing `getAllCached()` logic.
- `clearAllLocal()` — native: `Filesystem.rmdir('audio', { recursive: true })`; web: delete both Workbox audio caches.

### 2. Rewrite `src/lib/offline-download.ts` to call the store
Keep the public API exactly the same (`downloadSelected`, `downloadReciter`, `getCachedSurahCount`, `getCachedSurahIds`, `getAllCached`, `removeCachedSurah`, `removeReciterDownloads`, `clearReciterCache`) so `DownloadSheet.tsx` and `downloads.tsx` need **zero** changes.
- Inside `downloadSelected`, the per-worker body becomes:
  - If `isNative()`: `await saveSurahToDisk(reciterId, id, url, ctrl.signal)`.
  - Else: existing `fetch(url, { mode: 'no-cors', cache: 'reload' })` so the SW captures it.
- `getCachedSurahIds` / `getAllCached` / `removeCachedSurah` / `removeReciterDownloads` / `clearReciterCache` delegate to the store helpers.

### 3. `src/hooks/use-audio.ts` — resolve local URL before setting `audio.src`
In the "Build / replace source" effect, after computing the remote `url`:
```ts
const local = await getLocalPlaybackUrl(reciterId, surahId); // null for ayah mode or when not saved
audio.src = local ?? url;
```
Make the effect body async-aware via an inner `(async () => { ... })()` and an `if (cancelled) return;` guard against the existing cleanup. Ayah mode (`ayahId != null`) still uses the remote URL — we only store full-surah downloads (matches current UI).

### 4. `src/components/DownloadSheet.tsx`
No code changes. (It already calls `downloadSelected`; that function now writes to disk on native.)

### 5. `src/routes/downloads.tsx`
No code changes.

### 6. Capacitor config / native permissions
- `bun add @capacitor/filesystem`.
- `Directory.Data` requires no runtime permission on Android (app-private storage). No `AndroidManifest` edits needed.
- User runs `npm run build && npx cap sync android` after pulling.

## Out of scope
- Ayah-by-ayah offline (current UI doesn't expose it; remote with SW cache stays for ayah mode on web).
- A "Download size on disk" display (can add later from `Filesystem.stat().size`).
- Export to external storage / share. Files stay in app-private storage.
- iOS-specific tweaks (path works on iOS too, but not validated here).

## Files touched
- `package.json` — add `@capacitor/filesystem`
- `src/lib/offline-store.ts` — new
- `src/lib/offline-download.ts` — rewrite internals, same exports
- `src/hooks/use-audio.ts` — resolve local URL before assigning `audio.src`
