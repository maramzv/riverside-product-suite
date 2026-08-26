import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Builds into the shell's public/apps/shelves so it's served same-origin
// alongside the shell, instead of as its own separate deployment.
export default defineConfig({
  plugins: [react()],
  base: '/apps/shelves/',
  build: {
    outDir: '../../public/apps/shelves',
    emptyOutDir: true,
  },
})
