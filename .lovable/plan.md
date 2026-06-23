## Goal
Replace the Info (ⓘ) button in the header with an EN / BN language toggle. English stays the default; tapping switches the entire app (UI labels + surah names) between English and Bangla. The choice persists across reloads.

## Changes

### 1. Language store — `src/stores/language.ts` (new)
- Zustand store, persisted to `localStorage` under `qa-language`.
- Shape: `{ lang: "en" | "bn", setLang, toggle }`.
- Default: `"en"` (always, until user changes it).
- Export a `useT()` hook returning a `t(key)` function that reads from a dictionary.

### 2. Translations — `src/lib/i18n.ts` (new)
- Dictionary `{ en: {...}, bn: {...} }` covering every visible UI string used today:
  - TopBar / nav labels: Search, Home, Reciters, Favorites, Profile
  - Home: "Now Playing", "Recently Played", "All Surahs", "Select a surah to listen"
  - Player: Play, Pause, Shuffle, Repeat, Next, Previous
  - Surah list: "ayahs", "Meccan", "Medinan"
  - Search placeholder, empty states, etc.
- A helper `surahName(surah, lang)` returning the Bangla name when `lang === "bn"`, otherwise the existing English transliteration.

### 3. Bangla surah names — extend `src/lib/quran-data.ts`
- Add `bangla: string` field to the `Surah` type and fill it in for all 114 surahs (e.g. `আল-ফাতিহা`, `আল-বাকারা`, …). English fields stay untouched so nothing breaks.

### 4. TopBar — `src/components/TopBar.tsx`
- Remove the `Info` import and button.
- Add a compact pill toggle in its place:

```
[ EN | BN ]
```
- Active side uses `bg-primary-foreground text-primary`, inactive side is muted. Tapping either side calls `setLang`. `aria-label="Language"`, each segment is a `<button>` with `aria-pressed`.

### 5. Wire translations into existing screens
Swap hardcoded strings for `t("...")` and surah names for `surahName(surah, lang)` in:
- `src/components/BottomNav.tsx`
- `src/components/NowPlayingCard.tsx`
- `src/components/SurahListItem.tsx`, `src/components/RecentCard.tsx`
- `src/routes/index.tsx`, `src/routes/player.tsx`, `src/routes/search.tsx`, `src/routes/favorites.tsx`, `src/routes/reciters.tsx`, `src/routes/profile.tsx`, `src/routes/surah.$id.tsx`

Arabic text and reciter names remain as-is (proper nouns / scripture).

## Notes
- No backend or routing changes; purely a client-side preference.
- Search continues to match against the English transliteration so users can find surahs either way; we can additionally match the Bangla string when `lang === "bn"`.
- Numbers (surah #, ayah counts) stay in Western digits for consistency — let me know if you'd prefer Bangla numerals (১, ২, ৩…) when BN is active and I'll add a formatter.
