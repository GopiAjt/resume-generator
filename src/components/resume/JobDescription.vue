<script setup lang="ts">
defineProps<{
    modelValue: string;
    disabled?: boolean;
}>();

defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
    <div class="form-group">
        <label for="job-description">Target Job Description</label>
        <textarea id="job-description" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
            placeholder="Paste the job description here to optimize your resume..." rows="10"
            :disabled="disabled"></textarea>
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

textarea {
    width: 100%;
    padding: var(--space-4);
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    color: var(--color-text);
    font-family: var(--font-family-base);
    font-size: 1rem;
    transition: all var(--transition-base);
    resize: vertical;
}

textarea:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px hsla(var(--hue-primary), 80%, 60%, 0.1);
}

@media (max-width: 768px) {
    textarea {
        font-size: 16px;
        /* Prevents auto-zoom on iOS */
    }
}
</style>
