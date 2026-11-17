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
export type Preview = 'github' | 'site' | 'spotify'
/** Screenshot service for `site` previews; the page URL is appended. */
export const SCREENSHOT_SERVICE = 'https://image.thum.io/get/width/720/crop/900/noanimate/'

/**
 * `top` is the label's vertical centre in % of the panel; the first row starts on the left so its guide
 * line doesn't run through the minimap. `tools` are shown in the hover card. Set `image` (e.g.
 * asset('skills/video.jpg')) to show a photo in the card instead.
 */
export const skills: { id: SkillId; side: 'left' | 'right'; top: number; tools: SoftwareId[]; image?: string }[] = [
  { id: 'appDesign', side: 'left', top: 10, tools: ['figma', 'figjam', 'affinity'] },
  { id: 'webDesign', side: 'right', top: 23, tools: ['figma', 'react', 'typescript', 'scss', 'webstorm'] },
  { id: 'gameDesign', side: 'left', top: 36, tools: ['unity', 'csharp', 'rider', 'aseprite', 'blender', 'graphite'] },
  { id: 'uiux', side: 'right', top: 49, tools: ['figma', 'figjam', 'kumu'] },
  { id: 'backend', side: 'left', top: 62, tools: ['php', 'mysql', 'python', 'java', 'phpstorm', 'datagrip'] },
  { id: 'branding', side: 'right', top: 75, tools: ['affinity', 'figma', 'illustrator'] },
  { id: 'photoVideo', side: 'left', top: 88, tools: ['davinci', 'lightroom', 'affinity', 'photoshop'] },
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
  /** Portrait (4:5) screenshot revealed in the project list's preview; defaults to the first gallery image. */
  preview?: string
  /** Force a cover composition (0–4). */
  cover?: number
  /** Software used, linked from the Software panel's trace. */
  tools?: SoftwareId[]
  /** Collaborators, named from the Education panel's friends. */
  team?: FriendId[]
}

export const projects: Project[] = [
  { id: 'hearby', href: 'https://github.com/0skrrr/HearBy', tools: ['figjam', 'typescript', 'tauri', 'figma', 'webstorm', 'github'], gallery: [1, 2, 3].map((n) => asset(`projects/hearby-${n}.jpg`)), preview: asset('projects/hearby-preview.jpg'), team: ['kriztov', 'adris'] },
  { id: 'predichess', href: 'https://0skrrr.github.io/Predichess/', tools: ['react', 'typescript', 'mysql', 'webstorm', 'github'], gallery: [1, 2, 3].map((n) => asset(`projects/predichess-${n}.jpg`)), preview: asset('projects/predichess-preview.jpg') },
  { id: 'graphite', href: 'https://github.com/0skrrr/graphite-releases', tools: ['graphite', 'react', 'typescript', 'tauri', 'figma', 'webstorm', 'github'], gallery: [1, 2, 3].map((n) => asset(`projects/graphite-${n}.jpg`)), preview: asset('projects/graphite-preview.jpg') },
  { id: 'portfolio', href: 'https://github.com/0skrrr', tools: ['react', 'typescript', 'figma', 'webstorm', 'github'] },
  { id: 'afterglow', tools: ['davinci', 'lightroom', 'affinity', 'photoshop'] },
]

/**
 * Classmates & friends orbiting the Education card. `avatar` falls back to the GitHub profile picture, then to an initials badge.
 * Links are optional: `github` gets a profile card on hover, `linkedin` and `instagram` plain links, `spotify` an embedded player, `portfolio` a screenshot of the site (`portfolioShot` replaces it with a stored image).
 */
export const friends: { id: FriendId; relation: Relation; github?: string; linkedin?: string; instagram?: string; spotify?: string; portfolio?: string; portfolioShot?: string; avatar?: string }[] = [
  { id: 'adris', relation: 'classmate', github: 'https://github.com/adris-h', portfolio: 'https://adris.dev', portfolioShot: asset('shots/adris.jpg') },
  { id: 'izitaooo', relation: 'classmate', github: 'https://github.com/Izitaooo', portfolio: 'https://izitaooo.github.io/Portfolio-2025/', portfolioShot: asset('shots/izitaooo.jpg') },
  { id: 'kriztov', relation: 'classmate', github: 'https://github.com/kriztovv', portfolio: 'https://kriztovv.github.io/portfolio/', portfolioShot: asset('shots/kriztov.jpg') },
  { id: 'casualNpc', relation: 'classmate', github: 'https://github.com/the-casual-npc', portfolio: 'https://the-casual-npc.github.io/Portfolio/', portfolioShot: asset('shots/casualNpc.jpg') },
  { id: 'tomio', relation: 'classmate', github: 'https://github.com/TomioMan', portfolio: 'https://tomioman.github.io/Portfolio/', portfolioShot: asset('shots/tomio.jpg') },
  { id: 'justPurple', relation: 'friend', github: 'https://github.com/JustPurpleCZ', portfolio: 'https://justpurplecz.github.io/justpurple/' },
  { id: 'davidHrb', relation: 'friend', github: 'https://github.com/David-Hrb', portfolio: 'https://www.davidhrbacek.dev/en' },
  { id: 'dravlix', relation: 'friend', github: 'https://github.com/Dravlix', portfolio: 'https://tomecek.dev' },
  { id: 'maxikbe', relation: 'friend', github: 'https://github.com/maxikbe', portfolio: 'https://belunekmax.me' },
  { id: 'vojtaucz', relation: 'friend', github: 'https://github.com/vojtaucz', portfolio: 'https://vojtaucz.github.io/Portfolio/' },
  { id: 'asphinals', relation: 'friend', instagram: 'https://www.instagram.com/asphinals/', spotify: 'https://open.spotify.com/artist/6gclKPlpzyCCAzYaGDkgBX', avatar: 'https://image-cdn-ak.spotifycdn.com/image/ab67616100005174e0a3fff80adf3cbe7977c7f2' },
]

/** The Software panel reads left to right as the way work moves: plan → design & media → build → ship. */
export const softwareStages: SoftwareStage[] = ['plan', 'create', 'build', 'ship']

const L = (f: string) => asset(`logos/${f}`)
/**
 * `stage` places a tool in the pipeline (`offscreen` = hobby tools, listed under `hobbies` only); order within a stage = order here.
 * `core` marks daily drivers (accent dot), `group` splits Build into languages and apps,
 * `wordmark` crops a wide logo to its mark.
 */
export type SoftwareGroup = keyof Dict['software']['groups']
export const software: { id: SoftwareId; logo: string; stage: SoftwareStage | 'offscreen'; group?: SoftwareGroup; core?: boolean; wordmark?: boolean }[] = [
  { id: 'figjam', logo: L('figma.svg'), stage: 'plan' },
  { id: 'notion', logo: L('notion.png'), stage: 'plan' },
  { id: 'discord', core: true, logo: L('discord.png'), stage: 'plan' },
  { id: 'kumu', logo: L('kumu.png'), stage: 'plan' },
  { id: 'graphite', core: true, logo: L('graphite.svg'), stage: 'plan' },
  { id: 'figma', core: true, logo: L('figma.svg'), stage: 'create' },
  { id: 'affinity', core: true, logo: L('affinity.png'), stage: 'create' },
  { id: 'blender', logo: L('blender.svg'), stage: 'create' },
  { id: 'fusion', logo: L('fusion.png'), stage: 'create' },
  { id: 'aseprite', logo: L('aseprite.png'), stage: 'create' },
  { id: 'lightroom', logo: L('lightroom.png'), stage: 'create' },
  { id: 'photoshop', logo: L('photoshop.png'), stage: 'create' },
  { id: 'illustrator', logo: L('illustrator.png'), stage: 'create' },
  { id: 'davinci', logo: L('davinci.png'), stage: 'create' },
  { id: 'javascript', logo: L('javascript.png'), stage: 'build', group: 'languages' },
  { id: 'typescript', core: true, logo: L('typescript.svg'), stage: 'build', group: 'languages' },
  { id: 'react', core: true, logo: L('react.png'), stage: 'build', group: 'languages' },
  { id: 'scss', logo: L('scss.svg'), stage: 'build', group: 'languages' },
  { id: 'csharp', logo: L('csharp.png'), stage: 'build', group: 'languages' },
  { id: 'cpp', logo: L('cpp.svg'), stage: 'build', group: 'languages' },
  { id: 'java', logo: L('java.png'), stage: 'build', group: 'languages' },
  { id: 'php', logo: L('php.png'), stage: 'build', group: 'languages' },
  { id: 'python', logo: L('python.svg'), stage: 'build', group: 'languages' },
  { id: 'mysql', logo: L('mysql.png'), stage: 'build', group: 'languages' },
  { id: 'webstorm', core: true, logo: L('webstorm.png'), stage: 'build', group: 'apps' },
  { id: 'phpstorm', logo: L('phpstorm.svg'), stage: 'build', group: 'apps' },
  { id: 'intellij', logo: L('intellij.png'), stage: 'build', group: 'apps' },
  { id: 'rider', logo: L('rider.png'), stage: 'build', group: 'apps' },
  { id: 'pycharm', logo: L('pycharm.png'), stage: 'build', group: 'apps' },
  { id: 'datagrip', logo: L('datagrip.png'), stage: 'build', group: 'apps' },
  { id: 'unity', logo: L('unity.png'), stage: 'build', group: 'apps', wordmark: true },
  { id: 'github', core: true, logo: L('github.png'), stage: 'ship' },
  { id: 'tauri', logo: L('tauri.svg'), stage: 'ship' },
  { id: 'vivaldi', core: true, logo: L('vivaldi.png'), stage: 'ship' },
  { id: 'prusaslicer', logo: L('prusaslicer.png'), stage: 'offscreen' },
]

export type PlatformId = keyof Dict['software']['platforms']['items']
export const platforms: PlatformId[] = ['web', 'windows', 'macos', 'linux', 'android', 'ios']

export type HobbyId = keyof Dict['software']['hobbies']['items']
export const hobbies: { id: HobbyId; tools: SoftwareId[] }[] = [
  { id: 'printing', tools: ['fusion', 'prusaslicer'] },
  { id: 'fpv', tools: [] },
]
export const logoOf = Object.fromEntries(software.map((s) => [s.id, s.logo])) as Record<SoftwareId, string>

export const schoolSites: Record<string, string> = {
  chc: 'https://creativehill.cz',
  '2ika': 'https://2ika.edupage.org',
}
