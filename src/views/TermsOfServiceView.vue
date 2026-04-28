<script setup lang="ts">
</script>

<template>
  <div class="terms-of-service container">
    <h1 class="text-display">Terms of Service</h1>
    <p class="last-updated">Last updated: {{ new Date().toLocaleDateString() }}</p>

    <section class="terms-section">
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using ResumeGen, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by these terms, please do not use this service.</p>
    </section>

    <section class="terms-section">
      <h2>2. Description of Service</h2>
      <p>ResumeGen is an AI-powered resume optimization tool that helps users tailor their resumes to specific job descriptions. Our service includes:</p>
      <ul>
        <li>Resume text extraction from PDF and DOCX files</li>
        <li>AI-powered resume optimization using Google Gemini</li>
        <li>Multiple resume templates</li>
        <li>Export options (PDF, DOC, clipboard)</li>
      </ul>
    </section>

    <section class="terms-section">
      <h2>3. User Responsibilities</h2>
      <p>As a user of ResumeGen, you agree to:</p>
      <ul>
        <li>Provide accurate and truthful information</li>
        <li>Use the service for lawful purposes only</li>
        <li>Not attempt to reverse engineer or circumvent security measures</li>
        <li>Not use the service to create fraudulent or misleading resumes</li>
        <li>Respect intellectual property rights of others</li>
      </ul>
    </section>

    <section class="terms-section">
      <h2>4. Intellectual Property</h2>
      <p><strong>Your Content:</strong> You retain ownership of all resumes and content you create using our service.</p>
      <p><strong>Our Service:</strong> ResumeGen, including its design, code, and templates, is protected by intellectual property laws.</p>
      <p><strong>License:</strong> We grant you a limited, non-exclusive, non-transferable license to use our service for personal or professional use.</p>
    </section>

    <section class="terms-section">
      <h2>5. Disclaimer of Warranties</h2>
      <p>ResumeGen is provided "as is" without warranties of any kind, either express or implied. We do not guarantee:</p>
      <ul>
        <li>That the service will be uninterrupted or error-free</li>
        <li>That resumes generated will result in job offers</li>
        <li>That AI-generated content is completely accurate</li>
        <li>That the service will meet your specific requirements</li>
      </ul>
    </section>

    <section class="terms-section">
      <h2>6. Limitation of Liability</h2>
      <p>To the fullest extent permitted by law, ResumeGen shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of data, profits, or business opportunities.</p>
    </section>

    <section class="terms-section">
      <h2>7. AI Generated Content</h2>
      <p>Our service uses AI to generate resume content. You acknowledge that:</p>
      <ul>
        <li>AI-generated content may not always be accurate</li>
        <li>You are responsible for reviewing and editing all AI-generated content</li>
        <li>You should not present AI-generated content as entirely your own work without review</li>
        <li>Misrepresentation on resumes can have serious professional consequences</li>
      </ul>
    </section>

    <section class="terms-section">
      <h2>8. Privacy</h2>
      <p>Your use of our service is also governed by our Privacy Policy. Please review our Privacy Policy to understand how we collect, use, and protect your information.</p>
    </section>

    <section class="terms-section">
      <h2>9. Termination</h2>
      <p>We reserve the right to terminate or suspend your access to our service at any time, without prior notice, for any reason, including but not limited to violation of these terms.</p>
    </section>

    <section class="terms-section">
      <h2>10. Changes to Terms</h2>
      <p>We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
    </section>

    <section class="terms-section">
      <h2>11. Governing Law</h2>
      <p>These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which ResumeGen operates, without regard to its conflict of law provisions.</p>
    </section>

    <section class="terms-section">
      <h2>12. Contact Information</h2>
      <p>For questions about these terms, please contact us at:</p>
      <p><strong>Email:</strong> legal@resumegen.com</p>
    </section>
  </div>
</template>

<style scoped>
.terms-of-service {
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

.terms-section {
  margin-bottom: var(--space-8);
  padding-bottom: var(--space-8);
  border-bottom: 1px solid var(--color-border);
}

.terms-section:last-of-type {
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

strong {
  font-weight: 600;
}

@media (max-width: 768px) {
  .terms-of-service {
    padding: var(--space-4);
  }

  .text-display {
    font-size: 2rem;
  }
}
</style>
