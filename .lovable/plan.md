## Why nothing shows in the panel

The plugin currently installed — **`@capgo/capacitor-media-session`** — is only a thin bridge that forwards JS `navigator.mediaSession` calls to the native Android `MediaSessionCompat` object. It does **not** post a MediaStyle notification and does **not** start a foreground service. On Android, no notification = nothing in the panel, no matter how much metadata we set. That's why your build (synced + reinstalled, audio playing) still shows nothing.

To get the YouTube-style media tile in the notification panel, the plugin has to (a) post a MediaStyle notification and (b) bind it to a foreground service while playing. Two community plugins do this correctly today; the cleanest swap is **`@capawesome/capacitor-media-session`** (Capacitor 6/7, actively maintained, MIT, same API shape as the current one — so almost no code changes).

## Plan

### 1. Replace the plugin
- `bun remove @capgo/capacitor-media-session`
- `bun add @capawesome/capacitor-media-session`

### 2. Rewrite `src/lib/media-notification.ts` against the new API
The Capawesome API is almost identical in shape but uses upper-snake-case action names and a `MediaSession` import from `@capawesome/capacitor-media-session`. The bridge keeps the same four exports (`setNotificationMetadata`, `setNotificationPlaybackState`, `setNotificationPosition`, `setNotificationActionHandler`) so **`src/hooks/use-audio.ts` does not change**.

Mapping inside the bridge:
```text
web action          → Capawesome MediaSessionAction
play                → 'PLAY'
pause               → 'PAUSE'
previoustrack       → 'PREVIOUS_TRACK'
nexttrack           → 'NEXT_TRACK'
seekbackward        → 'SEEK_BACKWARD'
seekforward         → 'SEEK_FORWARD'
seekto              → 'SEEK_TO'
stop                → 'STOP'
```
The bridge translates internally; `use-audio.ts` keeps calling `setNotificationActionHandler('play', …)` etc.

Also call `MediaSession.setSupportedActions({ actions: [...] })` once after handlers register, which is what tells Android which transport buttons to render in the MediaStyle notification (this is the bit @capgo doesn't do, and a common reason buttons or the notification itself don't appear).

### 3. Android manifest permissions
Capawesome auto-merges these, but verify after `cap sync` that `android/app/src/main/AndroidManifest.xml` contains:
```text
android.permission.FOREGROUND_SERVICE
android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK
android.permission.POST_NOTIFICATIONS
android.permission.WAKE_LOCK
```
If any are missing after the auto-merge, add them. Android 13+ also requires runtime `POST_NOTIFICATIONS` permission — the plugin requests it on first `setMetadata`, but if it fails silently we'll add an explicit request inside the bridge before the first `setMetadata` call (using `@capacitor/core` `PermissionsAndroid` via the plugin's `requestPermissions()` helper).

### 4. Small icon
Capawesome lets you set the notification's small icon. Default `ic_media_play` is a generic Android system icon, but it works. We'll leave it as default for now — adding a custom `ic_stat_notify.png` under `android/app/src/main/res/drawable-*` is optional and can come later if you want app branding.

### 5. Verify
After implementing:
1. `npx cap sync android`
2. Rebuild & reinstall APK
3. Open app → tap play on any surah → swipe down notification panel → media tile must appear with surah title, reciter, app logo cover, and prev/play-pause/next buttons
4. Lock screen should show the same controls

If still nothing shows, the bridge will `console.warn` the underlying error so we can see it in `adb logcat`.

## Files touched
- `package.json` / `bun.lock` (swap dependency)
- `src/lib/media-notification.ts` (rewrite against new API, same exports)
- `src/hooks/use-audio.ts` (no changes)
- `android/app/src/main/AndroidManifest.xml` (verify only — usually no edit needed)

## Out of scope
- Custom notification small icon / color theming
- iOS lock-screen controls (already work via WebView's built-in MediaSession)
- Any playback engine, UI, download, or offline changes
