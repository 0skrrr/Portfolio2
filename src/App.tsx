import { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { POS, neighbour, type Dir, type SectionId } from './nav'
import { Intro } from './components/Intro'
import { Arrow } from './components/Arrow'
import { Minimap } from './components/Minimap'
import { Home } from './sections/Home'
import { Software } from './sections/Software'
import { Skillset } from './sections/Skillset'
import { Projects } from './sections/Projects'
import { Education } from './sections/Education'

gsap.registerPlugin(useGSAP)

const SECTIONS: Record<SectionId, () => React.JSX.Element> = {
  home: Home, software: Software, skillset: Skillset, projects: Projects, education: Education,
}
const fromHash = (): SectionId => {
  const h = window.location.hash.slice(1) as SectionId
  return h in POS ? h : 'home'
}
const DIRS: Dir[] = ['up', 'down', 'left', 'right']
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App() {
  const [active, setActive] = useState<SectionId>(fromHash)
  const [introDone, setIntroDone] = useState(false)
  const world = useRef<HTMLDivElement>(null)
  const first = useRef(true)

  const go = useCallback((id: SectionId) => setActive(id), [])
  // No input lock: a new direction simply retargets the running pan (overwrite: 'auto').
  const move = useCallback((d: Dir) => setActive((cur) => neighbour(cur, d) ?? cur), [])

  // Pan the world to the active panel, then stagger that panel's content in.
  useGSAP(
    () => {
      const p = POS[active]
      const panel = world.current!.querySelector<HTMLElement>(`[data-id="${active}"]`)!
      const items = panel.querySelectorAll('[data-anim]')
      if (window.location.hash.slice(1) !== active) history.replaceState(null, '', `#${active}`)
      document.title = active === 'home' ? 'Oskar — Portfolio' : `${active[0].toUpperCase()}${active.slice(1)} — Oskar`

      if (first.current) {
        first.current = false
        gsap.set(world.current, { xPercent: -p.x * 100, yPercent: -p.y * 100 })
        return
      }
      const dur = reduced() ? 0 : 1.1
      gsap.timeline()
        .to(world.current, { xPercent: -p.x * 100, yPercent: -p.y * 100, duration: dur, ease: 'expo.inOut', overwrite: 'auto' })
        .fromTo(items, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: reduced() ? 0 : 0.8, ease: 'expo.out', stagger: 0.04, clearProps: 'transform' }, dur * 0.55)
    },
    { dependencies: [active], scope: world },
  )

  // Home hero entrance after intro.
  useGSAP(() => {
    if (!introDone || active !== 'home' || reduced()) return
    gsap.timeline()
      .from('.home__figure', { xPercent: 20, autoAlpha: 0, duration: 1.4, ease: 'expo.out' })
      .from('.home__char', { yPercent: 100, autoAlpha: 0, stagger: 0.06, duration: 0.9, ease: 'expo.out' }, 0.1)
      .from('.socials li, .arrow, .minimap', { autoAlpha: 0, y: 10, stagger: 0.04, duration: 0.5 }, 0.6)
  }, { dependencies: [introDone] })

  // Input: keyboard, wheel/trackpad, touch swipe, hash changes.
  useEffect(() => {
    const keys: Record<string, Dir> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' }
    const onKey = (e: KeyboardEvent) => { const d = keys[e.key]; if (d) { e.preventDefault(); move(d) } }

    let wheelLock = 0
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      const now = Date.now()
      if (now < wheelLock) return
      const { deltaX: dx, deltaY: dy } = e
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return
      wheelLock = now + 1200
      move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
    }

    let sx = 0, sy = 0
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return
      // Let horizontally scrollable areas (mobile project cards) scroll instead of navigating.
      if (Math.abs(dx) > Math.abs(dy) && (e.target as Element).closest?.('.cards')) return
      // Swipe moves content with the finger: swipe left reveals the panel on the right.
      move(Math.abs(dx) > Math.abs(dy) ? (dx < 0 ? 'right' : 'left') : dy < 0 ? 'down' : 'up')
    }
    const onHash = () => go(fromHash())

    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onStart, { passive: true })
    window.addEventListener('touchend', onEnd, { passive: true })
    window.addEventListener('hashchange', onHash)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onStart)
      window.removeEventListener('touchend', onEnd)
      window.removeEventListener('hashchange', onHash)
    }
  }, [move, go])

  return (
    <>
      {!introDone && <Intro onDone={() => setIntroDone(true)} />}
      <main className="viewport">
        <div className="world" ref={world}>
          {(Object.keys(SECTIONS) as SectionId[]).map((id) => {
            const S = SECTIONS[id]
            return (
              <div key={id} data-id={id} className="slot" style={{ '--x': POS[id].x, '--y': POS[id].y } as React.CSSProperties} aria-hidden={id !== active} inert={id !== active}>
                <S />
              </div>
            )
          })}
        </div>

        {DIRS.map((d) => {
          const n = neighbour(active, d)
          return n ? <Arrow key={d} dir={d} onClick={() => move(d)} label={`Go to ${n}`} /> : null
        })}
        <Minimap active={active} go={go} />
      </main>
    </>
  )
}
