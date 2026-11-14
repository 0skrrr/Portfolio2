import type { Dict } from './i18n'

/** Public-folder URL that works at the domain root and under a GitHub Pages subpath. */
export const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`

/*
  Structure only: ids, order, links, images and layout. Every word the visitor reads lives in
  src/i18n/en.json under the same id. The id types below come from that file, so a typo here
  (or a missing entry there) fails the type check instead of rendering a blank.
*/
export type SocialId = keyof Dict['home']['socials']
export type SoftwareId = keyof Dict['software']['items']
export type SoftwareCategory = keyof Dict['software']['categories']
export type SkillId = keyof Dict['skillset']['items']
export type ProjectId = keyof Dict['projects']['items']
export type FriendId = keyof Dict['education']['friends']
export type Relation = keyof Dict['education']['relations']

export const profile = { email: 'kopcil.oskar@gmail.com' }

export const socials: { id: SocialId; href: string; icon: string }[] = [
  { id: 'discord', href: '#', icon: asset('social1.svg') },
  { id: 'email', href: `mailto:${profile.email}`, icon: asset('social3.svg') },
  { id: 'linkedin', href: '#', icon: asset('social2.svg') },
  { id: 'github', href: 'https://github.com/0skrrr', icon: asset('github.svg') },
]

/**
 * `top` is the label's vertical centre in % of the panel; the first row starts on the left so its guide
 * line doesn't run through the minimap. `tools` are shown in the hover card. Set `image` (e.g.
 * asset('skills/video.jpg')) to show a photo in the card instead.
 */
export const skills: { id: SkillId; side: 'left' | 'right'; top: number; tools: SoftwareId[]; image?: string }[] = [
  { id: 'video', side: 'left', top: 12, tools: ['davinci', 'photoshop'] },
  { id: 'webDesign', side: 'right', top: 27, tools: ['figma', 'react', 'javascript', 'webstorm'] },
  { id: 'backend', side: 'left', top: 42, tools: ['php', 'mysql', 'java', 'csharp', 'datagrip'] },
  { id: 'uiux', side: 'right', top: 57, tools: ['figma', 'illustrator'] },
  { id: 'branding', side: 'left', top: 72, tools: ['illustrator', 'photoshop'] },
  { id: 'photography', side: 'right', top: 87, tools: ['lightroom', 'photoshop'] },
]

/** Cover compositions (see components/Cover.tsx). Projects pick one by position unless `cover` is set. */
export const COVERS = 5

export type Project = {
  id: ProjectId
  /** Live site / repo. */
  href?: string
  /** Cover photo for the preview and case study. Without one, a generated typographic cover is used. */
  image?: string
  /** Case-study gallery; only rendered when it has images. */
  gallery?: string[]
  /** Force a cover composition (0–4). */
  cover?: number
}

export const projects: Project[] = [
  { id: 'hexe', href: 'https://github.com/0skrrr' },
  { id: 'portfolio', href: 'https://github.com/0skrrr' },
  { id: 'northline' },
  { id: 'fieldNotes' },
  { id: 'afterglow' },
]

/** Classmates & friends orbiting the Education card. Leave `avatar` empty for an initials badge; links are optional. */
export const friends: { id: FriendId; relation: Relation; github?: string; portfolio?: string; avatar?: string }[] = [
  { id: 'adam', relation: 'classmate' },
  { id: 'tereza', relation: 'classmate' },
  { id: 'jakub', relation: 'classmate' },
  { id: 'ema', relation: 'friend' },
  { id: 'matej', relation: 'classmate' },
  { id: 'klara', relation: 'friend' },
]

export const softwareCategories: SoftwareCategory[] = ['languages', 'ides', 'design', 'media', 'tools']

const L = (f: string) => asset(`logos/${f}`)
/** `core: true` marks your daily drivers — they get the accent marker. */
export const software: { id: SoftwareId; logo: string; cat: SoftwareCategory; core?: boolean }[] = [
  { id: 'javascript', core: true, logo: L('javascript.png'), cat: 'languages' },
  { id: 'react', core: true, logo: L('react.png'), cat: 'languages' },
  { id: 'csharp', logo: L('csharp.png'), cat: 'languages' },
  { id: 'java', logo: L('java.png'), cat: 'languages' },
  { id: 'php', logo: L('php.png'), cat: 'languages' },
  { id: 'mysql', logo: L('mysql.png'), cat: 'languages' },
  { id: 'webstorm', core: true, logo: L('webstorm.png'), cat: 'ides' },
  { id: 'intellij', logo: L('intellij.png'), cat: 'ides' },
  { id: 'rider', logo: L('rider.png'), cat: 'ides' },
  { id: 'pycharm', logo: L('pycharm.png'), cat: 'ides' },
  { id: 'datagrip', logo: L('datagrip.png'), cat: 'ides' },
  { id: 'figma', core: true, logo: L('figma.svg'), cat: 'design' },
  { id: 'photoshop', core: true, logo: L('photoshop.png'), cat: 'design' },
  { id: 'illustrator', logo: L('illustrator.png'), cat: 'design' },
  { id: 'aseprite', logo: L('aseprite.png'), cat: 'design' },
  { id: 'fusion', logo: L('fusion.png'), cat: 'design' },
  { id: 'lightroom', logo: L('lightroom.png'), cat: 'media' },
  { id: 'davinci', logo: L('davinci.png'), cat: 'media' },
  { id: 'unity', logo: L('unity.png'), cat: 'tools' },
  { id: 'github', logo: L('github.png'), cat: 'tools' },
  { id: 'notion', logo: L('notion.png'), cat: 'tools' },
  { id: 'discord', logo: L('discord.png'), cat: 'tools' },
  { id: 'vivaldi', logo: L('vivaldi.png'), cat: 'tools' },
]
export const logoOf = Object.fromEntries(software.map((s) => [s.id, s.logo])) as Record<SoftwareId, string>
