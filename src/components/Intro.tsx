import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

/** Intro from the first Figma frames: O → OK → OSKAR on dark, then wipes away. */
export function Intro({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // Click / key skips the intro.
      const tl = gsap.timeline({ onComplete: onDone })
      const skip = () => tl.timeScale(4)
      window.addEventListener('pointerdown', skip, { once: true })
      window.addEventListener('keydown', skip, { once: true })
      if (reduce) {
        tl.to(root.current, { autoAlpha: 0, duration: 0.4, delay: 0.3 })
        return
      }
      tl.from('.intro__char', { yPercent: 110, duration: 0.5, ease: 'expo.out', stagger: 0.07 })
        .from('.intro__word', { letterSpacing: '0.5em', duration: 0.8, ease: 'expo.out' }, 0)
        .to(root.current, { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'expo.inOut' }, '+=0.15')
      return () => {
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
