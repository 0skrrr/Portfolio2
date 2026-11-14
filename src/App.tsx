import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
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
import { profile } from './data'
import { fmt, locales, useI18n } from './i18n'

gsap.registerPlugin(useGSAP)

const SECTIONS: Record<SectionId, () => React.JSX.Element> = {
  home: Home, software: Software, skillset: Skillset, projects: Projects, education: Education,
}
const fromHash = (): SectionId => {
  const h = window.location.hash.slice(1) as SectionId
  return h in POS ? h : 'home'
}
const DIRS: Dir[] = ['up', 'down', 'left', 'right']
/** True if `el` sits in a panel that can still scroll in that vertical direction (mobile long panels). */
const canScroll = (el: EventTarget | null, down: boolean) => {
  const panel = (el as Element | null)?.closest?.('.panel') as HTMLElement | null
  if (!panel || panel.scrollHeight <= panel.clientHeight + 1) return false
  return down ? panel.scrollTop + panel.clientHeight < panel.scrollHeight - 1 : panel.scrollTop > 0
}
/** A case study is open: panel navigation stands down so the overlay can scroll and take keys. */
const modal = () => document.documentElement.classList.contains('is-modal')
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Stagger a panel's content in. Only `opacity` + `y` on elements that don't rely on CSS `translate` for layout. */
const enter = (panel: Element, at = 0) => {
  const r = reduced()
  return gsap.timeline({ delay: at })
    .fromTo(panel.querySelectorAll('[data-anim]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: r ? 0 : 0.5, ease: 'power3.out', stagger: { amount: r ? 0 : 0.25 }, clearProps: 'transform' })
    .fromTo(panel.querySelectorAll('[data-draw]'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: r ? 0 : 0.6, ease: 'power2.out', stagger: 0.05 }, 0.05)
}
const CHROME = '.arrow, .minimap, .corner'
/** Everything on the hero except the name, which the intro word has already landed on. */
const HERO_BITS = '.home [data-anim]:not([data-anim="title"])'

type Stage = 'intro' | 'reveal' | 'done'

export default function App() {
  const [active, setActive] = useState<SectionId>(fromHash)
  const [stage, setStage] = useState<Stage>('intro')
  const landing = useRef(active)
  const world = useRef<HTMLDivElement>(null)
  const { t, code, setCode } = useI18n()

  const go = useCallback((id: SectionId) => setActive(id), [])
  // No input lock: a new direction simply retargets the running pan (overwrite: 'auto').
  const move = useCallback((d: Dir) => setActive((cur) => neighbour(cur, d) ?? cur), [])

  // Park the world on the landing panel before first paint. A plain layout effect (not useGSAP) so
  // StrictMode's dev double-mount can't revert it and turn the first frame into a pan from home.
  useLayoutEffect(() => {
    const p = POS[landing.current]
    gsap.set(world.current, { xPercent: -p.x * 100, yPercent: -p.y * 100 })
  }, [])

  // Pan the world to the active panel, then stagger that panel's content in.
  useGSAP(
    () => {
      const p = POS[active]
      const panel = world.current!.querySelector<HTMLElement>(`[data-id="${active}"]`)!
      if (window.location.hash.slice(1) !== active) history.replaceState(null, '', `#${active}`)

      const x = -p.x * 100, y = -p.y * 100
      if (gsap.getProperty(world.current, 'xPercent') === x && gsap.getProperty(world.current, 'yPercent') === y) return
      const dur = reduced() ? 0 : 0.7
      gsap.to(world.current, { xPercent: x, yPercent: y, duration: dur, ease: 'power3.inOut', overwrite: 'auto' })
      enter(panel, dur * 0.45)
    },
    { dependencies: [active], scope: world },
  )

  useEffect(() => {
    document.title = active === 'home' ? t.meta.title : fmt(t.meta.sectionTitle, { section: t.nav.sections[active] })
  }, [active, t])

  // The hero's pointer lean waits for this, so it can't pull the slab away from under the intro's clip.
  useEffect(() => {
    document.documentElement.classList.toggle('is-ready', stage === 'done')
  }, [stage])

  // First load: hold back whatever is about to animate, then play it *during* the intro wipe so
  // nothing is ever shown fully-rendered and then yanked away (the old load flash).
  useGSAP(() => {
    if (reduced() || stage === 'done') return
    const id = landing.current
    const panel = world.current!.querySelector(`[data-id="${id}"]`)!
    if (stage === 'intro') {
      gsap.set(CHROME, { autoAlpha: 0 })
      if (id === 'home') gsap.set([HERO_BITS, '.home__hint'], { autoAlpha: 0 })
      else gsap.set(panel.querySelectorAll('[data-anim]'), { autoAlpha: 0 })
      return
    }
    const tl = gsap.timeline()
    if (id === 'home') {
      // The name is already in place (the intro word landed on it) and the ink is shrinking into the slab: the rest rises in as it goes.
      tl.fromTo(HERO_BITS, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.06, clearProps: 'transform' }, 0.45)
        .to('.home__hint', { autoAlpha: 1, duration: 0.6 }, 0.9) // centred with CSS translate: fade only
    } else {
      tl.add(enter(panel), 0.25)
    }
    tl.to(CHROME, { autoAlpha: 1, duration: 0.6, stagger: 0.04 }, 0.6)
  }, { dependencies: [stage] })

  // Input: keyboard, wheel/trackpad, touch swipe, hash changes.
  useEffect(() => {
    const keys: Record<string, Dir> = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', w: 'up', s: 'down', a: 'left', d: 'right' }
    const onKey = (e: KeyboardEvent) => { if (modal()) return; const d = keys[e.key]; if (d) { e.preventDefault(); move(d) } }

    let wheelLock = 0
    const onWheel = (e: WheelEvent) => {
      if (modal()) return
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && canScroll(e.target, e.deltaY > 0)) return
      e.preventDefault()
      const now = Date.now()
      if (now < wheelLock) return
      const { deltaX: dx, deltaY: dy } = e
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 25) return
      wheelLock = now + 750
      move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
    }

    let sx = 0, sy = 0
    const onStart = (e: TouchEvent) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      if (modal()) return
      const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 50) return
      if (Math.abs(dy) > Math.abs(dx) && canScroll(e.target, dy < 0)) return
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
      {stage !== 'done' && <Intro handoff={landing.current === 'home'} onReveal={() => setStage('reveal')} onDone={() => setStage('done')} />}
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
          return n ? <Arrow key={d} dir={d} onClick={() => move(d)} name={t.nav.sections[n]} /> : null
        })}
        <Minimap active={active} go={go} />
        <div className="corner">
          <a className="contact" href={`mailto:${profile.email}`}>{t.nav.contact} <span aria-hidden>↗</span></a>
          {/* Appears by itself once a second dictionary exists in src/i18n/. */}
          {locales.length > 1 && (
            <nav className="lang" aria-label={t.nav.language}>
              {locales.map((l) => (
                <button key={l.code} lang={l.t.meta.lang} aria-pressed={l.code === code} aria-label={l.t.meta.label} onClick={() => setCode(l.code)}>
                  {l.t.meta.short}
                </button>
              ))}
            </nav>
          )}
        </div>
      </main>
    </>
  )
}
