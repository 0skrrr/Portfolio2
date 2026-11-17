import { useState } from 'react'
import { hobbies, platforms, projects, skills, software, softwareStages, type SoftwareGroup, type SoftwareId } from '../data'
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

type Tool = (typeof software)[number]

function ToolButton({ s, traced, onTrace }: { s: Tool; traced: SoftwareId | null; onTrace: (id: SoftwareId) => void }) {
  const t = useT()
  const state = [s.core && 'is-core', s.adobe && 'is-adobe', traced === s.id && 'is-traced'].filter(Boolean).join(' ')
  return (
    <button className={`tool ${state}`} onPointerEnter={() => onTrace(s.id)} onFocus={() => onTrace(s.id)} onClick={() => onTrace(s.id)}>
      <img className={`tool__logo ${s.wordmark ? 'is-wordmark' : ''}`} src={s.logo} alt="" decoding="async" />
      <span className="tool__name">{t.software.items[s.id]}</span>
      {s.core && <span className="sr-only"> {t.software.dailyDriver}</span>}
      {s.adobe && <span className="sr-only"> {t.software.adobeNote}</span>}
    </button>
  )
}

function ToolList({ tools, traced, onTrace }: { tools: Tool[]; traced: SoftwareId | null; onTrace: (id: SoftwareId) => void }) {
  return (
    <ul className="stage__tools">
      {tools.map((s) => (
        <li key={s.id}><ToolButton s={s} traced={traced} onTrace={onTrace} /></li>
      ))}
    </ul>
  )
}

function groupsOf(tools: Tool[]): { group: SoftwareGroup; tools: Tool[] }[] {
  const order: SoftwareGroup[] = ['languages', 'apps']
  return order.map((group) => ({ group, tools: tools.filter((s) => s.group === group) })).filter((g) => g.tools.length)
}

function Platforms() {
  const t = useT()
  return (
    <div className="platforms">
      <span className="stage__group">{t.software.platforms.label}</span>
      <ul>
        {platforms.map((p) => <li key={p}>{t.software.platforms.items[p]}</li>)}
      </ul>
    </div>
  )
}

function Hobbies({ traced, onTrace }: { traced: SoftwareId | null; onTrace: (id: SoftwareId) => void }) {
  const t = useT()
  const toolById = (id: SoftwareId) => software.find((s) => s.id === id)
  return (
    <section className="hobbies" aria-label={t.software.hobbies.title} data-anim="foot">
      <header className="hobbies__head">
        <h3 className="stage__name">{t.software.hobbies.title}</h3>
        <p className="stage__caption">{t.software.hobbies.caption}</p>
      </header>
      {hobbies.map((h) => {
        const tools = h.tools.map(toolById).filter((s): s is Tool => !!s)
        return (
          <div key={h.id} className="hobby">
            <strong>{t.software.hobbies.items[h.id].name}</strong>
            <span className="hobby__caption">{t.software.hobbies.items[h.id].caption}</span>
            {tools.length > 0 && <ToolList tools={tools} traced={traced} onTrace={onTrace} />}
          </div>
        )
      })}
    </section>
  )
}

/** The toolchain read as the way work moves: plan → design & media → build → ship, then the off-screen hobbies. */
export function Software() {
  const t = useT()
  const [traced, setTraced] = useState<SoftwareId | null>(null)

  return (
    <section className="panel software" aria-label={t.nav.sections.software}>
      <div className="software__band">
        <p className="software__kicker" data-anim="kicker">{t.software.kicker}</p>
        <h2 className="software__title display" data-anim="title">{t.nav.sections.software}</h2>
      </div>
      <div className="software__body" onPointerLeave={() => setTraced(null)}>
        <ol className="pipeline" aria-label={t.software.pipelineLabel}>
          {softwareStages.map((stage, i) => {
            const tools = software.filter((s) => s.stage === stage)
            const groups = groupsOf(tools)
            return (
              <li key={stage} className="stage" style={{ '--count': tools.length } as React.CSSProperties} data-anim="stage">
                <header className="stage__head">
                  <span className="stage__no">{pad(i + 1)}</span>
                  <h3 className="stage__name">{t.software.stages[stage].name}</h3>
                  <p className="stage__caption">{t.software.stages[stage].caption}</p>
                </header>
                {groups.length ? (
                  <div className="stage__groups">
                    {groups.map((g) => (
                      <div key={g.group}>
                        <span className="stage__group">{t.software.groups[g.group]}</span>
                        <ToolList tools={g.tools} traced={traced} onTrace={setTraced} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ToolList tools={tools} traced={traced} onTrace={setTraced} />
                )}
                {stage === 'ship' && <Platforms />}
              </li>
            )
          })}
        </ol>
        <Hobbies traced={traced} onTrace={setTraced} />
        <footer className="software__foot" data-anim="foot">
          <Trace id={traced} />
          <div className="software__legend">
            <p><span className="dot" aria-hidden /> {t.software.legend}</p>
            <p><span className="dot dot--ring" aria-hidden /> {t.software.adobeLegend}</p>
          </div>
        </footer>
      </div>
    </section>
  )
}
