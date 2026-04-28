<script setup lang="ts">
import { ref, reactive } from 'vue'

const emit = defineEmits(['close', 'submit'])

const validationError = ref('')

const form = reactive({
    name: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    skills: '',
    experience: [
        { company: '', role: '', dates: '', description: '' }
    ],
    projects: [
        { name: '', description: '' }
    ],
    education: [
        { degree: '', school: '', dates: '', details: '' }
    ]
})

const addExperience = () => {
    form.experience.push({ company: '', role: '', dates: '', description: '' })
}

const removeExperience = (index: number) => {
    form.experience.splice(index, 1)
}

const addProject = () => {
    form.projects.push({ name: '', description: '' })
}

const removeProject = (index: number) => {
    form.projects.splice(index, 1)
}

const addEducation = () => {
    form.education.push({ degree: '', school: '', dates: '', details: '' })
}

const removeEducation = (index: number) => {
    form.education.splice(index, 1)
}

const handleSubmit = () => {
    validationError.value = ''

    if (!form.name.trim()) {
        validationError.value = 'Full Name is required.'
        return
    }
    if (!form.experience[0]?.company.trim() && !form.experience[0]?.role.trim()) {
        validationError.value = 'Please add at least one work experience entry.'
        return
    }
    // Format the form as a Reference Resume text
    let formattedText = `# ${form.name}\n`
    formattedText += `${form.location} | ${form.email} | ${form.phone}\n`
    if (form.linkedin) formattedText += `LinkedIn: ${form.linkedin} | `
    if (form.github) formattedText += `GitHub: ${form.github}\n`
    formattedText += `\n## SUMMARY\n${form.summary}\n`
    formattedText += `\n## SKILLS\n${form.skills}\n`

    formattedText += `\n## PROFESSIONAL EXPERIENCE\n`
    form.experience.forEach(exp => {
        formattedText += `### ${exp.company}\n**${exp.role} | ${exp.dates}**\n${exp.description}\n\n`
    })

    formattedText += `\n## PROJECTS\n`
    form.projects.forEach(proj => {
        formattedText += `### ${proj.name}\n${proj.description}\n\n`
    })

    formattedText += `\n## EDUCATION\n`
    form.education.forEach(edu => {
        formattedText += `### ${edu.degree}\n**${edu.school} | ${edu.dates}**\n${edu.details}\n\n`
    })

    emit('submit', formattedText)
}
</script>

<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content fade-up">
            <header class="modal-header">
                <h2>Resume Details Form</h2>
                <button class="close-btn" @click="$emit('close')">&times;</button>
            </header>

            <div class="modal-body">
                <p class="form-hint">Fill in your details below to generate a reference resume for tailoring.</p>

                <div v-if="validationError" class="validation-error">
                    <span>⚠️</span> {{ validationError }}
                </div>

                <form @submit.prevent="handleSubmit">
                    <!-- Personal Info -->
                    <section class="form-section">
                        <h3>Personal Info</h3>
                        <div class="grid-form">
                            <div class="form-group">
                                <label>Full Name</label>
                                <input v-model="form.name" placeholder="John Doe" required />
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input v-model="form.email" type="email" placeholder="john@example.com" required />
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input v-model="form.phone" placeholder="+1 (555) 000-0000" required />
                            </div>
                            <div class="form-group">
                                <label>Location</label>
                                <input v-model="form.location" placeholder="City, State/Country" required />
                            </div>
                            <div class="form-group">
                                <label>LinkedIn (Optional)</label>
                                <input v-model="form.linkedin" placeholder="linkedin.com/in/username" />
                            </div>
                            <div class="form-group">
                                <label>GitHub (Optional)</label>
                                <input v-model="form.github" placeholder="github.com/username" />
                            </div>
                        </div>
                    </section>

                    <section class="form-section">
                        <h3>Summary & Skills</h3>
                        <div class="form-group">
                            <label>Professional Summary</label>
                            <textarea v-model="form.summary"
                                placeholder="Briefly describe your career and goals..."></textarea>
                        </div>
                        <div class="form-group">
                            <label>Skills (Comma-separated)</label>
                            <textarea v-model="form.skills"
                                placeholder="Java, Python, Vue.js, Spring Boot, etc."></textarea>
                        </div>
                    </section>

                    <!-- Experience -->
                    <section class="form-section">
                        <div class="section-header">
                            <h3>Experience</h3>
                            <button type="button" @click="addExperience" class="btn-add">+ Add More</button>
                        </div>
                        <div v-for="(exp, index) in form.experience" :key="index" class="dynamic-item">
                            <div class="grid-form">
                                <div class="form-group">
                                    <label>Company</label>
                                    <input v-model="exp.company" placeholder="Example Corp" />
                                </div>
                                <div class="form-group">
                                    <label>Role</label>
                                    <input v-model="exp.role" placeholder="Software Engineer" />
                                </div>
                                <div class="form-group">
                                    <label>Dates</label>
                                    <input v-model="exp.dates" placeholder="Jan 2020 - Present" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Description (1-2 lines)</label>
                                <textarea v-model="exp.description"
                                    placeholder="Key responsibilities and achievements..."></textarea>
                            </div>
                            <button type="button" v-if="form.experience.length > 1" @click="removeExperience(index)"
                                class="btn-remove">Remove</button>
                        </div>
                    </section>

                    <!-- Projects -->
                    <section class="form-section">
                        <div class="section-header">
                            <h3>Projects</h3>
                            <button type="button" @click="addProject" class="btn-add">+ Add More</button>
                        </div>
                        <div v-for="(proj, index) in form.projects" :key="index" class="dynamic-item">
                            <div class="form-group">
                                <label>Project Name</label>
                                <input v-model="proj.name" placeholder="Portfolio Website" />
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea v-model="proj.description"
                                    placeholder="A brief about the project..."></textarea>
                            </div>
                            <button type="button" v-if="form.projects.length > 1" @click="removeProject(index)"
                                class="btn-remove">Remove</button>
                        </div>
                    </section>

                    <!-- Education -->
                    <section class="form-section">
                        <div class="section-header">
                            <h3>Education</h3>
                            <button type="button" @click="addEducation" class="btn-add">+ Add More</button>
                        </div>
                        <div v-for="(edu, index) in form.education" :key="index" class="dynamic-item">
                            <div class="grid-form">
                                <div class="form-group">
                                    <label>Degree</label>
                                    <input v-model="edu.degree" placeholder="B.E. in CS" />
                                </div>
                                <div class="form-group">
                                    <label>Institution</label>
                                    <input v-model="edu.school" placeholder="Example University" />
                                </div>
                                <div class="form-group">
                                    <label>Dates</label>
                                    <input v-model="edu.dates" placeholder="2018 - 2022" />
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Details / Coursework (Optional)</label>
                                <textarea v-model="edu.details" placeholder="Relevant achievements..."></textarea>
                            </div>
                            <button type="button" v-if="form.education.length > 1" @click="removeEducation(index)"
                                class="btn-remove">Remove</button>
                        </div>
                    </section>
                </form>
            </div>

            <footer class="modal-footer">
                <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
                <button type="submit" @click="handleSubmit" class="btn btn-primary">Process Details</button>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: var(--space-4);
}

.modal-content {
    background: var(--color-surface);
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    border-radius: var(--radius-xl);
    box-shadow: var(--shadow-xl);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border: 1px solid var(--color-border);
}

.modal-header {
    padding: var(--space-6);
    border-bottom: 1px solid var(--color-border);
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--color-primary);
}

.close-btn {
    background: transparent;
    border: none;
    font-size: 2rem;
    color: var(--color-text-muted);
    cursor: pointer;
    line-height: 1;
}

.modal-body {
    padding: var(--space-8);
    overflow-y: auto;
}

.modal-footer {
    padding: var(--space-6);
    border-top: 1px solid var(--color-border);
    display: flex;
    justify-content: flex-end;
    gap: var(--space-4);
    background: hsla(220, 20%, 98%, 0.5);
}

@media (prefers-color-scheme: dark) {
    .modal-footer {
        background: hsla(220, 40%, 8%, 0.5);
    }
}

.form-hint {
    color: var(--color-text-muted);
    margin-bottom: var(--space-6);
    font-size: 0.95rem;
}

.validation-error {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    background: hsla(var(--hue-danger), 80%, 55%, 0.1);
    border: 1px solid hsla(var(--hue-danger), 80%, 55%, 0.3);
    color: var(--color-danger);
    padding: var(--space-3) var(--space-4);
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: var(--space-4);
}

.form-section {
    margin-bottom: var(--space-8);
}

.form-section h3 {
    font-size: 1.1rem;
    color: var(--color-heading);
    margin-bottom: var(--space-4);
    display: flex;
    align-items: center;
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--space-4);
}

.grid-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-4);
}

@media (max-width: 600px) {
    .grid-form {
        grid-template-columns: 1fr;
    }
}

.form-group {
    margin-bottom: var(--space-4);
}

.form-group label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    margin-bottom: var(--space-1);
    color: var(--color-text-muted);
}

input,
textarea {
    width: 100%;
    padding: var(--space-3);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    background: var(--color-bg);
    color: var(--color-text);
    font-size: 1rem;
}

textarea {
    resize: vertical;
    min-height: 80px;
}

.dynamic-item {
    padding: var(--space-4);
    background: hsla(var(--hue-primary), 50%, 95%, 0.2);
    border-radius: var(--radius-md);
    border: 1px solid var(--color-border);
    margin-bottom: var(--space-4);
    position: relative;
}

.btn-add {
    background: transparent;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
    padding: var(--space-1) var(--space-3);
    border-radius: var(--radius-md);
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
}

.btn-remove {
    background: transparent;
    border: none;
    color: var(--color-danger);
    font-size: 0.85rem;
    cursor: pointer;
    text-align: right;
    width: 100%;
    margin-top: -var(--space-2);
}

.fade-up {
    animation: fadeUp 0.4s ease-out;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
