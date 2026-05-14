<script setup lang="ts">
// No reactive state needed — purely presentational
</script>

<template>
  <div class="home">

    <!-- ═══════════════════════════════ HERO ═══════════════════════════════ -->
    <section class="hero">
      <div class="hero-glow hero-glow--1"></div>
      <div class="hero-glow hero-glow--2"></div>

      <div class="container hero-inner">
        <div class="hero-badge fade-in" style="animation-delay: 50ms">
          <span class="badge-dot"></span>
          Resume Generator · Free Resume Builder · No Sign-up Required
        </div>

        <h1 class="hero-heading fade-in" style="animation-delay: 120ms">
          Free Resume Builder<br>
          <span class="gradient-text">and AI Resume Generator</span>
        </h1>

        <p class="hero-sub fade-in" style="animation-delay: 220ms">
          Create a professional resume template, tailor it to a job description, and use
          our ATS resume maker to improve keyword match in seconds.
        </p>

        <div class="cta-group fade-in" style="animation-delay: 320ms">
          <RouterLink to="/create-resume" class="btn btn-primary btn-lg hero-cta" aria-label="Optimize my resume for free">
            <span class="cta-shine" aria-hidden="true"></span>
            <span class="cta-copy">
              <span class="cta-main">Optimize My Resume</span>
              <span class="cta-note">Free ATS match in seconds</span>
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </RouterLink>
          <a href="#how-it-works" class="btn btn-ghost">See How It Works</a>
        </div>

        <div class="hero-proof fade-in" style="animation-delay: 420ms">
          <span>ATS resume maker</span>
          <span>No account needed</span>
          <span>Local file parsing</span>
        </div>
      </div>
    </section>

    <!-- ══════════════════════════ STATS BAR ══════════════════════════════ -->
    <section class="stats-bar">
      <div class="container stats-grid">
        <div class="stat-item">
          <span class="stat-number">4</span>
          <span class="stat-label">Professional Resume Templates</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">~15s</span>
          <span class="stat-label">Average Generation Time</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <span class="stat-number">0</span>
          <span class="stat-label">Accounts or App-Side Resume Storage</span>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════ HOW IT WORKS ═════════════════════════════ -->
    <section class="how-it-works container" id="how-it-works">
      <div class="section-header">
        <p class="section-eyebrow">Simple by Design</p>
        <h2 class="section-title">Three Steps with Our Resume Generator</h2>
      </div>

      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">01</div>
          <div class="step-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
          </div>
          <h3>Upload Your Resume</h3>
          <p>Drop in your existing PDF or DOCX, or start from scratch with the free resume builder form.</p>
        </div>

        <div class="step-connector">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        <div class="step-card">
          <div class="step-number">02</div>
          <div class="step-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3>Paste the Job Description</h3>
          <p>Copy the full JD from any job board — LinkedIn, Indeed, company website — and paste it in.</p>
        </div>

        <div class="step-connector">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>

        <div class="step-card">
          <div class="step-number">03</div>
          <div class="step-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <h3>Download Your ATS-Friendly Resume</h3>
          <p>Get an ATS score, a full optimization report, and download your professional resume template as a PDF or DOC instantly.</p>
        </div>
      </div>
    </section>

    <!-- ════════════════════════════ FEATURES ════════════════════════════ -->
    <section class="features-section container">
      <div class="section-header">
        <p class="section-eyebrow">Why ResumeGen</p>
        <h2 class="section-title">Everything You Need in a Free Resume Builder</h2>
      </div>

      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <h3>ATS Resume Maker</h3>
          <p>See your original vs. tailored ATS score side-by-side so you know exactly how much your match improved.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon
                points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h3>4 Professional Resume Templates</h3>
          <p>Modern Blue, Executive, Minimal, and Technical templates are professionally styled and print-ready.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h3>Privacy-Conscious Workflow</h3>
          <p>Your files are parsed in your browser, then only the resume text and job description are sent to AI for
            tailoring.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <h3>AI Resume Generator</h3>
          <p>The AI extracts job-critical keywords and weaves them into your bullet points naturally and honestly.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </div>
          <h3>PDF & DOCX Export</h3>
          <p>Download a pixel-perfect PDF for applications, or a DOCX for further manual editing.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
              <polyline points="13 2 13 9 20 9" />
            </svg>
          </div>
          <h3>PDF & DOCX Upload</h3>
          <p>Already have a resume? Just upload your existing PDF or Word file and let the AI do the rest.</p>
        </div>
      </div>
    </section>

    <!-- ═════════════════════════ SEO TOPICS ════════════════════════════ -->
    <section class="seo-links-section container" aria-labelledby="resume-tools-title">
      <div class="section-header">
        <p class="section-eyebrow">Resume Tools</p>
        <h2 id="resume-tools-title" class="section-title">Build the Resume You Need</h2>
      </div>

      <div class="seo-links-grid">
        <RouterLink to="/resume-generator">Resume Generator</RouterLink>
        <RouterLink to="/free-resume-builder">Free Resume Builder</RouterLink>
        <RouterLink to="/ats-resume-maker">ATS Resume Maker</RouterLink>
        <RouterLink to="/professional-resume-template">Professional Resume Template</RouterLink>
        <RouterLink to="/ai-resume-generator">AI Resume Generator</RouterLink>
      </div>
    </section>

    <!-- ══════════════════════════ FINAL CTA ══════════════════════════════ -->
    <section class="final-cta">
      <div class="final-cta-glow"></div>
      <div class="container final-cta-inner">
        <h2>Ready to Build a Better Resume?</h2>
        <p>Use ResumeGen as your resume generator, free resume builder, and ATS resume maker for every application.</p>
        <RouterLink to="/create-resume" class="btn btn-primary btn-lg">
          Start Optimising Now — It's Free
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </RouterLink>
      </div>
    </section>

  </div>
</template>

<style scoped>
/* ─── Shared ─────────────────────────────────────────────────────────────── */
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 var(--space-6);
}

.section-header {
  text-align: center;
  margin-bottom: var(--space-12);
}

.section-eyebrow {
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--color-primary);
  margin-bottom: var(--space-2);
}

.section-title {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--color-heading);
  line-height: 1.2;
}

.gradient-text {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */
.hero {
  position: relative;
  padding: var(--space-16) 0 var(--space-12);
  text-align: center;
  overflow: hidden;
}

.hero-glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  opacity: 0.18;
}

.hero-glow--1 {
  width: 600px;
  height: 600px;
  background: var(--color-primary);
  top: -150px;
  left: -100px;
}

.hero-glow--2 {
  width: 500px;
  height: 500px;
  background: var(--color-secondary);
  bottom: -100px;
  right: -80px;
}

.hero-inner {
  position: relative;
  z-index: 1;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-primary);
  background: hsla(var(--hue-primary), 80%, 60%, 0.1);
  border: 1px solid hsla(var(--hue-primary), 80%, 60%, 0.25);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-full);
  margin-bottom: var(--space-6);
}

.badge-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: pulse-dot 2s ease-in-out infinite;
}

@keyframes pulse-dot {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.5;
    transform: scale(0.7);
  }
}

.hero-heading {
  font-size: clamp(2.8rem, 6vw, 5rem);
  font-weight: 900;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: var(--color-heading);
  margin-bottom: var(--space-6);
  font-family: var(--font-family-display);
}

.hero-sub {
  font-size: 1.2rem;
  color: var(--color-text-muted);
  max-width: 560px;
  margin: 0 auto var(--space-8);
  line-height: 1.7;
}

.cta-group {
  display: flex;
  gap: var(--space-4);
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: var(--space-8);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-base);
  cursor: pointer;
  border: none;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  color: white;
  padding: var(--space-3) var(--space-6);
  box-shadow: 0 4px 20px hsla(var(--hue-primary), 80%, 60%, 0.4);
}

.btn-primary:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
  box-shadow: 0 8px 30px hsla(var(--hue-primary), 80%, 60%, 0.5);
}

.btn-lg {
  padding: var(--space-4) var(--space-8);
  font-size: 1.05rem;
}

.hero-cta {
  isolation: isolate;
  min-width: 260px;
  min-height: 68px;
  overflow: hidden;
  padding: var(--space-3) var(--space-5);
  border: 1px solid hsl(0 0% 100% / 0.32);
  box-shadow:
    0 14px 34px hsla(var(--hue-primary), 80%, 50%, 0.36),
    0 0 0 7px hsla(var(--hue-primary), 80%, 60%, 0.1);
  animation: cta-breathe 2.8s ease-in-out infinite;
}

.hero-cta:hover {
  animation-play-state: paused;
}

.hero-cta svg {
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.hero-cta:hover svg {
  transform: translateX(3px);
}

.cta-shine {
  position: absolute;
  inset: -80% auto -80% -40%;
  z-index: -1;
  width: 38%;
  transform: rotate(18deg);
  background: linear-gradient(90deg, transparent, hsl(0 0% 100% / 0.42), transparent);
  animation: cta-shine 3.4s ease-in-out infinite;
}

.cta-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.15;
}

.cta-main {
  font-size: 1.04rem;
}

.cta-note {
  margin-top: 0.2rem;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.04em;
  opacity: 0.86;
  text-transform: uppercase;
}

@keyframes cta-breathe {

  0%,
  100% {
    box-shadow:
      0 14px 34px hsla(var(--hue-primary), 80%, 50%, 0.36),
      0 0 0 7px hsla(var(--hue-primary), 80%, 60%, 0.1);
  }

  50% {
    box-shadow:
      0 18px 42px hsla(var(--hue-secondary), 80%, 50%, 0.42),
      0 0 0 11px hsla(var(--hue-secondary), 80%, 60%, 0.12);
  }
}

@keyframes cta-shine {

  0%,
  42% {
    left: -42%;
  }

  70%,
  100% {
    left: 112%;
  }
}

.btn-ghost {
  background: transparent;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  padding: var(--space-3) var(--space-6);
}

.btn-ghost:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: hsla(var(--hue-primary), 80%, 60%, 0.05);
}

.hero-proof {
  display: flex;
  justify-content: center;
  gap: var(--space-6);
  flex-wrap: wrap;
  font-size: 0.88rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.hero-proof span::before {
  content: '';
  display: inline-block;
  width: 0.45rem;
  height: 0.45rem;
  margin-right: var(--space-2);
  border-radius: 50%;
  background: hsl(var(--hue-success), 70%, 45%);
  box-shadow: 0 0 0 3px hsla(var(--hue-success), 70%, 45%, 0.14);
  vertical-align: 0.08em;
}

/* ─── Stats Bar ───────────────────────────────────────────────────────────── */
.stats-bar {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-8) 0;
}

.stats-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: var(--space-8);
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 900;
  font-family: var(--font-family-display);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-label {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  font-weight: 500;
  text-align: center;
  max-width: 160px;
}

.stat-divider {
  width: 1px;
  height: 48px;
  background: var(--color-border);
}

/* ─── How It Works ────────────────────────────────────────────────────────── */
.how-it-works {
  padding: var(--space-16) var(--space-6);
}

.steps-grid {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  gap: var(--space-4);
}

.step-card {
  flex: 1;
  max-width: 300px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-8);
  text-align: center;
  transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
}

.step-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
}

.step-number {
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.15em;
  color: var(--color-primary);
  margin-bottom: var(--space-4);
}

.step-icon {
  width: 56px;
  height: 56px;
  background: hsla(var(--hue-primary), 80%, 60%, 0.1);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto var(--space-4);
  color: var(--color-primary);
}

.step-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: var(--space-3);
}

.step-card p {
  font-size: 0.92rem;
  color: var(--color-text-muted);
  line-height: 1.65;
}

.step-connector {
  color: var(--color-primary);
  opacity: 0.5;
  padding-top: 60px;
  flex-shrink: 0;
}

/* ─── Features ────────────────────────────────────────────────────────────── */
.features-section {
  padding: 0 var(--space-6) var(--space-16);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.feature-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  transition: transform var(--transition-normal), box-shadow var(--transition-normal), border-color var(--transition-normal);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
  border-color: var(--color-primary);
}

.feature-icon-wrap {
  width: 44px;
  height: 44px;
  background: hsla(var(--hue-primary), 80%, 60%, 0.1);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  margin-bottom: var(--space-4);
}

.feature-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: var(--space-2);
}

.feature-card p {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.65;
}

/* ─── SEO Links ───────────────────────────────────────────────────────────── */
.seo-links-section {
  padding: 0 var(--space-6) var(--space-16);
}

.seo-links-grid {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.seo-links-grid a {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-heading);
  font-weight: 700;
  min-height: 90px;
  padding: var(--space-5);
  text-align: center;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.seo-links-grid a:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  transform: translateY(-2px);
}

/* ─── Final CTA ───────────────────────────────────────────────────────────── */
.final-cta {
  position: relative;
  padding: var(--space-16) 0;
  text-align: center;
  overflow: hidden;
  background: var(--color-surface);
  border-top: 1px solid var(--color-border);
}

.final-cta-glow {
  position: absolute;
  width: 700px;
  height: 400px;
  background: radial-gradient(ellipse, hsla(var(--hue-primary), 80%, 60%, 0.12) 0%, transparent 70%);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.final-cta-inner {
  position: relative;
  z-index: 1;
}

.final-cta h2 {
  font-size: 2.4rem;
  font-weight: 900;
  color: var(--color-heading);
  margin-bottom: var(--space-4);
  font-family: var(--font-family-display);
  line-height: 1.15;
}

.final-cta p {
  font-size: 1.1rem;
  color: var(--color-text-muted);
  margin-bottom: var(--space-8);
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
}

/* ─── Responsive ────────────────────────────────────────────────────────── */
@media (max-width: 768px) {
  .steps-grid {
    flex-direction: column;
    align-items: center;
    gap: var(--space-4);
  }

  .step-connector {
    padding-top: 0;
    transform: rotate(90deg);
  }

  .step-card {
    max-width: 100%;
    width: 100%;
  }

  .stat-divider {
    display: none;
  }

  .stats-grid {
    gap: var(--space-6);
  }

  .section-title {
    font-size: 1.8rem;
  }

  .hero-heading {
    font-size: 2.5rem;
  }

  .cta-group {
    align-items: stretch;
    flex-direction: column;
  }

  .cta-group .btn {
    width: 100%;
  }

  .hero-cta {
    min-width: 0;
  }

  .hero-cta .cta-copy {
    flex: 1;
    align-items: center;
  }

  .final-cta h2 {
    font-size: 1.9rem;
  }

  .hero-proof {
    flex-direction: column;
    align-items: center;
    gap: var(--space-2);
  }

  .seo-links-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-cta,
  .cta-shine,
  .badge-dot,
  .fade-in {
    animation: none;
  }
}
</style>
