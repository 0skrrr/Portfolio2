import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Cursor.css'

const FINE_POINTER = '(hover: hover) and (pointer: fine)'
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'
const INTERACTIVE = 'a, button, [role="button"], label, select'
const FOLLOW_SECONDS = 0.08
const STRETCH_SECONDS = 0.25
const SPEED_PER_STRETCH = 60
const MAX_STRETCH = 0.6
const SETTLE_AFTER_MS = 80

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

function followPointer(cursor: HTMLElement, blob: HTMLElement, onTarget: (target: EventTarget | null) => void) {
  const toX = gsap.quickTo(cursor, 'x', { duration: FOLLOW_SECONDS, ease: 'power3.out' })
  const toY = gsap.quickTo(cursor, 'y', { duration: FOLLOW_SECONDS, ease: 'power3.out' })
  const toStretch = gsap.quickTo(blob, 'scaleX', { duration: STRETCH_SECONDS, ease: 'power3.out' })
  const toSqueeze = gsap.quickTo(blob, 'scaleY', { duration: STRETCH_SECONDS, ease: 'power3.out' })
  let last: { x: number; y: number } | null = null
  let settle = 0

  const onMove = (e: PointerEvent) => {
    toX(e.clientX)
    toY(e.clientY)
    onTarget(e.target)
    if (last) {
      const dx = e.clientX - last.x
      const dy = e.clientY - last.y
      const stretch = Math.min(Math.hypot(dx, dy) / SPEED_PER_STRETCH, MAX_STRETCH)
      gsap.set(blob, { rotation: (Math.atan2(dy, dx) * 180) / Math.PI })
      toStretch(1 + stretch)
      toSqueeze(1 - stretch / 2)
    }
    last = { x: e.clientX, y: e.clientY }
    window.clearTimeout(settle)
    settle = window.setTimeout(() => { toStretch(1); toSqueeze(1) }, SETTLE_AFTER_MS)
  }
  window.addEventListener('pointermove', onMove)
  return () => {
    window.removeEventListener('pointermove', onMove)
    window.clearTimeout(settle)
  }
}

export function Cursor() {
  const canCustomise = useCanCustomise()
  const cursor = useRef<HTMLDivElement>(null)
  const blob = useRef<HTMLSpanElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const [isInside, setIsInside] = useState(true)

  useEffect(() => {
    document.documentElement.dataset.cursor = canCustomise ? 'custom' : 'system'
    return () => { delete document.documentElement.dataset.cursor }
  }, [canCustomise])

  useEffect(() => {
    if (!canCustomise || !cursor.current || !blob.current) return
    const onTarget = (target: EventTarget | null) => {
      setIsInside(true)
      setIsHovering(target instanceof Element && !!target.closest(INTERACTIVE))
    }
    const stopFollowing = followPointer(cursor.current, blob.current, onTarget)
    const onDown = () => setIsPressed(true)
    const onUp = () => setIsPressed(false)
    const onLeave = () => setIsInside(false)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    document.documentElement.addEventListener('pointerleave', onLeave)
    return () => {
      stopFollowing()
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [canCustomise])

  if (!canCustomise) return null
  return (
    <div ref={cursor} className="cursor" data-hover={isHovering} data-pressed={isPressed} data-inside={isInside} aria-hidden>
      <span className="cursor__mark">
        <span ref={blob} className="cursor__blob" />
      </span>
    </div>
  )
}
