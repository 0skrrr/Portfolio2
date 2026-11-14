# Oskar — Portfolio

A spatial portfolio: five panels around a hub, reached with the arrows, the keyboard (arrows / WASD), the wheel or a swipe. React + TypeScript + GSAP, deployed to GitHub Pages on every push to `main`.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
```

## Where things live

| What | File |
| --- | --- |
| **Every word on the site** — UI labels, project case studies, skills, education, friends, page title and meta description | `src/i18n/en.json` |
| Structure — ids, order, links, logos, images, layout positions | `src/data.ts` |
| Styles (one design system, notes at the top) | `src/styles.css` |

`data.ts` and `en.json` are joined by id: `projects` in `data.ts` lists `{ id: 'northline' }`, and its title, summary and sections live under `projects.items.northline` in `en.json`. The ids are typed from the JSON, so a typo or a missing entry fails `npm run build` instead of rendering a blank.

### Add a project

1. `src/data.ts` → add `{ id: 'myProject', href?, image?, gallery? }` to `projects` (order = display order).
2. `src/i18n/en.json` → add `projects.items.myProject` with `title`, `tag`, `year`, `role`, `tools`, `summary` and `sections`.

Without an `image`, the project gets a generated typographic cover; `gallery` images appear in the case study only when there are some.

### Add a language

1. Copy `src/i18n/en.json` to e.g. `src/i18n/cs.json`.
2. Translate the values (keep the keys). Set `meta.lang`, `meta.label` and `meta.short` (`"cs"`, `"Čeština"`, `"CS"`).

That's it: the language switcher appears next to *Contact* as soon as there are two files. Anything you leave out falls back to English, so a translation can be done in stages. Visitors get their browser language automatically, `?lang=cs` forces one, and their choice is remembered.

## Content checklist

Some content is still sample text that reads finished but isn't real yet — replace it in `en.json` (and the links in `data.ts`) before sharing the site widely:

- [ ] Projects `hexe`, `northline`, `fieldNotes`, `afterglow` — titles, summaries and case-study sections (`portfolio` describes this site and is accurate)
- [ ] Education `schools` — years, school names and fields
- [ ] Education `friends` — names and roles; add `github` / `portfolio` links in `data.ts`
- [ ] Social links for Discord and LinkedIn in `data.ts` (currently `#`)
- [ ] Optional: project photos (`image`, `gallery`) and skill photos (`image`) in `public/assets/`
