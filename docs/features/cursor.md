# Custom cursor

A single custom cursor: a small dot drawn with `mix-blend-mode: difference`, so it inverts whatever is under it and needs no dark-mode rules.

## How it reacts
- **Movement:** stretches along the direction of travel the faster the pointer moves (up to 1.6× long, 0.7× thin), and settles back to round ~80ms after it stops.
- **Hover:** grows from 10px to 40px over links, buttons and labels, with a slight overshoot.
- **Press:** shrinks to 60% while the mouse button is down.
- **Leaving the window:** fades out, and fades back in on the next move.

## Rules
- Only on fine pointers with hover, and never when the visitor prefers reduced motion; otherwise the browser cursor stays.
- The outer `.cursor` follows the pointer with `gsap.quickTo` on `x`/`y`. The stretch is GSAP `rotation`/`scaleX`/`scaleY` on the inner `.cursor__blob`. It can't go on `.cursor__mark`: GSAP writes inline `translate: none; scale: none` on anything it transforms, which would undo the mark's CSS centring (`translate: -50% -50%`) and its press shrink (`scale`).
- Text fields keep the text cursor.
