## Goal
On Android, a single hardware back press should navigate to the previous page. Only when there is no previous page (user is on a root screen) should back act as exit — and even then, it requires **two presses within 2 seconds** to actually exit, with a toast hint in between.

## Changes

1. **Install Capacitor App plugin**
   - Add `@capacitor/app` (already a peer of Capacitor core, but ensure it's in `package.json`).
   - Run `npx cap sync android` after build (user step, documented in closing note).

2. **New hook `src/hooks/use-android-back-button.ts`**
   - Registers `App.addListener('backButton', ...)` only when running under Capacitor native (`Capacitor.isNativePlatform()`).
   - Logic on back press:
     - If `window.history.length > 1` AND current route is not a designated "root" route (`/`, `/reciters`, `/favorites`, `/downloads`, `/profile` — the BottomNav tabs) → call `window.history.back()`.
     - Else (on a root tab with nothing to pop):
       - First press: show a sonner toast "Press back again to exit" and start a 2-second timer.
       - Second press within 2s: call `App.exitApp()`.
       - Timer expiry: reset the "armed" flag.
   - Cleans up the listener on unmount.

3. **Wire the hook into `src/routes/__root.tsx`**
   - Call `useAndroidBackButton()` inside `RootComponent` alongside `useAudioEngine()`.
   - No-op on web/PWA builds (guarded by `Capacitor.isNativePlatform()`), so web behavior is unchanged.

4. **Toast**
   - Reuse the existing `sonner` toaster already in the app (no new dependency). Message text in both English and Bangla based on current `useLanguage()` store: e.g. EN "Press back again to exit", BN "প্রস্থান করতে আবার ব্যাক চাপুন".

## Out of scope
- No changes to web/PWA back behavior (browser handles it natively).
- No changes to in-app navigation UI or BottomNav.
- No new screens or settings toggle — this is always-on native behavior, matching standard Android app UX. (If you want it as a user-toggleable setting in Profile, say so and I'll add it.)

## Files touched
- `package.json` — add `@capacitor/app` dependency
- `src/hooks/use-android-back-button.ts` — new
- `src/routes/__root.tsx` — call the new hook
