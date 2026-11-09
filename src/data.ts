/** Public-folder URL that works at the domain root and under a GitHub Pages subpath. */
export const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`

// Edit your content here — the sections read from this file.


/** Hero + persistent chrome. Placeholder copy — make it yours. */
export const profile = {
  role: 'Designer & developer',
  status: 'Open to new projects',
  email: 'kopcil.oskar@gmail.com',
}

export const socials = [
  { label: 'Discord', href: '#', icon: asset('social1.svg') },
  { label: 'Email', href: `mailto:${profile.email}`, icon: asset('social3.svg') },
  { label: 'LinkedIn', href: '#', icon: asset('social2.svg') },
  { label: 'GitHub', href: 'https://github.com/0skrrr', icon: asset('github.svg') },
]

/**
 * `image` slides in on the opposite side when the skill is hovered. Drop files in public/assets/skills/ and set image: asset('skills/name.jpg').
 * `top` is the label's vertical centre in % of the panel. The first row starts on the left so its guide line doesn't run through the minimap.
 */
export const skills: { name: string; side: 'left' | 'right'; top: number; image?: string }[] = [
  { name: 'Video', side: 'left', top: 12, image: undefined },
  { name: 'Web Design', side: 'right', top: 27, image: undefined },
  { name: 'Backend', side: 'left', top: 42, image: undefined },
  { name: 'UI / UX', side: 'right', top: 57, image: undefined },
  { name: 'Branding', side: 'left', top: 72, image: undefined },
  { name: 'Photography', side: 'right', top: 87, image: undefined },
]

export type Project = {
  title: string
  tag: string
  year: string
  role: string
  tools: string[]
  /** One or two sentences: shown in the hover preview and as the case-study lead. */
  summary: string
  /** Extra case-study paragraphs (problem, process, outcome…). */
  body?: string[]
  /** Cover image for the preview + case study. */
  image?: string
  /** Case-study gallery. Empty slots render as labelled placeholders. */
  gallery?: string[]
  /** Live site / repo. */
  href?: string
  /** Call-to-action row instead of a project (opens `href`). */
  cta?: boolean
}

const BODY = [
  'The problem — what needed solving, for whom, and why it mattered.',
  'The process — research, sketches, the decisions you made and the ones you threw away.',
  'The outcome — what shipped, what changed, and what you would do differently next time.',
]

export const projects: Project[] = [
  { title: 'Project Hexe', tag: 'Code', year: '2025', role: 'Design & development', tools: ['React', 'GSAP', 'Figma'], summary: 'Short description of the project — what it is, your role and the tools used.', body: BODY, image: asset('silhouette.png'), href: 'https://github.com/0skrrr' },
  { title: 'Project Two', tag: 'Web', year: '2025', role: 'UI / UX', tools: ['Figma', 'WebStorm'], summary: 'Short description of the project.', body: BODY, image: asset('silhouette.png') },
  { title: 'Project Three', tag: 'Branding', year: '2024', role: 'Identity', tools: ['Illustrator', 'Photoshop'], summary: 'Short description of the project.', body: BODY, image: asset('silhouette.png') },
  { title: 'Project Four', tag: 'Photo', year: '2024', role: 'Photography', tools: ['Lightroom'], summary: 'Short description of the project.', body: BODY, image: asset('silhouette.png') },
  { title: 'Project Five', tag: 'Video', year: '2023', role: 'Edit & grade', tools: ['DaVinci Resolve'], summary: 'Short description of the project.', body: BODY, image: asset('silhouette.png') },
  { title: 'Your project?', tag: 'Let’s talk', year: 'Now', role: '', tools: [], summary: 'Have an idea? Get in touch and let’s build it together.', href: `mailto:${profile.email}`, cta: true },
]

export const education = [
  { years: '20XX — now', school: 'School name', field: 'Field of study' },
  { years: '20XX — 20XX', school: 'Previous school', field: 'Field of study' },
]

/** `relation` is what makes the orbit read right: these are the people you study and build with. */
export type Friend = { name: string; role: string; relation: 'Classmate' | 'Friend'; github?: string; portfolio?: string; avatar?: string }

/** Classmates & friends orbiting the Education card. Leave `avatar` empty for an initials placeholder. */
export const friends: Friend[] = [
  { name: 'Friend One', relation: 'Classmate', role: 'Frontend dev', github: 'https://github.com/', portfolio: 'https://example.com' },
  { name: 'Friend Two', relation: 'Classmate', role: 'Designer', github: 'https://github.com/', portfolio: 'https://example.com' },
  { name: 'Friend Three', relation: 'Classmate', role: 'Backend dev', github: 'https://github.com/', portfolio: 'https://example.com' },
  { name: 'Friend Four', relation: 'Friend', role: 'Game dev', github: 'https://github.com/', portfolio: 'https://example.com' },
  { name: 'Friend Five', relation: 'Classmate', role: 'Photographer', github: 'https://github.com/', portfolio: 'https://example.com' },
  { name: 'Friend Six', relation: 'Friend', role: 'Full-stack', github: 'https://github.com/', portfolio: 'https://example.com' },
]

export const softwareCategories = ['Languages', 'IDEs', 'Design', 'Media', 'Tools'] as const
export type SoftwareCategory = (typeof softwareCategories)[number]

const L = (f: string) => asset(`logos/${f}`)
/** `core: true` marks your daily drivers — they get the accent marker. Placeholder picks: adjust. */
export const software: { name: string; logo: string; cat: SoftwareCategory; core?: boolean }[] = [
  { name: 'JavaScript', core: true, logo: L('javascript.png'), cat: 'Languages' },
  { name: 'React', core: true, logo: L('react.png'), cat: 'Languages' },
  { name: 'C#', logo: L('csharp.png'), cat: 'Languages' },
  { name: 'Java', logo: L('java.png'), cat: 'Languages' },
  { name: 'PHP', logo: L('php.png'), cat: 'Languages' },
  { name: 'MySQL', logo: L('mysql.png'), cat: 'Languages' },
  { name: 'WebStorm', core: true, logo: L('webstorm.png'), cat: 'IDEs' },
  { name: 'IntelliJ IDEA', logo: L('intellij.png'), cat: 'IDEs' },
  { name: 'Rider', logo: L('rider.png'), cat: 'IDEs' },
  { name: 'PyCharm', logo: L('pycharm.png'), cat: 'IDEs' },
  { name: 'DataGrip', logo: L('datagrip.png'), cat: 'IDEs' },
  { name: 'Figma', core: true, logo: L('figma.svg'), cat: 'Design' },
  { name: 'Photoshop', core: true, logo: L('photoshop.png'), cat: 'Design' },
  { name: 'Illustrator', logo: L('illustrator.png'), cat: 'Design' },
  { name: 'Aseprite', logo: L('aseprite.png'), cat: 'Design' },
  { name: 'Fusion 360', logo: L('fusion.png'), cat: 'Design' },
  { name: 'Lightroom', logo: L('lightroom.png'), cat: 'Media' },
  { name: 'DaVinci Resolve', logo: L('davinci.png'), cat: 'Media' },
  { name: 'Unity', logo: L('unity.png'), cat: 'Tools' },
  { name: 'GitHub', logo: L('github.png'), cat: 'Tools' },
  { name: 'Notion', logo: L('notion.png'), cat: 'Tools' },
  { name: 'Discord', logo: L('discord.png'), cat: 'Tools' },
  { name: 'Vivaldi', logo: L('vivaldi.png'), cat: 'Tools' },
]
