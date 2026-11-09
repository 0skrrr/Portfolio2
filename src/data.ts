// Edit your content here — the sections read from this file.

export const socials = [
  { label: 'Discord', href: '#', icon: '/assets/social1.svg' },
  { label: 'Email', href: 'mailto:kopcil.oskar@gmail.com', icon: '/assets/social3.svg' },
  { label: 'LinkedIn', href: '#', icon: '/assets/social2.svg' },
  { label: 'GitHub', href: 'https://github.com/0skrrr', icon: '/assets/github.svg' },
]

export const skills = [
  { name: 'Video', side: 'right', top: 4 },
  { name: 'Web Design', side: 'left', top: 18 },
  { name: 'Backend', side: 'right', top: 33 },
  { name: 'UI / UX', side: 'left', top: 48 },
  { name: 'Branding', side: 'right', top: 63 },
  { name: 'Photography', side: 'left', top: 78 },
] as const

export type Project = { title: string; tag: string; description: string; image?: string; href?: string }

export const projects: Project[] = [
  { title: 'Project Hexe', tag: 'Code Hexe', description: 'Short description of the project — what it is, your role and the tools used.', image: '/assets/silhouette.png' },
  { title: 'Project Two', tag: 'Web', description: 'Short description of the project.', image: '/assets/silhouette.png' },
  { title: 'Project Three', tag: 'Branding', description: 'Short description of the project.', image: '/assets/silhouette.png' },
  { title: 'Project Four', tag: 'Photo', description: 'Short description of the project.', image: '/assets/silhouette.png' },
  { title: 'Project Five', tag: 'Video', description: 'Short description of the project.', image: '/assets/silhouette.png' },
  { title: 'Your project?', tag: 'Your', description: 'Have an idea? Get in touch and let’s build it together.' },
]

export const education = [
  { years: '20XX — 20XX', school: 'School name', field: 'Field of study' },
  { years: '20XX — 20XX', school: 'School name', field: 'Field of study' },
]

/** Software grid from Figma (10 cols × 7 rows). `c`/`r` = column/row, `s` = span. Squares without a logo are decorative. */
type Tile = { c: number; r: number; s?: number; logo?: string; name?: string; fill?: 'dark' | 'outline' }
const L = (f: string) => `/assets/logos/${f}`
export const software: Tile[] = [
  { c: 1, r: 1, s: 2, logo: L('vivaldi.png'), name: 'Vivaldi' },
  { c: 3, r: 1, fill: 'dark' }, { c: 4, r: 1, logo: L('fusion.png'), name: 'Fusion 360' },
  { c: 5, r: 1, fill: 'outline' }, { c: 6, r: 1, logo: L('photoshop.png'), name: 'Photoshop' },
  { c: 7, r: 1, fill: 'dark' }, { c: 8, r: 1, logo: L('intellij.png'), name: 'IntelliJ IDEA' },
  { c: 9, r: 1, logo: L('react.png'), name: 'React' },
  { c: 3, r: 2, fill: 'dark' }, { c: 4, r: 2, logo: L('github.png'), name: 'GitHub' },
  { c: 5, r: 2, logo: L('csharp.png'), name: 'C#' }, { c: 6, r: 2, logo: L('aseprite.png'), name: 'Aseprite' },
  { c: 7, r: 2, logo: L('mysql.png'), name: 'MySQL' }, { c: 8, r: 2, s: 2, logo: L('webstorm.png'), name: 'WebStorm' },
  { c: 2, r: 3, logo: L('davinci.png'), name: 'DaVinci Resolve' }, { c: 3, r: 3, logo: L('discord.png'), name: 'Discord' },
  { c: 4, r: 3, fill: 'outline' }, { c: 5, r: 3, fill: 'dark' }, { c: 10, r: 3, fill: 'dark' },
  { c: 2, r: 4, fill: 'outline' }, { c: 10, r: 4, logo: L('datagrip.png'), name: 'DataGrip' },
  { c: 1, r: 5, fill: 'dark' }, { c: 2, r: 5, logo: L('javascript.png'), name: 'JavaScript' },
  { c: 3, r: 5, logo: L('rider.png'), name: 'Rider' }, { c: 4, r: 5, s: 2, logo: L('figma.svg'), name: 'Figma' },
  { c: 6, r: 5, fill: 'outline' }, { c: 7, r: 5, fill: 'outline' }, { c: 8, r: 5, logo: L('notion.png'), name: 'Notion' },
  { c: 9, r: 5, fill: 'dark' }, { c: 10, r: 5, fill: 'outline' },
  { c: 2, r: 6, logo: L('lightroom.png'), name: 'Lightroom' }, { c: 3, r: 6, fill: 'outline' },
  { c: 6, r: 6, logo: L('java.png'), name: 'Java' }, { c: 7, r: 6, fill: 'dark' }, { c: 8, r: 6, fill: 'dark' },
  { c: 9, r: 6, logo: L('illustrator.png'), name: 'Illustrator' }, { c: 10, r: 6, fill: 'outline' },
  { c: 1, r: 7, fill: 'outline' }, { c: 2, r: 7, logo: L('php.png'), name: 'PHP' },
  { c: 3, r: 7, logo: L('unity.png'), name: 'Unity' }, { c: 7, r: 7, fill: 'outline' },
  { c: 8, r: 7, logo: L('pycharm.png'), name: 'PyCharm' },
]
