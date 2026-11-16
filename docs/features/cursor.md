# Custom cursor

A small, low-contrast **Cursor · <style>** button in the top bar cycles through three cursor styles, so they can be tried out on the live site. The choice is saved in `localStorage` under `cursor`; the default is `dot`.

| Style | What it does |
|---|---|
| `dot` | Small ink dot with `mix-blend-mode: difference`, so it inverts whatever is under it and needs no dark-mode rules. Grows over links and buttons. |
| `label` | Dot (same `difference` blend as `dot`, so it inverts what's under it) that turns into a pill with a word (Go, Mail, Open, Click) over interactive elements. Skipped on links with `data-preview`, so it doesn't fight the hover preview. |
| `section` | Shape changes with the active panel: crosshair (software), square (skillset), diamond (projects), pen nib (education), dot (home). |

## Rules
- Only on fine pointers with hover, and never when the visitor prefers reduced motion; otherwise the system cursor stays and the switch is hidden.
- The drawn cursor moves with `gsap.quickTo` on `x`/`y`. Its children are centred with CSS `translate`, never the animated element itself (see the GSAP translate conflict).
- Text fields keep the text cursor.
