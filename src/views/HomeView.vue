<script setup lang="ts">
</script>

<template>
  <div class="home">
    <section class="hero">
      <div class="container">
        <h1 class="text-display fade-in" style="animation-delay: 100ms">
          Create Your Professional<br>Resume in Minutes.
        </h1>
        <p class="subtitle fade-in" style="animation-delay: 200ms">
          Stand out from the crowd with our premium, AI-powered resume builder. Designed for professionals who demand
          excellence.
        </p>

        <div class="cta-group fade-in" style="animation-delay: 300ms">
          <RouterLink to="/create-resume" class="btn btn-primary">Create My Resume</RouterLink>
          <!-- <a href="#" class="btn btn-secondary">View Templates</a> -->
        </div>
      </div>

      <div class="hero-bg"></div>
    </section>

    <section class="features container">
      <div class="feature-card">
        <div class="icon">✨</div>
        <h3>Professional Designs</h3>
        <p>Choose from our curated collection of premium templates.</p>
      </div>
      <div class="feature-card">
        <div class="icon">🚀</div>
        <h3>ATS Friendly</h3>
        <p>Ensure your resume gets past the robots and into human hands.</p>
      </div>
      <div class="feature-card">
        <div class="icon">🔒</div>
        <h3>Private & Secure</h3>
        <p>Your data is encrypted and stored locally on your device.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
.hero {
  padding: var(--space-16) 0;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: var(--space-6);
  line-height: 1.1;
}

.subtitle {
  font-size: 1.25rem;
  max-width: 600px;
  margin: 0 auto var(--space-8);
  color: var(--color-text-muted);
}

.cta-group {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-8);
  padding: var(--space-16) var(--space-4);
}

.feature-card {
  background: var(--color-surface);
  padding: var(--space-8);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  transition: transform var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-5px);
  border-color: var(--color-primary);
  box-shadow: var(--shadow-xl);
}

.icon {
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
}

@media (min-width: 768px) {
  .hero h1 {
    font-size: 4.5rem;
  }
}
</style>
