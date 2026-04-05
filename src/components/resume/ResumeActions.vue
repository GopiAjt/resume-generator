<script setup lang="ts">
defineProps<{
    isGenerating: boolean;
}>();

defineEmits<{
    (e: 'download-pdf'): void;
    (e: 'download-doc'): void;
    (e: 'copy-markdown'): void;
    (e: 'start-over'): void;
}>();
</script>

<template>
    <div class="preview-actions">
        <button @click="$emit('download-pdf')" class="btn btn-primary" title="Recommended for Mobile">Download
            PDF</button>
        <button @click="$emit('download-doc')" class="btn btn-secondary">Download DOC</button>
        <button @click="$emit('copy-markdown')" class="btn btn-secondary" title="Copy as Text">Copy Markdown</button>
        <button @click="$emit('start-over')" class="btn btn-secondary danger">Start Over</button>
    </div>
</template>

<style scoped>
.preview-actions {
    display: flex;
    gap: var(--space-4);
    flex-wrap: wrap;
    justify-content: flex-end;
}

.btn {
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-md);
    font-weight: 700;
    cursor: pointer;
    transition: all var(--transition-base);
    border: none;
    font-size: 0.95rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.btn:active {
    transform: translateY(0);
}

.btn-primary {
    background: var(--color-primary);
    color: white;
    box-shadow: 0 4px 14px hsla(var(--hue-primary), 80%, 60%, 0.4);
}

.btn-primary:hover {
    background: var(--color-secondary);
}

.btn-secondary {
    background: transparent;
    border: 1px solid var(--color-border);
    color: var(--color-text);
}

.btn-secondary.danger {
    color: #dc2626;
    /* var(--color-danger) from global if available, but staying safe */
    border-color: hsla(0, 80%, 60%, 0.2);
}

.btn-secondary.danger:hover {
    background: hsla(0, 80%, 60%, 0.05);
    border-color: #dc2626;
}

@media (max-width: 640px) {
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
        margin: 0;
    }
}
</style>
