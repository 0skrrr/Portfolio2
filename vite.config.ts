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

// Relative base: the build works at any GitHub Pages path (user site or /<repo>/).
export default defineConfig({ base: './', plugins: [htmlText(), react()] })
