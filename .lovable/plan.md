## Goal
Use your uploaded logo image as the header logo (not the inline SVG fallback I substituted earlier).

## Why it changed
Earlier you reported the logo "crashed" (broken `/logo.png` reference). I replaced the `<img>` with an inline SVG `Logo` component to stop the crash, but that lost your actual uploaded artwork. I should have re-uploaded your image as a proper asset instead.

## Plan
1. Upload the attached image to Lovable Assets via `lovable-assets create`, producing `src/assets/logo.png.asset.json` (CDN-hosted, won't 404).
2. Update `src/components/TopBar.tsx` to render an `<img>` using the asset URL (`import logoAsset from "@/assets/logo.png.asset.json"`), keeping the same sizing (`h-7 w-auto`) and Link wrapper.
3. Leave `src/components/Logo.tsx` in place but unused (or delete it) — confirm preference; default: delete since the real logo replaces it.
4. Verify in preview that the chevron-style logo renders crisply in the header on mobile viewport.

## Result
Your uploaded logo shows in the header reliably across dev, preview, and published builds — no more disappearing/crashing.