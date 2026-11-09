import { skills } from '../data'

export function Skillset() {
  return (
    <section className="panel skillset" aria-label="Skillset">
      <div className="skillset__band" data-anim="band">
        <h2 className="skillset__title display">SKILLSET</h2>
      </div>
      <ul className="skillset__list">
        {skills.map((s) => (
          <li key={s.name} className={`skill skill--${s.side}`} style={{ '--top': `${s.top}%` } as React.CSSProperties} data-anim="skill">
            <span>{s.name}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
