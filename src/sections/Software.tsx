import { useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'
import { software, softwareCategories, type SoftwareCategory } from '../data'

gsap.registerPlugin(Flip)

type Filter = 'All' | SoftwareCategory
const FILTERS: Filter[] = ['All', ...softwareCategories]

export function Software() {
  const [filter, setFilter] = useState<Filter>('All')
  const grid = useRef<HTMLUListElement>(null)
  const flipState = useRef<Flip.FlipState | null>(null)

  const choose = (f: Filter) => {
    if (f === filter) return
    // Record positions before React re-renders, then animate from them (FLIP).
    flipState.current = Flip.getState(grid.current!.children)
    setFilter(f)
  }

  useGSAP(
    () => {
      if (!flipState.current) return
      Flip.from(flipState.current, {
        duration: 0.45,
        ease: 'power3.inOut',
        absolute: true,
        stagger: 0.01,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 0.35, delay: 0.1 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.6, duration: 0.25 }),
      })
      flipState.current = null
    },
    { dependencies: [filter], scope: grid },
  )

  return (
    <section className="panel software" aria-label="Software">
      <header className="software__head" data-anim="head">
        <h2 className="software__title display">SOFTWARE</h2>
        <div className="chips" role="group" aria-label="Filter software">
          {FILTERS.map((f) => (
            <button key={f} className="chip" aria-pressed={filter === f} onClick={() => choose(f)}>
              {f}
              <sup>{f === 'All' ? software.length : software.filter((s) => s.cat === f).length}</sup>
            </button>
          ))}
        </div>
      </header>

      <ul className="software__grid" ref={grid}>
        {software.map((s) => (
          <li key={s.name} className="tool" data-flip-id={s.name} hidden={filter !== 'All' && s.cat !== filter} data-anim="tile">
            <div className="tool__logo">
              <img src={s.logo} alt="" loading="lazy" className={s.name === 'Unity' ? 'is-left' : ''} />
            </div>
            <span className="tool__name">{s.name}</span>
            <span className="tool__cat">{s.cat}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
