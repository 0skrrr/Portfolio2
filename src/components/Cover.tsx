import { COVERS } from '../data'

type Props = {
  /** Composition 0…COVERS-1, or 'cta' for the "your project?" card. */
  variant: number | 'cta'
  no: string
  title: string
  meta: string
  /** Real photo: shown instead of the composition, the number badge stays. */
  image?: string
  className?: string
}

/**
 * Typographic project cover in the hero's language: an ink slab split across cream, with the number and
 * title in difference blend so they flip colour wherever they cross the slab. Each composition moves the
 * slab, so a list of projects never looks stamped from one template.
 */
export function Cover({ variant, no, title, meta, image, className = '' }: Props) {
  const v = variant === 'cta' ? 'cta' : ((variant % COVERS) + COVERS) % COVERS
  if (image) {
    return (
      <div className={`cover cover--photo ${className}`}>
        <img src={image} alt="" />
        <span className="cover__badge">{no}</span>
      </div>
    )
  }
  return (
    <div className={`cover cover--${v} ${className}`}>
      <span className="cover__slab" />
      <span className="cover__dot" />
      <span className="cover__no">{no}</span>
      <span className="cover__foot">
        <span className="cover__meta">{meta}</span>
        <span className="cover__title">{title}</span>
      </span>
    </div>
  )
}
