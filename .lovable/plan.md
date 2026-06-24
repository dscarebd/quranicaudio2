## Goal

Add a Developer & About page accessible from the Profile screen, styled like the reference. Use the uploaded An-Nur Digital logo as the developer image.

## Asset

Upload the user-provided logo via `lovable-assets`:
- Source: `/mnt/user-uploads/Untitled_design_1.png`
- Pointer: `src/assets/annur-digital.png.asset.json` (CDN-hosted, not committed as binary)

## New route: `src/routes/developer-info.tsx`

- `AppShell` + simple header with a back link "← Back to profile" → `/profile`.
- `head()`: title "Developer — Quran Audio".

### Developer card (top)
- Centered An-Nur Digital logo (h-24, from new asset pointer)
- Name: **An-Nur Digital** (font-display, bold)
- Tagline: *Crafting digital experiences with purpose*
- Three contact rows, each an `<a>`:
  - Globe icon → Website · `annurdigital.com` → `https://annurdigital.com`
  - Mail icon → Email · `support@annurdigital.com` → `mailto:`
  - MessageCircle icon → Telegram · `@nuralamin.official` → `https://t.me/nuralamin.official`
- Icon chips: `bg-primary/15 text-primary` rounded-full (uses app's blue theme, not the reference's purple).

### About app card (below)
- Header: app logo chip (existing `logo.png.asset.json`) + **About Quran Audio** + sub "Listen to the Quran, beautifully"
- Body: short description — 114 Surahs, choose reciter, favorites, recently played, sleep timer, EN/BN.
- Footer line: `Version 1.0.0`.

## Profile entry point

`src/routes/profile.tsx`: add a new `Section title="About"` (last section) with a single `Link` row → `/developer-info`:
- Icon `Info`, label "Developer & About", chevron right.

## Design notes

- Reuse existing `Section`/card styling (rounded-3xl, bg-surface, border-border) so it feels native.
- All colors via design tokens — no hardcoded hex/purple.
- Mobile-first, matches existing profile aesthetic.

## Out of scope

- No i18n strings (English labels, matching existing static profile copy).
- No new npm dependencies.
- No bottom-nav changes.
