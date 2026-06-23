## Problem

Two issues in the **Recently Played** row on the home page:

1. **Surahs auto add/remove on load** — `useAudioEngine` calls `pushRecent(surahId)` inside its track-loading effect. That effect re-runs on mount (with the restored player state) and whenever `reciterId` changes, so a surah gets pushed into recents even when the user didn't actively start it.
2. **Blink / cards disappear** — When the recents store is empty, the home page shows a 5-item fallback list `[1, 5, 18, 36, 67]`. As soon as one surah is played, `recents` becomes `[playedId]` and the other 4 fallback cards instantly disappear, then the row re-populates as more surahs are played. This reads as a "blink / auto remove".

## Fix

### 1. `src/hooks/use-audio.ts`
Only push to recents on a real, user-initiated track change.

- Add a `didMountRef` so the first run of the source-loading effect does NOT call `pushRecent` (prevents the restored surah from being re-pushed on page load).
- Track the last pushed `surahId` in a ref and only push when `surahId` actually changes to a new value (skip pushes triggered by `reciterId` changes alone).

### 2. `src/routes/index.tsx`
Make the Recently Played row stable so it never collapses when recents has fewer than ~5 items.

- Always render a fixed-length list (e.g. 6 items) by taking `recents` first and padding with defaults `[1, 5, 18, 36, 67, 36]` (skipping ids already in recents). This way the row never visibly shrinks/blinks when the first user play happens — fallback cards stay until pushed off the end.
- Dedupe and cap at 10.

No changes to styling, store shape, or any other component.

## Files touched

- `src/hooks/use-audio.ts` — guard `pushRecent` with mount + last-id refs.
- `src/routes/index.tsx` — pad + dedupe `recentList` so the row length is stable.