<script setup lang="ts">
import { getScoreClass } from '@/utils/resumeUtils';

interface OptimizationItem {
    category: string;
    action: string;
    impact: string;
}

defineProps<{
    optimizationReport: OptimizationItem[];
    originalAtsScore: number;
    atsScore: number;
}>();
</script>

<template>
    <div class="optimization-report">
        <div class="report-header">
            <div class="header-main">
                <span class="report-icon">📊</span>
                <h3>Optimization Report</h3>
            </div>
            <div class="score-comparison">
                <div class="ats-score-badge original" :class="getScoreClass(originalAtsScore)">
                    <span class="score-label">Original</span>
                    <span class="score-value">{{ originalAtsScore }}%</span>
                </div>
                <div class="score-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </div>
                <div class="ats-score-badge tailored" :class="getScoreClass(atsScore)">
                    <span class="score-label">Tailored</span>
                    <span class="score-value">{{ atsScore }}%</span>
                </div>
            </div>
            <p class="score-disclaimer">
                * Note: These are approximate keyword match estimates, not scores from a real ATS engine.
            </p>
        </div>
        <div class="report-content">
            <ul class="report-list">
                <li v-for="(item, index) in optimizationReport" :key="index" class="report-item">
                    <div class="report-item-header">
                        <span class="report-category">{{ item.category }}</span>
                        <span class="report-impact" :class="item.impact.toLowerCase()">{{ item.impact }} Impact</span>
                    </div>
                    <div class="report-action">{{ item.action }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.optimization-report {
    margin-top: var(--space-10);
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    box-shadow: var(--shadow-lg);
    position: relative;
    overflow: hidden;
    width: 100%;
    max-width: 210mm;
}

@media (prefers-color-scheme: dark) {
    .optimization-report {
        background: hsla(220, 40%, 10%, 1);
        border-color: hsla(220, 40%, 20%, 1);
    }
}

.report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-4);
    border-bottom: 1px solid var(--color-border);
}

@media (max-width: 640px) {
    .report-header {
        flex-direction: column;
        gap: var(--space-4);
        align-items: flex-start;
    }

    .score-comparison {
        width: 100%;
        justify-content: space-between;
    }
}

.header-main {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.report-icon {
    font-size: 1.5rem;
}

h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-heading);
}

.score-comparison {
    display: flex;
    align-items: center;
    gap: var(--space-3);
}

.score-arrow {
    color: var(--color-text-muted);
    display: flex;
    align-items: center;
    animation: move-right 2s infinite ease-in-out;
}

@keyframes move-right {

    0%,
    100% {
        transform: translateX(0);
    }

    50% {
        transform: translateX(4px);
    }
}

.ats-score-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-1) var(--space-4);
    background: hsla(var(--hue-primary), 50%, 95%, 1);
    border-radius: var(--radius-lg);
    border: 1px solid hsla(var(--hue-primary), 50%, 85%, 1);
    min-width: 80px;
}

.ats-score-badge.original {
    background: hsla(220, 20%, 96%, 1);
    border-color: var(--color-border);
    opacity: 0.8;
}

.ats-score-badge.high {
    background: hsla(142, 70%, 95%, 1);
    border-color: hsla(142, 70%, 85%, 1);
}

.ats-score-badge.high .score-value {
    color: #059669;
}

.ats-score-badge.medium {
    background: hsla(45, 90%, 95%, 1);
    border-color: hsla(45, 90%, 85%, 1);
}

.ats-score-badge.medium .score-value {
    color: #d97706;
}

.ats-score-badge.low {
    background: hsla(0, 80%, 95%, 1);
    border-color: hsla(0, 80%, 85%, 1);
}

.ats-score-badge.low .score-value {
    color: #dc2626;
}

@media (prefers-color-scheme: dark) {
    .ats-score-badge {
        background: hsla(220, 40%, 15%, 1);
        border-color: hsla(220, 40%, 25%, 1);
    }

    .ats-score-badge.original {
        background: hsla(220, 40%, 12%, 1);
        border-color: hsla(220, 40%, 18%, 1);
    }

    .ats-score-badge.high {
        background: hsla(142, 70%, 10%, 1);
    }

    .ats-score-badge.medium {
        background: hsla(45, 90%, 10%, 1);
    }

    .ats-score-badge.low {
        background: hsla(0, 80%, 10%, 1);
    }
}

.score-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--color-text-muted);
}

.score-value {
    font-size: 1.25rem;
    font-weight: 800;
    color: var(--color-primary);
}

.report-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
}

.report-item {
    background: hsla(var(--hue-primary), 20%, 98%, 1);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    padding: var(--space-4);
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
}

.report-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.report-category {
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-primary);
    background: hsla(var(--hue-primary), 50%, 90%, 0.5);
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
}

.report-impact {
    font-size: 0.8rem;
    font-weight: 600;
    padding: var(--space-1) var(--space-2);
    border-radius: var(--radius-sm);
}

.report-impact.high {
    color: #059669;
    background: hsla(142, 70%, 90%, 0.5);
}

.report-impact.medium {
    color: #d97706;
    background: hsla(45, 90%, 90%, 0.5);
}

.report-impact.low {
    color: #dc2626;
    background: hsla(0, 80%, 90%, 0.5);
}

.report-action {
    font-size: 1rem;
    line-height: 1.5;
    color: var(--color-heading);
}

@media (prefers-color-scheme: dark) {
    .report-item {
        background: hsla(220, 40%, 12%, 1);
    }
}

.score-disclaimer {
    font-size: 0.8rem;
    color: var(--color-text-muted);
    margin-top: var(--space-4);
    text-align: center;
    font-style: italic;
}
</style>
