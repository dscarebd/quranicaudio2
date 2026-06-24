## Goal

Replace the plain blue "Download all" link on the home page with a UI-matched icon button. Tapping it opens a popup where the user picks a reciter and one/multiple/all surahs, then taps "Start download" to cache audio on the device for offline playback.

## Scope

- File to edit: `src/routes/index.tsx` (button trigger)
- New component: `src/components/DownloadSheet.tsx` (the popup)
- Reuse existing infra: `src/lib/offline-download.ts`, `src/lib/reciters.ts`, `src/lib/audio-urls.ts`, `src/lib/quran-data.ts`
- i18n: add a few keys to `src/lib/i18n.ts` (English + Bangla)

## Button redesign

Replace the text link with a compact pill button that matches the app's primary style:
- Icon: `Download` from lucide-react
- Label: "Download" (short)
- Style: rounded-full, `bg-primary/10 text-primary` with hover state — visually consistent with existing accent chips, not a bare blue link

## Popup (bottom sheet)

Use the existing shadcn `Sheet` component (side="bottom") for a mobile-friendly modal.

Sections inside the sheet:
1. **Header** — title "Download for offline", close button
2. **Reciter picker** — shadcn `Select` listing all reciters from `RECITERS`
3. **Surah selection**
   - Three quick chips: "All 114", "Clear", and a search input to filter
   - Scrollable list of surahs with a `Checkbox` per row (id, name, transliteration)
   - Header row shows "X selected" counter
4. **Footer (sticky)**
   - Primary button: "Start download" — disabled until reciter + ≥1 surah selected
   - Shows progress (`completed / total`, current surah, failed count) once downloading
   - Cancel button while in progress
   - Success state: "✓ Saved to device" with close action

## Download logic

- Extend `src/lib/offline-download.ts` with a new helper `downloadSelected(reciterId, surahIds[], onProgress)` mirroring the existing `downloadReciter` worker pool (concurrency 3, AbortController, no-cors fetch). Existing `downloadReciter` stays for callers that want all 114.
- The service worker's CacheFirst rule already persists these requests, so no other plumbing is needed.
- Audio plays from cache automatically when offline (already wired through the SW).

## Technical notes

- The popup state (`open`, selected reciter, selected surah set, progress, handle) lives inside `DownloadSheet`. The home page only renders the trigger button + sheet.
- Progress UI updates via React state from the `onProgress` callback.
- On unmount or cancel, call `handle.cancel()` to abort in-flight fetches.
- Out of scope: a separate "Downloads" management screen, per-reciter cache size display, deleting individual cached surahs (the existing `clearReciterCache` already nukes everything if needed).

## Files touched

```text
src/routes/index.tsx              edit: swap button → <DownloadSheet />
src/components/DownloadSheet.tsx  new
src/lib/offline-download.ts       edit: add downloadSelected()
src/lib/i18n.ts                   edit: add keys (download, selectReciter,
                                         selectSurahs, selected, startDownload,
                                         downloading, downloadComplete, cancel,
                                         selectAll, clear, searchSurah)
```
