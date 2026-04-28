# Resume Generator

An AI-powered resume optimization tool that helps you create tailored, ATS-friendly resumes for specific job descriptions. Built with Vue 3, TypeScript, and Google's Gemini AI.

## Features

- **AI-Powered Resume Optimization**: Uses Google Gemini AI to analyze job descriptions and tailor your resume accordingly
- **Multiple File Support**: Upload existing resumes in PDF or DOCX format
- **Manual Entry Option**: Enter resume details manually via a comprehensive form
- **ATS-Friendly Output**: Generates resumes optimized for Applicant Tracking Systems
- **Multiple Templates**: Choose from 4 professional templates (Modern Blue, Executive, Minimalist, Technical)
- **Export Options**: Download as PDF, DOC, or copy formatted content to clipboard
- **Real-time Preview**: See your tailored resume with live template switching
- **Optimization Reports**: View detailed analysis of ATS score improvements
- **Privacy-Focused**: All processing happens client-side; your data stays on your device

## Tech Stack

- **Frontend**: Vue 3 with Composition API and TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **AI Integration**: Google Generative AI (Gemini)
- **File Processing**: PDF.js (PDF extraction), Mammoth (DOCX extraction)
- **Markdown**: Marked.js for markdown parsing
- **Security**: DOMPurify for XSS sanitization
- **PDF Generation**: html2pdf.js
- **Linting**: ESLint with oxlint, Prettier for formatting
- **Testing**: Vitest

## Prerequisites

- Node.js ^20.19.0 or >=22.12.0
- npm or yarn
- Google Gemini API Key

## Getting Started

### 1. Clone the repository

```sh
git clone <repository-url>
cd resume-generator
```

### 2. Install dependencies

```sh
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```sh
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

To get a Gemini API key:
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file

### 4. Run the development server

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

```sh
# Development server with hot-reload
npm run dev

# Type-check, compile and minify for production
npm run build

# Preview production build
npm run preview

# Run unit tests
npm run test:unit

# Lint code with ESLint and oxlint
npm run lint

# Format code with Prettier
npm run format

# Type-check only
npm run type-check
```

## Project Structure

```
src/
├── assets/          # Static assets and global styles
├── components/      # Vue components
│   ├── resume/      # Resume-specific components
│   └── ResumeDetailFormModal.vue
├── composables/     # Vue composables (reusable logic)
│   ├── useResumeProcessor.ts  # File text extraction
│   └── useResumeExporter.ts   # PDF/DOC export
├── router/          # Vue Router configuration
├── services/        # External service integrations
│   ├── gemini.ts    # Gemini AI service
│   └── resumeStyles.ts  # Template styles
├── stores/          # Pinia stores
├── utils/           # Utility functions
├── views/           # Page components
└── main.ts          # Application entry point
```

## How It Works

1. **Upload or Enter Resume**: Upload your existing resume (PDF/DOCX) or enter details manually
2. **Provide Job Description**: Paste the target job description
3. **AI Processing**: Gemini AI analyzes the JD and optimizes your resume
4. **Preview & Customize**: View the tailored resume and switch between templates
5. **Export**: Download as PDF, DOC, or copy to clipboard

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## License

Private - All rights reserved.

## Contributing

This is a private project. For questions or suggestions, please contact the maintainers.
