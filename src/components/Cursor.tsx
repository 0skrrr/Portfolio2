import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { CursorStyle } from '../cursor'
import type { SectionId } from '../nav'
import { useT, type Dict } from '../i18n'
import './Cursor.css'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const FOLLOW_SECONDS: Record<CursorStyle, number> = { dot: 0.08, label: 0.12, ring: 0.45, section: 0.08 }

type LabelKey = keyof Dict['nav']['cursor']['labels']

function labelFor(target: Element | null): LabelKey | null {
  if (!target || target.closest('[data-preview]')) return null
  if (target.closest('.arrow')) return 'go'
  if (target.closest('a[href^="mailto:"], .contact')) return 'mail'
  if (target.closest('a[target="_blank"]')) return 'open'
  if (target.closest('a, button')) return 'click'
  return null
}

function useCanCustomise() {
  const query = () => window.matchMedia(FINE_POINTER).matches && !window.matchMedia(REDUCED_MOTION).matches
  const [canCustomise, setCanCustomise] = useState(query)
  useEffect(() => {
    const lists = [window.matchMedia(FINE_POINTER), window.matchMedia(REDUCED_MOTION)]
    const update = () => setCanCustomise(query())
    lists.forEach((list) => list.addEventListener('change', update))
    return () => lists.forEach((list) => list.removeEventListener('change', update))
  }, [])
  return canCustomise
}

export function Cursor({ style, section }: { style: CursorStyle; section: SectionId }) {
  const t = useT()
  const canCustomise = useCanCustomise()
  const pointer = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<LabelKey | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const isDrawn = canCustomise

  useEffect(() => {
    document.documentElement.dataset.cursor = isDrawn ? 'custom' : 'system'
    return () => { delete document.documentElement.dataset.cursor }
  }, [isDrawn])

  useEffect(() => {
    if (!isDrawn || !pointer.current) return
    const duration = FOLLOW_SECONDS[style]
    const toX = gsap.quickTo(pointer.current, 'x', { duration, ease: 'power3.out' })
    const toY = gsap.quickTo(pointer.current, 'y', { duration, ease: 'power3.out' })
    const onMove = (e: PointerEvent) => {
      toX(e.clientX)
      toY(e.clientY)
      const target = e.target instanceof Element ? e.target : null
      setIsHovering(!!target?.closest('a, button, [role="button"]'))
      setLabel(style === 'label' ? labelFor(target) : null)
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [isDrawn, style])

  if (!isDrawn) return null
  return (
    <div ref={pointer} className={`cursor cursor--${style}`} data-section={section} data-hover={isHovering} aria-hidden>
      <span className="cursor__mark">{label && <span className="cursor__label">{t.nav.cursor.labels[label]}</span>}</span>
      {style === 'ring' && <span className="cursor__ring" />}
    </div>
  )
}
