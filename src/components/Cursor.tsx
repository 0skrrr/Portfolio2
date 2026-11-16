import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { CursorStyle } from '../cursor'
import type { SectionId } from '../nav'
import { useT, type Dict } from '../i18n'
import './Cursor.css'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const FOLLOW_SECONDS: Record<CursorStyle, number> = { system: 0, dot: 0.08, label: 0.12, ring: 0.45, section: 0.08, magnetic: 0 }
const MAGNET_TARGETS = '.arrow, .corner button, .minimap button'
const MAGNET_RANGE_PX = 80
const MAGNET_PULL = 0.35

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

function pullMagnets(x: number, y: number) {
  document.querySelectorAll<HTMLElement>(MAGNET_TARGETS).forEach((el) => {
    const box = el.getBoundingClientRect()
    const dx = x - (box.left + box.width / 2)
    const dy = y - (box.top + box.height / 2)
    const isNear = Math.hypot(dx, dy) < MAGNET_RANGE_PX
    el.style.setProperty('--magnet-x', `${isNear ? dx * MAGNET_PULL : 0}px`)
    el.style.setProperty('--magnet-y', `${isNear ? dy * MAGNET_PULL : 0}px`)
  })
}

function releaseMagnets() {
  document.querySelectorAll<HTMLElement>(MAGNET_TARGETS).forEach((el) => {
    el.style.removeProperty('--magnet-x')
    el.style.removeProperty('--magnet-y')
  })
}

export function Cursor({ style, section }: { style: CursorStyle; section: SectionId }) {
  const t = useT()
  const canCustomise = useCanCustomise()
  const pointer = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState<LabelKey | null>(null)
  const [isHovering, setIsHovering] = useState(false)
  const isDrawn = canCustomise && style !== 'system' && style !== 'magnetic'
  const isMagnetic = canCustomise && style === 'magnetic'

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

  useEffect(() => {
    if (!isMagnetic) return
    const onMove = (e: PointerEvent) => pullMagnets(e.clientX, e.clientY)
    window.addEventListener('pointermove', onMove)
    return () => {
      window.removeEventListener('pointermove', onMove)
      releaseMagnets()
    }
  }, [isMagnetic])

  if (!isDrawn) return null
  return (
    <div ref={pointer} className={`cursor cursor--${style}`} data-section={section} data-hover={isHovering} aria-hidden>
      <span className="cursor__mark">{label && <span className="cursor__label">{t.nav.cursor.labels[label]}</span>}</span>
      {style === 'ring' && <span className="cursor__ring" />}
    </div>
  )
}
