export type Dir = 'up' | 'down' | 'left' | 'right'
export type SectionId = 'home' | 'software' | 'skillset' | 'projects' | 'education'

/** Grid position of each screen, matching the Figma layout around the hub. */
export const POS: Record<SectionId, { x: number; y: number }> = {
  home: { x: 0, y: 0 },
  software: { x: 0, y: -1 },
  skillset: { x: 0, y: 1 },
  projects: { x: -1, y: 0 },
  education: { x: 1, y: 0 },
}

const DELTA: Record<Dir, { x: number; y: number }> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

export function neighbour(from: SectionId, dir: Dir): SectionId | null {
  const p = POS[from]
  const t = { x: p.x + DELTA[dir].x, y: p.y + DELTA[dir].y }
  const hit = (Object.keys(POS) as SectionId[]).find((k) => POS[k].x === t.x && POS[k].y === t.y)
  return hit ?? null
}
