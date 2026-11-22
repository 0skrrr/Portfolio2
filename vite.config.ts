import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import en from './src/i18n/en.json'

/** Fills {{meta.title}}-style placeholders in index.html from the English dictionary, so crawlers and link previews get the same text as the app. */
function htmlText(): Plugin {
  const lookup = (path: string) => path.split('.').reduce<unknown>((o, k) => (o as Record<string, unknown> | undefined)?.[k], en)
  const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
  return {
    name: 'i18n-html',
    transformIndexHtml: {
      order: 'pre',
      handler: (html) =>
        html.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, path: string) => {
          const v = lookup(path)
          if (typeof v !== 'string') throw new Error(`index.html: "${path}" is not a string in src/i18n/en.json`)
          return escape(v)
        }),
    },
  }
}

/** Writes absolute share-image URLs from SITE_URL (set in the deploy workflow); without it, the og:image tags are dropped. */
function siteUrl(): Plugin {
  const url = process.env.SITE_URL?.trim()
  return {
    name: 'site-url',
    generateBundle() {
      if (!url) return
      const base = url.endsWith('/') ? url : `${url}/`
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `User-agent: *\nAllow: /\n\nSitemap: ${base}sitemap.xml\n` })
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}</loc></url></urlset>\n`,
      })
    },
    transformIndexHtml: (html) =>
      url ? html.replaceAll('%SITE_URL%', url.endsWith('/') ? url : `${url}/`) : html.replace(/^.*%SITE_URL%.*\n/gm, ''),
  }
}

// Relative base: the build works at any GitHub Pages path (user site or /<repo>/).
export default defineConfig({ base: './', plugins: [htmlText(), siteUrl(), react()] })
