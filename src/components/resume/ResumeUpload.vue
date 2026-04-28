<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    companyName: string;
    isExtracting: boolean;
    isGenerating: boolean;
    resumeFile: File | null;
    extractedResumeText: string;
}>();

const emit = defineEmits<{
    (e: 'update:companyName', value: string): void;
    (e: 'file-change', event: Event): void;
    (e: 'manual-entry'): void;
}>();

const handleFileChange = (event: Event) => {
    emit('file-change', event);
};
</script>

<template>
    <div class="resume-upload-section">
        <div class="form-group">
            <label for="company-name">Company Name (Optional)</label>
            <input id="company-name" :value="companyName"
                @input="emit('update:companyName', ($event.target as HTMLInputElement).value)" type="text"
                placeholder="e.g. Google, Meta, etc." :disabled="isGenerating" class="company-input"
                aria-describedby="company-name-help" />
        </div>

        <div class="form-group">
            <label for="resume-upload">Upload Current Resume (PDF/DOCX)</label>
            <div class="file-upload-wrapper">
                <label for="resume-upload" class="file-upload-label"
                    :class="{ 'disabled': isGenerating || isExtracting }"
                    :aria-disabled="isGenerating || isExtracting">
                    <div class="upload-icon" aria-hidden="true">
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
                        <span class="sub-text">PDF or DOCX (Max 5MB)</span>
                    </div>
                </label>
                <input id="resume-upload" type="file" @change="handleFileChange" accept=".pdf,.docx"
                    :disabled="isGenerating || isExtracting" class="file-input-hidden"
                    aria-label="Upload resume file" />

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
            <div class="form-help" id="company-name-help">
                <p>Don't have a resume to upload? <button type="button" class="btn-link"
                        @click="emit('manual-entry')" aria-label="Enter resume details manually">Provide your details manually</button></p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.form-group {
    margin-bottom: var(--space-6);
}

label {
    display: block;
    font-weight: 600;
    margin-bottom: var(--space-2);
    color: var(--color-heading);
}

.company-input {
    width: 100%;
    padding: var(--space-4);
    background: var(--color-bg);
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
