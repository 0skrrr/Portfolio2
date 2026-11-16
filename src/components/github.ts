/** Public GitHub profile data for the hover card. Only the fields the card shows. */
export type GithubProfile = {
  login: string
  name: string | null
  avatar: string
  bio: string | null
  repoCount: number
  followers: number
  repos: { name: string; language: string | null }[]
}

const API = 'https://api.github.com'
const RECENT_REPOS = 4
const USERNAME = /^[a-z\d](?:[a-z\d-]{0,38})$/i

/** `https://github.com/someone` (or `/someone/repo`) → `someone`; anything else → null. */
export function githubUser(href: string): string | null {
  let url: URL
  try {
    url = new URL(href)
  } catch {
    return null
  }
  if (url.hostname !== 'github.com' && url.hostname !== 'www.github.com') return null
  const user = url.pathname.split('/')[1] ?? ''
  return USERNAME.test(user) ? user : null
}

const str = (v: unknown) => (typeof v === 'string' ? v : null)
const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : 0)

/** The API response is external input: keep only well-typed fields, reject anything without a login. */
export function parseProfile(user: unknown, repos: unknown): GithubProfile | null {
  if (typeof user !== 'object' || user === null) return null
  const u = user as Record<string, unknown>
  const login = str(u.login)
  const avatar = str(u.avatar_url)
  if (!login || !avatar?.startsWith('https://')) return null
  const list = Array.isArray(repos) ? repos : []
  return {
    login,
    avatar,
    name: str(u.name),
    bio: str(u.bio),
    repoCount: num(u.public_repos),
    followers: num(u.followers),
    repos: list
      .filter((r): r is Record<string, unknown> => typeof r === 'object' && r !== null && typeof r.name === 'string')
      .slice(0, RECENT_REPOS)
      .map((r) => ({ name: r.name as string, language: str(r.language) })),
  }
}

// Unauthenticated API calls are limited to 60 an hour per visitor, so each profile is fetched once per tab.
const cache = new Map<string, Promise<GithubProfile | null>>()

export function loadProfile(user: string): Promise<GithubProfile | null> {
  const hit = cache.get(user)
  if (hit) return hit
  const get = (path: string) => fetch(`${API}${path}`).then((r) => (r.ok ? r.json() : null))
  const p = Promise.all([get(`/users/${user}`), get(`/users/${user}/repos?sort=pushed&per_page=${RECENT_REPOS}&type=owner`)])
    .then(([u, r]) => parseProfile(u, r))
    .catch(() => null)
  cache.set(user, p)
  return p
}
