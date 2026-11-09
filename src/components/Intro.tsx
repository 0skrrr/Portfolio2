import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

type Props = {
  /** Landing on home: the intro word glides onto the hero title so the wipe hands off seamlessly. */
  handoff: boolean
  /** Fired as the ink starts wiping away — the page behind starts its entrance here, not after. */
  onReveal: () => void
  onDone: () => void
}

/** Wait for the display weight so letters never swap fonts mid-animation (capped so a slow CDN can't stall the site). */
const fontsReady = () =>
  Promise.race([document.fonts?.load('700 100px Urbanist') ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1800))])

/** Intro from the first Figma frames: O → OK → OSKAR on dark, then the ink wipes away. */
export function Intro({ handoff, onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const word = root.current!.querySelector<HTMLElement>('.intro__word')!
      const hero = document.querySelector<HTMLElement>('.home__title')
      const target = handoff && hero && !reduce ? hero : null

      // Typeset the intro word exactly like the hero title so the handoff is pixel-identical.
      if (target) {
        const cs = getComputedStyle(target)
        word.style.fontSize = cs.fontSize
        word.style.letterSpacing = cs.letterSpacing
      }

      const tl = gsap.timeline({ paused: true, onComplete: onDone })
      if (reduce) {
        tl.call(onReveal).to(root.current, { autoAlpha: 0, duration: 0.4, delay: 0.2 })
      } else {
        tl.from('.intro__char', { yPercent: 110, duration: 0.55, ease: 'expo.out', stagger: 0.07 })
          .from(word, { letterSpacing: '0.5em', duration: 0.9, ease: 'expo.out' }, 0)
        if (target) {
          // Measure at tween start (fonts are loaded by then): first intro glyph → first hero glyph.
          const delta = (axis: 'left' | 'top') => () =>
            target.querySelector('.home__char')!.getBoundingClientRect()[axis] -
            root.current!.querySelector('.intro__mask')!.getBoundingClientRect()[axis]
          tl.to(word, { x: delta('left'), y: delta('top'), duration: 0.75, ease: 'expo.inOut' }, '+=0.1')
        }
        tl.call(onReveal, undefined, target ? '-=0.05' : '+=0.15')
          .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.8, ease: 'expo.inOut' }, '<')
      }

      // Click / key skips ahead.
      const skip = () => tl.timeScale(4)
      window.addEventListener('pointerdown', skip, { once: true })
      window.addEventListener('keydown', skip, { once: true })
      let cancelled = false
      fontsReady().then(() => {
        if (!cancelled) tl.play()
      })
      return () => {
        cancelled = true
        window.removeEventListener('pointerdown', skip)
        window.removeEventListener('keydown', skip)
      }
    },
    { scope: root },
  )
  return (
    <div className="intro" ref={root} aria-hidden>
      <div className="intro__word">
        {'OSKAR'.split('').map((c, i) => (
          <span className="intro__mask" key={i}>
            <span className="intro__char">{c}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
