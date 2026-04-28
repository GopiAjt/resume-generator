<script setup lang="ts">
</script>

<template>
  <div class="privacy-policy container">
    <h1 class="text-display">Privacy Policy</h1>
    <p class="last-updated">Last updated: {{ new Date().toLocaleDateString() }}</p>

    <section class="policy-section">
      <h2>1. Information We Collect</h2>
      <p>ResumeGen is designed with privacy in mind. We collect the following information:</p>
      <ul>
        <li><strong>Resume Data:</strong> Your resume content (PDF, DOCX, or manually entered text) is processed locally in your browser and sent to Google's Gemini AI for optimization.</li>
        <li><strong>Job Descriptions:</strong> Job descriptions you provide are sent to Google's Gemini AI for analysis.</li>
        <li><strong>Usage Data:</strong> We may collect anonymous usage data to improve our service.</li>
      </ul>
    </section>

    <section class="policy-section">
      <h2>2. How We Use Your Information</h2>
      <p>We use your information solely for:</p>
      <ul>
        <li>Generating optimized resumes tailored to job descriptions</li>
        <li>Improving our AI prompts and service quality</li>
        <li>Analyzing usage patterns to enhance user experience</li>
      </ul>
    </section>

    <section class="policy-section">
      <h2>3. Data Storage and Processing</h2>
      <p><strong>Client-Side Processing:</strong> All file processing (PDF/DOCX text extraction) happens locally in your browser.</p>
      <p><strong>AI Processing:</strong> Your resume and job description data are sent to Google's Gemini API for processing. Google's privacy policy applies to data sent to their service.</p>
      <p><strong>No Persistent Storage:</strong> We do not store your resume data on our servers. Once your session ends, the data is cleared from your browser.</p>
    </section>

    <section class="policy-section">
      <h2>4. Third-Party Services</h2>
      <p>We use the following third-party services:</p>
      <ul>
        <li><strong>Google Gemini AI:</strong> For resume optimization and analysis. Refer to <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</li>
        <li><strong>Vercel:</strong> For hosting our application. Refer to <a href="https://vercel.com/privacy" target="_blank" rel="noopener noreferrer">Vercel's Privacy Policy</a>.</li>
      </ul>
    </section>

    <section class="policy-section">
      <h2>5. Data Security</h2>
      <p>We implement appropriate security measures to protect your information:</p>
      <ul>
        <li>All data transmission uses HTTPS encryption</li>
        <li>We use security headers (CSP, HSTS, X-Frame-Options)</li>
        <li>We sanitize all user inputs to prevent XSS attacks</li>
        <li>We do not store sensitive data on our servers</li>
      </ul>
    </section>

    <section class="policy-section">
      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access the data you've provided during your session</li>
        <li>Delete your data by clearing your browser cache</li>
        <li>Opt-out of any data collection by not using our service</li>
      </ul>
    </section>

    <section class="policy-section">
      <h2>7. Children's Privacy</h2>
      <p>Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children.</p>
    </section>

    <section class="policy-section">
      <h2>8. Changes to This Policy</h2>
      <p>We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page.</p>
    </section>

    <section class="policy-section">
      <h2>9. Contact Us</h2>
      <p>If you have any questions about this privacy policy, please contact us at:</p>
      <p><strong>Email:</strong> privacy@resumegen.com</p>
    </section>
  </div>
</template>

<style scoped>
.privacy-policy {
  padding: var(--space-8) var(--space-4);
  max-width: 800px;
  margin: 0 auto;
}

.text-display {
  font-size: 2.5rem;
  margin-bottom: var(--space-4);
}

.last-updated {
  color: var(--color-text-muted);
  font-size: 0.9rem;
  margin-bottom: var(--space-8);
}

.policy-section {
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-8);
  border-bottom: 1px solid var(--color-border);
}

.policy-section:last-of-type {
  border-bottom: none;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: var(--space-4);
  color: var(--color-heading);
}

p {
  margin-bottom: var(--space-4);
  line-height: 1.6;
}

ul {
  margin-left: var(--space-6);
  margin-bottom: var(--space-4);
}

li {
  margin-bottom: var(--space-2);
  line-height: 1.6;
}

a {
  color: var(--color-primary);
  text-decoration: underline;
}

a:hover {
  color: var(--color-secondary);
}

strong {
  font-weight: 600;
}

@media (max-width: 768px) {
  .privacy-policy {
    padding: var(--space-4);
  }

  .text-display {
    font-size: 2rem;
  }
}
</style>
