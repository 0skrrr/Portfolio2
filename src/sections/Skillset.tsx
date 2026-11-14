import { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { logoOf, skills } from '../data'
import { fmt, useT } from '../i18n'

const pad = (n: number) => String(n).padStart(2, '0')

export function Skillset() {
  const t = useT()
  const [hovered, setHovered] = useState<number | null>(null)
  // Remember the last shown skill so the card keeps its content while sliding out.
  const [shown, setShown] = useState(0)
  const root = useRef<HTMLElement>(null)
  const card = useRef<HTMLDivElement>(null)

  const skill = skills[shown]
  const text = t.skillset.items[skill.id]
  // The card appears on the side opposite the label (and, on phones, the opposite half of the screen).
  const side = skill.side === 'left' ? 'right' : 'left'
  const half = skill.top < 50 ? 'below' : 'above'

  const { contextSafe } = useGSAP({ scope: root })

  // The card's wrapper is positioned with CSS `translate`; GSAP only ever moves the card inside it.
  const show = contextSafe((i: number) => {
    const fromSide = skills[i].side === 'left' ? 'right' : 'left'
    const switchingSide = hovered !== null && skills[hovered].side !== skills[i].side
    setHovered(i)
    setShown(i)
    gsap.killTweensOf(card.current)
    gsap.fromTo(
      card.current,
      // Fresh entry (or side change) slides in from the page edge; same-side swaps just nudge.
      hovered === null || switchingSide
        ? { xPercent: fromSide === 'right' ? 115 : -115, rotate: fromSide === 'right' ? 6 : -6, autoAlpha: 1 }
        : { xPercent: fromSide === 'right' ? 10 : -10, rotate: 0, autoAlpha: 0.4 },
      { xPercent: 0, rotate: fromSide === 'right' ? 1 : -1, autoAlpha: 1, duration: 0.55, ease: 'expo.out' },
    )
  })

  const hide = contextSafe(() => {
    if (hovered === null) return
    const toSide = skills[hovered].side === 'left' ? 'right' : 'left'
    setHovered(null)
    gsap.to(card.current, { xPercent: toSide === 'right' ? 115 : -115, rotate: 0, duration: 0.4, ease: 'power3.in' })
  })

  return (
    <section className="panel skillset" aria-label={t.nav.sections.skillset} ref={root}>
      <div className={`skill-preview skill-preview--${side} skill-preview--${half}`} aria-hidden>
        <div className="skill-card" ref={card}>
          {skill.image ? (
            <img className="skill-card__photo" src={skill.image} alt="" />
          ) : (
            <>
              <span className="skill-card__no">{fmt(t.skillset.number, { n: pad(shown + 1), total: pad(skills.length) })}</span>
              <strong className="skill-card__name">{text.name}</strong>
              <p className="skill-card__blurb">{text.blurb}</p>
              <div className="skill-card__tools">
                <span className="skill-card__label">{t.skillset.toolsLabel}</span>
                <ul>
                  {skill.tools.map((id) => (
                    <li key={id}>
                      <img src={logoOf[id]} alt="" />
                      {t.software.items[id]}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
          {skill.image && <span className="skill-card__caption">{text.name}</span>}
        </div>
      </div>

      <div className="skillset__band">
        <h2 className="skillset__title display" data-anim="title">{t.nav.sections.skillset}</h2>
      </div>
      <ul className="skillset__list">
        {skills.map((s, i) => (
          <li
            key={s.id}
            className={`skill skill--${s.side} ${hovered === i ? 'is-active' : ''}`}
            style={{ '--top': `${s.top}%` } as React.CSSProperties}
          >
            <button
              data-anim="skill"
              onPointerEnter={(e) => e.pointerType === 'mouse' && show(i)}
              onPointerLeave={(e) => e.pointerType === 'mouse' && hide()}
              onFocus={() => show(i)}
              onBlur={hide}
              // Touch: tap toggles the card.
              onClick={() => (hovered === i ? hide() : show(i))}
              aria-pressed={hovered === i}
              aria-describedby={hovered === i ? 'skill-blurb' : undefined}
            >
              {t.skillset.items[s.id].name}
            </button>
          </li>
        ))}
      </ul>
      {/* The card itself is decorative; this carries its text for screen readers. */}
      <p id="skill-blurb" className="sr-only">{text.blurb}</p>
    </section>
  )
}
