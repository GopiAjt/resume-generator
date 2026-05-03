import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Remove devtools from production build
    process.env.NODE_ENV === 'development' ? vueDevTools() : []
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // Minification and optimization
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Strategic code splitting
        manualChunks: {
          'pdf-extraction': ['pdfjs-dist'],
          'doc-extraction': ['mammoth'],
          'markdown': ['marked'],
          'vendor': ['vue', 'vue-router', 'pinia']
        }
      }
    }
  }
})
