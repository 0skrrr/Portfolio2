import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { projects } from '../data'

const no = (i: number) => String(i + 1).padStart(2, '0')
/** Real projects only — the CTA row isn't a case study. */
const CASES = projects.map((p, i) => ({ p, i })).filter(({ p }) => !p.cta)

/**
 * Full-screen case study. Portalled to <body>: the panels live inside a transformed `.world`,
 * where `position: fixed` would be relative to the panel, not the viewport.
 */
export function CaseStudy({ index, onClose, onGo }: { index: number; onClose: () => void; onGo: (i: number) => void }) {
  const root = useRef<HTMLDivElement>(null)
  const closeBtn = useRef<HTMLButtonElement>(null)
  const p = projects[index]
  const at = CASES.findIndex((c) => c.i === index)
  const prev = CASES[(at - 1 + CASES.length) % CASES.length]
  const next = CASES[(at + 1) % CASES.length]
  const shots = p.gallery?.length ? p.gallery : [p.image, undefined, undefined]
  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Wipe in from the right on open (mount-only, so StrictMode's revert + rerun replays it correctly)…
  useGSAP(
    () => {
      if (!reduce()) gsap.fromTo(root.current, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 0.75, ease: 'expo.inOut' })
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
    gsap.to(root.current, { clipPath: 'inset(0 0 0 100%)', duration: 0.55, ease: 'expo.inOut', onComplete: onClose })
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
        <span className="case__crumb">Projects <span aria-hidden>/</span> {no(index)}</span>
        <nav className="case__nav" aria-label="Case studies">
          <button onClick={() => onGo(prev.i)} aria-label={`Previous: ${prev.p.title}`}>← <span>Prev</span></button>
          <button onClick={() => onGo(next.i)} aria-label={`Next: ${next.p.title}`}><span>Next</span> →</button>
          <button className="case__close" ref={closeBtn} onClick={close}>Close <span aria-hidden>✕</span></button>
        </nav>
      </header>

      <div className="case__scroll">
        <section className="case__hero">
          <p className="case__kicker case__reveal"><span className="case__no">{no(index)}</span> {p.tag} — {p.year}</p>
          <h2 className="case__title case__reveal" id="case-title">{p.title}</h2>
        </section>

        <dl className="case__meta case__reveal">
          <div><dt>Role</dt><dd>{p.role}</dd></div>
          <div><dt>Year</dt><dd>{p.year}</dd></div>
          <div><dt>Tools</dt><dd>{p.tools.join(', ')}</dd></div>
          <div>
            <dt>Link</dt>
            <dd>{p.href ? <a href={p.href} target="_blank" rel="noreferrer">Visit <span aria-hidden>↗</span></a> : '—'}</dd>
          </div>
        </dl>

        <div className="case__text case__reveal">
          <p className="case__lead">{p.summary}</p>
          {p.body?.map((t, i) => <p key={i}>{t}</p>)}
        </div>

        <div className="case__gallery">
          {shots.map((src, i) => (
            <figure className={`case__shot case__reveal ${i === 0 ? 'is-wide' : ''}`} key={i}>
              {src ? <img src={src} alt="" /> : <div className="case__ph"><span>Image {no(i)}</span></div>}
              <figcaption>{no(i)}</figcaption>
            </figure>
          ))}
        </div>

        <button className="case__next" onClick={() => onGo(next.i)}>
          <span className="case__next-label">Next project</span>
          <span className="case__next-title">{next.p.title} <span aria-hidden>→</span></span>
        </button>
      </div>
    </div>,
    document.body,
  )
}
