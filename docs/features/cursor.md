# Custom cursor

A small, low-contrast **Cursor · <style>** button in the top bar cycles through six cursor styles, so they can be tried out on the live site. The choice is saved in `localStorage` under `cursor`; the default is `dot`.

| Style | What it does |
|---|---|
| `system` | The browser's normal cursor. |
| `dot` | Small ink dot with `mix-blend-mode: difference`, so it inverts whatever is under it and needs no dark-mode rules. Grows over links and buttons. |
| `label` | Dot that turns into a pill with a word (Go, Mail, Open, Click) over interactive elements. Skipped on links with `data-preview`, so it doesn't fight the hover preview. |
| `ring` | Accent dot with a trailing ring (longer follow time); the ring shrinks and fills over links. |
| `section` | Shape changes with the active panel: crosshair (software), square (skillset), diamond (projects), pen nib (education), dot (home). |
| `magnetic` | System cursor; arrows and top-bar buttons lean towards the pointer within 80px. |

## Rules
- Only on fine pointers with hover, and never when the visitor prefers reduced motion; otherwise the system cursor stays and the switch is hidden.
- The drawn cursor moves with `gsap.quickTo` on `x`/`y`. Its children are centred with CSS `translate`, never the animated element itself (see the GSAP translate conflict).
- Magnetic pull is applied through `--magnet-x`/`--magnet-y` on the CSS `transform` property, which composes with the arrows' own `translate` and `scale` instead of replacing them.
- Text fields keep the text cursor.
