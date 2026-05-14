<script setup lang="ts">
import { computed } from 'vue';
import { useHead } from '@unhead/vue';
import { useRoute, useRouter } from 'vue-router';
import { getAbsoluteUrl, type SeoMeta } from '@/utils/seo';

const router = useRouter();
const route = useRoute();
const goHome = () => router.push('/');

const seoMeta = computed(() => route.meta as SeoMeta);
const canonicalUrl = computed(() => getAbsoluteUrl(route.path));
const previewImage = 'https://www.resumegen.pro/og-image.png';
const keywordMeta = computed(() =>
  seoMeta.value.keywords ? [{ name: 'keywords', content: seoMeta.value.keywords }] : [],
);

useHead(() => ({
  title: seoMeta.value.title,
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value,
    },
  ],
  meta: [
    { name: 'title', content: seoMeta.value.title },
    { name: 'description', content: seoMeta.value.description },
    ...keywordMeta.value,
    { name: 'robots', content: seoMeta.value.robots || 'index, follow' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'ResumeGen' },
    { property: 'og:url', content: canonicalUrl.value },
    { property: 'og:title', content: seoMeta.value.title },
    { property: 'og:description', content: seoMeta.value.description },
    { property: 'og:image', content: seoMeta.value.image || previewImage },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: 'ResumeGen AI resume optimizer preview' },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:url', content: canonicalUrl.value },
    { property: 'twitter:title', content: seoMeta.value.title },
    { property: 'twitter:description', content: seoMeta.value.description },
    { property: 'twitter:image', content: seoMeta.value.image || previewImage },
  ],
}));
</script>

<template>
  <header>
    <div class="container navbar">
      <div class="logo">
        <span
          class="logo-text"
          @click="goHome"
          @keydown.enter.prevent="goHome"
          @keydown.space.prevent="goHome"
          role="button"
          tabindex="0"
          aria-label="Go to home page"
        >
          ResumeGen
        </span>
      </div>
      <nav aria-label="Main navigation">
        <RouterLink to="/">Home</RouterLink>
      </nav>
    </div>
  </header>

  <main>
    <RouterView v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </RouterView>
  </main>

  <footer>
    <div class="container">
      <p style="font-size: smaller;">&copy; {{ new Date().getFullYear() }} ResumeGen. All rights reserved.</p>
      <nav class="footer-nav" aria-label="Footer navigation">
        <RouterLink to="/resume-generator">Resume Generator</RouterLink>
        <RouterLink to="/free-resume-builder">Free Resume Builder</RouterLink>
        <RouterLink to="/ats-resume-maker">ATS Resume Maker</RouterLink>
        <RouterLink to="/professional-resume-template">Resume Templates</RouterLink>
        <RouterLink to="/ai-resume-generator">AI Resume Generator</RouterLink>
        <RouterLink to="/privacy">Privacy Policy</RouterLink>
        <RouterLink to="/terms">Terms of Service</RouterLink>
      </nav>
    </div>
  </footer>
</template>

<style scoped>
header {
  padding: var(--space-4) 0;
  backdrop-filter: blur(10px);
  position: sticky;
  top: 0;
  z-index: 100;
  background: hsl(220 20% 98% / 0.82);
  border-bottom: 1px solid var(--color-border);
}

@media (prefers-color-scheme: dark) {
  header {
    background: hsl(220 40% 8% / 0.78);
  }
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-text {
  display: inline-flex;
  border-radius: var(--radius-sm);
  font-family: var(--font-family-display);
  font-weight: 800;
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  cursor: pointer;
}

.logo-text:focus-visible {
  outline: 3px solid hsla(var(--hue-primary), 80%, 60%, 0.35);
  outline-offset: 4px;
}

nav {
  display: flex;
  gap: var(--space-6);
}

nav a {
  text-decoration: none;
  color: var(--color-text-muted);
  font-weight: 500;
  transition: color var(--transition-fast);
}

nav a:hover,
nav a.router-link-active {
  color: var(--color-primary);
}

main {
  flex: 1;
}

footer {
  padding: var(--space-8) 0;
  text-align: center;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
}

.footer-nav {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
  margin-top: var(--space-4);
  flex-wrap: wrap;
}

.footer-nav a {
  text-decoration: none;
  color: var(--color-text-muted);
  font-size: 0.85rem;
  transition: color var(--transition-fast);
}

.footer-nav a:hover {
  color: var(--color-primary);
}

/* Page Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
