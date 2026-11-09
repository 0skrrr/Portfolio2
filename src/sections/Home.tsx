import { socials, asset } from '../data'

export function Home() {
  return (
    <section className="panel home" aria-label="Home">
      <div className="home__figure" data-anim="figure">
        <img src={asset('silhouette.png')} alt="Silhouette portrait of Oskar" />
      </div>
      <h1 className="home__title" data-anim="title">
        {'OSKAR'.split('').map((c, i) => (
          <span key={i} className="home__char">{c}</span>
        ))}
      </h1>
      <p className="home__hint" aria-hidden>
        <span className="home__hint-keys">← ↑ → ↓</span> <span className="home__hint-touch">swipe</span> to explore
      </p>
      <ul className="socials" data-anim="socials">
        {socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
              <img src={s.icon} alt="" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
