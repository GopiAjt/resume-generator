<script setup lang="ts">
import { ref } from 'vue'
import { generateResume } from '@/services/gemini'
import { marked } from 'marked'
import * as pdfjsLib from 'pdfjs-dist'
import mammoth from 'mammoth'
import ResumeDetailFormModal from '@/components/ResumeDetailFormModal.vue'
// @ts-ignore
import html2pdf from 'html2pdf.js'

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

const jobDescription = ref('')
const companyName = ref('')
const resumeFile = ref<File | null>(null)
const extractedResumeText = ref('')
const isGenerating = ref(false)
const isExtracting = ref(false)
const showModal = ref(false)
const generatedResume = ref('')
const generatedResumeHtml = ref('')
const originalAtsScore = ref(0)
const atsScore = ref(0)
const optimizationReport = ref<string[]>([])
const errorMessage = ref('')
const resumeContainer = ref<HTMLElement | null>(null)
const toast = ref({
    show: false,
    message: '',
    type: 'error'
})

const templates = [
    { id: 'modern', name: 'Modern Blue', icon: '✨', description: 'Clean, professional with blue accents.' },
    { id: 'executive', name: 'Executive', icon: '👔', description: 'Classic serif font for a senior look.' },
    { id: 'minimal', name: 'Minimalist', icon: '🌱', description: 'Simple, spacious and elegant.' },
    { id: 'technical', name: 'Technical', icon: '💻', description: 'Compact and focused on skills.' }
]

const selectedTemplate = ref('modern')

const showToast = (message: string, type = 'error') => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
        toast.value.show = false
    }, 5000)
}

const handleFormSubmit = (text: string) => {
    extractedResumeText.value = text
    resumeFile.value = null // Clear file if they chose form
    showModal.value = false
    showToast('Your details have been processed. Now enter the Job Description!', 'success')
}

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        resumeFile.value = target.files[0]
        await extractTextFromFile(resumeFile.value)
    }
}

const extractTextFromFile = async (file: File) => {
    isExtracting.value = true
    errorMessage.value = ''
    extractedResumeText.value = ''

    try {
        const fileType = file.type
        const fileName = file.name.toLowerCase()

        if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
            const arrayBuffer = await file.arrayBuffer()
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
            let text = ''
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i)
                const content = await page.getTextContent()
                const strings = content.items.map((item: any) => item.str)
                text += strings.join(' ') + '\n'
            }
            extractedResumeText.value = text
        } else if (
            fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            fileName.endsWith('.docx')
        ) {
            const arrayBuffer = await file.arrayBuffer()
            const result = await mammoth.extractRawText({ arrayBuffer })
            extractedResumeText.value = result.value
        } else {
            throw new Error('Unsupported file format. Please upload a PDF or DOCX file.')
        }

        if (!extractedResumeText.value.trim()) {
            throw new Error('Failed to extract text from the file. The file might be empty or scanned as an image.')
        }
    } catch (error: any) {
        console.error('Text extraction failed:', error)
        errorMessage.value = error.message || 'Failed to read the resume file.'
        resumeFile.value = null
    } finally {
        isExtracting.value = false
    }
}

const handleSubmit = async () => {
    if (!jobDescription.value.trim() || !extractedResumeText.value.trim()) return

    isGenerating.value = true
    errorMessage.value = ''
    generatedResume.value = ''
    generatedResumeHtml.value = ''
    originalAtsScore.value = 0
    atsScore.value = 0
    optimizationReport.value = []

    try {
        const response = await generateResume(jobDescription.value, extractedResumeText.value)

        if (typeof response === 'string') {
            generatedResume.value = response
            generatedResumeHtml.value = (await marked(response)) as string
        } else {
            generatedResume.value = response.resume_markdown
            generatedResumeHtml.value = (await marked(response.resume_markdown)) as string
            originalAtsScore.value = response.original_ats_score
            atsScore.value = response.ats_score
            optimizationReport.value = response.optimization_report
        }
    } catch (error: any) {
        console.error('Failed to generate resume:', error)
        const msg = error.message || ''
        if (msg.includes('503') || msg.toLowerCase().includes('high demand')) {
            showToast('Gemini is currently under high demand. Please wait a few moments and try again!', 'warning')
        } else {
            errorMessage.value = msg || 'Failed to generate resume. Please check your API key and try again.'
        }
    } finally {
        isGenerating.value = false
    }
}

const getScoreClass = (score: number) => {
    if (score >= 80) return 'high'
    if (score >= 60) return 'medium'
    return 'low'
}

const getFilename = () => {
    if (!generatedResume.value) return 'resume'

    // Extract name from the first H1 header in markdown
    const nameMatch = generatedResume.value.match(/^#\s+(.+)$/m)
    let rawName = 'Tailored'
    if (nameMatch && nameMatch[1]) {
        rawName = nameMatch[1].trim()
    }

    // Sanitize name for filename
    const sanitizedName = rawName.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_')
    const companySuffix = companyName.value ? `_${companyName.value.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_')}` : ''

    return `${sanitizedName}${companySuffix}_resume`
}

const getTemplateStyles = (templateId: string, isPrint = false) => {
    const baseStyles = `
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        color: #1a202c;
        line-height: 1.4;
    `;

    const templates: Record<string, string> = {
        modern: `
            h1 { font-size: 24pt; color: #1a365d; margin-bottom: 4pt; font-weight: 800; letter-spacing: -0.02em; }
            p:first-of-type { font-size: 10pt; color: #4a5568; margin-bottom: 16pt; font-weight: 500; }
            h2 { font-size: 12pt; color: #2b6cb0; text-transform: uppercase; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4pt; margin-top: 20pt; margin-bottom: 10pt; font-weight: 700; letter-spacing: 0.05em; }
            h3 { font-size: 11pt; color: #1a202c; margin-top: 12pt; margin-bottom: 4pt; font-weight: 700; }
            p, li { font-size: 10pt; color: #2d3748; margin-bottom: 5pt; }
            li::before { content: "•"; color: #2b6cb0; font-weight: bold; margin-right: 8pt; }
        `,
        executive: `
            body { font-family: 'Georgia', serif; }
            h1 { font-size: 26pt; color: #000; text-align: center; margin-bottom: 6pt; font-weight: normal; }
            p:first-of-type { font-size: 10pt; color: #333; text-align: center; margin-bottom: 24pt; border-bottom: 1px solid #333; padding-bottom: 10pt; }
            h2 { font-size: 13pt; color: #000; border-top: 2px solid #000; border-bottom: 1px solid #000; padding: 4pt 0; margin-top: 22pt; margin-bottom: 12pt; text-align: center; font-weight: bold; }
            h3 { font-size: 11.5pt; color: #000; margin-top: 14pt; margin-bottom: 4pt; font-weight: bold; }
            p, li { font-size: 10.5pt; color: #111; margin-bottom: 6pt; }
            li::before { content: "▪"; color: #000; margin-right: 8pt; }
        `,
        minimal: `
            h1 { font-size: 22pt; color: #111; margin-bottom: 2pt; font-weight: 300; }
            p:first-of-type { font-size: 9pt; color: #718096; margin-bottom: 30pt; text-transform: uppercase; letter-spacing: 0.1em; }
            h2 { font-size: 10pt; color: #111; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 30pt; margin-bottom: 10pt; font-weight: 600; }
            h3 { font-size: 11pt; color: #111; margin-top: 15pt; margin-bottom: 5pt; font-weight: 600; }
            p, li { font-size: 10pt; color: #4a5568; margin-bottom: 8pt; }
            li::before { content: "—"; color: #cbd5e0; margin-right: 8pt; }
        `,
        technical: `
            body { font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace; font-size: 9.5pt; }
            h1 { font-size: 22pt; color: #000; margin-bottom: 4pt; border-left: 8px solid #000; padding: 6pt 15pt; background: #f7fafc; letter-spacing: -0.02em; font-weight: 800; }
            p:first-of-type { font-size: 9pt; color: #fff; background: #1a202c; padding: 10pt 20pt; border-radius: 0 0 12px 12px; margin-bottom: 25pt; }
            h2 { font-size: 11pt; color: #000; background: #edf2f7; padding: 6pt 12pt; margin-top: 20pt; margin-bottom: 10pt; font-weight: 800; border-radius: 4px; }
            h3 { font-size: 10.5pt; color: #2b6cb0; border-bottom: 1px dashed #cbd5e0; display: inline-block; padding-bottom: 2pt; margin-top: 12pt; font-weight: 800; }
            p, li { font-size: 9.5pt; color: #2d3748; margin-bottom: 5pt; }
            li { padding-left: 1.5rem; }
            li::before { content: "::"; color: #718096; font-weight: 800; position: absolute; left: 0; font-size: 0.9em; }
        `
    };

    return `
        ${baseStyles}
        ${templates[templateId] || templates.modern}
        ul { list-style: none; padding-left: 0; }
        li { position: relative; }
        strong { font-weight: 600; }
        a { color: inherit; text-decoration: none; border-bottom: 1px dotted currentColor; }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        h1, h2, h3, li { page-break-inside: avoid; break-inside: avoid; }
    `;
}

const downloadPDF = async () => {
    if (!resumeContainer.value) return

    const fileName = `${getFilename()}.pdf`
    const element = resumeContainer.value

    const opt = {
        margin: 10,
        filename: fileName,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
            scale: 3,
            useCORS: true,
            letterRendering: true,
            logging: false
        },
        jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait' as const
        },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    try {
        showToast('Generating PDF... Please wait.', 'success')
        await html2pdf().set(opt).from(element).save()
        showToast('PDF downloaded!', 'success')
    } catch (error) {
        console.error('PDF generation failed:', error)
        showToast('Failed to generate PDF. Click "Copy Markdown" as backup.', 'error')
    }
}

const copyToClipboard = async () => {
    if (!generatedResumeHtml.value) return

    try {
        // Try to copy the HTML version for formatted paste, or fallback to plain text if needed
        const blob = new Blob([generatedResumeHtml.value], { type: 'text/html' })
        const data = [new ClipboardItem({ 'text/html': blob, 'text/plain': new Blob([generatedResume.value], { type: 'text/plain' }) })]
        await navigator.clipboard.write(data)
        showToast('Formatted resume copied to clipboard!', 'success')
    } catch (err) {
        // Fallback to plain text markdown
        try {
            await navigator.clipboard.writeText(generatedResume.value)
            showToast('Resume Markdown copied to clipboard!', 'success')
        } catch (innerErr) {
            console.error('Copy failed:', innerErr)
            showToast('Failed to copy. Please select and copy manually.', 'error')
        }
    }
}

const downloadDOC = () => {
    if (!generatedResumeHtml.value) return

    const fileName = `${getFilename()}.doc`
    const content = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' 
              xmlns:w='urn:schemas-microsoft-com:office:word' 
              xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
            <meta charset='utf-8'>
            <title>Resume</title>
            <style>
                @page { size: 8.5in 11in; margin: 0.75in 0.75in 0.75in 0.75in; }
                body { font-family: 'Arial', sans-serif; line-height: 1.4; color: #1a202c; }
                ${getTemplateStyles(selectedTemplate.value, false)}
            </style>
        </head>
        <body>
            ${generatedResumeHtml.value}
        </body>
        </html>
    `

    const blob = new Blob([content], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.download = fileName

    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }, 100)

    showToast('DOC download started!', 'success')
}
</script>

<template>
    <div class="create-resume container fade-in">
        <!-- Toast Notification -->
        <Transition name="toast">
            <div v-if="toast.show" class="toast-notification" :class="toast.type">
                <div class="toast-content">
                    <span v-if="toast.type === 'warning'" class="toast-icon">⚠️</span>
                    <span v-else-if="toast.type === 'success'" class="toast-icon">✅</span>
                    <span v-else class="toast-icon">❌</span>
                    <p>{{ toast.message }}</p>
                </div>
                <button @click="toast.show = false" class="toast-close">&times;</button>
            </div>
        </Transition>

        <div class="header-section">
            <h1 class="text-display">Optimize Your Resume</h1>
            <p class="subtitle">Upload your existing resume and paste a job description to get a tailored, ATS-ready
                version in seconds.</p>
        </div>

        <div class="input-section" v-if="!generatedResume">
            <div class="form-group">
                <label for="company-name">Company Name (Optional)</label>
                <input id="company-name" v-model="companyName" type="text" placeholder="e.g. Google, Meta, etc."
                    :disabled="isGenerating" class="company-input" />
            </div>

            <div class="form-group">
                <label for="resume-upload">Upload Current Resume (PDF/DOCX)</label>
                <div class="file-upload-wrapper">
                    <label for="resume-upload" class="file-upload-label"
                        :class="{ 'disabled': isGenerating || isExtracting }">
                        <div class="upload-icon">
                            <svg v-if="!resumeFile" xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                stroke-linecap="round" stroke-linejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                        </div>
                        <div class="upload-text">
                            <span v-if="!resumeFile" class="main-text">Choose your resume</span>
                            <span v-else class="main-text file-name">{{ resumeFile.name }}</span>
                            <span class="sub-text">PDF or DOCX (Max 10MB)</span>
                        </div>
                    </label>
                    <input id="resume-upload" type="file" @change="handleFileChange" accept=".pdf,.docx"
                        :disabled="isGenerating || isExtracting" class="file-input-hidden" />

                    <div v-if="isExtracting" class="extracting-status">
                        <span class="spinner"></span>
                        <span>Analyzing resume content...</span>
                    </div>
                    <Transition name="fade">
                        <div v-if="extractedResumeText && !isExtracting" class="success-status">
                            <span class="status-icon">✨</span>
                            <span>Resume analyzed and ready for optimization</span>
                        </div>
                    </Transition>
                </div>
                <div class="form-help">
                    <p>Don't have a resume to upload? <button type="button" class="btn-link"
                            @click="showModal = true">Provide your details manually</button></p>
                </div>
            </div>

            <div class="form-group">
                <label for="job-description">Target Job Description</label>
                <textarea id="job-description" v-model="jobDescription"
                    placeholder="Paste the job description here to optimize your resume..." rows="10"
                    :disabled="isGenerating"></textarea>
            </div>

            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <div class="actions">
                <button @click="handleSubmit" class="btn btn-primary"
                    :disabled="!jobDescription.trim() || !extractedResumeText.trim() || isGenerating || isExtracting">
                    <span v-if="isGenerating">Optimizing Your Resume...</span>
                    <span v-else>Optimize Resume</span>
                </button>
            </div>
        </div>

        <div class="resume-preview" v-if="generatedResume">
            <div class="preview-header">
                <h2>Tailored Resume Preview</h2>
                <div class="preview-actions">
                    <button @click="downloadPDF" class="btn btn-primary" title="Recommended for Mobile">Download
                        PDF</button>
                    <button @click="downloadDOC" class="btn btn-secondary">Download DOC</button>
                    <button @click="copyToClipboard" class="btn btn-secondary" title="Copy as Text">Copy
                        Markdown</button>
                    <button @click="generatedResume = ''" class="btn btn-secondary danger">Start Over</button>
                </div>
            </div>

            <div class="template-selector">
                <div class="template-options">
                    <div v-for="temp in templates" :key="temp.id" class="template-card"
                        :class="{ 'active': selectedTemplate === temp.id }" @click="selectedTemplate = temp.id">
                        <div class="template-icon">{{ temp.icon }}</div>
                        <div class="template-info">
                            <span class="template-name">{{ temp.name }}</span>
                            <span class="template-desc">{{ temp.description }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="resume-paper" :class="'template-' + selectedTemplate" ref="resumeContainer">
                <div class="resume-content" v-html="generatedResumeHtml"></div>
            </div>

            <div class="optimization-report" v-if="optimizationReport.length">
                <div class="report-header">
                    <div class="header-main">
                        <span class="report-icon">📊</span>
                        <h3>Optimization Report</h3>
                    </div>
                    <div class="score-comparison">
                        <div class="ats-score-badge original" :class="getScoreClass(originalAtsScore)">
                            <span class="score-label">Original</span>
                            <span class="score-value">{{ originalAtsScore }}%</span>
                        </div>
                        <div class="score-arrow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12" />
                                <polyline points="12 5 19 12 12 19" />
                            </svg>
                        </div>
                        <div class="ats-score-badge tailored" :class="getScoreClass(atsScore)">
                            <span class="score-label">Tailored</span>
                            <span class="score-value">{{ atsScore }}%</span>
                        </div>
                    </div>
                </div>
                <div class="report-content">
                    <ul class="report-list">
                        <li v-for="(item, index) in optimizationReport" :key="index">{{ item }}</li>
                    </ul>
                </div>
            </div>
        </div>

        <ResumeDetailFormModal v-if="showModal" @close="showModal = false" @submit="handleFormSubmit" />
    </div>
</template>

<style scoped>
.create-resume {
    padding: var(--space-8) var(--space-4);
    max-width: 1200px;
    margin: 0 auto;
}

.header-section {
    text-align: center;
    margin-bottom: var(--space-8);
}

.subtitle {
    font-size: 1.1rem;
    color: var(--color-text-muted);
    max-width: 600px;
    margin: 0 auto;
}

.input-section {
    background: var(--color-surface);
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-lg);
}

.resume-preview {
    background: var(--color-surface);
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    border: none;
    box-shadow: var(--shadow-xl);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow-x: hidden;
}

.form-group {
    margin-bottom: var(--space-6);
}

label {
    display: block;
    font-weight: 600;
    margin-bottom: var(--space-2);
    color: var(--color-heading);
}

textarea,
.company-input {
    width: 100%;
    padding: var(--space-4);
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text);
    font-family: var(--font-family-base);
    font-size: 1rem;
    transition: all var(--transition-base);
}

.file-input-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}

.file-upload-wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    width: 100%;
}

.file-upload-label {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    padding: var(--space-5) var(--space-6);
    background: hsla(220, 20%, 96%, 1);
    border: 2px dashed var(--color-border);
    border-radius: var(--radius-lg);
    cursor: pointer;
    transition: all var(--transition-base);
}

@media (prefers-color-scheme: dark) {
    .file-upload-label {
        background: hsla(220, 40%, 12%, 1);
        border-color: hsla(220, 40%, 20%, 1);
    }
}

.file-upload-label:hover {
    border-color: var(--color-primary);
    background: hsla(var(--hue-primary), 80%, 60%, 0.05);
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.file-upload-label.disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.upload-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: white;
    border-radius: var(--radius-md);
    color: var(--color-primary);
    box-shadow: var(--shadow-sm);
    flex-shrink: 0;
}

@media (prefers-color-scheme: dark) {
    .upload-icon {
        background: hsla(220, 40%, 18%, 1);
    }
}

.upload-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.main-text {
    font-weight: 600;
    font-size: 1.05rem;
    color: var(--color-heading);
}

.file-name {
    color: var(--color-primary);
}

.sub-text {
    font-size: 0.85rem;
    color: var(--color-text-muted);
}

.extracting-status {
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-primary);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-1) var(--space-4);
}

.success-status {
    font-size: 0.95rem;
    font-weight: 500;
    color: #059669;
    /* Emerald 600 */
    display: flex;
    align-items: center;
    gap: var(--space-3);
    padding: var(--space-1) var(--space-4);
}

@media (prefers-color-scheme: dark) {
    .success-status {
        color: #34d399;
    }
}

.status-icon {
    font-size: 1.1rem;
}

.spinner {
    width: 20px;
    height: 20px;
    border: 3px solid hsla(var(--hue-primary), 80%, 60%, 0.2);
    border-top-color: var(--color-primary);
    border-radius: 50%;
    animation: spin 0.8s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

textarea {
    resize: vertical;
}

.form-help {
    margin-top: var(--space-4);
    text-align: center;
}

.form-help p {
    font-size: 0.95rem;
    color: var(--color-text-muted);
}

.btn-link {
    background: transparent;
    border: none;
    color: var(--color-primary);
    font-weight: 600;
    text-decoration: underline;
    cursor: pointer;
    padding: 0;
    font-size: inherit;
    transition: color var(--transition-fast);
}

.btn-link:hover {
    color: var(--color-secondary);
}

textarea:focus,
.company-input:focus,
.file-input:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px hsla(var(--hue-primary), 80%, 60%, 0.1);
}

.actions {
    display: flex;
    justify-content: flex-end;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
}

.error-message {
    color: var(--color-danger);
    background: hsla(var(--hue-danger), 100%, 50%, 0.1);
    padding: var(--space-4);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-6);
}

.resume-content {
    display: flex;
    flex-direction: column;
    background: var(--color-background);
    padding: var(--space-6);
    border-radius: var(--radius-md);
    /* border: 1px solid var(--color-border); Removed border for cleaner look */
    margin: var(--space-6) 0;
    overflow-x: auto;
}

pre {
    white-space: pre-wrap;
    font-family: monospace;
    color: var(--color-text);
}

.btn-secondary {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text);
}

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
    width: 100%;
    max-width: 210mm;
}

.preview-actions {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
    justify-content: flex-end;
}

.resume-paper {
    background: white;
    background-image: repeating-linear-gradient(to bottom,
            transparent,
            transparent calc(297mm - 1px),
            #e2e8f0 calc(297mm - 1px),
            #e2e8f0 297mm);
    background-size: 100% 297mm;
    color: #1a202c;
    padding: 0.75in;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    margin: 0 auto var(--space-10);
    width: 210mm;
    min-height: 297mm;
    height: auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    line-height: 1.4;
    text-align: left;
    box-sizing: border-box;
    transition: all var(--transition-base);
    position: relative;
    overflow-wrap: break-word;
}

.resume-paper::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: var(--color-primary);
    opacity: 0.1;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
    .create-resume {
        padding: var(--space-4);
    }

    .subtitle {
        font-size: 1rem;
    }

    .input-section,
    .resume-preview {
        padding: var(--space-4);
    }

    textarea {
        font-size: 16px;
        /* Prevents auto-zoom on iOS */
    }

    .preview-header {
        flex-direction: column;
        gap: var(--space-4);
        text-align: center;
    }

    .preview-header h2 {
        font-size: 1.5rem;
    }

    .preview-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--space-2);
        width: 100%;
    }

    .preview-actions .btn {
        width: 100%;
        padding: var(--space-2.5) var(--space-2);
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .resume-paper {
        width: 100%;
        max-width: 100%;
        min-height: auto;
        padding: var(--space-6);
        box-shadow: none;
        border: 1px solid var(--color-border);
    }

    .resume-content :deep(h1) {
        font-size: 18pt;
    }

    .resume-content :deep(h2) {
        font-size: 11pt;
        margin-top: 16pt;
        margin-bottom: 8pt;
    }

    .resume-content :deep(h3) {
        font-size: 10pt;
        margin-top: 10pt;
    }

    .resume-content :deep(p),
    .resume-content :deep(li),
    .resume-content :deep(p:first-of-type) {
        font-size: 9pt;
        margin-bottom: 4pt;
    }
}

@media (max-width: 480px) {
    .preview-actions button {
        width: 100%;
    }
}

.resume-content :deep(h1),
.resume-content :deep(h2),
.resume-content :deep(h3),
.resume-content :deep(li) {
    page-break-inside: avoid;
    break-inside: avoid;
}

.resume-content :deep(h1) {
    font-size: 24pt;
    /* Prominent Name */
    font-weight: 800;
    color: #1a365d;
    /* Deep Navy accent */
    margin-bottom: 2pt;
    text-align: left;
    border: none;
    letter-spacing: -0.02em;
}

/* Contact info line */
.resume-content :deep(p:first-of-type) {
    font-size: 10.5pt;
    color: #4a5568;
    /* Subtle gray for contact info */
    margin-bottom: 20pt;
    font-weight: 500;
    letter-spacing: 0.01em;
}

.resume-content :deep(h2) {
    font-size: 13pt;
    font-weight: 700;
    text-transform: uppercase;
    color: #2b6cb0;
    /* Professional blue section headers */
    border-bottom: 1.5px solid #e2e8f0;
    /* Accent line */
    padding-bottom: 4pt;
    margin-top: 24pt;
    margin-bottom: 12pt;
    letter-spacing: 0.05em;
}

.resume-content :deep(h3) {
    font-size: 11.5pt;
    font-weight: 700;
    color: #1a202c;
    margin-top: 14pt;
    margin-bottom: 4pt;
    font-weight: bold;
}

/* Clickable Links styling */
.resume-content :deep(a) {
    color: #2b6cb0;
    text-decoration: none;
}

.resume-content :deep(a:hover) {
    text-decoration: underline;
}

.resume-content :deep(p),
.resume-content :deep(li) {
    font-size: 10.5pt;
    color: #2d3748;
    margin-bottom: 6pt;
}

.resume-content :deep(ul) {
    padding-left: 1.25rem;
    margin-bottom: 10pt;
    list-style-type: none;
    /* We'll use custom bullets if needed, but standard disc is fine */
}

.resume-content :deep(li) {
    position: relative;
    margin-bottom: 5pt;
}

.resume-content :deep(li::before) {
    content: "•";
    color: #2b6cb0;
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
}

.template-selector {
    width: 100%;
    max-width: 210mm;
    margin-bottom: var(--space-8);
    background: hsla(220, 20%, 96%, 0.4);
    backdrop-filter: blur(8px);
    padding: var(--space-4);
    border-radius: var(--radius-2xl);
    border: 1px solid var(--color-border);
}

@media (prefers-color-scheme: dark) {
    .template-selector {
        background: hsla(220, 40%, 10%, 0.4);
    }
}

.template-options {
    display: flex;
    gap: var(--space-3);
    overflow-x: auto;
    padding: var(--space-2);
    scrollbar-width: none;
    -ms-overflow-style: none;
}

.template-options::-webkit-scrollbar {
    display: none;
}

.template-card {
    flex: 0 0 150px;
    padding: var(--space-4);
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: var(--radius-xl);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--space-2);
    box-shadow: var(--shadow-sm);
}

.template-card:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-md);
    border-color: var(--color-primary);
}

.template-card.active {
    border-color: var(--color-primary);
    background: white;
    box-shadow: 0 0 0 1px var(--color-primary), 0 10px 25px -10px hsla(var(--hue-primary), 80%, 60%, 0.3);
}

@media (prefers-color-scheme: dark) {
    .template-card.active {
        background: hsla(var(--hue-primary), 40%, 15%, 1);
    }
}

.template-icon {
    font-size: 1.75rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.template-info {
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.template-name {
    font-weight: 800;
    font-size: 0.95rem;
    color: var(--color-heading);
}

.template-desc {
    font-size: 0.7rem;
    color: var(--color-text-muted);
    line-height: 1.2;
}

/* Template Specific Content Styles */
.template-modern {
    font-family: 'Inter', sans-serif !important;
}

.template-modern :deep(h1) {
    font-size: 24pt;
    color: #1a365d;
    font-weight: 800;
    border: none;
}

.template-modern :deep(h2) {
    color: #2b6cb0;
    border-bottom: 1.5px solid #e2e8f0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 24pt;
}

.template-modern :deep(li::before) {
    content: "•";
    color: #2b6cb0;
    font-weight: bold;
}

.template-executive {
    font-family: 'Times New Roman', Times, serif !important;
}

.template-executive :deep(h1) {
    font-size: 26pt;
    color: #000;
    text-align: center;
    font-weight: 400;
    border: none;
}

.template-executive :deep(p:first-of-type) {
    text-align: center;
    border-bottom: 1px solid #333;
    padding-bottom: 10pt;
    margin-bottom: 25pt;
}

.template-executive :deep(h2) {
    text-align: center;
    border-top: 1px solid #111;
    border-bottom: 1px solid #111;
    color: #111;
    padding: 4pt 0;
    text-transform: uppercase;
    margin-top: 22pt;
}

.template-executive :deep(li::before) {
    content: "▪";
    color: #000;
}

.template-minimal {
    font-family: 'Helvetica', 'Arial', sans-serif !important;
}

.template-minimal :deep(h1) {
    font-size: 22pt;
    font-weight: 300;
    color: #111;
    border: none;
}

.template-minimal :deep(p:first-of-type) {
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #718096;
    margin-bottom: 30pt;
}

.template-minimal :deep(h2) {
    border-bottom: none;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    font-size: 10pt;
    color: #111;
    margin-top: 30pt;
    font-weight: 600;
}

.template-minimal :deep(li::before) {
    content: "—";
    color: #cbd5e0;
}

.template-technical {
    font-family: 'JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', monospace !important;
    font-size: clamp(8pt, 1.25vw, 9.5pt) !important;
}

.template-technical :deep(h1) {
    border-left: clamp(4px, 1.5vw, 8px) solid #000;
    padding: clamp(6pt, 1.5vw, 10pt) clamp(12pt, 3vw, 20pt);
    font-size: clamp(16pt, 4vw, 22pt);
    background: #f7fafc;
    margin-bottom: clamp(4pt, 1vw, 8pt);
    line-height: 1.1;
    letter-spacing: -0.02em;
    font-weight: 800;
}

.template-technical :deep(p:first-of-type) {
    background: #1a202c;
    color: #fff;
    padding: 10pt clamp(12pt, 3vw, 20pt);
    font-size: clamp(8.5pt, 1vw, 9.5pt);
    border-radius: 0 0 12px 12px;
    margin-bottom: 25pt;
    display: flex;
    flex-wrap: wrap;
    gap: 12pt;
    line-height: 1.4;
}

.template-technical :deep(h2) {
    border-bottom: none;
    background: #edf2f7;
    padding: 6pt clamp(10pt, 2vw, 15pt);
    font-size: clamp(10pt, 1.5vw, 11pt);
    color: #000;
    border-radius: 4px;
    margin-top: clamp(14pt, 2.5vw, 18pt);
    font-weight: 800;
}

.template-technical :deep(li) {
    position: relative;
    padding-left: 1.25rem;
    margin-bottom: 4pt;
}

.template-technical :deep(li::before) {
    content: "::";
    color: #718096;
    font-weight: 800;
    position: absolute;
    left: 0;
    font-size: 0.9em;
}

/* Technical Template Mobile Overrides */
@media (max-width: 768px) {
    .template-technical :deep(h1) {
        border-left-width: 4px;
    }

    .template-technical :deep(p:first-of-type) {
        flex-direction: column;
        gap: 4pt;
        border-radius: 4px;
    }

    .template-technical :deep(h2) {
        margin-left: calc(-1 * var(--space-6));
        margin-right: calc(-1 * var(--space-6));
        padding-left: var(--space-6);
        border-radius: 0;
    }
}

.resume-paper {
    background: white;
    background-image: repeating-linear-gradient(to bottom,
            transparent,
            transparent calc(297mm - 1px),
            #e2e8f0 calc(297mm - 1px),
            #e2e8f0 297mm);
    background-size: 100% 297mm;
    color: #1a202c;
    padding: 0.75in;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
    margin: 0 auto var(--space-10);
    width: 210mm;
    min-height: 297mm;
    height: auto;
    font-family: inherit;
    line-height: 1.4;
    text-align: left;
    box-sizing: border-box;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow-wrap: break-word;
}

.btn-secondary {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text);
}

.optimization-report {
    margin-top: var(--space-10);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    box-shadow: var(--shadow-lg);
    position: relative;
    overflow: hidden;
}

@media (prefers-color-scheme: dark) {
    .optimization-report {
        background: hsla(220, 40%, 10%, 1);
        border-color: hsla(220, 40%, 20%, 1);
    }
}

.report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
}

@media (max-width: 640px) {
    .report-header {
        flex-direction: column;
        gap: var(--space-4);
        align-items: flex-start;
    }

    .score-comparison {
        width: 100%;
        justify-content: space-between;
    }
}

.header-main {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.report-icon {
    font-size: 1.5rem;
}

.optimization-report h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-heading);
}

.score-comparison {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.score-arrow {
    color: var(--color-text-muted);
    display: flex;
    align-items: center;
    animation: move-right 2s infinite ease-in-out;
}

@keyframes move-right {

    0%,
    100% {
        transform: translateX(0);
    }

    50% {
        transform: translateX(4px);
    }
}

.ats-score-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-1) var(--space-4);
    background: hsla(var(--hue-primary), 50%, 95%, 1);
    border-radius: var(--radius-lg);
    border: 1px solid hsla(var(--hue-primary), 50%, 85%, 1);
    min-width: 80px;
}

.ats-score-badge.original {
    background: hsla(220, 20%, 96%, 1);
    border-color: var(--color-border);
    opacity: 0.8;
}

.ats-score-badge.high {
    background: hsla(142, 70%, 95%, 1);
    border-color: hsla(142, 70%, 85%, 1);
}

.ats-score-badge.high .score-value {
    color: #059669;
}

.ats-score-badge.medium {
    background: hsla(45, 90%, 95%, 1);
    border-color: hsla(45, 90%, 85%, 1);
}

.ats-score-badge.medium .score-value {
    color: #d97706;
}

.ats-score-badge.low {
    background: hsla(0, 80%, 95%, 1);
    border-color: hsla(0, 80%, 85%, 1);
}

.ats-score-badge.low .score-value {
    color: #dc2626;
}

@media (prefers-color-scheme: dark) {
    .ats-score-badge {
        background: hsla(220, 40%, 15%, 1);
        border-color: hsla(220, 40%, 25%, 1);
    }

    .ats-score-badge.original {
        background: hsla(220, 40%, 12%, 1);
        border-color: hsla(220, 40%, 18%, 1);
    }

    .ats-score-badge.high {
        background: hsla(142, 70%, 10%, 1);
    }

    .ats-score-badge.medium {
        background: hsla(45, 90%, 10%, 1);
    }

    .ats-score-badge.low {
        background: hsla(0, 80%, 10%, 1);
    }
}

.score-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
}

.score-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
}

.report-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
}

.report-list li {
    font-size: 1.05rem;
    line-height: 1.5;
    color: var(--color-text);
    padding-left: var(--space-8);
    position: relative;
}

.report-list li::before {
    content: "✔️";
    position: absolute;
    left: 0;
    color: var(--color-primary);
    font-size: 1rem;
}

/* Toast Notification */
.toast-notification {
    position: fixed;
    top: var(--space-6);
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-width: 320px;
    max-width: 500px;
    padding: var(--space-4) var(--space-6);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-xl);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    animation: slide-down var(--transition-base);
}

.toast-notification.error {
    border-left: 4px solid var(--color-danger);
}

.toast-notification.warning {
    border-left: 4px solid #f59e0b;
    /* Amber 500 */
}

.toast-notification.success {
    border-left: 4px solid #10b981;
    /* Emerald 500 */
}

.toast-content {
    display: flex;
    align-items: center;
    gap: var(--space-4);
}

.toast-icon {
    font-size: 1.25rem;
}

.toast-content p {
    margin: 0;
    font-size: 0.95rem;
    font-weight: 500;
    color: var(--color-heading);
}

.toast-close {
    background: transparent;
    border: none;
    color: var(--color-text-muted);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    margin-left: var(--space-4);
    line-height: 1;
}

/* Animations */
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translate(-50%, -20px);
}

@keyframes slide-down {
    from {
        opacity: 0;
        transform: translate(-50%, -20px);
    }

    to {
        opacity: 1;
        transform: translate(-50%, 0);
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
