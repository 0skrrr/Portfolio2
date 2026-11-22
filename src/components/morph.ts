export type Glyph = { shown: string; becomes: string | null }

const sharedPrefixLength = (a: string, b: string) => {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) i++
  return i
}

/** Nickname → name as glyph slots: each keeps its letter, rolls to another, or (becomes = null) collapses away. */
export function morphGlyphs(from: string, to: string): Glyph[] {
  const head = sharedPrefixLength(from, to)
  const tail = Math.min(sharedPrefixLength([...from].reverse().join(''), [...to].reverse().join('')), from.length - head, to.length - head)
  const fromMid = [...from.slice(head, from.length - tail)]
  const toMid = [...to.slice(head, to.length - tail)]
  const keep = (c: string): Glyph => ({ shown: c, becomes: c })
  const middle = fromMid.map((c, i): Glyph => ({ shown: c, becomes: i < toMid.length ? toMid[i] : null }))
  const extra = toMid.slice(fromMid.length).map((c): Glyph => ({ shown: '', becomes: c }))
  return [...[...from.slice(0, head)].map(keep), ...middle, ...extra, ...[...from.slice(from.length - tail)].map(keep)]
}
