import { useRef, useState } from 'react'
import gsap from 'gsap'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'
import { software, softwareCategories, type SoftwareCategory } from '../data'
import { useT } from '../i18n'

gsap.registerPlugin(Flip)

type Filter = 'all' | SoftwareCategory
const FILTERS: Filter[] = ['all', ...softwareCategories]

export function Software() {
  const t = useT()
  const [filter, setFilter] = useState<Filter>('all')
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
    <section className="panel software" aria-label={t.nav.sections.software}>
      <div className="software__band">
        <p className="software__kicker" data-anim="kicker">{t.software.kicker}</p>
        <h2 className="software__title display" data-anim="title">{t.nav.sections.software}</h2>
      </div>
      <div className="software__body">
        <header className="software__head" data-anim="head">
          <div className="chips" role="group" aria-label={t.software.filterLabel}>
            {FILTERS.map((f) => (
              <button key={f} className="chip" aria-pressed={filter === f} onClick={() => choose(f)}>
                {f === 'all' ? t.software.all : t.software.categories[f]}
                <sup>{f === 'all' ? software.length : software.filter((s) => s.cat === f).length}</sup>
              </button>
            ))}
          </div>
          <p className="software__legend"><span className="dot" aria-hidden /> {t.software.legend}</p>
        </header>

        <ul className="software__grid" ref={grid}>
          {software.map((s) => (
            <li key={s.id} className={`tool ${s.core ? 'is-core' : ''}`} data-flip-id={s.id} hidden={filter !== 'all' && s.cat !== filter} data-anim="tile">
              <div className="tool__logo">
                <img src={s.logo} alt="" decoding="async" className={s.id === 'unity' ? 'is-left' : ''} />
              </div>
              <span className="tool__name">{t.software.items[s.id]}{s.core && <span className="sr-only"> {t.software.dailyDriver}</span>}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
