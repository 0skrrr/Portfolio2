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
export type SoftwareStage = keyof Dict['software']['stages']
export type SkillId = keyof Dict['skillset']['items']
export type ProjectId = keyof Dict['projects']['items']
export type FriendId = keyof Dict['education']['friends']
export type Relation = keyof Dict['education']['relations']

export const profile = { email: 'kopcil.oskar@gmail.com' }

/**
 * `handle` is what the contact drawer shows and copies; a social without one stays out of the drawer
 * (set it once the link is real). `preview: 'github'` shows a GitHub card on hover.
 */
export const socials: { id: SocialId; href: string; icon: string; handle?: string; preview?: Preview }[] = [
  { id: 'discord', href: 'https://discord.com/users/783236003066019882', icon: asset('social1.svg') },
  { id: 'email', href: `mailto:${profile.email}`, icon: asset('social3.svg'), handle: profile.email },
  { id: 'linkedin', href: 'www.linkedin.com/in/oskar-kopčil-b68aa0368', icon: asset('social2.svg') },
  { id: 'github', href: 'https://github.com/0skrrr', icon: asset('github.svg'), handle: 'github.com/0skrrr', preview: 'github' },
]

/** Hover previews for outgoing links: a GitHub profile card, or a screenshot of any other site. */
export type Preview = 'github' | 'site'
/** Screenshot service for `site` previews; the page URL is appended. */
export const SCREENSHOT_SERVICE = 'https://image.thum.io/get/width/720/crop/900/noanimate/'

/**
 * `top` is the label's vertical centre in % of the panel; the first row starts on the left so its guide
 * line doesn't run through the minimap. `tools` are shown in the hover card. Set `image` (e.g.
 * asset('skills/video.jpg')) to show a photo in the card instead.
 */
export const skills: { id: SkillId; side: 'left' | 'right'; top: number; tools: SoftwareId[]; image?: string }[] = [
  { id: 'appDesign', side: 'left', top: 10, tools: ['figma', 'illustrator'] },
  { id: 'webDesign', side: 'right', top: 23, tools: ['figma', 'react', 'javascript', 'webstorm'] },
  { id: 'gameDesign', side: 'left', top: 36, tools: ['unity', 'csharp', 'aseprite'] },
  { id: 'uiux', side: 'right', top: 49, tools: ['figma', 'illustrator'] },
  { id: 'backend', side: 'left', top: 62, tools: ['php', 'mysql', 'java', 'csharp', 'datagrip'] },
  { id: 'branding', side: 'right', top: 75, tools: ['illustrator', 'photoshop'] },
  { id: 'photoVideo', side: 'left', top: 88, tools: ['lightroom', 'davinci', 'photoshop'] },
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
  /** Software used, linked from the Software panel's trace. */
  tools?: SoftwareId[]
}

export const projects: Project[] = [
  { id: 'hexe', href: 'https://github.com/0skrrr', tools: ['unity', 'csharp', 'aseprite', 'rider'] },
  { id: 'portfolio', href: 'https://github.com/0skrrr', tools: ['react', 'javascript', 'figma', 'webstorm', 'github'] },
  { id: 'northline', tools: ['figma', 'illustrator', 'notion'] },
  { id: 'fieldNotes', tools: ['react', 'php', 'mysql', 'datagrip', 'figma'] },
  { id: 'afterglow', tools: ['lightroom', 'davinci', 'photoshop'] },
]

/**
 * Classmates & friends orbiting the Education card. `avatar` falls back to the GitHub profile picture, then to an initials badge.
 * Links are optional: `github` gets a profile card on hover, `linkedin` a plain link, `portfolio` a screenshot of the site (`portfolioShot` replaces it with a stored image).
 */
export const friends: { id: FriendId; relation: Relation; github?: string; linkedin?: string; portfolio?: string; portfolioShot?: string; avatar?: string }[] = [
  { id: 'adris', relation: 'classmate', github: 'https://github.com/adris-h', portfolio: 'https://adris.dev', portfolioShot: asset('shots/adris.jpg') },
  { id: 'izitaooo', relation: 'classmate', github: 'https://github.com/Izitaooo' },
  { id: 'kriztov', relation: 'classmate', github: 'https://github.com/kriztovv' },
  { id: 'casualNpc', relation: 'classmate', github: 'https://github.com/the-casual-npc' },
  { id: 'friend5', relation: 'friend' },
  { id: 'friend6', relation: 'friend' },
]

/** The Software panel reads left to right as the way work moves: plan → design & media → build → ship. */
export const softwareStages: SoftwareStage[] = ['plan', 'create', 'build', 'ship']

const L = (f: string) => asset(`logos/${f}`)
/** `stage` places a tool in the pipeline; order within a stage = order here. `core: true` marks daily drivers (accent dot); `wordmark: true` crops a wide logo to its mark. */
export const software: { id: SoftwareId; logo: string; stage: SoftwareStage; core?: boolean; wordmark?: boolean }[] = [
  { id: 'javascript', core: true, logo: L('javascript.png'), stage: 'build' },
  { id: 'react', core: true, logo: L('react.png'), stage: 'build' },
  { id: 'csharp', logo: L('csharp.png'), stage: 'build' },
  { id: 'java', logo: L('java.png'), stage: 'build' },
  { id: 'php', logo: L('php.png'), stage: 'build' },
  { id: 'mysql', logo: L('mysql.png'), stage: 'build' },
  { id: 'webstorm', core: true, logo: L('webstorm.png'), stage: 'build' },
  { id: 'intellij', logo: L('intellij.png'), stage: 'build' },
  { id: 'rider', logo: L('rider.png'), stage: 'build' },
  { id: 'pycharm', logo: L('pycharm.png'), stage: 'build' },
  { id: 'datagrip', logo: L('datagrip.png'), stage: 'build' },
  { id: 'figma', core: true, logo: L('figma.svg'), stage: 'create' },
  { id: 'photoshop', core: true, logo: L('photoshop.png'), stage: 'create' },
  { id: 'illustrator', logo: L('illustrator.png'), stage: 'create' },
  { id: 'aseprite', logo: L('aseprite.png'), stage: 'create' },
  { id: 'fusion', logo: L('fusion.png'), stage: 'create' },
  { id: 'lightroom', logo: L('lightroom.png'), stage: 'create' },
  { id: 'davinci', logo: L('davinci.png'), stage: 'create' },
  { id: 'unity', logo: L('unity.png'), stage: 'build', wordmark: true },
  { id: 'github', logo: L('github.png'), stage: 'ship' },
  { id: 'notion', logo: L('notion.png'), stage: 'plan' },
  { id: 'discord', logo: L('discord.png'), stage: 'plan' },
  { id: 'vivaldi', logo: L('vivaldi.png'), stage: 'ship' },
]
export const logoOf = Object.fromEntries(software.map((s) => [s.id, s.logo])) as Record<SoftwareId, string>
