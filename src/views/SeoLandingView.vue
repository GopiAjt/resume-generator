<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import {
  seoLandingPageByPath,
  seoLandingPages,
  type SeoLandingPage,
} from '@/data/seoLandingPages'

const route = useRoute()
const fallbackPage = seoLandingPages[0]!
const page = computed<SeoLandingPage>(() => seoLandingPageByPath.get(route.path) || fallbackPage)
const relatedPages = computed(() => seoLandingPages.filter((item) => item.path !== page.value.path))
</script>

<template>
  <article class="seo-page">
    <section class="seo-hero">
      <div class="container seo-hero-inner">
        <p class="eyebrow">{{ page.keyword }}</p>
        <h1>{{ page.headline }}</h1>
        <p class="intro">{{ page.intro }}</p>
        <div class="actions">
          <RouterLink to="/create-resume" class="btn btn-primary">Create My Resume</RouterLink>
          <RouterLink to="/" class="btn btn-secondary">Explore ResumeGen</RouterLink>
        </div>
      </div>
    </section>

    <section class="container content-grid" aria-label="Benefits">
      <div v-for="benefit in page.benefits" :key="benefit" class="benefit-card">
        <span aria-hidden="true">✓</span>
        <p>{{ benefit }}</p>
      </div>
    </section>

    <section class="container detail-section">
      <div v-for="section in page.sections" :key="section.heading" class="detail-block">
        <h2>{{ section.heading }}</h2>
        <p>{{ section.body }}</p>
      </div>
    </section>

    <section class="container faq-section">
      <div class="section-header">
        <p class="eyebrow">Common Questions</p>
        <h2>{{ page.keyword }} FAQ</h2>
      </div>

      <div class="faq-list">
        <details v-for="faq in page.faqs" :key="faq.question" open>
          <summary>{{ faq.question }}</summary>
          <p>{{ faq.answer }}</p>
        </details>
      </div>
    </section>

    <section class="container related-section">
      <div class="section-header">
        <p class="eyebrow">Related Tools</p>
        <h2>More ResumeGen Pages</h2>
      </div>

      <div class="related-links">
        <RouterLink v-for="item in relatedPages" :key="item.path" :to="item.path">
          {{ item.keyword }}
        </RouterLink>
      </div>
    </section>
  </article>
</template>

<style scoped>
.seo-page {
  padding-bottom: var(--space-16);
}

.seo-hero {
  padding: var(--space-16) 0 var(--space-12);
  border-bottom: 1px solid var(--color-border);
  background: linear-gradient(180deg, var(--color-surface), transparent);
}

.seo-hero-inner {
  max-width: 880px;
}

.eyebrow {
  color: var(--color-primary);
  font-size: 0.82rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  margin-bottom: var(--space-3);
  text-transform: uppercase;
}

h1 {
  color: var(--color-heading);
  font-family: var(--font-family-display);
  font-size: clamp(2.35rem, 5vw, 4.6rem);
  line-height: 1.05;
  margin-bottom: var(--space-6);
}

.intro {
  color: var(--color-text-muted);
  font-size: 1.2rem;
  max-width: 760px;
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-8);
}

.content-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: var(--space-12);
}

.benefit-card {
  align-items: flex-start;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  gap: var(--space-3);
  min-height: 120px;
  padding: var(--space-6);
}

.benefit-card span {
  color: var(--color-primary);
  font-weight: 800;
}

.benefit-card p,
.detail-block p,
details p {
  margin-bottom: 0;
}

.detail-section {
  display: grid;
  gap: var(--space-8);
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: var(--space-16);
}

.detail-block h2,
.section-header h2 {
  color: var(--color-heading);
  font-size: 2rem;
}

.faq-section,
.related-section {
  margin-top: var(--space-16);
}

.section-header {
  margin-bottom: var(--space-6);
  max-width: 720px;
}

.faq-list {
  display: grid;
  gap: var(--space-4);
}

details {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-5);
}

summary {
  color: var(--color-heading);
  cursor: pointer;
  font-weight: 700;
  margin-bottom: var(--space-2);
}

.related-links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.related-links a {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  color: var(--color-text);
  padding: var(--space-2) var(--space-4);
  text-decoration: none;
}

.related-links a:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

@media (max-width: 800px) {
  .content-grid,
  .detail-section {
    grid-template-columns: 1fr;
  }

  .seo-hero {
    padding-top: var(--space-12);
  }
}
</style>
