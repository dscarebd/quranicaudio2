## Quran Audio PWA — Build Plan

A dark, minimal, smooth mobile-first web app styled to match your screenshots (black background, green accent #1DB954-ish, rounded cards, bold sans typography). Installable on iOS/Android home screen. Can be wrapped with Capacitor later for the App Store / Play Store.

### Screens (routes)

```
/                 Home  – Now Playing card, Recently Played, All Surah list
/surah/$id        Surah detail – cover, verse list (Arabic), play verse-by-verse
/player           Now Playing – big art, scrubber, prev/play/next, shuffle/repeat
/reciters         Pick reciter (15 options), shown on first launch + from header
/search           Search across 114 surahs
/favorites        Hearted surahs
```

Bottom nav: Home · Favorites (matching the green pentagon + heart icons in your mockup).

### Data sources (no audio hosting needed)

- **Surah metadata + Arabic text + verse count:** `api.alquran.cloud` (free, returns all 114 surahs / 6236 ayahs incl. bismillah).
- **Full-surah MP3s:** EveryAyah.com / mp3quran.net CDNs — URL pattern per reciter folder, e.g. `https://server8.mp3quran.net/afs/001.mp3`.
- **Verse-by-verse MP3s:** EveryAyah pattern `https://everyayah.com/data/{reciter}/{surah:03}{ayah:03}.mp3` — enables tap-an-ayah playback.
- **15 reciters** (Mishary Alafasy, Abdul Basit, Sudais, Shuraim, Husary, Minshawi, Maher Al Muaiqly, Ajamy, Ghamdi, Matrood, Hudhaify, Shaatri, Abdullah Basfar, Khalil Al Husary Muallim, Saood Shuraym) — stored in a static `reciters.ts` config with their CDN folder slugs.

### Features

1. **Audio engine** – single global `<audio>` via a Zustand store (`usePlayer`): play/pause, seek, next/prev, shuffle, repeat, current surah/ayah, current reciter. Persists last position to localStorage.
2. **Home** – Now Playing banner (green card) when audio active; Recently Played horizontal scroller (localStorage, last 10); "All Surah" list with per-item play button + heart.
3. **Surah detail** – Header with surah name (Arabic + English), play-full button, then scrollable verse list. Tap any ayah → plays that ayah, highlights current, auto-advances to next ayah.
4. **Now Playing** – full-screen player matching screenshot 1.
5. **Reciter picker** – grid/list; selection persists; switching reciter swaps audio source for current track at same position.
6. **Favorites** – heart toggle stored in localStorage; `/favorites` lists them.
7. **Search** – filters 114 surahs by name (English + Arabic + number).
8. **Offline download** – per-surah download button + "Download all" for current reciter; cached via Service Worker (Cache Storage). Uses `vite-plugin-pwa` with `NetworkFirst` for HTML, `CacheFirst` for hashed assets, and a runtime cache rule for audio CDN hosts. Guarded registration (skipped in Lovable preview per PWA skill).
9. **PWA install** – manifest + icons + theme color so users can "Add to Home Screen" and it feels native.

### Visual design

- Background `#0A0A0A`, surface `#141414`, accent green `#22C55E` / `#1DB954`, text white / muted gray.
- Typography: **Outfit** (display) + **Figtree** (body) via @fontsource — bold, modern, matches the mockup.
- Rounded-2xl cards, generous spacing, framer-motion for page transitions, play-button scale on tap, smooth scrubber.
- Custom Quran-arch logo (the white wing/book mark in your header) generated as SVG.
- All colors as semantic tokens in `src/styles.css` (no hardcoded `bg-black`).

### Technical structure

```
src/
  routes/  index.tsx, surah.$id.tsx, player.tsx, reciters.tsx,
           search.tsx, favorites.tsx
  components/  AppShell, BottomNav, TopBar, SurahListItem,
               NowPlayingCard, PlayerControls, VerseRow, ReciterCard
  lib/
    quran-data.ts      static 114-surah metadata (name, ayah count, type)
    reciters.ts        15-reciter config with CDN URL builders
    audio-urls.ts      builders for full-surah + per-ayah URLs
  stores/
    player.ts          Zustand: current track, queue, position, controls
    favorites.ts       Zustand + localStorage
    recents.ts         Zustand + localStorage
    reciter.ts         Zustand + localStorage (selected reciter)
  hooks/
    use-audio.ts       wires store → <audio>, time updates, ended → next
    use-surah-text.ts  TanStack Query fetch from alquran.cloud
  pwa/
    register-sw.ts     guarded registration (skill-compliant)
public/
  manifest.webmanifest, icons (192, 512, maskable), apple-touch-icon
```

No backend required for v1 — all state is local. Lovable Cloud can be added later if you want cross-device sync of favorites/recents/last-position.

### Out of scope (v1)

- Native App Store/Play Store builds (Capacitor wrap is a follow-up).
- Account login / cloud sync.
- Translation text / tafsir.
- Background audio on iOS Safari when screen locked (web-platform limitation; works in installed PWA on Android, partially on iOS).

### Deliverable

A polished, installable mobile web app you can open on your phone, add to home screen, browse all 114 surahs, pick from 15 reciters, play full surahs or individual verses, favorite, search, and download for offline listening.
