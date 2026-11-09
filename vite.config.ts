import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base: the build works at any GitHub Pages path (user site or /<repo>/).
export default defineConfig({ base: './', plugins: [react()] })
