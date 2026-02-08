<script setup lang="ts">
import { ref } from 'vue'
import { generateResume } from '@/services/gemini'
import { marked } from 'marked'
// @ts-ignore
import html2pdf from 'html2pdf.js'

const jobDescription = ref('')
const isGenerating = ref(false)
const generatedResume = ref('')
const generatedResumeHtml = ref('')
const validationSummary = ref('')
const errorMessage = ref('')
const resumeContainer = ref<HTMLElement | null>(null)

const handleSubmit = async () => {
    if (!jobDescription.value.trim()) return

    isGenerating.value = true
    errorMessage.value = ''
    generatedResume.value = ''
    generatedResumeHtml.value = ''
    validationSummary.value = ''

    try {
        const response = await generateResume(jobDescription.value)

        if (typeof response === 'string') {
            generatedResume.value = response
            generatedResumeHtml.value = marked(response) as string
        } else {
            generatedResume.value = response.resume_markdown
            generatedResumeHtml.value = marked(response.resume_markdown) as string
            validationSummary.value = response.validation_summary
        }
    } catch (error: any) {
        console.error('Failed to generate resume:', error)
        errorMessage.value = error.message || 'Failed to generate resume. Please check your API key and try again.'
    } finally {
        isGenerating.value = false
    }
}

const downloadPDF = () => {
    if (!resumeContainer.value) return

    const opt = {
        margin: 0,
        filename: 'Gopi_Aajatarao_resume.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            windowWidth: 794 // Approx 210mm in pixels at 96dpi
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const },
        pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    }

    html2pdf().set(opt).from(resumeContainer.value).save()
}
</script>

<template>
    <div class="create-resume container fade-in">
        <div class="header-section">
            <h1 class="text-display">Target Your Resume</h1>
            <p class="subtitle">Paste the job description below to tailor your resume for this specific role.</p>
        </div>

        <div class="input-section" v-if="!generatedResume">
            <div class="form-group">
                <label for="job-description">Job Description</label>
                <textarea id="job-description" v-model="jobDescription"
                    placeholder="Paste the full job description here..." rows="10" :disabled="isGenerating"></textarea>
            </div>

            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <div class="actions">
                <button @click="handleSubmit" class="btn btn-primary"
                    :disabled="!jobDescription.trim() || isGenerating">
                    <span v-if="isGenerating">Generating Resume...</span>
                    <span v-else>Build Resume</span>
                </button>
            </div>
        </div>

        <div class="resume-preview" v-if="generatedResume">
            <div class="preview-header">
                <h2>Generated Resume</h2>
                <div class="preview-actions">
                    <button @click="downloadPDF" class="btn btn-primary">Download PDF</button>
                    <button @click="generatedResume = ''" class="btn btn-secondary">Create Another</button>
                </div>
            </div>

            <div class="resume-paper" ref="resumeContainer">
                <div class="resume-content" v-html="generatedResumeHtml"></div>
            </div>

            <div class="validation-summary" v-if="validationSummary">
                <h3>Optimization Report</h3>
                <div class="summary-content">
                    <pre>{{ validationSummary }}</pre>
                </div>
            </div>
        </div>
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
    overflow-x: auto;
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

textarea {
    width: 100%;
    padding: var(--space-4);
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text);
    font-family: var(--font-family-base);
    font-size: 1rem;
    resize: vertical;
    transition: border-color var(--transition-fast), box-shadow var(--transition-fast);
}

textarea:focus {
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
}

.preview-actions {
    display: flex;
    gap: var(--space-4);
}

.resume-paper {
    background: white;
    color: #1a202c;
    padding: 0.5in;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    width: 210mm;
    /* A4 Width */
    min-height: 297mm;
    /* A4 Height */
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    line-height: 1.5;
    text-align: left;
    box-sizing: border-box;
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

.resume-content :deep(strong) {
    font-weight: 600;
    color: #1a202c;
}

.btn-secondary {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text);
}

.validation-summary {
    margin-top: var(--space-8);
    background: hsla(var(--hue-primary), 50%, 95%, 1);
    border: 1px solid hsla(var(--hue-primary), 50%, 80%, 1);
    border-radius: var(--radius-md);
    padding: var(--space-6);
}

.validation-summary h3 {
    color: var(--color-primary);
    margin-bottom: var(--space-4);
}

.summary-content pre {
    background: transparent;
    color: var(--color-text);
    font-family: var(--font-family-base);
    white-space: pre-wrap;
}
</style>
