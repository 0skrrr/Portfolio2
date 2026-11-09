/** Public-folder URL that works at the domain root and under a GitHub Pages subpath. */
export const asset = (p: string) => `${import.meta.env.BASE_URL}assets/${p}`

// Edit your content here — the sections read from this file.

export const socials = [
  { label: 'Discord', href: '#', icon: asset('social1.svg') },
  { label: 'Email', href: 'mailto:kopcil.oskar@gmail.com', icon: asset('social3.svg') },
  { label: 'LinkedIn', href: '#', icon: asset('social2.svg') },
  { label: 'GitHub', href: 'https://github.com/0skrrr', icon: asset('github.svg') },
]

/** `image` slides in on the opposite side when the skill is hovered. Drop files in public/assets/skills/ and set image: asset('skills/name.jpg'). */
export const skills: { name: string; side: 'left' | 'right'; top: number; image?: string }[] = [
  { name: 'Video', side: 'right', top: 4, image: undefined },
  { name: 'Web Design', side: 'left', top: 18, image: undefined },
  { name: 'Backend', side: 'right', top: 33, image: undefined },
  { name: 'UI / UX', side: 'left', top: 48, image: undefined },
  { name: 'Branding', side: 'right', top: 63, image: undefined },
  { name: 'Photography', side: 'left', top: 78, image: undefined },
]

export type Project = { title: string; tag: string; description: string; image?: string; href?: string }

export const projects: Project[] = [
  { title: 'Project Hexe', tag: 'Code Hexe', description: 'Short description of the project — what it is, your role and the tools used.', image: asset('silhouette.png') },
  { title: 'Project Two', tag: 'Web', description: 'Short description of the project.', image: asset('silhouette.png') },
  { title: 'Project Three', tag: 'Branding', description: 'Short description of the project.', image: asset('silhouette.png') },
  { title: 'Project Four', tag: 'Photo', description: 'Short description of the project.', image: asset('silhouette.png') },
  { title: 'Project Five', tag: 'Video', description: 'Short description of the project.', image: asset('silhouette.png') },
  { title: 'Your project?', tag: 'Your', description: 'Have an idea? Get in touch and let’s build it together.' },
]

export const education = [
  { years: '20XX — 20XX', school: 'School name', field: 'Field of study' },
  { years: '20XX — 20XX', school: 'School name', field: 'Field of study' },
]

export type Friend = { name: string; role: string; github?: string; portfolio?: string; avatar?: string }

/** Friends shown around the Education title. Leave `avatar` empty for an initials placeholder. */
export const friends: Friend[] = [
  { name: 'Friend One', role: 'Frontend dev', github: 'https://github.com/', portfolio: 'https://example.com' },
  { name: 'Friend Two', role: 'Designer', github: 'https://github.com/', portfolio: 'https://example.com' },
  { name: 'Friend Three', role: 'Backend dev', github: 'https://github.com/', portfolio: 'https://example.com' },
  { name: 'Friend Four', role: 'Game dev', github: 'https://github.com/', portfolio: 'https://example.com' },
  { name: 'Friend Five', role: 'Photographer', github: 'https://github.com/', portfolio: 'https://example.com' },
  { name: 'Friend Six', role: 'Full-stack', github: 'https://github.com/', portfolio: 'https://example.com' },
]

export const softwareCategories = ['Languages', 'IDEs', 'Design', 'Media', 'Tools'] as const
export type SoftwareCategory = (typeof softwareCategories)[number]

const L = (f: string) => asset(`logos/${f}`)
export const software: { name: string; logo: string; cat: SoftwareCategory }[] = [
  { name: 'JavaScript', logo: L('javascript.png'), cat: 'Languages' },
  { name: 'React', logo: L('react.png'), cat: 'Languages' },
  { name: 'C#', logo: L('csharp.png'), cat: 'Languages' },
  { name: 'Java', logo: L('java.png'), cat: 'Languages' },
  { name: 'PHP', logo: L('php.png'), cat: 'Languages' },
  { name: 'MySQL', logo: L('mysql.png'), cat: 'Languages' },
  { name: 'WebStorm', logo: L('webstorm.png'), cat: 'IDEs' },
  { name: 'IntelliJ IDEA', logo: L('intellij.png'), cat: 'IDEs' },
  { name: 'Rider', logo: L('rider.png'), cat: 'IDEs' },
  { name: 'PyCharm', logo: L('pycharm.png'), cat: 'IDEs' },
  { name: 'DataGrip', logo: L('datagrip.png'), cat: 'IDEs' },
  { name: 'Figma', logo: L('figma.svg'), cat: 'Design' },
  { name: 'Photoshop', logo: L('photoshop.png'), cat: 'Design' },
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
