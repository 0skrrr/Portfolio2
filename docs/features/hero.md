# Hero

## Head silhouette
- Follows the original Figma frame: no slab, a large ink head on cream, and the name in difference blend so it flips wherever it crosses the face.
- `public/assets/hero/head.svg` has its viewBox cropped to the head's bounds (298 300 756 850), so CSS can size it with `aspect-ratio: 756 / 850`. The torso is intentionally not used.
- Painted through a CSS mask (same trick as the social icons) so the fill follows the theme.
- The slab (or the head, when there's no slab) leans ±4vw with the pointer (Home.tsx) and tilts ±5° around the neck (HeroFigure.tsx). They're on different elements so the GSAP transforms don't fight.
- Source photos live in the git-ignored `assets-src/`.

## Hero variants (one switch)
`heroVariant` in `src/data.ts`:
- `'head'`: big ink head, no slab (the Figma frame).
- `'both'`: slab plus head. The head is painted in `--blend` with `mix-blend-mode: difference`, so it reads dark on cream and light on the slab, like the name.
- `'text'`: the original text-only hero (name split by the slab). Default since 2026-11-22.
The intro adapts: when a slab exists it shrinks into the slab and fades from red to the slab colour; otherwise it wipes up.

## Accent red
The intro is red and wipes up off the hero. Project rows and skill labels fill red on hover instead of ink.

## Photo credit
The © button opens a native `popover` (light-dismiss and Esc for free). Fill `photoCredit.photographer` / `photographerHref` in `src/data.ts`; until then it shows `home.credit.unknown`.

## Intro nickname
The red intro types `intro.nickname` ("Oskrrr") and morphs into `profile.name`. `morphGlyphs` (src/components/morph.ts) keeps the shared prefix and suffix; middle glyphs roll into the new letter, and leftovers collapse to zero width before the handoff measures positions.

## Phone layout notes
Below 760px the up arrow drops under the header row (Contact / theme / language) so it never covers those toggles. Long panels scroll with ~96px bottom padding, so their content clears the bottom arrows once scrolled.

## Contact portrait
`public/assets/photos/portrait.jpg` (`portraitPhoto` in data.ts) is shown in the contact drawer with a red offset shadow. Swap the file to change the photo.
It's exported through a browser canvas (orientation applied, 1000px long side, JPEG 80%) so **no EXIF/XMP metadata** — camera, lens, timestamps, GPS — ships with it. Re-export any replacement the same way rather than copying the camera file.
