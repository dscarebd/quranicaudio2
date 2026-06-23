## Issue

`Recently Played` is already device-local (zustand + `localStorage` key `q_recents`), so different users never share it. But `src/routes/index.tsx` injects a hardcoded `FALLBACK = [1, 5, 18, 36, 67, 55]` list, which makes brand-new visitors see the same surahs and look like a server-shared feed.

## Fix

In `src/routes/index.tsx`:
- Remove the `FALLBACK` array and the dedup/merge loop.
- Use `recents` directly from `useRecents`.
- When `recents.length === 0`, hide the "Recently Played" section entirely (or render a subtle empty state: "Songs you play will appear here"). Default: hide the section so the homepage starts with "All Surah" until the user plays something.

No store/server changes — `useRecents.push(id)` is already called from `src/hooks/use-audio.ts` on playback, per-device only.
