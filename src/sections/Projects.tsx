import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { projects } from '../data'
import { CaseStudy } from '../components/CaseStudy'

const no = (i: number) => String(i + 1).padStart(2, '0')
const count = String(projects.filter((p) => !p.cta).length).padStart(2, '0')

/**
 * Same grammar as Skillset: an ink spine carrying the title, hairline-ruled labels that invert
 * when active, and a floating preview frame. Hover a row to preview, click to open the case study.
 */
export function Projects() {
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<number | null>(null)
  const preview = useRef<HTMLElement>(null)
  const p = projects[active]

  useGSAP(
    () => {
      // The image is mirrored with a CSS transform, so it only fades; the caption lines also rise.
      gsap.fromTo('.pv__fade', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: 'power2.out' })
      gsap.fromTo('.pv__swap', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out', clearProps: 'transform' })
    },
    { dependencies: [active], scope: preview },
  )

  const choose = (i: number) => {
    const proj = projects[i]
    if (proj.cta && proj.href) window.location.href = proj.href
    else setOpen(i)
  }

  return (
    <section className="panel projects" aria-label="Projects">
      <div className="projects__band">
        <h2 className="projects__title display" data-anim="title">PROJECTS</h2>
        <span className="projects__count" data-anim="count" aria-label={`${count} projects`}>{count}</span>
      </div>

      <ol className="index">
        {projects.map((proj, i) => (
          <li key={proj.title} data-anim="row">
            <button
              className={`row ${i === active ? 'is-active' : ''} ${proj.cta ? 'row--cta' : ''}`}
              onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => choose(i)}
            >
              <span className="row__no" aria-hidden>{no(i)}</span>
              <span className="row__title">{proj.title}</span>
              <span className="row__tag">{proj.tag}</span>
              <span className="row__year">{proj.year}</span>
              <span className="row__go" aria-hidden>{proj.cta ? '✉' : '→'}</span>
            </button>
          </li>
        ))}
      </ol>

      <figure className="pv" ref={preview} data-anim="preview" aria-hidden>
        <div className="pv__frame">
          {p.image ? <img className="pv__fade" src={p.image} alt="" /> : <span className="pv__q pv__fade">?</span>}
          <span className="pv__no">{no(active)}</span>
        </div>
        <figcaption className="pv__cap">
          <span className="pv__tag pv__swap">{p.tag} · {p.year}</span>
          <span className="pv__sum pv__swap">{p.summary}</span>
          <span className="pv__cta pv__swap">{p.cta ? 'Write to me' : 'Click to open the case study'} <b>→</b></span>
        </figcaption>
      </figure>

      {open !== null && <CaseStudy index={open} onGo={setOpen} onClose={() => setOpen(null)} />}
    </section>
  )
}
