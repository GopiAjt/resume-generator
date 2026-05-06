import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Remove devtools from production build
    process.env.NODE_ENV === 'development' ? vueDevTools() : [],
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // jsPDF bundles html2canvas as an optional dep for its .html() method.
      // We never call jsPDF.html(), so stub it out to save ~200 KB.
      html2canvas: fileURLToPath(
        new URL('./src/utils/html2canvasStub.ts', import.meta.url),
      ),
    },
  },
  build: {
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Function form: Rollup passes the resolved module ID so the match is reliable.
        manualChunks(id) {
          if (id.includes('pdfjs-dist') || id.includes('tesseract')) {
            return 'pdf-extraction'
          }
          if (id.includes('mammoth')) {
            return 'doc-extraction'
          }
          if (id.includes('marked')) {
            return 'markdown'
          }
          if (
            id.includes('node_modules/vue') ||
            id.includes('node_modules/vue-router') ||
            id.includes('node_modules/pinia')
          ) {
            return 'vendor'
          }
        },
      },
    },
  },
})

