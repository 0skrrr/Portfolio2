import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { heroSilhouette, photoCredit } from '../data'
import { useT } from '../i18n'

const HEAD_TILT_DEG = 5
const TILT_MQ = '(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)'

const mask = (url: string) => ({ maskImage: `url(${url})`, WebkitMaskImage: `url(${url})` })

function CreditLink({ name, href }: { name: string; href: string }) {
  if (!href) return <span>{name}</span>
  return <a href={href} target="_blank" rel="noreferrer">{name}</a>
}

export function HeroFigure() {
  const t = useT()
  const root = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const head = root.current!.querySelector<HTMLElement>('.figure__tilt')!
      const mq = window.matchMedia(TILT_MQ)
      const toRotation = gsap.quickTo(head, 'rotation', { duration: 1.2, ease: 'power3' })
      const onMove = (e: PointerEvent) => {
        if (!mq.matches || e.pointerType !== 'mouse') return
        toRotation((e.clientX / window.innerWidth - 0.5) * 2 * HEAD_TILT_DEG)
      }
      window.addEventListener('pointermove', onMove)
      return () => window.removeEventListener('pointermove', onMove)
    },
    { scope: root },
  )

  return (
    <div className="figure" ref={root} data-anim="figure">
      <span className="figure__part figure__body" style={mask(heroSilhouette.body)} aria-hidden />
      <span className="figure__head" aria-hidden>
        <span className="figure__part figure__tilt" style={mask(heroSilhouette.head)} />
      </span>
      <button className="figure__credit" popoverTarget="photo-credit" aria-label={t.home.credit.open}>©</button>
      <div className="figure__popover" id="photo-credit" popover="auto">
        <dl>
          <dt>{t.home.credit.photo}</dt>
          <dd><CreditLink name={photoCredit.photographer || t.home.credit.unknown} href={photoCredit.photographerHref} /></dd>
          <dt>{t.home.credit.cutout}</dt>
          <dd><CreditLink name={photoCredit.cutoutTool} href={photoCredit.cutoutHref} /></dd>
        </dl>
      </div>
    </div>
  )
}
