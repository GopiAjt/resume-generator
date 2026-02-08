<template>
  <div class="about container">
    <h1>About ResumeGen</h1>
    <p>
      ResumeGen is a premium resume builder designed to help you land your dream job.
      We use cutting-edge technology to format your resume perfectly for both humans and ATS.
    </p>
    <div class="actions">
      <router-link to="/" class="btn btn-primary">Back to Home</router-link>
    </div>
  </div>
</template>

<style scoped>
.about {
  padding: var(--space-8) var(--space-4);
  max-width: 800px;
}

h1 {
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.actions {
  margin-top: var(--space-8);
}
</style>
