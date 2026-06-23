## Root cause

`useAudioEngine()` is called inside `src/components/AppShell.tsx`, and every route renders its own `<AppShell>`. With `PageTransition` (framer-motion `AnimatePresence`), the outgoing page and incoming page are both mounted during the transition — so **two audio engines run at once**, each with its own `new Audio()` element. Tapping play repeatedly across navigation accumulates orphan `Audio` instances that the store can't pause, producing layered/overlapping playback that never stops.

The hydration error in the console has the same family of cause: `recents.length > 0` differs between SSR (empty) and client (localStorage-hydrated), so the homepage tree mismatches and React throws away the SSR tree.

## Fix

1. **Single audio engine.** Remove `useAudioEngine()` from `src/components/AppShell.tsx`. Call it once in `src/routes/__root.tsx` `RootComponent` (alongside `<PageTransition />` and `<BottomNav />`). One `new Audio()` instance for the whole app lifetime — pause/play always controls the same element.
2. **Same-track tap behavior.** In `src/stores/player.ts` `play(surahId, ayahId)`: if it matches the currently loaded track, just set `isPlaying: true` and seek to 0 via `_seekRequest`; otherwise keep current behavior. Prevents the "tap play again starts a second stream" feel even if a stale engine is still around during transition.
3. **Defensive cleanup.** In `useAudioEngine`'s mount effect, return a cleanup that pauses the audio, clears its `src`, removes listeners, and nulls the ref — so if the engine ever does unmount, no orphan element keeps playing.
4. **Hydration fix on home.** In `src/routes/index.tsx`, gate the `Recently Played` section on a client-only `mounted` flag (`useState(false)` + `useEffect(() => setMounted(true), [])`) so SSR and first client render agree (both render nothing); the section appears after hydration when `recents` is read from localStorage.

No store schema or server changes.
