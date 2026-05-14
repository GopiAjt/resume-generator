export type SeoLandingPage = {
  path: string
  keyword: string
  title: string
  description: string
  headline: string
  intro: string
  benefits: string[]
  sections: Array<{
    heading: string
    body: string
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
}

export const seoLandingPages: SeoLandingPage[] = [
  {
    path: '/resume-generator',
    keyword: 'resume generator',
    title: 'Resume Generator - Build an ATS-Friendly Resume Online | ResumeGen',
    description:
      'Use ResumeGen as a resume generator to create an ATS-friendly, professional resume tailored to a target job description and ready to download.',
    headline: 'Resume Generator for Job-Specific Applications',
    intro:
      'ResumeGen turns your existing resume and a job description into a focused, ATS-friendly resume that keeps your experience honest while improving keyword match.',
    benefits: [
      'Generate a tailored resume from an uploaded PDF, DOCX, or manual entry',
      'Compare ATS keyword scores before and after optimization',
      'Download a polished PDF or editable DOC resume',
    ],
    sections: [
      {
        heading: 'Built for real job descriptions',
        body: 'Paste the full job description so the resume generator can identify role-specific skills, tools, and phrasing that matter for the application.',
      },
      {
        heading: 'Professional output without starting over',
        body: 'Keep your work history and achievements, then reshape the wording and layout into a cleaner resume that is easier for recruiters and ATS systems to scan.',
      },
    ],
    faqs: [
      {
        question: 'What does a resume generator do?',
        answer:
          'A resume generator helps create or improve a resume by organizing your details, matching relevant keywords, and formatting the result for applications.',
      },
      {
        question: 'Can I use ResumeGen with my existing resume?',
        answer:
          'Yes. You can upload an existing PDF or DOCX resume, paste a job description, and generate a tailored version.',
      },
    ],
  },
  {
    path: '/free-resume-builder',
    keyword: 'free resume builder',
    title: 'Free Resume Builder - Create and Download Your Resume | ResumeGen',
    description:
      'Create a job-ready resume with a free resume builder that supports resume uploads, AI tailoring, ATS checks, and PDF or DOC downloads.',
    headline: 'Free Resume Builder with AI Tailoring',
    intro:
      'Build a resume for free, tailor it to the role you want, and export a clean file you can use for job applications.',
    benefits: [
      'No account required to start building',
      'Upload your existing resume or enter details manually',
      'Create a professional resume and download it as PDF or DOC',
    ],
    sections: [
      {
        heading: 'Start from your current resume',
        body: 'The builder reads your resume text from common file formats, so you can improve what you already have instead of rebuilding every section manually.',
      },
      {
        heading: 'Free resume creation for every application',
        body: 'Use the same workflow for each target job: add the job description, generate a tailored version, review the ATS report, and download.',
      },
    ],
    faqs: [
      {
        question: 'Is ResumeGen a free resume builder?',
        answer:
          'Yes. ResumeGen lets you create and tailor resumes for free, including PDF and DOC export options.',
      },
      {
        question: 'Do I need to sign up?',
        answer:
          'No. You can start building and optimizing a resume without creating an account.',
      },
    ],
  },
  {
    path: '/ats-resume-maker',
    keyword: 'ATS resume maker',
    title: 'ATS Resume Maker - Create an ATS-Friendly Resume | ResumeGen',
    description:
      'Use an ATS resume maker to tailor your resume to job descriptions, improve keyword match, and export a professional ATS-friendly resume.',
    headline: 'ATS Resume Maker for Better Keyword Match',
    intro:
      'ResumeGen helps you create a resume that is easier for applicant tracking systems to parse while still reading naturally to recruiters.',
    benefits: [
      'Compare original and optimized ATS scores',
      'Find missing job-description keywords',
      'Use clean formatting designed for ATS readability',
    ],
    sections: [
      {
        heading: 'Match the role without keyword stuffing',
        body: 'The ATS resume maker looks for important terms in the job description and works them into relevant experience where they belong.',
      },
      {
        heading: 'Readable for software and humans',
        body: 'ATS-friendly does not mean bland. ResumeGen keeps the resume structured, scannable, and professional for both automated screening and hiring teams.',
      },
    ],
    faqs: [
      {
        question: 'What is an ATS resume maker?',
        answer:
          'An ATS resume maker creates or improves a resume so applicant tracking systems can parse the content and match it against job requirements.',
      },
      {
        question: 'Does ResumeGen guarantee interviews?',
        answer:
          'No tool can guarantee interviews, but improving relevance, structure, and keyword match can make your resume more competitive.',
      },
    ],
  },
  {
    path: '/professional-resume-template',
    keyword: 'professional resume template',
    title: 'Professional Resume Template - ATS-Friendly Resume Layouts | ResumeGen',
    description:
      'Choose a professional resume template and generate a polished, ATS-friendly resume layout for PDF or DOC export with ResumeGen.',
    headline: 'Professional Resume Templates That Stay ATS-Friendly',
    intro:
      'ResumeGen gives you polished resume templates that look professional while preserving the structure needed for clear scanning and export.',
    benefits: [
      'Choose from Modern Blue, Executive, Minimal, and Technical templates',
      'Keep sections readable and recruiter-friendly',
      'Export a finished professional resume as PDF or DOC',
    ],
    sections: [
      {
        heading: 'Designed for clarity',
        body: 'Each template prioritizes readable headings, clean spacing, and practical structure over decorative layouts that can confuse ATS parsing.',
      },
      {
        heading: 'Templates for different career styles',
        body: 'Pick a compact technical layout, a crisp executive format, a minimal design, or a modern blue theme depending on your target role.',
      },
    ],
    faqs: [
      {
        question: 'What makes a resume template professional?',
        answer:
          'A professional resume template is clear, consistent, easy to scan, and appropriate for the role or industry you are targeting.',
      },
      {
        question: 'Are ResumeGen templates ATS-friendly?',
        answer:
          'ResumeGen templates are designed to keep resume sections organized and readable for applicant tracking systems.',
      },
    ],
  },
  {
    path: '/ai-resume-generator',
    keyword: 'AI resume generator',
    title: 'AI Resume Generator - Tailor Your Resume to Any Job | ResumeGen',
    description:
      'Use an AI resume generator to tailor bullet points, improve ATS keyword match, and create a professional resume for each job application.',
    headline: 'AI Resume Generator for Tailored Applications',
    intro:
      'ResumeGen uses AI to help tailor your resume to a specific job description, improving relevance while keeping your real experience at the center.',
    benefits: [
      'Generate tailored bullet points from your resume and target role',
      'Identify role-specific keywords and gaps',
      'Create a polished resume ready for PDF or DOC export',
    ],
    sections: [
      {
        heading: 'AI that works from your actual experience',
        body: 'The AI resume generator uses your existing resume as source material, then adapts wording and emphasis to match the job description.',
      },
      {
        heading: 'Faster tailoring for every role',
        body: 'Instead of manually rewriting your resume for each application, generate a focused version, review the output, and make final edits quickly.',
      },
    ],
    faqs: [
      {
        question: 'How does an AI resume generator help?',
        answer:
          'It can rewrite and organize resume content around a target job description, helping highlight relevant skills and keywords.',
      },
      {
        question: 'Should I review the AI-generated resume?',
        answer:
          'Yes. Always review the generated resume to confirm accuracy, tone, and alignment with your actual experience.',
      },
    ],
  },
]

export const seoLandingPageByPath = new Map(seoLandingPages.map((page) => [page.path, page]))
