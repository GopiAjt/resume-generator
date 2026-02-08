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
const errorMessage = ref('')
const resumeContainer = ref<HTMLElement | null>(null)

const handleSubmit = async () => {
    if (!jobDescription.value.trim()) return

    isGenerating.value = true
    errorMessage.value = ''
    generatedResume.value = ''
    generatedResumeHtml.value = ''

    try {
        const resume = await generateResume(jobDescription.value)
        generatedResume.value = resume
        generatedResumeHtml.value = marked(resume) as string
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
        margin: 10,
        filename: 'Gopi_Aajatarao_resume.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
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
        </div>
    </div>
</template>

<style scoped>
.create-resume {
    padding: var(--space-12) var(--space-4);
    max-width: 100%;
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

.input-section,
.resume-preview {
    background: var(--color-surface);
    padding: var(--space-8);
    border-radius: var(--radius-lg);
    border: 1px solid var(--color-border);
    box-shadow: var(--shadow-lg);
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
    border: 1px solid var(--color-border);
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
    color: #333;
    padding: 40px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: 0 auto;
    font-family: 'Georgia', serif;
    line-height: 1.6;
}

.resume-content :deep(h1),
.resume-content :deep(h2),
.resume-content :deep(h3) {
    color: #2c3e50;
    border-bottom: 2px solid #eee;
    padding-bottom: 10px;
    margin-top: 20px;
    margin-bottom: 15px;
}

.resume-content :deep(h1) {
    text-align: center;
    border-bottom: none;
    font-size: 2.5em;
    margin-bottom: 5px;
}

.resume-content :deep(p) {
    margin-bottom: 10px;
}

.resume-content :deep(ul) {
    padding-left: 20px;
    margin-bottom: 15px;
}

.resume-content :deep(li) {
    margin-bottom: 5px;
}

.resume-content :deep(strong) {
    font-weight: bold;
    color: #000;
}

.resume-content :deep(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
}

.resume-content :deep(th),
.resume-content :deep(td) {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

.resume-content :deep(th) {
    background-color: #f2f2f2;
    font-weight: bold;
}

.btn-secondary {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text);
}
</style>
