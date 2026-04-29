<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import { generateResume } from '@/services/gemini'
import { logger } from '@/utils/logger'

// Components
import ResumeDetailFormModal from '@/components/ResumeDetailFormModal.vue'
import ResumeUpload from '@/components/resume/ResumeUpload.vue'
import JobDescription from '@/components/resume/JobDescription.vue'
import TemplateSelector from '@/components/resume/TemplateSelector.vue'
import ResumeActions from '@/components/resume/ResumeActions.vue'
import ResumePaper from '@/components/resume/ResumePaper.vue'
import OptimizationReport from '@/components/resume/OptimizationReport.vue'

// Composables & Utils
import { useResumeProcessor } from '@/composables/useResumeProcessor'
import { useResumeExporter } from '@/composables/useResumeExporter'
import { getScoreClass } from '@/utils/resumeUtils'

// Constants
const MAX_FILE_SIZE_MB = 5
const MAX_JD_LENGTH = 10000
const MAX_RESUME_LENGTH = 20000

// State
const jobDescription = ref('')
const companyName = ref('')
const resumeFile = ref<File | null>(null)
const isGenerating = ref(false)
const showModal = ref(false)
const generatedResume = ref('')
const generatedResumeHtml = ref('')
const originalAtsScore = ref(0)
const atsScore = ref(0)
const optimizationReport = ref<any[]>([])
const errorMessage = ref('')
const selectedTemplate = ref('modern')

const resumePaperRef = ref<InstanceType<typeof ResumePaper> | null>(null)
const toast = ref({
    show: false,
    message: '',
    type: 'error'
})

// Logic
const { isExtracting, extractedResumeText, extractTextFromFile, errorMessage: extractionError } = useResumeProcessor()
const { downloadPDF, downloadDOC, copyToClipboard } = useResumeExporter()

// Loading step cycler
const LOADING_STEPS = [
    'Analyzing job description...',
    'Identifying ATS keywords...',
    'Matching your experience...',
    'Crafting tailored bullet points...',
    'Formatting your resume...',
]
const loadingStep = ref(LOADING_STEPS[0])
let loadingInterval: ReturnType<typeof setInterval> | null = null

const startLoadingCycle = () => {
    let i = 0
    loadingStep.value = LOADING_STEPS[0]
    loadingInterval = setInterval(() => {
        i = (i + 1) % LOADING_STEPS.length
        loadingStep.value = LOADING_STEPS[i]
    }, 3500)
}

const stopLoadingCycle = () => {
    if (loadingInterval) {
        clearInterval(loadingInterval)
        loadingInterval = null
    }
}

onUnmounted(stopLoadingCycle)

const showToast = (message: string, type = 'error') => {
    toast.value = { show: true, message, type }
    setTimeout(() => {
        toast.value.show = false
    }, 5000)
}

const handleFormSubmit = (text: string) => {
    if (text.length > MAX_RESUME_LENGTH) {
        showToast(`Your resume text is too long! Please limit it to ${MAX_RESUME_LENGTH} characters.`, 'error')
        return
    }
    extractedResumeText.value = text
    resumeFile.value = null
    showModal.value = false
    showToast('Your details have been processed. Now enter the Job Description!', 'success')
}

const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files && target.files[0]) {
        const file = target.files[0]

        // 5MB File Size Validation
        if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
            showToast(`File is too large! Maximum size is ${MAX_FILE_SIZE_MB}MB.`, 'error')
            target.value = '' // Clear input
            return
        }

        resumeFile.value = file
        try {
            await extractTextFromFile(resumeFile.value)

            // Check extracted text length
            if (extractedResumeText.value.length > MAX_RESUME_LENGTH) {
                showToast(`Extracted resume text is too long! Please use a more concise resume.`, 'error')
                extractedResumeText.value = ''
                resumeFile.value = null
                target.value = ''
            }
        } catch (err: any) {
            const msg = err?.message || extractionError.value || 'Failed to read the resume file.'
            showToast(msg, 'error')
            resumeFile.value = null
            target.value = ''
        }
    }
}

const formatResumeHtml = async (markdown: string) => {
    const rawHtml = await marked(markdown) as string;

    // XSS Sanitization
    const sanitizedHtml = DOMPurify.sanitize(rawHtml);

    // Add resume-meta class to the first paragraph (usually contact info/summary) for robust styling
    const finalHtml = sanitizedHtml.replace(/<p>(.*?)<\/p>/, '<p class="resume-meta">$1</p>');
    return finalHtml;
};

const validateInputs = () => {
    if (!jobDescription.value.trim()) {
        showToast('Please enter a target job description.', 'error')
        return false
    }
    if (jobDescription.value.length > MAX_JD_LENGTH) {
        showToast(`Job description is too long! Please limit it to ${MAX_JD_LENGTH} characters.`, 'error')
        return false
    }
    if (!extractedResumeText.value.trim()) {
        showToast('Please upload your resume or enter your details manually.', 'error')
        return false
    }
    return true
}

const handleSubmit = async () => {
    if (!validateInputs()) return

    isGenerating.value = true
    errorMessage.value = ''
    generatedResume.value = ''
    generatedResumeHtml.value = ''
    originalAtsScore.value = 0
    atsScore.value = 0
    optimizationReport.value = []
    startLoadingCycle()

    try {
        const response = await generateResume(jobDescription.value, extractedResumeText.value)

        if (typeof response === 'string') {
            generatedResume.value = response
            generatedResumeHtml.value = await formatResumeHtml(response)
        } else {
            generatedResume.value = response.resume_markdown
            generatedResumeHtml.value = await formatResumeHtml(response.resume_markdown)
            originalAtsScore.value = response.original_ats_score
            atsScore.value = response.ats_score
            optimizationReport.value = response.optimization_report
        }
    } catch (error: any) {
        logger.error('Failed to generate resume:', error)
        const msg = error.message || ''
        if (msg.includes('503') || msg.toLowerCase().includes('high demand')) {
            showToast('Gemini is currently under high demand. Please wait a few moments and try again!', 'warning')
        } else {
            errorMessage.value = msg || 'Failed to generate resume. Please check your API key and try again.'
        }
    } finally {
        stopLoadingCycle()
        isGenerating.value = false
    }
}

const onDownloadPDF = () => {
    const container = resumePaperRef.value?.resumeContainer ?? null
    downloadPDF(
        container,
        generatedResume.value,
        companyName.value,
        (msg) => showToast(msg, 'success'),
        (msg) => showToast(msg, 'success'),
        (msg) => showToast(msg, 'error')
    )
}

const onDownloadDOC = () => {
    downloadDOC(
        generatedResumeHtml.value,
        generatedResume.value,
        companyName.value,
        selectedTemplate.value,
        (msg) => showToast(msg, 'success')
    )
}

const onCopyMarkdown = () => {
    copyToClipboard(
        generatedResumeHtml.value,
        generatedResume.value,
        (msg) => showToast(msg, 'success'),
        (msg) => showToast(msg, 'error')
    )
}
</script>

<template>
    <div class="create-resume container fade-in">
        <!-- Toast Notification -->
        <Transition name="toast">
            <div v-if="toast.show" class="toast-notification" :class="toast.type" role="alert" aria-live="polite">
                <div class="toast-content">
                    <span v-if="toast.type === 'warning'" class="toast-icon" aria-hidden="true">⚠️</span>
                    <span v-else-if="toast.type === 'success'" class="toast-icon" aria-hidden="true">✅</span>
                    <span v-else class="toast-icon" aria-hidden="true">❌</span>
                    <p>{{ toast.message }}</p>
                </div>
                <button @click="toast.show = false" class="toast-close" aria-label="Close notification">&times;</button>
            </div>
        </Transition>

        <div class="header-section">
            <h1 class="text-display">Optimize Your Resume</h1>
            <p class="subtitle">Upload your existing resume and paste a job description to get a tailored, ATS-ready
                version in seconds.</p>
        </div>

        <div class="input-section" v-if="!generatedResume">
            <ResumeUpload v-model:companyName="companyName" :isExtracting="isExtracting" :isGenerating="isGenerating"
                :resumeFile="resumeFile" :extractedResumeText="extractedResumeText" @file-change="handleFileChange"
                @manual-entry="showModal = true" />

            <JobDescription v-model="jobDescription" :disabled="isGenerating" />

            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>

            <div class="actions">
                <button @click="handleSubmit" class="btn btn-primary"
                    :disabled="!jobDescription.trim() || !extractedResumeText.trim() || isGenerating || isExtracting">
                    <span v-if="isGenerating" class="loading-step-text">
                        <span class="btn-spinner"></span>
                        {{ loadingStep }}
                    </span>
                    <span v-else>Optimize Resume</span>
                </button>
            </div>
        </div>

        <div class="resume-preview" v-if="generatedResume">
            <div class="preview-header">
                <h2>Tailored Resume Preview</h2>
                <ResumeActions :isGenerating="isGenerating" @download-pdf="onDownloadPDF" @download-doc="onDownloadDOC"
                    @copy-markdown="onCopyMarkdown" @start-over="generatedResume = ''" />
            </div>

            <TemplateSelector v-model="selectedTemplate" />

            <ResumePaper ref="resumePaperRef" :selectedTemplate="selectedTemplate"
                :generatedResumeHtml="generatedResumeHtml" />

            <OptimizationReport v-if="optimizationReport.length" :optimizationReport="optimizationReport"
                :originalAtsScore="originalAtsScore" :atsScore="atsScore" />
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

.preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
    width: 100%;
    max-width: 210mm;
}

.actions {
    display: flex;
    justify-content: flex-end;
}

.loading-step-text {
    display: inline-flex;
    align-items: center;
    gap: var(--space-2);
}

.btn-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: btn-spin 0.7s linear infinite;
    flex-shrink: 0;
}

@keyframes btn-spin {
    to {
        transform: rotate(360deg);
    }
}

.btn-primary {
    background: var(--color-primary);
    color: white;
    padding: var(--space-3) var(--space-8);
    border-radius: var(--radius-md);
    font-weight: 700;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 14px hsla(var(--hue-primary), 80%, 60%, 0.4);
    transition: all var(--transition-base);
}

.btn-primary:hover:not(:disabled) {
    background: var(--color-secondary);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px hsla(var(--hue-primary), 80%, 60%, 0.5);
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error-message {
    color: var(--color-danger);
    background: hsla(var(--hue-danger), 100%, 50%, 0.1);
    padding: var(--space-4);
    border-radius: var(--radius-md);
    margin-bottom: var(--space-6);
}

/* Toast Notification Styles */
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
}

.toast-notification.error {
    border-left: 4px solid var(--color-danger);
}

.toast-notification.warning {
    border-left: 4px solid #f59e0b;
}

.toast-notification.success {
    border-left: 4px solid #10b981;
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
    margin-left: var(--space-4);
}

/* Transitions */
.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translate(-50%, -20px);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

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

    .preview-header {
        flex-direction: column;
        gap: var(--space-4);
        text-align: center;
    }
}
</style>
