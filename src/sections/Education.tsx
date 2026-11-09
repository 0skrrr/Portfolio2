import { education } from '../data'

export function Education() {
  return (
    <section className="panel education" aria-label="Education">
      <h2 className="education__title display" data-anim="edu-title">EDUCATION</h2>
      <ol className="education__list">
        {education.map((e, i) => (
          <li key={i} data-anim="edu">
            <span className="education__years">{e.years}</span>
            <strong>{e.school}</strong>
            <span>{e.field}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
