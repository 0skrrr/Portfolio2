import { useState } from 'react'
import { projects, skills, software, softwareStages, type SoftwareId } from '../data'
import { useT } from '../i18n'
import './Software.css'

const pad = (n: number) => String(n).padStart(2, '0')

/** Where a tool shows up: the skills that list it and the projects built with it. */
function useTrace(id: SoftwareId | null) {
  const t = useT()
  if (!id) return null
  return {
    skills: skills.filter((s) => s.tools.includes(id)).map((s) => t.skillset.items[s.id].name),
    projects: projects.filter((p) => p.tools?.includes(id)).map((p) => t.projects.items[p.id].title),
  }
}

function Trace({ id }: { id: SoftwareId | null }) {
  const t = useT()
  const trace = useTrace(id)
  if (!id || !trace) return <p className="trace trace--idle">{t.software.trace.hint}</p>
  const list = (items: string[]) => (items.length ? items.join(' · ') : t.software.trace.none)
  return (
    <dl className="trace" aria-live="polite">
      <dt className="trace__tool">{t.software.items[id]}</dt>
      <dd><span>{t.software.trace.skills}</span>{list(trace.skills)}</dd>
      <dd><span>{t.software.trace.projects}</span>{list(trace.projects)}</dd>
    </dl>
  )
}

/** The toolchain read as the way work moves: plan → design & media → build → ship. Built to take many more tools per stage. */
export function Software() {
  const t = useT()
  const [traced, setTraced] = useState<SoftwareId | null>(null)

  return (
    <section className="panel software" aria-label={t.nav.sections.software}>
      <div className="software__band">
        <p className="software__kicker" data-anim="kicker">{t.software.kicker}</p>
        <h2 className="software__title display" data-anim="title">{t.nav.sections.software}</h2>
      </div>
      <div className="software__body">
        <ol className="pipeline" aria-label={t.software.pipelineLabel} onPointerLeave={() => setTraced(null)}>
          {softwareStages.map((stage, i) => {
            const tools = software.filter((s) => s.stage === stage)
            return (
              <li key={stage} className="stage" style={{ '--count': tools.length } as React.CSSProperties} data-anim="stage">
                <header className="stage__head">
                  <span className="stage__no">{pad(i + 1)}</span>
                  <h3 className="stage__name">{t.software.stages[stage].name}</h3>
                  <p className="stage__caption">{t.software.stages[stage].caption}</p>
                </header>
                <ul className="stage__tools">
                  {tools.map((s) => (
                    <li key={s.id}>
                      <button
                        className={`tool ${s.core ? 'is-core' : ''} ${traced === s.id ? 'is-traced' : ''}`}
                        onPointerEnter={() => setTraced(s.id)}
                        onFocus={() => setTraced(s.id)}
                        onClick={() => setTraced(s.id)}
                      >
                        <img className={`tool__logo ${s.wordmark ? 'is-wordmark' : ''}`} src={s.logo} alt="" decoding="async" />
                        <span className="tool__name">{t.software.items[s.id]}</span>
                        {s.core && <span className="sr-only"> {t.software.dailyDriver}</span>}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            )
          })}
        </ol>
        <footer className="software__foot" data-anim="foot">
          <Trace id={traced} />
          <p className="software__legend"><span className="dot" aria-hidden /> {t.software.legend}</p>
        </footer>
      </div>
    </section>
  )
}
