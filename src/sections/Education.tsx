import { friends, asset } from '../data'
import { fmt, useT } from '../i18n'

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

/** Classmates sit on an ellipse around the card; at 60° steps none lands on the side arrow at 50% height. */
const spot = (i: number, n: number) => {
  const a = (-90 + (360 / n) * i) * (Math.PI / 180)
  return { x: 50 + 38 * Math.cos(a), y: 50 + 36 * Math.sin(a) }
}

function FriendCard({ f }: { f: (typeof friends)[number] }) {
  const t = useT()
  const { name, role } = t.education.friends[f.id]
  return (
    <div className="friend" data-anim="friend">
      <div className="friend__avatar">
        {f.avatar ? <img src={f.avatar} alt="" /> : <span aria-hidden>{initials(name)}</span>}
      </div>
      <div className="friend__body">
        <span className="friend__relation">{t.education.relations[f.relation]}</span>
        <strong>{name}</strong>
        <span className="friend__role">{role}</span>
        {(f.github || f.portfolio) && (
          <span className="friend__links">
            {f.github && (
              <a href={f.github} target="_blank" rel="noreferrer" aria-label={fmt(t.education.onGithub, { name })}>
                <img src={asset('github.svg')} alt="" /> {t.education.github}
              </a>
            )}
            {f.portfolio && (
              <a href={f.portfolio} target="_blank" rel="noreferrer" aria-label={fmt(t.education.portfolioOf, { name })}>
                {t.education.portfolio} <span aria-hidden>↗</span>
              </a>
            )}
          </span>
        )}
      </div>
    </div>
  )
}

export function Education() {
  const t = useT()
  const spots = friends.map((_, i) => spot(i, friends.length))
  return (
    <section className="panel education" aria-label={t.education.label}>
      <svg className="education__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {spots.map((p, i) => (
          <line key={i} x1="50" y1="50" x2={p.x} y2={p.y} pathLength={1} data-draw />
        ))}
      </svg>

      <div className="education__center">
        <p className="education__kicker" data-anim="kicker">{t.education.kicker}</p>
        <h2 className="education__title display" data-anim="title">{t.nav.sections.education}</h2>
        <ol className="education__list">
          {t.education.schools.map((e, i) => (
            <li key={i} data-anim="school">
              <span className="education__years">{e.years}</span>
              <strong>{e.school}</strong>
              <span>{e.field}</span>
            </li>
          ))}
        </ol>
        <p className="education__caption" data-anim="caption">{t.education.caption}</p>
      </div>

      <ul className="friends" aria-label={t.education.friendsLabel}>
        {friends.map((f, i) => (
          <li key={f.id} style={{ '--x': `${spots[i].x}%`, '--y': `${spots[i].y}%` } as React.CSSProperties}>
            <FriendCard f={f} />
          </li>
        ))}
      </ul>
    </section>
  )
}
