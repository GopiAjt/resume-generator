<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
    selectedTemplate: string;
    generatedResumeHtml: string;
}>();

const resumeContainer = ref<HTMLElement | null>(null);

// Expose the container ref so the parent (CreateResumeView) can pass it to useResumeExporter
defineExpose({
    resumeContainer
});
</script>

<template>
    <div class="resume-paper" :class="'template-' + selectedTemplate" ref="resumeContainer">
        <div class="resume-content" v-html="generatedResumeHtml"></div>
    </div>
</template>

<style scoped>
.resume-paper {
    background: white;
    background-image: repeating-linear-gradient(to bottom,
            transparent,
            transparent calc(297mm - 1px),
            #e2e8f0 calc(297mm - 1px),
            #e2e8f0 297mm);
    background-size: 100% 297mm;
    color: #1a202c;
    /* padding: 0.75in; Removed by user in latest update */
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

/* Clean Printing Styles */
.resume-paper.is-printing {
    width: 210mm !important;
    padding: 0 !important;
    /* Managed by PDF margins */
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    background-image: none !important;
    transition: none !important;
}

.resume-paper.is-printing :deep(*) {
    max-width: 190mm !important;
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

.resume-paper.is-printing::after {
    display: none !important;
}

.resume-content {
    display: flex;
    flex-direction: column;
    background: transparent;
    padding: 0;
    margin: 0;
}

@media (max-width: 768px) {
    .resume-paper {
        width: 100%;
        max-width: 100%;
        min-height: auto;
        padding: var(--space-6);
        box-shadow: none;
        border: 1px solid var(--color-border);
    }
}
</style>
