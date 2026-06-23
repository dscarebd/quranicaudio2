## Goal
Make the `NowPlayingCard` always visible on the screen. When no Surah is currently playing, display a placeholder state that matches the card's visual style with a message prompting the user to start listening.

## What will change

### 1. Translation dictionary (`src/lib/i18n.ts`)
- Add new translation key `tapToListen`:
  - English: `"Tap a Surah to start listening"`
  - Bangla: `"শোনা শুরু করতে একটি সূরায় ট্যাপ করুন"`

### 2. NowPlayingCard component (`src/components/NowPlayingCard.tsx`)
- Remove the early `return null` when `surahId == null`.
- Render the card always, preserving the existing background, shape, wave pattern, and layout.
- When `surahId == null`:
  - Keep the "Now Playing" / "এখন চলছে" label at the top.
  - Show the new `tapToListen` placeholder message in the title area.
  - Hide the time display, play/pause, shuffle, and repeat controls.
  - Show a static placeholder icon or cover-art area (e.g., a muted/generic SurahCoverArt or a simple note icon) instead of the rotating surah art.
- The card remains clickable/tappable and links to `/player` as before.
- When a Surah IS playing, behavior stays exactly the same as today (surah name, controls, cover art, time).

### 3. Styling
- Placeholder text should be slightly muted (opacity) so it visually reads as an idle/invitation state.
- No new colors or hardcoded values — use existing theme tokens (`opacity-60`, `text-primary-foreground`, etc.).

## Scope
- Only `NowPlayingCard.tsx` and `src/lib/i18n.ts` are modified.
- No changes to player logic, audio store, or other pages.

## Outcome
- The NowPlayingCard is never hidden.
- Users always see a consistent card at the bottom, with a friendly localized prompt to begin listening when idle.