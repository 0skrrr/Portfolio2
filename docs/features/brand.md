# Brand mark and consistency

The site follows the profile logo: Urbanist 700, cream / ink, and one red dot as the signature ("OSKAR.").

## Red dot after the hero name
The hero name uses `mix-blend-mode: difference`, and red under difference turns teal. So `.home__dot` is painted in `--dot-through-blend`, the colour that comes out as exactly `#b84a39` after the difference blend with the backdrop it sits on:
- light: backdrop cream `#ebe3d0` → `#339997`
- dark: backdrop `#130918` → `#cb5351`

It only works because the dot always sits on the panel background (right of the slab edge in landscape, below the seam in portrait). If the layout moves the dot onto the slab, recompute.

## Cursor over red
Rows and skill labels fill red on hover. The difference-blend cursor would turn teal there, so `ACCENT_ON_HOVER` switches it to a plain cream ring.

## Favicon
`public/favicon.svg`: the "O." monogram (cream O, red dot on ink), square corners like the rest of the site.

## Still to do
- `og:image` share card: needs an absolute site URL at build time (deploy config), not added yet.
