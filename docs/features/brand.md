# Brand mark and consistency

The site follows the profile logo: Urbanist 700, cream / ink, and one red dot as the signature ("OSKAR.").

## Red dot after the hero name
The hero name uses `mix-blend-mode: difference`, and red under difference turns teal. So `.home__dot` is painted in `--dot-through-blend`, the colour that comes out as exactly `#b84a39` after the difference blend with the backdrop it sits on:
- light: backdrop cream `#ebe3d0` → `#339997`
- dark: backdrop `#130918` → `#cb5351`

It only works because the dot always sits on the panel background (right of the slab edge in landscape, below the seam in portrait). If the layout moves the dot onto the slab, recompute.

## Cursor over red
Rows and skill labels fill red on hover. The difference-blend cursor would turn teal there, so `ACCENT_ON_HOVER` switches it to a plain cream ring.

## Icons (main logo)
The main logo is the **unsmoothed** silhouette with OSKAR. centred (original-edge / v2 in the design folder).
- `public/icons/icon-light.png` (cream bg, ink silhouette) and `icon-dark.png` (ink bg, cream silhouette), 192px.
- In index.html the light icon has **no** `media` attribute and the dark one comes after it with `media="(prefers-color-scheme: dark)"`. Browsers use the last matching icon, so dark-scheme visitors still get the dark icon before JS runs. `applyTheme` (src/theme.ts) then flips both `media` to `all` / `not all`, so the tab icon follows the site's own theme toggle.
- Why the light one has no `media`: Google Search only shows a site icon if it finds a plain `rel="icon"` whose size is a multiple of 48px (192 = 4×48). With both links behind media queries, results showed the generic globe.
- `public/favicon.ico` (48/32/16, light version) is a root fallback for crawlers and old clients that request `/favicon.ico` directly. It is deliberately **not** linked in the head: browsers prefer its exact 16/32 sizes, which would break the theme-following tab icon.
- `apple-touch-icon.png` (180px, light version).

## Share card
`public/og.png`: 1200×630, the light logo centred on cream. Share cards need an absolute URL, so the `siteUrl` Vite plugin fills `%SITE_URL%` from the `SITE_URL` env var (set in `.github/workflows/deploy.yml`). Without it (local builds) the og:image tags are removed rather than shipped broken.
