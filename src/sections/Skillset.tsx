import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { skills } from '../data'

export function Skillset() {
  const [hovered, setHovered] = useState<number | null>(null)
  // Remember the last shown skill so the image keeps its content while sliding out.
  const [shown, setShown] = useState(0)
  const root = useRef<HTMLElement>(null)
  const preview = useRef<HTMLDivElement>(null)

  const skill = skills[shown]
  // Image appears on the side opposite the hovered label.
  const side = skill.side === 'left' ? 'right' : 'left'

  const { contextSafe } = useGSAP({ scope: root })

  const show = contextSafe((i: number) => {
    const fromSide = skills[i].side === 'left' ? 'right' : 'left'
    const switchingSide = hovered !== null && skills[hovered].side !== skills[i].side
    setHovered(i)
    setShown(i)
    gsap.killTweensOf(preview.current)
    gsap.fromTo(
      preview.current,
      // Fresh entry (or side change) slides in from the page edge; same-side swaps just nudge.
      hovered === null || switchingSide
        ? { xPercent: fromSide === 'right' ? 110 : -110, rotate: fromSide === 'right' ? 6 : -6, autoAlpha: 1 }
        : { xPercent: fromSide === 'right' ? 12 : -12, rotate: 0, autoAlpha: 0.4 },
      { xPercent: 0, rotate: fromSide === 'right' ? 2 : -2, autoAlpha: 1, duration: 0.55, ease: 'expo.out' },
    )
  })

  const hide = contextSafe(() => {
    if (hovered === null) return
    const toSide = skills[hovered].side === 'left' ? 'right' : 'left'
    setHovered(null)
    gsap.to(preview.current, { xPercent: toSide === 'right' ? 110 : -110, rotate: 0, duration: 0.4, ease: 'power3.in' })
  })

  return (
    <section className="panel skillset" aria-label="Skillset" ref={root}>
      <div className={`skill-preview skill-preview--${side}`} ref={preview} aria-hidden>
        {skill.image ? (
          <img src={skill.image} alt="" />
        ) : (
          <div className="skill-preview__placeholder">
            <span>{skill.name}</span>
          </div>
        )}
        <span className="skill-preview__caption">{skill.name}</span>
      </div>

      <div className="skillset__band" data-anim="band">
        <h2 className="skillset__title display">SKILLSET</h2>
      </div>
      <ul className="skillset__list">
        {skills.map((s, i) => (
          <li
            key={s.name}
            className={`skill skill--${s.side} ${hovered === i ? 'is-active' : ''}`}
            style={{ '--top': `${s.top}%` } as React.CSSProperties}
            data-anim="skill"
          >
            <button
              onPointerEnter={(e) => e.pointerType === 'mouse' && show(i)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && hide()}
              onFocus={() => show(i)}
              onBlur={hide}
              // Touch: tap toggles the preview.
              onClick={() => (hovered === i ? hide() : show(i))}
              aria-pressed={hovered === i}
            >
              {s.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
