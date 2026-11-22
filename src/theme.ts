import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

const readSaved = (): Theme | null => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved === 'light' || saved === 'dark' ? saved : null
  } catch {
    return null
  }
}

export const initialTheme = (): Theme =>
  readSaved() ?? (window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light')

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
  const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim()
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', ink)
  document.querySelectorAll<HTMLLinkElement>('link[data-theme-icon]').forEach((icon) => {
    icon.media = icon.dataset.themeIcon === theme ? 'all' : 'not all'
  })
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  useEffect(() => applyTheme(theme), [theme])
  const toggle = useCallback(() => {
    setTheme((current) => {
      const next: Theme = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        return next
      }
      return next
    })
  }, [])
  return { theme, toggle }
}
