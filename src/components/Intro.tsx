import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { useT } from '../i18n'

type Props = {
  /** Landing on home: the intro word glides onto the hero title and the ink shrinks into the hero's slab. */
  handoff: boolean
  /** Fired as the ink starts to move — the page behind starts its entrance here, not after. */
  onReveal: () => void
  onDone: () => void
}

/** Wait for the display weight so letters never swap fonts mid-animation (capped so a slow CDN can't stall the site). */
const fontsReady = () =>
  Promise.race([document.fonts?.load('700 100px Urbanist') ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1800))])

/** clip-path that crops the full-screen intro down to `el`'s on-screen rectangle. */
const insetTo = (el: Element) => {
  const r = el.getBoundingClientRect()
  const px = (n: number) => `${Math.max(0, Math.round(n))}px`
  return `inset(${px(r.top)} ${px(window.innerWidth - r.right)} ${px(window.innerHeight - r.bottom)} ${px(r.left)})`
}

/** Intro from the first Figma frames: O → OK → OSKAR on ink, then the ink retracts into the hero (or wipes away elsewhere). */
export function Intro({ handoff, onReveal, onDone }: Props) {
  const root = useRef<HTMLDivElement>(null)
  const name = useT().profile.name
  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const word = root.current!.querySelector<HTMLElement>('.intro__word')!
      const hero = document.querySelector<HTMLElement>('.home__title')
      const slab = document.querySelector<HTMLElement>('.home__slab')
      const target = handoff && hero && slab && !reduce ? hero : null

      // Typeset the intro word exactly like the hero title so the handoff is pixel-identical.
      if (target) {
        const cs = getComputedStyle(target)
        word.style.fontSize = cs.fontSize
        word.style.letterSpacing = cs.letterSpacing
      }

      const full = 'inset(0px 0px 0px 0px)'
      const tl = gsap.timeline({ paused: true, onComplete: onDone })
      if (reduce) {
        tl.call(onReveal).to(root.current, { autoAlpha: 0, duration: 0.4, delay: 0.2 })
      } else {
        tl.from('.intro__char', { yPercent: 110, duration: 0.55, ease: 'expo.out', stagger: 0.07 })
          .from(word, { letterSpacing: '0.5em', duration: 0.9, ease: 'expo.out' }, 0)
        if (target) {
          // Measured at tween start (fonts are loaded by then): first intro glyph → first hero glyph.
          const delta = (axis: 'left' | 'top') => () =>
            target.querySelector('.home__char')!.getBoundingClientRect()[axis] -
            root.current!.querySelector('.intro__mask')!.getBoundingClientRect()[axis]
          tl.to(word, { x: delta('left'), y: delta('top'), duration: 0.75, ease: 'expo.inOut' }, '+=0.1')
            .call(onReveal, undefined, '-=0.1')
            // The ink doesn't leave: it shrinks to exactly the slab underneath, so the intro *becomes* the hero.
            .fromTo(root.current, { clipPath: full }, { clipPath: () => insetTo(slab!), duration: 0.95, ease: 'expo.inOut' }, '<')
        } else {
          tl.call(onReveal, undefined, '+=0.15')
            .fromTo(root.current, { clipPath: full }, { clipPath: 'inset(0px 0px 100% 0px)', duration: 0.8, ease: 'expo.inOut' }, '<')
        }
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
        {[...name].map((c, i) => (
          <span className="intro__mask" key={i}>
            <span className="intro__char">{c}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
