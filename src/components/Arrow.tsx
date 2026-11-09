import type { Dir } from '../nav'

const ROT: Record<Dir, number> = { left: 0, up: 90, right: 180, down: 270 }

export function Arrow({ dir, onClick, name, className = '' }: { dir: Dir; onClick: () => void; name: string; className?: string }) {
  return (
    <button className={`arrow arrow--${dir} ${className}`} onClick={onClick} aria-label={`Go to ${name}`}>
      <svg viewBox="0 0 14 14" style={{ transform: `rotate(${ROT[dir]}deg)` }} aria-hidden>
        <circle cx="7" cy="7" r="6.5" fill="none" stroke="currentColor" strokeWidth="0.6" />
        <path d="M8.2 4 5.2 7l3 3" fill="none" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="arrow__label" aria-hidden>{name}</span>
    </button>
  )
}
