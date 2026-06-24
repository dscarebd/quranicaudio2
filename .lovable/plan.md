## Goal
The floating scroll-to-top button on `/surah/$id` isn't appearing for you even after scrolling deep into a long surah. Fix it so it reliably shows once you've scrolled past the top, and tapping it returns to the top of the surah.

## Likely cause
In `src/routes/surah.$id.tsx` the visibility state is driven by a `scroll` listener on `window` that:
- runs only on the client after mount (no initial check, so on a route that loads already-scrolled it stays hidden)
- relies on `window.scrollY` without `{ passive: true }` and without a fallback to `document.documentElement.scrollTop` (some mobile webviews report 0)
- isn't re-evaluated when content height changes after the async ayah fetch resolves

Net effect: on mobile the threshold check can silently never flip to `true`.

## Fix

In `src/routes/surah.$id.tsx`:

1. Replace the scroll effect with a more robust version:
   - Compute scroll using `window.scrollY || document.documentElement.scrollTop || document.body.scrollTop`.
   - Add `{ passive: true }` to the listener.
   - Run the check once immediately on mount and again whenever ayah data loads (so layout-height changes re-trigger evaluation).
   - Also listen to `resize` to recover from viewport changes.

2. Bump the button's visual presence so it's obviously visible above the bottom nav:
   - Keep `fixed bottom-24 left-4 z-40`.
   - Increase size to `h-12 w-12`, add a subtle entrance (`opacity-100 scale-100` vs `opacity-0 scale-90 pointer-events-none`) so it animates in instead of mount-flashing.
   - Keep the existing `ArrowUp` icon and `aria-label={t("scrollToTop")}`.

3. Click handler stays `window.scrollTo({ top: 0, behavior: "smooth" })` but also falls back to setting `document.documentElement.scrollTop = 0` for Safari.

## Out of scope
- No changes to Home, Reciters, Favorites, or Settings pages.
- No changes to `AppShell`, `BottomNav`, translations, or data loading.

## Verification
- Open `/surah/2`, scroll past the first card → button appears bottom-left above the bottom nav.
- Tap it → smooth scroll back to the surah header.
- Scroll back to top → button fades out.
