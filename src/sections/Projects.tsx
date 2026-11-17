import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { profile, projects } from '../data'
import { fmt, useT } from '../i18n'
import { CaseStudy } from '../components/CaseStudy'
import { Cover } from '../components/Cover'

const no = (i: number) => String(i + 1).padStart(2, '0')
const count = String(projects.length).padStart(2, '0')
/** The last row is a call to action, not a project. */
const CTA = projects.length

/**
 * Same grammar as Skillset: an ink spine carrying the title, hairline-ruled labels that invert
 * when active, and a floating preview frame. Hover a row to preview, click to open the case study.
 */
export function Projects() {
  const t = useT()
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const preview = useRef<HTMLElement>(null)

  const rows = [
    ...projects.map((p, i) => ({ ...t.projects.items[p.id], image: p.image, cover: p.cover ?? i })),
    { ...t.projects.cta, image: undefined, cover: 'cta' as const },
  ]
  const row = rows[active]
  const isCta = active === CTA

  useGSAP(
    () => {
      gsap.fromTo('.pv__fade', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo('.pv__swap', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out', clearProps: 'transform' })
    },
    { dependencies: [active], scope: preview },
  )

  const choose = (i: number) => {
    if (i === CTA) window.location.href = `mailto:${profile.email}`
    else setOpen(i)
  }

  return (
    <section className="panel projects" aria-label={t.nav.sections.projects}>
      <div className="projects__band">
        <h2 className="projects__title display" data-anim="title">{t.nav.sections.projects}</h2>
        <span className="projects__count" data-anim="count" aria-label={fmt(t.projects.count, { count: projects.length })}>{count}</span>
      </div>

      <div className="projects__list">
        <p className="projects__kicker" data-anim="kicker">{t.projects.kicker}</p>
        <ol className="index">
          {rows.map((r, i) => (
            <li key={i} data-anim="row">
              <button
                className={`row ${i === active ? 'is-active' : ''} ${i === CTA ? 'row--cta' : ''}`}
                onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => choose(i)}
              >
                <span className="row__no" aria-hidden>{no(i)}</span>
                <span className="row__title">{r.title}</span>
                <span className="row__tag">{r.tag}</span>
                <span className="row__year">{r.year}</span>
                <span className="row__go" aria-hidden>{i === CTA ? '✉' : '→'}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <figure className="pv" ref={preview} data-anim="preview" aria-hidden>
        <div className="pv__frame">
          <Cover className="pv__fade" variant={row.cover} no={isCta ? '?' : no(active)} title={row.title} meta={`${row.tag} · ${row.year}`} image={row.image} />
        </div>
        <figcaption className="pv__cap">
          <span className="pv__tag pv__swap">{row.tag} · {row.year}</span>
          <span className="pv__sum pv__swap">{row.summary}</span>
          <span className="pv__cta pv__swap">{isCta ? t.projects.cta.action : t.projects.openCase} <b>→</b></span>
        </figcaption>
      </figure>

      {open !== null && <CaseStudy index={open} onGo={setOpen} onClose={() => setOpen(null)} />}
    </section>
  )
}
