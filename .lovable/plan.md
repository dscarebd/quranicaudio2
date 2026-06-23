## Goal

Replace the placeholder initials avatar on `/reciters` with each reciter's real photograph hot-linked from QuranCentral's public artwork CDN (`https://artwork.qurancentral.com/<slug>-300x300.jpg`). No AI images, no files added to the repo.

All 15 image URLs verified to return HTTP 200.

## Changes

### 1. `src/lib/reciters.ts` — add `image` field

Add a new `image: string` property on the `Reciter` type and on each of the 15 entries, using the verified QuranCentral slugs:

| Reciter id | Slug |
|---|---|
| alafasy | mishary-rashid-alafasy |
| abdulbasit | abdul-basit-abd-us-samad |
| sudais | abdur-rahman-as-sudais |
| shuraim | saud-al-shuraim |
| husary | mahmoud-khalil-al-husary |
| minshawi | muhammad-siddiq-al-minshawi |
| muaiqly | maher-al-mueaqly |
| ajamy | ahmed-al-ajmi |
| ghamdi | saad-al-ghamdi |
| matrood | abdullah-al-matrood |
| hudhaify | ali-abdur-rahman-al-huthaify |
| shaatri | abu-bakr-al-shatri |
| basfar | abdullah-basfar |
| juhany | abdullah-awad-al-juhani |
| rifai | hani-ar-rifai |

Each `image` resolves to `https://artwork.qurancentral.com/<slug>-300x300.jpg`.

### 2. `src/routes/reciters.tsx` — render the photo

Replace the initials `<div>` inside each list button with:

```tsx
<img
  src={r.image}
  alt={r.name}
  loading="lazy"
  width={48}
  height={48}
  className="h-12 w-12 rounded-full object-cover bg-surface-2"
  onError={(e) => { (e.currentTarget as HTMLImageElement).style.visibility = 'hidden'; }}
/>
```

Keeps the same 48px circular slot, lazy-loads off-screen images, and hides gracefully if the CDN ever 404s. The active ring/check styling stays unchanged.

## Out of scope

- No changes to the player, mini-player, or anywhere else that lists reciters (can extend later if you want photos on the player screen too).
- No files cached locally — images are served directly from QuranCentral's CDN.