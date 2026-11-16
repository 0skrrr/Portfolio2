import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { socials } from '../data'
import { fmt, useT } from '../i18n'
import './ContactDrawer.css'

const COPIED_FOR_MS = 1600
const reachable = socials.filter((s) => s.handle)

/** Ink drawer listing every way to reach you: copy an address, or open it. The homepage icons are the "open now" shortcut. */
export function ContactDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT()
  const root = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(open)
  const [copied, setCopied] = useState<string | null>(null)

  if (open && !mounted) setMounted(true)

  // Panel navigation stands down while the drawer is open (same switch the case study uses).
  useEffect(() => {
    if (!open) return
    document.documentElement.classList.add('is-modal')
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => {
      document.documentElement.classList.remove('is-modal')
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  useGSAP(() => {
    if (!mounted || !root.current) return
    const panel = root.current.querySelector('.drawer__panel')
    const shade = root.current.querySelector('.drawer__shade')
    if (open) {
      gsap.fromTo(shade, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 })
      gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.55, ease: 'expo.out' })
      gsap.fromTo(root.current.querySelectorAll('.drawer__row'), { autoAlpha: 0, x: 24 }, { autoAlpha: 1, x: 0, duration: 0.45, ease: 'power3.out', stagger: 0.05, delay: 0.1 })
      root.current.querySelector<HTMLElement>('.drawer__close')?.focus()
      return
    }
    gsap.to(shade, { autoAlpha: 0, duration: 0.25 })
    gsap.to(panel, { xPercent: 100, duration: 0.35, ease: 'power3.in', onComplete: () => setMounted(false) })
  }, { dependencies: [open, mounted], scope: root })

  const copy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(id)
      window.setTimeout(() => setCopied((c) => (c === id ? null : c)), COPIED_FOR_MS)
    } catch {
      setCopied(null) // clipboard blocked (permissions / insecure context): the Open link still works
    }
  }

  if (!mounted) return null
  return (
    <div className="drawer" ref={root}>
      <div className="drawer__shade" onClick={onClose} />
      <aside className="drawer__panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
        <header className="drawer__head">
          <p className="drawer__kicker">{t.contact.kicker}</p>
          <h2 id="drawer-title" className="drawer__title display">{t.contact.title}</h2>
          <button className="drawer__close" onClick={onClose} aria-label={t.contact.close}>×</button>
        </header>
        <p className="drawer__note">{t.contact.note}</p>
        <ul className="drawer__list">
          {reachable.map((s) => {
            const name = t.home.socials[s.id]
            return (
              <li key={s.id} className="drawer__row">
                <span className="drawer__name">{name}</span>
                <span className="drawer__handle">{s.handle}</span>
                <span className="drawer__actions">
                  <button onClick={() => copy(s.id, s.handle!)} aria-label={fmt(t.contact.copyLabel, { name })}>
                    {copied === s.id ? t.contact.copied : t.contact.copy}
                  </button>
                  <a href={s.href} target="_blank" rel="noreferrer" data-preview={s.preview} aria-label={fmt(t.contact.open, { name })}>↗</a>
                </span>
              </li>
            )
          })}
        </ul>
        <p className="sr-only" aria-live="polite">{copied ? t.contact.copied : ''}</p>
      </aside>
    </div>
  )
}
