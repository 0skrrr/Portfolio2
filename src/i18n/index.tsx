import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import en from './en.json'

/**
 * Every word on the site lives in a JSON file in this folder. English (en.json) is the source of truth;
 * to add a language, copy it to e.g. cs.json and translate the values. Anything a translation leaves out
 * falls back to English, and the switcher in the corner appears as soon as there are two files.
 */
export type Dict = typeof en

type DeepPartial<T> = { [K in keyof T]?: T[K] extends unknown[] ? T[K] : T[K] extends object ? DeepPartial<T[K]> : T[K] }
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v)

/** Translation over English, key by key. Arrays (paragraphs, tool lists) are replaced whole. */
function merge<T>(base: T, over: unknown): T {
  if (over === undefined || over === null) return base
  if (!isObj(base) || !isObj(over)) return over as T
  const out: Record<string, unknown> = { ...base }
  for (const k of Object.keys(over)) out[k] = merge(base[k], over[k])
  return out as T
}

const files = import.meta.glob<DeepPartial<Dict>>('./*.json', { eager: true, import: 'default' })

export type Locale = { code: string; t: Dict }
/** English first, the rest alphabetically by file name. */
export const locales: Locale[] = Object.entries(files)
  .map(([path, dict]) => {
    const code = path.slice(2, -'.json'.length)
    return { code, t: code === 'en' ? en : merge(en, dict) }
  })
  .sort((a, b) => (a.code === 'en' ? -1 : b.code === 'en' ? 1 : a.code.localeCompare(b.code)))
const byCode = Object.fromEntries(locales.map((l) => [l.code, l]))

const STORE = 'lang'
const read = () => {
  try { return localStorage.getItem(STORE) } catch { return null }
}
/** ?lang=cs → saved choice → browser languages (exact, then base: "cs-CZ" → "cs") → English. */
function detect(): string {
  const langs = navigator.languages ?? [navigator.language]
  const wanted = [
    new URLSearchParams(window.location.search).get('lang'),
    read(),
    ...langs.map((l) => l.toLowerCase()),
    ...langs.map((l) => l.slice(0, 2).toLowerCase()),
  ]
  return wanted.find((c): c is string => !!c && c in byCode) ?? 'en'
}

/** "Go to {name}" + { name: 'Projects' } → "Go to Projects". Unknown placeholders are left as they are. */
export const fmt = (s: string, vars: Record<string, string | number>) =>
  s.replace(/\{(\w+)\}/g, (m, k: string) => (k in vars ? String(vars[k]) : m))

type Ctx = { t: Dict; code: string; setCode: (c: string) => void }
const I18n = createContext<Ctx>({ t: en, code: 'en', setCode: () => {} })

export function I18nProvider({ children }: { children: ReactNode }) {
  const [code, setCodeState] = useState(detect)
  const t = byCode[code].t
  const setCode = useCallback((c: string) => {
    if (!(c in byCode)) return
    setCodeState(c)
    try { localStorage.setItem(STORE, c) } catch { /* private mode: the choice just isn't remembered */ }
  }, [])
  useEffect(() => {
    document.documentElement.lang = t.meta.lang
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.meta.description)
  }, [t])
  const value = useMemo(() => ({ t, code, setCode }), [t, code, setCode])
  return <I18n.Provider value={value}>{children}</I18n.Provider>
}

export const useI18n = () => useContext(I18n)
/** The active dictionary: `const t = useT(); t.home.statement`. */
export const useT = () => useContext(I18n).t
