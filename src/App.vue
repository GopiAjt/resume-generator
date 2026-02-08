<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="container navbar">
      <div class="logo">
        <span class="logo-text">ResumeGen</span>
      </div>

      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
      
      <div class="actions">
        <a href="#" class="btn btn-primary">Get Started</a>
      </div>
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
      <p>&copy; 2024 Resume Generator. All rights reserved.</p>
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
  background: hsla(220, 20%, 98%, 0.8);
  border-bottom: 1px solid var(--color-border);
}

@media (prefers-color-scheme: dark) {
  header {
    background: hsla(220, 40%, 8%, 0.8);
  }
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-text {
  font-family: var(--font-family-display);
  font-weight: 800;
  font-size: 1.5rem;
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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

nav a:hover, nav a.router-link-active {
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
