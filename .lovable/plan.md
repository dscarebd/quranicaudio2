## Goal
Add **Abd Al-Rahman Al-Ossi** (عبد الرحمن العوسي) to the reciter list so users can play all 114 surahs with his recitation, the same as the existing 15 reciters.

## Changes

**1. `src/lib/reciters.ts`** — append one entry to `RECITERS`:

```ts
{
  id: "ossi",
  name: "Abd Al-Rahman Al-Ossi",
  arabic: "عبد الرحمن العوسي",
  mp3quranBase: "https://server6.mp3quran.net/3osi/", // full-surah MP3s NNN.mp3
  everyayahFolder: "Alafasy_128kbps",                  // fallback (no ayah-by-ayah set on everyayah)
  image: img("abdur-rahman-al-ossi"),
}
```

No other code changes needed — `reciters.tsx`, `player.tsx`, `audio-urls.ts`, and the surah page all iterate `RECITERS`, so he'll appear automatically in the reciters grid, player, and selectors.

## Notes / open items
- Full-surah URL base from mp3quran.net for Al-Ossi is `server6.mp3quran.net/3osi/` (files `001.mp3`…`114.mp3`). I'll verify the exact server number works before finalizing; if that mirror is offline I'll swap to the current live one returned by mp3quran's reciter API.
- everyayah.com does not host an Al-Ossi verse-by-verse set, so verse-level playback (if any feature uses `everyayahFolder`) falls back to Alafasy for him. Full-surah playback — what you asked for — works fully.
- Artwork: using the QuranCentral CDN slug `abdur-rahman-al-ossi`. If the image 404s I'll fall back to a generic placeholder.

Confirm and I'll implement.