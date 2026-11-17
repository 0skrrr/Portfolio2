import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { SCREENSHOT_SERVICE, type Preview } from '../data'
import { fmt, useT } from '../i18n'
import { useOutbound } from './outbound'
import { githubUser, loadProfile, type GithubProfile } from './github'
import './LinkPreview.css'

const CARD_WIDTH = 300
const GAP = 16
const EDGE = 12
const HOVER_MQ = '(hover: hover) and (pointer: fine)'

/** Beside the link on whichever side has room, kept inside the viewport. */
function place(anchor: HTMLElement, card: HTMLElement) {
  const a = anchor.getBoundingClientRect()
  const h = card.offsetHeight
  const roomRight = window.innerWidth - a.right - GAP - EDGE
  const left = roomRight >= CARD_WIDTH ? a.right + GAP : Math.max(EDGE, a.left - GAP - CARD_WIDTH)
  const top = Math.min(Math.max(EDGE, a.top + a.height / 2 - h / 2), window.innerHeight - h - EDGE)
  return { left, top }
}

function GithubCard({ href }: { href: string }) {
  const t = useT()
  const user = githubUser(href)
  const [profile, setProfile] = useState<GithubProfile | null | undefined>(undefined)

  useEffect(() => {
    if (!user) return
    let live = true
    setProfile(undefined)
    loadProfile(user).then((p) => live && setProfile(p))
    return () => { live = false }
  }, [user])

  if (!user || profile === null) return <p className="lp__status">{t.preview.unavailable}</p>
  if (profile === undefined) return <p className="lp__status">{t.preview.loading}</p>
  return (
    <div className="lp-gh">
      <header className="lp-gh__head">
        <img className="lp-gh__avatar" src={profile.avatar} alt="" />
        <div>
          <strong>{profile.name ?? profile.login}</strong>
          <span>@{profile.login}</span>
        </div>
      </header>
      {profile.bio && <p className="lp-gh__bio">{profile.bio}</p>}
      <p className="lp-gh__stats">
        <span>{fmt(t.preview.repos, { count: profile.repoCount })}</span>
        <span>{fmt(t.preview.followers, { count: profile.followers })}</span>
      </p>
      {profile.repos.length > 0 && (
        <>
          <span className="lp__label">{t.preview.recent}</span>
          <ul className="lp-gh__repos">
            {profile.repos.map((r) => (
              <li key={r.name}><span>{r.name}</span>{r.language && <em>{r.language}</em>}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function SiteShot({ href, shot }: { href: string; shot?: string }) {
  const t = useT()
  const [state, setState] = useState<'loading' | 'ready' | 'failed'>('loading')
  useEffect(() => setState('loading'), [href, shot])
  if (state === 'failed') return <p className="lp__status">{t.preview.unavailable}</p>
  return (
    <div className={`lp-site is-${state}`}>
      {state === 'loading' && <p className="lp__status">{t.preview.loading}</p>}
      <img src={shot ?? SCREENSHOT_SERVICE + href} alt="" onLoad={() => setState('ready')} onError={() => setState('failed')} />
    </div>
  )
}

const SPOTIFY_EMBED = 'https://open.spotify.com/embed/'
const SPOTIFY_PATH = /^\/(artist|album|track|playlist)\/[A-Za-z0-9]+$/

function spotifyEmbed(href: string) {
  const url = new URL(href)
  if (url.hostname !== 'open.spotify.com' || !SPOTIFY_PATH.test(url.pathname)) return null
  return SPOTIFY_EMBED + url.pathname.slice(1)
}

function SpotifyCard({ href }: { href: string }) {
  const t = useT()
  const src = spotifyEmbed(href)
  if (!src) return <p className="lp__status">{t.preview.unavailable}</p>
  return <iframe className="lp-sp" src={src} title={t.preview.spotify} loading="lazy" allow="encrypted-media" />
}

function PreviewBody({ kind, href, shot }: { kind: Preview; href: string; shot?: string }) {
  if (kind === 'github') return <GithubCard href={href} />
  if (kind === 'spotify') return <SpotifyCard href={href} />
  return <SiteShot href={href} shot={shot} />
}

const PREVIEW_KINDS: Preview[] = ['github', 'site', 'spotify']

/** Floating preview of where an outgoing link with `data-preview` goes. Pointer devices only: on touch a tap just follows the link. */
export function LinkPreview() {
  const out = useOutbound()
  const card = useRef<HTMLDivElement>(null)
  const kind = out?.anchor.dataset.preview as Preview | undefined
  const show = !!out && !!kind && PREVIEW_KINDS.includes(kind) && window.matchMedia(HOVER_MQ).matches

  useLayoutEffect(() => {
    const el = card.current
    if (!show || !el) return
    const reposition = () => gsap.set(el, place(out.anchor, el))
    reposition()
    // The card grows when the profile or screenshot arrives; keep it centred on the link.
    const resize = new ResizeObserver(reposition)
    resize.observe(el)
    gsap.fromTo(el.firstElementChild, { autoAlpha: 0, y: 8, rotate: -1.5 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 0.3, ease: 'power3.out' })
    return () => resize.disconnect()
  }, [show, out])

  if (!show) return null
  return (
    <div className="lp" ref={card} aria-hidden>
      <div className="lp__card">
        <span className="lp__host">{out.host} <span aria-hidden>↗</span></span>
        <PreviewBody kind={kind} href={out.href} shot={out.anchor.dataset.shot} />
      </div>
    </div>
  )
}
