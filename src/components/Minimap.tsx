import { useState } from 'react'
import { POS, type SectionId } from '../nav'
import { fmt, useT } from '../i18n'

// A loose pen loop that overshoots its start, like circling something by hand.
const SCRIBBLE = 'M30.5 8.2C24.8 3.4 13.2 4.2 7.6 11.5 2.4 18.3 5.1 30.6 14.2 34.6c8.6 3.8 19.8.2 22.4-9.3C39 15.9 32.6 6.7 21.7 5.4 18.9 5.1 16.6 5.6 14.8 6.4'
// Slight per-dot rotation so the circles don't look stamped.
const TILT: Record<SectionId, number> = { home: 0, software: -24, skillset: 38, projects: 140, education: -70 }

/** Dial-pad minimap: filled dot = where you are, hand-drawn circle = where you're pointing. */
export function Minimap({ active, go }: { active: SectionId; go: (s: SectionId) => void }) {
  const t = useT()
  const [hover, setHover] = useState<SectionId | null>(null)
  const label = hover && hover !== active ? fmt(t.nav.pointing, { name: t.nav.sections[hover] }) : t.nav.sections[active]
  return (
    <nav className="minimap" aria-label={t.nav.siteMap} onPointerLeave={() => setHover(null)}>
      <div className="minimap__grid">
        {(Object.keys(POS) as SectionId[]).map((id) => (
          <button
            key={id}
            className={`minimap__dot ${id === active ? 'is-active' : ''} ${id === hover ? 'is-hover' : ''}`}
            style={{ gridColumn: POS[id].x + 2, gridRow: POS[id].y + 2 }}
            onClick={() => go(id)}
            onPointerEnter={() => setHover(id)}
            onFocus={() => setHover(id)}
            onBlur={() => setHover(null)}
            aria-label={fmt(t.nav.goTo, { name: t.nav.sections[id] })}
            aria-current={id === active ? 'page' : undefined}
          >
            <svg className="minimap__scribble" viewBox="0 0 40 40" style={{ rotate: `${TILT[id]}deg` }} aria-hidden>
              <path d={SCRIBBLE} pathLength={1} />
            </svg>
          </button>
        ))}
      </div>
      <p className="minimap__label" aria-live="polite">{label}</p>
    </nav>
  )
}
