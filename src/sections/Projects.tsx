import { useState } from 'react'
import { projects } from '../data'

// Scattered card positions (in % of the panel) echoing the Figma composition.
const SPOTS = [
  { x: 44, y: 14, r: -2 }, { x: 58, y: 21, r: 3 }, { x: 62, y: 42, r: -3 },
  { x: 14, y: 50, r: 2 }, { x: 54, y: 60, r: 4 }, { x: 40, y: 64, r: -4 },
]

export function Projects() {
  const [active, setActive] = useState(0)
  const p = projects[active]
  return (
    <section className="panel projects" aria-label="Projects">
      <article className="project-detail" aria-live="polite" data-anim="detail">
        <div>
          <h3>{p.title}</h3>
          <p className="project-detail__tag">{p.tag}</p>
          <p>{p.description}</p>
        </div>
        {p.image && <img src={p.image} alt="" />}
      </article>

      <h2 className="projects__title display">PROJECTS</h2>

      <ul className="cards">
        {projects.map((proj, i) => (
          <li key={proj.title} style={{ '--x': `${SPOTS[i % SPOTS.length].x}%`, '--y': `${SPOTS[i % SPOTS.length].y}%`, '--r': `${SPOTS[i % SPOTS.length].r}deg` } as React.CSSProperties} data-anim="card">
            <button className={`card ${i === active ? 'is-active' : ''}`} onClick={() => setActive(i)} onMouseEnter={() => setActive(i)} aria-label={proj.title}>
              {proj.image ? <img src={proj.image} alt="" /> : <span className="card__q">?</span>}
              <span className="card__label">{proj.tag}</span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
