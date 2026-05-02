<script setup lang="ts">
import { computed, ref } from 'vue';
import { getTemplateStyles } from '@/services/resumeStyles';

const props = defineProps<{
    selectedTemplate: string;
    generatedResumeHtml: string;
}>();

const resumeContainer = ref<HTMLElement | null>(null);
const previewTemplateStyles = computed(() =>
    getTemplateStyles(props.selectedTemplate, false, `.resume-paper.template-${props.selectedTemplate}`)
);

// Expose the container ref so the parent (CreateResumeView) can pass it to useResumeExporter
defineExpose({
    resumeContainer
});
</script>

<template>
    <div class="resume-paper" :class="'template-' + selectedTemplate" ref="resumeContainer">
        <component :is="'style'">{{ previewTemplateStyles }}</component>
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
    color: #0f172a;
    /* Slate 900 - High Visibility Primary Text */
    padding: 12.7mm;
    /* User preference preserved */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
    margin: 0 auto var(--space-10);
    width: 210mm;
    min-height: 297mm;
    height: auto;
    font-family: Arial, Helvetica, sans-serif;
    line-height: 1.5;
    text-align: left;
    box-sizing: border-box;
    transition: all var(--transition-base);
    position: relative;
    overflow-wrap: break-word;
}

/* Mobile Adjustments for Preview */
@media (max-width: 768px) {
    .resume-paper:not(.pdf-export) {
        width: 100%;
        max-width: 100%;
        min-height: auto;
        padding: 4%;
        box-shadow: none;
        border: 1px solid var(--color-border);
    }

    .resume-paper:not(.pdf-export) {
        font-size: 8pt;
        line-height: 1.3;
    }
}

/* Removes elements that only make sense in the browser, not in PDF output */
.resume-paper.is-printing {
    width: 210mm !important;
    padding: 10mm 12mm !important;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    background-image: none !important;
    transition: none !important;
    font-size: 10pt !important;
    line-height: 1.5 !important;
}

/* Do NOT constrain max-width in print — breaks Technical full-bleed headers */
.resume-paper.is-printing :deep(*) {
    box-shadow: none !important;
}

/* ATS-Friendly PDF Export Styles */
.resume-paper.pdf-export {
    width: 210mm;
    min-height: 0 !important;
    height: auto !important;
    padding: 0mm 5mm;
    margin: 0 !important;
    box-shadow: none !important;
    border: none !important;
    border-radius: 0 !important;
    background-image: none !important;
}

.resume-paper.pdf-export::after {
    display: none !important;
}

/* Prevent bad splits - avoid breaking inside these elements */
.resume-paper.pdf-export :deep(h1),
.resume-paper.pdf-export :deep(h2),
.resume-paper.pdf-export :deep(h3) {
    page-break-after: avoid;
    break-after: avoid;
}

.resume-paper.pdf-export :deep(h1),
.resume-paper.pdf-export :deep(h2),
.resume-paper.pdf-export :deep(h3),
.resume-paper.pdf-export :deep(p),
.resume-paper.pdf-export :deep(li) {
    orphans: 3;
    widows: 3;
}

/* Force page breaks where needed */
.resume-paper.pdf-export :deep(.page-break) {
    page-break-before: always;
    break-before: page;
}

/* Avoid breaking inside sections */
.resume-paper.pdf-export :deep(.section),
.resume-paper.pdf-export :deep(.experience-item),
.resume-paper.pdf-export :deep(.project-item),
.resume-paper.pdf-export :deep(.education-item) {
    page-break-inside: avoid;
    break-inside: avoid;
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
