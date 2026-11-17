import { friends, asset, schoolSites } from '../data'
import { useState } from 'react'
import { fmt, useT } from '../i18n'
import { githubUser } from '../components/github'

const initials = (n: string) => n.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase()

const AVATAR_SIZE = 96

function avatarSrc(f: (typeof friends)[number]): string | null {
  if (f.avatar) return f.avatar
  const user = f.github ? githubUser(f.github) : null
  return user ? `https://github.com/${user}.png?size=${AVATAR_SIZE}` : null
}

const JITTER = 1.6

const SLOTS: { x: number; y: number }[] = [
  { x: 50, y: 11 }, { x: 83, y: 30 }, { x: 84, y: 72 }, { x: 52, y: 89 }, { x: 15, y: 70 }, { x: 14, y: 31 },
  { x: 25, y: 14 }, { x: 76, y: 14 }, { x: 77, y: 88 }, { x: 27, y: 87 }, { x: 11, y: 50 },
]

const wobble = (i: number, salt: number) => {
  const v = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453
  return (v - Math.floor(v)) * 2 - 1
}

/** Hand-placed slots around the card, none on the right edge's middle where the Home arrow sits; a seeded wobble keeps them loose but stable between visits. */
const spot = (i: number) => {
  const slot = SLOTS[i % SLOTS.length]
  return { x: slot.x + wobble(i, 1) * JITTER, y: slot.y + wobble(i, 2) * JITTER }
}

function FriendCard({ f }: { f: (typeof friends)[number] }) {
  const t = useT()
  const { name, role } = t.education.friends[f.id]
  const [hasAvatarFailed, setHasAvatarFailed] = useState(false)
  const src = hasAvatarFailed ? null : avatarSrc(f)
  return (
    <div className="friend" data-anim="friend">
      <div className="friend__avatar">
        {src ? <img src={src} alt="" loading="lazy" onError={() => setHasAvatarFailed(true)} /> : <span aria-hidden>{initials(name)}</span>}
      </div>
      <div className="friend__body">
        <span className="friend__relation">{t.education.relations[f.relation]}</span>
        <strong>{name}</strong>
        <span className="friend__role">{role}</span>
        {(f.github || f.linkedin || f.instagram || f.spotify || f.portfolio) && (
          <span className="friend__links">
            {f.github && (
              <a href={f.github} target="_blank" rel="noreferrer" data-preview="github" aria-label={fmt(t.education.onGithub, { name })}>
                <img src={asset('github.svg')} alt="" /> {t.education.github}
              </a>
            )}
            {f.linkedin && (
              <a href={f.linkedin} target="_blank" rel="noreferrer" aria-label={fmt(t.education.onLinkedin, { name })}>
                <img src={asset('social2.svg')} alt="" /> {t.education.linkedin}
              </a>
            )}
            {f.instagram && (
              <a href={f.instagram} target="_blank" rel="noreferrer" aria-label={fmt(t.education.onInstagram, { name })}>
                <img src={asset('instagram.svg')} alt="" /> {t.education.instagram}
              </a>
            )}
            {f.spotify && (
              <a href={f.spotify} target="_blank" rel="noreferrer" data-preview="spotify" aria-label={fmt(t.education.onSpotify, { name })}>
                {t.education.spotify} <span aria-hidden>↗</span>
              </a>
            )}
            {f.portfolio && (
              <a href={f.portfolio} target="_blank" rel="noreferrer" data-preview="site" data-shot={f.portfolioShot} aria-label={fmt(t.education.portfolioOf, { name })}>
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
  const spots = friends.map((_, i) => spot(i))
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
              {schoolSites[e.id] ? (
                <a className="education__school" href={schoolSites[e.id]} target="_blank" rel="noreferrer" data-preview="site" aria-label={fmt(t.education.visitSchool, { name: e.school })}>
                  <strong>{e.school}</strong>
                </a>
              ) : (
                <strong>{e.school}</strong>
              )}
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
