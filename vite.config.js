import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from "rollup-plugin-visualizer";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), visualizer({
  //  template: 'network'
  })],
  // Configurar base path para GitHub Pages
  // Use VITE_BASE_PATH para controlar o base path
  // Para GitHub Pages: VITE_BASE_PATH=/roads/ npm run build
  // Para teste local: npm run build (sem variável)
  base: process.env.VITE_BASE_PATH || '/',
  server: {
    port: 8080
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
