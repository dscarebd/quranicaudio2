## Why page switches feel slow (3–4s blink)

Two compounding causes in the current setup:

1. **`PageTransition` uses `AnimatePresence mode="wait"`** (`src/components/PageTransition.tsx`). This forces the OLD page to fully play its exit animation (opacity + translate, 220ms) BEFORE the NEW page starts mounting. During that gap the screen is blank — that's the "blink". On top of that, the NEW page then plays its own 220ms enter animation. So even in the best case every tap costs ~450ms of pure animation, and it visually reads as a blank flash.

2. **No link preloading is configured.** `src/router.tsx` sets `defaultPreloadStaleTime: 0` but never sets `defaultPreload`. That means when you tap a tab, the route's JS chunk + its loader/query only start fetching AT tap time. Combined with the exit animation blocking the mount, on a cold route this stacks to multiple seconds. Routes like `/reciters`, `/downloads`, `/favorites` each load their own data on mount, so the first visit is the slowest.

The "blank for 3–4s then appears" pattern is the signature of `mode="wait"` + un-preloaded route chunks.

## Plan

### 1. Fix the page transition (remove the blank gap)
File: `src/components/PageTransition.tsx`
- Switch `AnimatePresence` from `mode="wait"` to the default (`"sync"`) so the new page mounts immediately while the old one fades out underneath.
- Shorten enter animation to ~120ms, opacity-only (drop the `y` translate which also costs a paint). Remove the exit animation entirely (or make it 80ms opacity) so navigation feels instant.
- Keep `key={pathname}` and `initial={false}` behavior.

### 2. Enable route preloading
File: `src/router.tsx`
- Add `defaultPreload: "intent"` and `defaultPreloadDelay: 50` to `createRouter`. This makes TanStack Router start fetching the route's JS chunk + loader data on hover / touchstart, so by the time the tap fires the page is usually already ready.

### 3. (Optional but recommended) Bottom nav links use Link, not navigate
Spot-check `src/components/BottomNav.tsx` to confirm it uses `<Link to=...>` (required for `defaultPreload: "intent"` to work). If it uses `useNavigate` onClick, switch to `<Link>` so preloading kicks in.

## Out of scope
- No data-layer changes, no route restructuring, no loader rewrites. This is a perceived-performance fix focused on the transition layer and router config.

## Expected result
Tapping a bottom-nav tab should feel instant: no blank flash, page content appears within ~100ms on warm routes and noticeably faster on first visit thanks to intent preloading.