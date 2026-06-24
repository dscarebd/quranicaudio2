## Why it resets

The "Now Playing" card on the home page reads from the in-memory Zustand player store (`src/stores/player.ts`). Nothing is saved to the browser, so every page refresh or reopen starts with `surahId = null` — which is why the card flips back to "Tap a Surah to start listening".

## Fix

Persist the player store to `localStorage` using Zustand's built-in `persist` middleware. Only the fields that should survive a reload are saved; transient playback fields are not.

### Changes

`src/stores/player.ts`
- Wrap the store in `persist(...)` from `zustand/middleware` with key `quran-player`.
- `partialize` to persist only:
  - `surahId`, `ayahId`
  - `shuffle`, `repeat`, `playbackRate`
- Do NOT persist: `isPlaying`, `currentTime`, `duration`, `_seekRequest`, `sleepMode`, `sleepEndsAt` (audio should not auto-resume on reload; sleep timers shouldn't survive).
- On rehydrate, force `isPlaying: false` and `currentTime: 0` so the card shows the last-played Surah, paused at 0:00, ready for the user to tap play.

### Result

After a refresh: the card still shows "Sura Al-Fatihah" (or whatever was last played) with the play button, instead of resetting to the idle prompt.

### Out of scope

- No change to `NowPlayingCard.tsx`, `use-audio.ts`, or any route.
- No auto-play on reload (browsers block it anyway, and it would be surprising UX).
