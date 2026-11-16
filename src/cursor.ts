import { useCallback, useState } from 'react'

export const CURSOR_STYLES = ['dot', 'label', 'section'] as const
export type CursorStyle = (typeof CURSOR_STYLES)[number]

const STORAGE_KEY = 'cursor'
const DEFAULT_STYLE: CursorStyle = 'dot'

const isCursorStyle = (value: unknown): value is CursorStyle =>
  typeof value === 'string' && (CURSOR_STYLES as readonly string[]).includes(value)

const readSaved = (): CursorStyle => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return isCursorStyle(saved) ? saved : DEFAULT_STYLE
  } catch {
    return DEFAULT_STYLE
  }
}

const save = (style: CursorStyle) => {
  try {
    localStorage.setItem(STORAGE_KEY, style)
  } catch {
    return
  }
}

export function useCursorStyle() {
  const [style, setStyle] = useState<CursorStyle>(readSaved)
  const cycle = useCallback(() => {
    setStyle((current) => {
      const next = CURSOR_STYLES[(CURSOR_STYLES.indexOf(current) + 1) % CURSOR_STYLES.length]
      save(next)
      return next
    })
  }, [])
  return { style, cycle }
}
