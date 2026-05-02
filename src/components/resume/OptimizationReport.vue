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
    <div class="optimization-report fade-in-up">
        <div class="report-header">
            <div class="header-main">
                <span class="report-icon pulse">✨</span>
                <h3>Optimization Insights</h3>
            </div>
            <div class="score-comparison">
                <div class="ats-score-badge original" :class="getScoreClass(originalAtsScore)">
                    <span class="score-label">Original</span>
                    <span class="score-value">{{ originalAtsScore }}<span class="pct">%</span></span>
                </div>
                <div class="score-arrow">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                    </svg>
                </div>
                <div class="ats-score-badge tailored glass" :class="getScoreClass(atsScore)">
                    <span class="score-label">Tailored</span>
                    <span class="score-value">{{ atsScore }}<span class="pct">%</span></span>
                </div>
            </div>
            <p class="score-disclaimer">
                * Note: These are keyword matching estimates, not definitive ATS scoring.
            </p>
        </div>
        <div class="report-content">
            <ul class="report-list">
                <li v-for="(item, index) in (optimizationReport || [])" :key="index"
                    class="report-item glass-card slide-in" :style="{ animationDelay: `${index * 0.1}s` }">
                    <div class="report-item-header">
                        <span class="report-category">
                            <span class="dot"></span>
                            {{ item.category }}
                        </span>
                        <span class="report-impact" :class="item.impact.toLowerCase()">
                            <span class="impact-indicator"></span>
                            {{ item.impact }} Impact
                        </span>
                    </div>
                    <div class="report-action">{{ item.action }}</div>
                </li>
            </ul>
        </div>
    </div>
</template>

<style scoped>
.optimization-report {
    margin-top: var(--space-8);
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.5));
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: var(--radius-xl);
    padding: var(--space-8);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05), 0 5px 15px rgba(0, 0, 0, 0.03);
    position: relative;
    max-width: 210mm;
    margin-inline: auto;
}

@media (prefers-color-scheme: dark) {
    .optimization-report {
        background: linear-gradient(145deg, hsla(220, 30%, 15%, 0.8), hsla(220, 30%, 10%, 0.6));
        border: 1px solid hsla(220, 30%, 30%, 0.4);
        box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
    }
}

.report-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    margin-bottom: var(--space-6);
    padding-bottom: var(--space-6);
    border-bottom: 2px dashed rgba(var(--color-primary-rgb), 0.15);
}

.header-main {
    display: flex;
    align-items: center;
    gap: var(--space-3);
    margin-bottom: var(--space-4);
}

.report-icon {
    font-size: 1.8rem;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.pulse {
    animation: gentle-pulse 2.5s infinite;
}

@keyframes gentle-pulse {

    0%,
    100% {
        transform: scale(1);
    }

    50% {
        transform: scale(1.1) rotate(5deg);
    }
}

h3 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.02em;
}

.score-comparison {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    background: rgba(var(--color-primary-rgb), 0.03);
    padding: var(--space-3) var(--space-6);
    border-radius: var(--radius-full);
}



.score-arrow {
    color: var(--color-primary);
    animation: flow-right 1.5s infinite alternate ease-in-out;
}

@keyframes flow-right {
    0% {
        transform: translateX(-3px);
    }

    100% {
        transform: translateX(3px);
        filter: drop-shadow(0 0 5px rgba(var(--color-primary-rgb), 0.5));
    }
}

.ats-score-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--space-2) var(--space-5);
    border-radius: var(--radius-lg);
    min-width: 90px;
    box-shadow: inset 0 2px 4px rgba(255, 255, 255, 0.5);
}

.ats-score-badge.original {
    background: hsla(220, 20%, 94%, 1);
    border: 1px solid hsla(220, 20%, 85%, 1);
}

.ats-score-badge.tailored.glass {
    position: relative;
    overflow: hidden;
    color: white;
}

.ats-score-badge.tailored.glass::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 50%;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.4), transparent);
    transform: skewX(-20deg);
    animation: shine 3s infinite;
}

@keyframes shine {
    0% {
        left: -100%;
    }

    20%,
    100% {
        left: 200%;
    }
}

.ats-score-badge.high.tailored {
    background: linear-gradient(135deg, #10b981, #059669);
    border: 1px solid #047857;
    box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.ats-score-badge.high.tailored .score-value,
.ats-score-badge.high.tailored .score-label {
    color: #fff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.score-label {
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 2px;
}

.ats-score-badge.original .score-label {
    color: var(--color-text-muted);
}

.score-value {
    font-size: 1.5rem;
    font-weight: 900;
    line-height: 1;
}

.ats-score-badge.original .score-value {
    color: rgb(23, 23, 23);
}

.pct {
    font-size: 0.9rem;
    opacity: 0.8;
}

.score-disclaimer {
    width: 100%;
    font-size: 0.8rem;
    color: var(--color-text-muted);
    margin-top: var(--space-3);
    text-align: right;
    font-style: italic;
    opacity: 0.7;
}

.report-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: var(--space-4);
}

.glass-card {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: var(--radius-lg);
    padding: var(--space-5);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.glass-card:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
    background: rgba(255, 255, 255, 0.9);
}

@media (prefers-color-scheme: dark) {
    .glass-card {
        background: rgba(0, 0, 0, 0.2);
        border-color: rgba(255, 255, 255, 0.05);
    }

    .glass-card:hover {
        background: rgba(0, 0, 0, 0.4);
    }
}

.report-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-3);
}

.report-category {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.85rem;
    font-weight: 800;
    text-transform: uppercase;
    color: var(--color-primary);
    background: hsla(var(--hue-primary), 50%, 95%, 1);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
}

.dot {
    width: 6px;
    height: 6px;
    background: currentColor;
    border-radius: 50%;
    opacity: 0.8;
}

.report-impact {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-full);
    letter-spacing: 0.05em;
}

.impact-indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
}

.report-impact.high {
    color: #047857;
    background: #d1fae5;
}

.report-impact.high .impact-indicator {
    background: #10b981;
    box-shadow: 0 0 8px #10b981;
}

.report-impact.medium {
    color: #b45309;
    background: #fef3c7;
}

.report-impact.medium .impact-indicator {
    background: #f59e0b;
    box-shadow: 0 0 8px #f59e0b;
}

.report-impact.low {
    color: #b91c1c;
    background: #fee2e2;
}

.report-impact.low .impact-indicator {
    background: #ef4444;
    box-shadow: 0 0 8px #ef4444;
}

.report-action {
    font-size: 1.05rem;
    line-height: 1.6;
    color: var(--color-heading);
    font-weight: 500;
}

/* Animations */
.fade-in-up {
    animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.slide-in {
    opacity: 0;
    animation: slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(-15px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Mobile Adjustments for Optimization Report */
@media (max-width: 768px) {
    .optimization-report {
        padding: var(--space-4) var(--space-3);
        margin-top: var(--space-4);
        border-radius: var(--radius-md);
        width: 100%;
        box-sizing: border-box;
    }

    .report-header {
        flex-direction: column;
        align-items: center;
        padding-bottom: var(--space-4);
        margin-bottom: var(--space-4);
    }

    .header-main {
        width: 100%;
        justify-content: center;
        margin-bottom: var(--space-2);
    }

    h3 {
        font-size: 1.2rem;
        text-align: center;
    }

    .report-icon {
        font-size: 1.2rem;
    }

    .score-comparison {
        width: 100%;
        justify-content: center;
        gap: var(--space-3);
        padding: var(--space-3) var(--space-2);
        background: transparent;
        flex-wrap: wrap;
    }

    .ats-score-badge {
        flex: 1;
        min-width: 90px;
        padding: var(--space-2);
    }

    .score-value {
        font-size: 1.25rem;
    }

    .score-label {
        font-size: 0.6rem;
    }

    .glass-card {
        padding: var(--space-3);
    }

    .report-item-header {
        flex-direction: row;
        flex-wrap: wrap;
        align-items: center;
        gap: var(--space-2);
        margin-bottom: var(--space-2);
    }

    .report-category,
    .report-impact {
        font-size: 0.7rem;
        padding: var(--space-1) var(--space-2);
    }

    .report-action {
        font-size: 0.9rem;
        line-height: 1.5;
    }

    .score-disclaimer {
        text-align: center;
        margin-top: 0;
        font-size: 0.7rem;
    }
}
</style>
