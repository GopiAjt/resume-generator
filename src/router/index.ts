import type { Router, RouteRecordRaw } from 'vue-router'
import { trackPageView } from '@/utils/analytics'
import { updateSeoMeta, type SeoMeta } from '@/utils/seo'
import { seoLandingPages } from '@/data/seoLandingPages'
import HomeView from '../views/HomeView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      title: 'Resume Generator - Free AI Resume Builder and ATS Resume Maker | ResumeGen',
      description:
        'Use ResumeGen as a free resume builder, ATS resume maker, and AI resume generator to create professional resume templates tailored to any job description.',
      keywords:
        'resume generator, free resume builder, ATS resume maker, professional resume template, AI resume generator',
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
    meta: {
      title: 'About ResumeGen - Free AI Resume Generator and ATS Resume Maker',
      description:
        'Learn how ResumeGen helps job seekers create ATS-friendly resumes with a free AI resume generator, professional resume templates, and privacy-conscious file parsing.',
      keywords:
        'AI resume generator, ATS resume maker, professional resume template, resume generator',
    },
  },
  {
    path: '/create-resume',
    name: 'create-resume',
    component: () => import('../views/CreateResumeView.vue'),
    meta: {
      title: 'Create a Resume - Free Resume Builder and ATS Resume Maker | ResumeGen',
      description:
        'Create a professional resume template with ResumeGen, a free resume builder and ATS resume maker powered by AI. Upload, tailor, and download your resume as PDF or DOC.',
      keywords:
        'free resume builder, ATS resume maker, AI resume generator, professional resume template, resume generator',
    },
  },
  ...seoLandingPages.map((page) => ({
    path: page.path,
    name: page.path.slice(1),
    component: () => import('../views/SeoLandingView.vue'),
    meta: {
      title: page.title,
      description: page.description,
      keywords: page.keyword,
    },
  })),
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
]

export const setupRouterGuards = (router: Router) => {
  router.afterEach((to) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    trackPageView(to.fullPath, typeof to.name === 'string' ? to.name : undefined)
    updateSeoMeta({
      ...(to.meta as SeoMeta),
      path: to.path,
    })
  })
}
