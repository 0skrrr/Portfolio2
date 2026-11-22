# Hero

## Silhouette
- `public/assets/hero/head.svg` and `body.svg` come from the same 1333×2000 canvas, so they stack exactly. They are painted through CSS masks (same trick as the social icons) so the fill follows the theme.
- The head layer is shifted 3px down to overlap the body; otherwise the two anti-aliased mask edges leave a hairline at the neck.
- In portrait the silhouette sits on the slab as a faint watermark. Its colour is an *opaque* mix of cream into ink: a translucent fill would double up where head and body overlap.
- The head tilts ±5° toward the pointer (fine pointers, motion allowed). GSAP rotates `.figure__tilt`, an element with no CSS transform of its own (see the GSAP gotchas about `translate`).
- Source photos live in the git-ignored `assets-src/`.

## Photo credit
The © button opens a native `popover` (light-dismiss and Esc for free). Fill `photoCredit.photographer` / `photographerHref` in `src/data.ts`; until then it shows `home.credit.unknown`.

## Intro nickname
The intro types `intro.nickname` ("Oskrrr") and morphs into `profile.name`. `morphGlyphs` (src/components/morph.ts) keeps the shared prefix and suffix; middle glyphs roll into the new letter, and leftovers collapse to zero width before the handoff measures positions.
