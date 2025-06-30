import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Ganti "cloud1" dengan nama repo kamu di GitHub
export default defineConfig({
  base: '/cloud1/',
  plugins: [react()]
})
