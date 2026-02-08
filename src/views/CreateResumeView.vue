<script setup lang="ts">
import { ref } from 'vue'

const jobDescription = ref('')

const handleSubmit = () => {
    console.log('Job Description submitted:', jobDescription.value)
    // TODO: Navigate to resume editor or next step
}
</script>

<template>
    <div class="create-resume container fade-in">
        <div class="header-section">
            <h1 class="text-display">Target Your Resume</h1>
            <p class="subtitle">Paste the job description below to tailor your resume for this specific role.</p>
        </div>

        <div class="input-section">
            <div class="form-group">
                <label for="job-description">Job Description</label>
                <textarea id="job-description" v-model="jobDescription"
                    placeholder="Paste the full job description here..." rows="10"></textarea>
            </div>

            <div class="actions">
                <button @click="handleSubmit" class="btn btn-primary" :disabled="!jobDescription.trim()">
                    Continue to Resume Builder
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.create-resume {
    padding: var(--space-12) var(--space-4);
    max-width: 800px;
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
</style>
