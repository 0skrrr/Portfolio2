import { education, friends, type Friend, asset } from '../data'

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

/** Classmates sit on an ellipse around the card; at 60° steps none lands on the side arrow at 50% height. */
const spot = (i: number, n: number) => {
  const a = (-90 + (360 / n) * i) * (Math.PI / 180)
  return { x: 50 + 38 * Math.cos(a), y: 50 + 36 * Math.sin(a) }
}

function FriendCard({ f }: { f: Friend }) {
  return (
    <div className="friend" data-anim="friend">
      <div className="friend__avatar">
        {f.avatar ? <img src={f.avatar} alt="" /> : <span aria-hidden>{initials(f.name)}</span>}
      </div>
      <div className="friend__body">
        <span className="friend__relation">{f.relation}</span>
        <strong>{f.name}</strong>
        <span className="friend__role">{f.role}</span>
        <span className="friend__links">
          {f.github && (
            <a href={f.github} target="_blank" rel="noreferrer" aria-label={`${f.name} on GitHub`}>
              <img src={asset('github.svg')} alt="" /> GitHub
            </a>
          )}
          {f.portfolio && (
            <a href={f.portfolio} target="_blank" rel="noreferrer" aria-label={`${f.name}'s portfolio`}>
              Portfolio <span aria-hidden>↗</span>
            </a>
          )}
        </span>
      </div>
    </div>
  )
}

export function Education() {
  const spots = friends.map((_, i) => spot(i, friends.length))
  return (
    <section className="panel education" aria-label="Education, classmates and friends">
      <svg className="education__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {spots.map((p, i) => (
          <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} pathLength={1} data-draw />
        ))}
      </svg>

      <div className="education__center">
        <p className="education__kicker" data-anim="kicker">Where I study</p>
        <h2 className="education__title display" data-anim="title">EDUCATION</h2>
        <ol className="education__list">
          {education.map((e, i) => (
            <li key={i} data-anim="school">
              <span className="education__years">{e.years}</span>
              <strong>{e.school}</strong>
              <span>{e.field}</span>
            </li>
          ))}
        </ol>
        <p className="education__caption" data-anim="caption">
          The classmates and friends I study and build things with. Their work is one click away.
        </p>
      </div>

      <ul className="friends" aria-label="Classmates and friends">
        {friends.map((f, i) => (
          <li key={f.name} style={{ '--x': `${spots[i].x}%`, '--y': `${spots[i].y}%` } as React.CSSProperties}>
            <FriendCard f={f} />
          </li>
        ))}
      </ul>
    </section>
  )
}
