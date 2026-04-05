<script setup lang="ts">
import { templates } from '@/services/resumeStyles';

defineProps<{
    modelValue: string;
}>();

defineEmits<{
    (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
    <div class="template-selector">
        <div class="template-options">
            <div v-for="temp in templates" :key="temp.id" class="template-card"
                :class="{ 'active': modelValue === temp.id }" @click="$emit('update:modelValue', temp.id)">
                <div class="template-icon">{{ temp.icon }}</div>
                <div class="template-info">
                    <span class="template-name">{{ temp.name }}</span>
                    <span class="template-desc">{{ temp.description }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.template-selector {
    width: 100%;
    margin-bottom: var(--space-8);
}

.template-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--space-4);
    width: 100%;
}

.template-card {
    background: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    padding: var(--space-4);
    display: flex;
    align-items: center;
    gap: var(--space-4);
    cursor: pointer;
    transition: all var(--transition-base);
}

.template-card:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
}

.template-card.active {
    border-color: var(--color-primary);
    background: hsla(var(--hue-primary), 80%, 60%, 0.05);
    box-shadow: 0 0 0 1px var(--color-primary);
}

.template-icon {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
}

@media (prefers-color-scheme: dark) {
    .template-icon {
        background: hsla(220, 40%, 15%, 1);
    }
}

.template-info {
    display: flex;
    flex-direction: column;
}

.template-name {
    font-weight: 700;
    color: var(--color-heading);
}

.template-desc {
    font-size: 0.75rem;
    color: var(--color-text-muted);
}
</style>
