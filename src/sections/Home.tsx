import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { socials } from '../data'
import { useT } from '../i18n'

/** Landscape split = vertical edge; portrait = horizontal. The lean only makes sense with a real pointer. */
const LEAN_MQ = '(orientation: landscape) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

export function Home() {
  const t = useT()
  const root = useRef<HTMLElement>(null)

  // The slab's edge leans a little toward the pointer, so the name keeps re-splitting as you move.
  // Held back until the intro has handed over (html.is-ready), or the intro's clip would miss the slab.
  useGSAP(
    () => {
      const slab = root.current!.querySelector<HTMLElement>('.home__slab')!
      const mq = window.matchMedia(LEAN_MQ)
      const toX = gsap.quickTo(slab, 'x', { duration: 1.4, ease: 'power3' })
      const onMove = (e: PointerEvent) => {
        if (!mq.matches || e.pointerType !== 'mouse' || !document.documentElement.classList.contains('is-ready')) return
        toX((e.clientX / window.innerWidth - 0.5) * window.innerWidth * 0.08) // ±4vw
      }
      const onChange = () => { if (!mq.matches) gsap.set(slab, { x: 0 }) }
      window.addEventListener('pointermove', onMove)
      mq.addEventListener('change', onChange)
      return () => {
        window.removeEventListener('pointermove', onMove)
        mq.removeEventListener('change', onChange)
      }
    },
    { scope: root },
  )

  return (
    <section className="panel home" aria-label={t.nav.sections.home} ref={root}>
      <div className="home__slab" aria-hidden />
      {/* Letters are split for the intro handoff; the label keeps it one word for screen readers. */}
      <h1 className="home__title" aria-label={t.profile.name}>
        <span className="home__word" data-anim="title" aria-hidden>
          {[...t.profile.name].map((c, i) => (
            <span key={i} className="home__char">{c}</span>
          ))}
        </span>
      </h1>
      <p className="home__role">
        <span className="home__role-line" data-anim="role">{t.profile.role}</span>
        <span className="home__status" data-anim="role"><span className="dot" aria-hidden /> {t.profile.status}</span>
      </p>
      <p className="home__statement"><span data-anim="statement">{t.home.statement}</span></p>
      {/* Desktop arrows carry their destinations; touch users still need to know they can swipe. */}
      <p className="home__hint" aria-hidden>{t.home.hint}</p>
      <ul className="socials" aria-label={t.home.socialsLabel}>
        {socials.map((s) => (
          <li key={s.id} data-anim="social">
            <a href={s.href} target="_blank" rel="noreferrer" aria-label={t.home.socials[s.id]}>
              {/* Painted through a mask so the icon takes the exact blend colour (a filtered white <img> came out mint-tinted). The hidden <img> just sizes the box. */}
              <span className="socials__icon" style={{ maskImage: `url(${s.icon})`, WebkitMaskImage: `url(${s.icon})` }}>
                <img src={s.icon} alt="" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
