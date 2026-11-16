import { useSyncExternalStore } from 'react'

/** The outgoing link the visitor is pointing at or has focused, if any. */
export type Outbound = { href: string; host: string; anchor: HTMLAnchorElement }

let current: Outbound | null = null
const listeners = new Set<() => void>()

const set = (next: Outbound | null) => {
  if (next?.anchor === current?.anchor) return
  current = next
  listeners.forEach((l) => l())
}

/** An http(s) link to another origin; mailto and in-page links don't leave the site. */
export function outboundOf(target: EventTarget | null): Outbound | null {
  const anchor = (target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null
  if (!anchor) return null
  const url = new URL(anchor.href, window.location.href)
  const isWeb = url.protocol === 'http:' || url.protocol === 'https:'
  if (!isWeb || url.origin === window.location.origin) return null
  return { href: url.href, host: url.host.replace(/^www\./, '') + url.pathname.replace(/\/$/, ''), anchor }
}

let started = false
/** One document-level listener covers every outgoing link, wherever it's rendered. */
function start() {
  if (started) return
  started = true
  document.addEventListener('pointerover', (e) => set(outboundOf(e.target)))
  document.addEventListener('focusin', (e) => set(outboundOf(e.target)))
  document.addEventListener('focusout', () => set(null))
  // Leaving the window, or a click that opens the link in a new tab, ends the hover.
  document.documentElement.addEventListener('pointerleave', () => set(null))
  window.addEventListener('blur', () => set(null))
}

export function useOutbound() {
  return useSyncExternalStore(
    (l) => {
      start()
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => current,
  )
}
