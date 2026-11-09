import { socials, asset, profile } from '../data'

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
      <p className="home__role">
        <span className="home__role-line">{profile.role}</span>
        <span className="home__status"><span className="dot" aria-hidden /> {profile.status}</span>
      </p>
      {/* Desktop arrows carry their destinations; touch users still need to know they can swipe. */}
      <p className="home__hint" aria-hidden>Swipe to explore</p>
      <ul className="socials" data-anim="socials">
        {socials.map((s) => (
          <li key={s.label}>
            <a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}>
              {/* The icon is painted through a mask so it takes the exact blend colour (a filtered white <img> came out mint-tinted). The hidden <img> just sizes the box. */}
              <span className="socials__icon" style={{ maskImage: `url(${s.icon})`, WebkitMaskImage: `url(${s.icon})` }}>
                <img src={s.icon} alt="" />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
