import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { projects } from '../data'

// Scattered card positions (in % of the panel) echoing the Figma composition.
const SPOTS = [
  // Top row sits right of the detail box, bottom row below the title band — nothing crosses "PROJECTS".
  { x: 46, y: 8, r: -3 }, { x: 61, y: 12, r: 3 }, { x: 76, y: 7, r: -2 },
  { x: 19, y: 61, r: 2 }, { x: 37, y: 64, r: -4 }, { x: 55, y: 60, r: 4 },
]

export function Projects() {
  const [active, setActive] = useState(0)
  const p = projects[active]
  const detail = useRef<HTMLElement>(null)
  // Quick crossfade whenever the selected project changes.
  useGSAP(() => {
    gsap.fromTo(detail.current!.children, { autoAlpha: 0, x: -12 }, { autoAlpha: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power2.out' })
  }, { dependencies: [active] })
  return (
    <section className="panel projects" aria-label="Projects">
      <article ref={detail} className="project-detail" aria-live="polite" data-anim="detail">
        <div>
          <h3>{p.title}</h3>
          <p className="project-detail__tag">{p.tag}</p>
          <p>{p.description}</p>
        </div>
        {p.image ? <img src={p.image} alt="" /> : <span className="project-detail__q">?</span>}
      </article>

      <h2 className="projects__title display">PROJECTS</h2>

      <ul className="cards">
        {projects.map((proj, i) => (
          <li key={proj.title} style={{ '--x': `${SPOTS[i % SPOTS.length].x}%`, '--y': `${SPOTS[i % SPOTS.length].y}%`, '--r': `${SPOTS[i % SPOTS.length].r}deg` } as React.CSSProperties} data-anim="card">
            <button className={`card ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} aria-label={proj.title}>
              {proj.image ? <img src={proj.image} alt="" /> : <span className="card__q">?</span>}
              <span className="card__label">{proj.tag}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
