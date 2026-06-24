## Root cause

`PageTransition` wraps every route in a `motion.div` that animates `y` and sets `will-change: transform, opacity`. A `position: fixed` child inside a transformed ancestor is positioned relative to that ancestor's box — not the viewport. The scroll-to-top button therefore sits at `bottom: 6rem` of the *full surah content*, which is far below the visible screen, so it's effectively invisible no matter how far you scroll.

## Fix

In `src/routes/surah.$id.tsx`, render the floating button through a React portal to `document.body` so it escapes the transformed `motion.div`:

- Import `createPortal` from `react-dom`.
- Track a `mounted` state (set `true` in a `useEffect`) so SSR doesn't try to portal.
- When `mounted` is true, wrap the existing `<button>` in `createPortal(..., document.body)`.
- Keep current styles (`fixed bottom-24 left-4 z-40 h-12 w-12 ...`) and the show/hide opacity/scale logic.

No changes to `PageTransition`, `AppShell`, or any other route — the transform-based slide animation stays intact.

## Verification

Open `/surah/2`, scroll down past the first card → the circular up-arrow button appears at the bottom-left, above the bottom nav. Tap it → smooth scroll to top, button fades out.
