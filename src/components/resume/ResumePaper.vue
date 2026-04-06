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
    color: #1e293b;
    padding: 2%;
    /* User preference preserved */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    margin: 0 auto var(--space-10);
    width: 210mm;
    min-height: 297mm;
    height: auto;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
    line-height: 1.5;
    text-align: left;
    box-sizing: border-box;
    transition: all var(--transition-base);
    position: relative;
    overflow-wrap: break-word;
}

/* Global Reset for Lists in Preview to Prevent Double Bullets */
.resume-paper :deep(ul) {
    list-style: none !important;
    padding-left: 0 !important;
    margin: 0 !important;
}

.resume-paper :deep(li) {
    list-style: none !important;
    position: relative;
    padding-left: 1.4rem;
    margin-bottom: 4pt;
    line-height: 1.5;
}

.resume-paper :deep(p) {
    margin: 0 0 6pt 0;
}

.resume-paper :deep(h1),
.resume-paper :deep(h2),
.resume-paper :deep(h3) {
    margin: 0;
    padding: 0;
    color: #0f172a;
    font-weight: 700;
}

/* Template Specific Content Styles */

/* MODERN */
.template-modern {
    font-family: 'Inter', sans-serif !important;
}

.template-modern :deep(h1) {
    font-size: 24pt;
    font-weight: 800;
    color: #2563eb;
    margin-bottom: 6pt;
    letter-spacing: -0.02em;
}

.template-modern :deep(.resume-meta) {
    font-size: 10pt;
    color: #475569;
    margin-bottom: 16pt;
    font-weight: 500;
}

.template-modern :deep(h2) {
    font-size: 12pt;
    font-weight: 700;
    color: #2563eb;
    text-transform: uppercase;
    border-bottom: 2px solid #2563eb;
    padding-bottom: 4pt;
    margin-top: 18pt;
    margin-bottom: 8pt;
    letter-spacing: 0.05em;
}

.template-modern :deep(h3) {
    font-size: 11pt;
    font-weight: 700;
    margin-top: 10pt;
    margin-bottom: 2pt;
}

.template-modern :deep(li::before) {
    content: "•";
    position: absolute;
    left: 0;
    color: #2563eb;
    font-weight: bold;
}

/* EXECUTIVE */
.template-executive {
    font-family: 'Georgia', serif !important;
}

.template-executive :deep(h1) {
    font-size: 26pt;
    text-align: center;
    font-weight: 400;
    margin-bottom: 6pt;
    color: #4338ca;
}

.template-executive :deep(.resume-meta) {
    text-align: center;
    font-size: 10pt;
    border-bottom: 2px solid #4338ca;
    padding-bottom: 8pt;
    margin-bottom: 20pt;
    color: #6366f1;
}

.template-executive :deep(h2) {
    font-size: 13pt;
    text-transform: uppercase;
    text-align: center;
    border-top: 2px solid #4338ca;
    border-bottom: 1px solid #4338ca;
    padding: 4pt 0;
    margin-top: 20pt;
    margin-bottom: 10pt;
    font-weight: 700;
    color: #4338ca;
}

.template-executive :deep(h3) {
    font-size: 11.5pt;
    font-weight: 700;
    margin-top: 12pt;
    margin-bottom: 3pt;
    color: #1a202c;
}

.template-executive :deep(li::before) {
    content: "▪";
    position: absolute;
    left: 0;
    color: #4338ca;
}

/* MINIMAL */
.template-minimal {
    font-family: 'Inter', sans-serif !important;
}

.template-minimal :deep(h1) {
    font-size: 22pt;
    font-weight: 300;
    margin-bottom: 4pt;
    color: #059669;
}

.template-minimal :deep(.resume-meta) {
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #10b981;
    margin-bottom: 24pt;
}

.template-minimal :deep(h2) {
    font-size: 10pt;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-top: 24pt;
    margin-bottom: 8pt;
    color: #059669;
    border-left: 4px solid #059669;
    padding-left: 10pt;
}

.template-minimal :deep(h3) {
    font-size: 11pt;
    font-weight: 600;
    margin-top: 12pt;
    margin-bottom: 3pt;
    color: #065f46;
}

.template-minimal :deep(li::before) {
    content: "—";
    position: absolute;
    left: 0;
    color: #10b981;
    font-weight: 800;
}

/* TECHNICAL */
.template-technical {
    font-family: 'JetBrains Mono', monospace !important;
    font-size: 9.5pt !important;
}

.template-technical :deep(h1) {
    font-size: 22pt;
    font-weight: 800;
    border-left: 6px solid #7c3aed;
    padding: 6pt 12pt;
    background: #f5f3ff;
    margin-bottom: 6pt;
    color: #5b21b6;
}

.template-technical :deep(.resume-meta) {
    font-size: 9pt;
    background: #7c3aed;
    color: #fff;
    padding: 8pt 12pt;
    margin-bottom: 20pt;
    border-radius: 0 0 10px 10px;
    font-weight: 600;
}

.template-technical :deep(h2) {
    font-size: 11pt;
    font-weight: 800;
    background: #f3f4f6;
    padding: 5pt 10pt;
    margin-top: 18pt;
    margin-bottom: 8pt;
    border-radius: 4px;
    color: #4c1d95;
    border-right: 4px solid #7c3aed;
}

.template-technical :deep(h3) {
    font-size: 10.5pt;
    font-weight: 700;
    color: #7c3aed;
    border-bottom: 2px dashed #ddd6fe;
    display: inline-block;
    margin-top: 10pt;
    margin-bottom: 3pt;
}

.template-technical :deep(li::before) {
    content: "::";
    position: absolute;
    left: 0;
    color: #7c3aed;
    font-weight: 800;
}

/* Mobile Adjustments for Preview */
@media (max-width: 768px) {
    .resume-paper {
        width: 100%;
        max-width: 100%;
        min-height: auto;
        padding: 2%;
        /* User preference preserved */
        box-shadow: none;
        border: 1px solid var(--color-border);
    }

    .template-technical :deep(h1) {
        border-left-width: 4px;
        font-size: 18pt;
    }

    .template-technical :deep(.resume-meta) {
        border-radius: 4px;
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
</style>
