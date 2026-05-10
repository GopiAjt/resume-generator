import { createRouter, createWebHistory } from 'vue-router'
import { trackPageView } from '@/utils/analytics'
import { updateSeoMeta, type SeoMeta } from '@/utils/seo'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'ResumeGen - Free AI Resume Optimizer and ATS Resume Builder',
        description:
          'Optimize your resume for any job description with AI. Compare ATS keyword scores, tailor bullet points, and download a polished PDF or DOC resume for free.',
      },
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      meta: {
        title: 'About ResumeGen - AI Resume Optimizer',
        description:
          'Learn how ResumeGen helps job seekers tailor resumes to job descriptions with ATS-friendly formatting, AI keyword matching, and privacy-conscious file parsing.',
      },
    },
    {
      path: '/create-resume',
      name: 'create-resume',
      component: () => import('../views/CreateResumeView.vue'),
      meta: {
        title: 'Create a Tailored Resume - Free AI Resume Optimizer | ResumeGen',
        description:
          'Upload your resume, paste a job description, and generate a tailored ATS-friendly resume with AI. Download your optimized resume as PDF or DOC.',
      },
    },
    {
      path: '/privacy',
      name: 'privacy',
      component: () => import('../views/PrivacyPolicyView.vue'),
      meta: {
        title: 'Privacy Policy - ResumeGen',
        description:
          'Read how ResumeGen handles resume text, job descriptions, browser-based file parsing, analytics, and AI processing with Google Gemini.',
      },
    },
    {
      path: '/terms',
      name: 'terms',
      component: () => import('../views/TermsOfServiceView.vue'),
      meta: {
        title: 'Terms of Service - ResumeGen',
        description:
          'Review the terms for using ResumeGen, including AI-generated resume content, user responsibilities, export options, and service limitations.',
      },
    },
  ],
})

router.afterEach((to) => {
  trackPageView(to.fullPath, typeof to.name === 'string' ? to.name : undefined)
  updateSeoMeta({
    ...(to.meta as SeoMeta),
    path: to.path,
  })
})

export default router
