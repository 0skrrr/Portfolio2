import { software } from '../data'

export function Software() {
  return (
    <section className="panel software" aria-label="Software">
      <div className="software__grid">
        {software.map((t, i) => (
          <div
            key={i}
            className={`tile ${t.fill ? `tile--${t.fill}` : ''} ${t.s ? 'tile--big' : ''} ${t.logo ? '' : 'tile--deco'}`}
            style={{ '--c': t.c, '--r': t.r, '--s': t.s ?? 1 } as React.CSSProperties}
            data-anim="tile"
            title={t.name}
          >
            {t.logo && <img src={t.logo} alt={t.name} loading="lazy" className={t.name === 'Unity' ? 'is-left' : ''} />}
          </div>
        ))}
        <h2 className="software__title display">SOFTWARE</h2>
      </div>
    </section>
  )
}
