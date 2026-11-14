import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { projects } from '../data'
import { fmt, useT } from '../i18n'
import { Cover } from './Cover'

const no = (i: number) => String(i + 1).padStart(2, '0')

/**
 * Full-screen case study. Portalled to <body>: the panels live inside a transformed `.world`,
 * where `position: fixed` would be relative to the panel, not the viewport.
 */
export function CaseStudy({ index, onClose, onGo }: { index: number; onClose: () => void; onGo: (i: number) => void }) {
  const t = useT()
  const root = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const p = projects[index]
  const c = t.projects.items[p.id]
  const prevI = (index - 1 + projects.length) % projects.length
  const nextI = (index + 1) % projects.length
  const prev = t.projects.items[projects[prevI].id]
  const next = t.projects.items[projects[nextI].id]
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Wipe in from the right on open (mount-only, so StrictMode's revert + rerun replays it correctly)…
  useGSAP(
    () => {
      if (!reduce()) gsap.fromTo(root.current, { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.75, ease: 'expo.inOut' })
    },
    { scope: root },
  )
  // …and restage the content on open and on every prev/next (waiting for the wipe if it's still running).
  useGSAP(
    () => {
      root.current!.querySelector('.case__scroll')!.scrollTop = 0
      if (reduce()) return
      const delay = gsap.isTweening(root.current) ? 0.35 : 0
      gsap.fromTo('.case__reveal', { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', stagger: 0.06, delay, clearProps: 'transform' })
    },
    { dependencies: [index], scope: root },
  )

  const { contextSafe } = useGSAP({ scope: root })
  const close = contextSafe(() => {
    if (reduce()) return onClose()
    gsap.to(root.current, { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.55, ease: 'expo.inOut', onComplete: onClose })
  })
  // contextSafe hands back a new function each render; read it through a ref so the effect below runs once.
  const closeRef = useRef(close)
  closeRef.current = close

  // Modal plumbing: lock the panel navigation, Esc closes, focus goes in and comes back out.
  useEffect(() => {
    const back = document.activeElement as HTMLElement | null
    document.documentElement.classList.add('is-modal')
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeRef.current() }
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('is-modal')
      window.removeEventListener('keydown', onKey)
      back?.focus?.()
    }
  }, [])

  return createPortal(
    <div className="case" ref={root} role="dialog" aria-modal="true" aria-labelledby="case-title">
      <header className="case__bar">
        <span className="case__crumb">{t.caseStudy.crumb} <span aria-hidden>/</span> {no(index)}</span>
        <nav className="case__nav" aria-label={t.caseStudy.navLabel}>
          <button onClick={() => onGo(prevI)} aria-label={fmt(t.caseStudy.prevLabel, { title: prev.title })}>← <span>{t.caseStudy.prev}</span></button>
          <button onClick={() => onGo(nextI)} aria-label={fmt(t.caseStudy.nextLabel, { title: next.title })}><span>{t.caseStudy.next}</span> →</button>
          <button className="case__close" ref={closeBtn} onClick={close}>{t.caseStudy.close} <span aria-hidden>✕</span></button>
        </nav>
      </header>

      <div className="case__scroll">
        <section className="case__hero">
          <p className="case__kicker case__reveal"><span className="case__no">{no(index)}</span> {c.tag} — {c.year}</p>
          <h2 className="case__title case__reveal" id="case-title">{c.title}</h2>
        </section>

        <dl className="case__meta case__reveal">
          <div><dt>{t.caseStudy.role}</dt><dd>{c.role}</dd></div>
          <div><dt>{t.caseStudy.year}</dt><dd>{c.year}</dd></div>
          <div><dt>{t.caseStudy.tools}</dt><dd>{c.tools.join(', ')}</dd></div>
          {p.href && (
            <div>
              <dt>{t.caseStudy.link}</dt>
              <dd><a href={p.href} target="_blank" rel="noreferrer">{t.caseStudy.visit} <span aria-hidden>↗</span></a></dd>
            </div>
          )}
        </dl>

        <figure className="case__cover case__reveal">
          <Cover variant={p.cover ?? index} no={no(index)} title={c.title} meta={`${c.tag} · ${c.year}`} image={p.image} />
        </figure>

        <div className="case__text">
          <p className="case__lead case__reveal">{c.summary}</p>
          <ol className="case__sections">
            {c.sections.map((s, i) => (
              <li key={i} className="case__reveal">
                <span className="case__sno" aria-hidden>{no(i)}</span>
                <h3>{s.heading}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {!!p.gallery?.length && (
          <div className="case__gallery">
            {p.gallery.map((src, i) => (
              <figure className={`case__shot case__reveal ${i === 0 ? 'is-wide' : ''}`} key={src}>
                <img src={src} alt="" loading="lazy" />
                <figcaption>{no(i)}</figcaption>
              </figure>
            ))}
          </div>
        )}

        <button className="case__next" onClick={() => onGo(nextI)}>
          <span className="case__next-label">{t.caseStudy.nextProject}</span>
          <span className="case__next-title">{next.title} <span aria-hidden>→</span></span>
        </button>
      </div>
    </div>,
    document.body,
  )
}
