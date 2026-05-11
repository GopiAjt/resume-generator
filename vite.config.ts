import { fileURLToPath, URL } from 'node:url'

import { defineConfig, type UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const routeSeo: Record<string, { title: string; description: string }> = {
  '/': {
    title: 'ResumeGen - Free AI Resume Optimizer and ATS Resume Builder',
    description:
      'Optimize your resume for any job description with AI. Compare ATS keyword scores, tailor bullet points, and download a polished PDF or DOC resume for free.',
  },
  '/create-resume': {
    title: 'Create a Tailored Resume - Free AI Resume Optimizer | ResumeGen',
    description:
      'Upload your resume, paste a job description, and generate a tailored ATS-friendly resume with AI. Download your optimized resume as PDF or DOC.',
  },
  '/about': {
    title: 'About ResumeGen - AI Resume Optimizer',
    description:
      'Learn how ResumeGen helps job seekers tailor resumes to job descriptions with ATS-friendly formatting, AI keyword matching, and privacy-conscious file parsing.',
  },
  '/privacy': {
    title: 'Privacy Policy - ResumeGen',
    description:
      'Read how ResumeGen handles resume text, job descriptions, browser-based file parsing, analytics, and AI processing with Google Gemini.',
  },
  '/terms': {
    title: 'Terms of Service - ResumeGen',
    description:
      'Review the terms for using ResumeGen, including AI-generated resume content, user responsibilities, export options, and service limitations.',
  },
}

const siteUrl = 'https://www.resumegen.pro'
const previewImage = `${siteUrl}/og-image.png`

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

const replaceTagContent = (html: string, pattern: RegExp, replacement: string) =>
  pattern.test(html) ? html.replace(pattern, replacement) : html

const applyRouteHead = (route: string, html: string) => {
  const normalizedRoute = route === '' ? '/' : route
  const meta = routeSeo[normalizedRoute] || routeSeo['/']!
  const canonical = `${siteUrl}${normalizedRoute === '/' ? '/' : normalizedRoute}`
  const title = escapeHtml(meta.title)
  const description = escapeHtml(meta.description)

  return [
    [/<title>.*?<\/title>/, `<title>${title}</title>`],
    [/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${canonical}">`],
    [/<meta name="title" content="[^"]*">/, `<meta name="title" content="${title}">`],
    [/<meta name="description" content="[^"]*">/, `<meta name="description" content="${description}">`],
    [/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${canonical}">`],
    [/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${title}">`],
    [
      /<meta property="og:description" content="[^"]*">/,
      `<meta property="og:description" content="${description}">`,
    ],
    [/<meta property="og:image" content="[^"]*">/, `<meta property="og:image" content="${previewImage}">`],
    [
      /<meta property="twitter:url" content="[^"]*">/,
      `<meta property="twitter:url" content="${canonical}">`,
    ],
    [
      /<meta property="twitter:title" content="[^"]*">/,
      `<meta property="twitter:title" content="${title}">`,
    ],
    [
      /<meta property="twitter:description" content="[^"]*">/,
      `<meta property="twitter:description" content="${description}">`,
    ],
    [
      /<meta property="twitter:image" content="[^"]*">/,
      `<meta property="twitter:image" content="${previewImage}">`,
    ],
  ].reduce((updatedHtml, [pattern, replacement]) => {
    return replaceTagContent(updatedHtml, pattern as RegExp, replacement as string)
  }, html)
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // Remove devtools from production build
    process.env.NODE_ENV === 'development' ? vueDevTools() : [],
  ],
  ssgOptions: {
    dirStyle: 'nested',
    onPageRendered(route: string, html: string) {
      return applyRouteHead(route, html)
    },
  },
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
} as UserConfig & { ssgOptions: { dirStyle: 'nested' } })
