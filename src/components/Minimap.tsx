import { POS, type SectionId } from '../nav'

/** Dial-pad style minimap: 5 dots in a cross, the active one gets a ring. */
export function Minimap({ active, go }: { active: SectionId; go: (s: SectionId) => void }) {
  return (
    <nav className="minimap" aria-label="Site map">
      {(Object.keys(POS) as SectionId[]).map((id) => (
        <button
          key={id}
          className={`minimap__dot ${id === active ? 'is-active' : ''}`}
          style={{ gridColumn: POS[id].x + 2, gridRow: POS[id].y + 2 }}
          onClick={() => go(id)}
          aria-label={id}
          aria-current={id === active ? 'page' : undefined}
        >
          <span className="minimap__tip">{id}</span>
        </button>
      ))}
    </nav>
  )
}
