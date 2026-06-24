## Goal
Add a persistent media-style notification on Android with play/pause/next/prev controls so the user can manage Quran playback from the notification panel and lock screen — even when the app is backgrounded.

## Why the current setup isn't enough
`src/hooks/use-audio.ts` already wires up the Web `MediaSession` API (metadata, playback state, action handlers). In a Chrome PWA this surfaces a media notification automatically, but inside a Capacitor Android WebView **no notification is shown** unless a native plugin bridges playback to Android's `MediaSession` / `MediaStyle` notification. That's the missing piece.

## Approach
Use the community plugin **`capacitor-plugin-musiccontrols`** (Capacitor 6/7 compatible, MIT, actively maintained fork of the Cordova music-controls plugin). It renders a `MediaStyle` notification with album art + transport controls and forwards button events back to JS, which we connect to the existing `usePlayer` store.

No changes to playback engine, UI, or download/offline logic — purely additive native bridge.

### Steps

1. **Install dependency**
   - `capacitor-plugin-musiccontrols` (added to `package.json`).
   - User will run `npx cap sync android` after pulling, per the Capacitor workflow.

2. **New `src/lib/media-notification.ts`**
   - Exports `showMediaNotification(meta)`, `updatePlaybackState(isPlaying)`, `hideMediaNotification()`.
   - Internally no-ops on web (`Capacitor.getPlatform() !== 'android'`) so PWA keeps using `navigator.mediaSession`.
   - On Android calls `MusicControls.create({ track, artist, album, cover, isPlaying, hasPrev: true, hasNext: true, hasClose: true, ticker })` and `MusicControls.subscribe(...)` once, dispatching:
     - `music-controls-play` → `usePlayer.setPlaying(true)` + `audio.play()`
     - `music-controls-pause` → `usePlayer.setPlaying(false)` + `audio.pause()`
     - `music-controls-next` → `usePlayer.next()`
     - `music-controls-previous` → `usePlayer.prev()`
     - `music-controls-destroy` / headset unplug → pause
   - Cover art uses the bundled `src/assets/logo.png` (resolved to absolute URL, matching the existing MediaSession artwork — does not violate the locked-logo rule).

3. **Wire into `src/hooks/use-audio.ts`**
   - In the existing metadata effect (already keyed on `surahId/ayahId/reciterId`): after setting `navigator.mediaSession.metadata`, also call `showMediaNotification({ title, artist, album, cover })`.
   - In the existing `isPlaying` effect: also call `updatePlaybackState(isPlaying)`.
   - When `surahId == null`: call `hideMediaNotification()`.
   - The action handlers in the new module reuse the same store actions the lock-screen handlers already call, so behavior stays consistent.

4. **Capacitor config**
   - No permission changes required; the plugin declares `FOREGROUND_SERVICE` in its own manifest and merges automatically.
   - No edits to `capacitor.config.ts` unless the user wants to customize notification color (skipping for now).

### Out of scope
- iOS lock-screen controls (already work via MediaSession in WKWebView — no change needed; plugin also supports iOS if we want parity later).
- Changing playback, offline downloads, UI sizing, or the locked header logo.
- Background audio service for long pauses with screen off — the plugin keeps the notification as a foreground service automatically while playing.

## Files touched
- `package.json` (add dependency)
- `src/lib/media-notification.ts` (new)
- `src/hooks/use-audio.ts` (3 small additions inside existing effects)

## After merge — user action
Pull, then run:
```
npm install
npx cap sync android
npx cap run android
```
