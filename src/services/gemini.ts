import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateResume = async (jobDescription: string) => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set VITE_GEMINI_API_KEY in .env.local");
  }

  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-flash-latest",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    const prompt = `
        Persona
            You are a senior technical recruiter and ATS optimization expert with extensive experience hiring software engineers (frontend, backend, and full-stack) for product companies and startups.

        Task
            Generate a highly targeted, ATS-friendly resume that dynamically adapts to the provided job description, using my existing resume strictly as a reference. The goal is to maximize keyword alignment, role relevance, and shortlisting probability while remaining fully truthful and consistent with my real experience.

        Context
            I will provide:

            A Job Description (JD)

            My current resume (reference only)

        You must:

            Analyze the job description to identify required skills, preferred skills, responsibilities, and ATS keywords

            Reframe, reorder, and optimize my experience to closely match the JD without fabricating experience

            Emphasize relevant technologies, measurable impact, and role-specific achievements

            Remove or de-emphasize irrelevant skills and responsibilities

            Use clear, concise, professional language suitable for recruiters and ATS systems

            Constraints:

            Resume length: 1 to 1.5 pages

            Use simple, ATS-safe formatting (no tables, icons, graphics, or columns)

            Use standard section headings

            Bullet points must start with strong action verbs

            Quantify impact wherever possible

            Do not add skills or tools that cannot be reasonably inferred from my experience

        Format
        You MUST return a JSON object with the following structure:
        {
            "resume_markdown": "The full resume content in Markdown format...",
            "validation_summary": "The final validation summary/report..."
        }

        Resume Structure (for the "resume_markdown" field):

            1: Header

                1.1: Name

                1.2: Location | Email | Phone | LinkedIn | GitHub

            2: Professional Summary

                2–3 lines

                Aligned with the job title and core requirements from the JD

                Must include years of experience and primary tech stack

            3: Core Skills

                3.1: Categorized (e.g., Backend, Frontend, Databases, DevOps, Tools)

                3.2: Ordered by relevance to the JD

                3.3: Use exact keywords from the JD where applicable

            4: Professional Experience

                4.1: Company | Role | Dates

                4.2: 4–6 bullet points per role

                4.3: Focus on responsibilities, technologies, and achievements most relevant to the JD

                4.4: Prioritize impact, scalability, performance, and ownership

            5: Projects (include only if relevant to the JD)

                5.1: Project name

                5.2: 2–4 bullets highlighting tech stack, architecture, and outcomes

            6: Education

                6.1: Degree | Institution | Year

            7: Optimization Rules

                7.1: Prioritize JD-critical skills and technologies

                7.2: Reorder skills and bullets based on JD importance

                7.3: Use exact terminology from the JD when natural

                7.4: Avoid buzzwords, filler text, and generic claims


        Validation Summary (for the "validation_summary" field):
            
            8: Final Validation
            Before outputting, ensure:

                8.1: The resume appears custom-written for this specific job

                8.2: It would score highly in ATS keyword matching

                8.3: A recruiter can identify strong role fit within 10 seconds

            Job Description:

            ${jobDescription}


            My Current Resume (Reference):
            [
                Gopi Ajatarao
                Bengaluru, India
                gopiajt23@gmail.com | 📞 +91 90088 30298
                LinkedIn: www.linkedin.com/in/gopi-ajt | GitHub: www.github.com/GopiAjt
                ________________________________________
                Professional Summary:
                Full Stack Developer with 2+ years of experience designing and developing high-performance, responsive web applications using Vue.js, Spring Boot, and MySQL. Skilled in building scalable backend systems, integrating RESTful APIs, and crafting dynamic frontends for seamless user experiences. Experienced in Docker-based deployments, database optimization, and Agile development. Passionate about delivering clean, maintainable, and efficient code that drives business impact.
                ________________________________________
                Core Competencies:
                ●	Full Stack Web Development
                ●	RESTful API Design & Integration
                ●	Scalable Backend Architecture
                ●	Frontend Development & UI Optimization
                ●	Docker & Containerization
                ●	MySQL Performance Tuning
                ●	Agile Collaboration & SDLC
                ●	Version Control (Git & GitHub)
                ________________________________________
                Technical Skills:
                Languages & Frameworks:
                Java (Intermediate), JavaScript (Intermediate), Vue.js (Advanced), Spring Boot (Intermediate), HTML (Advanced), CSS (Advanced)
                Databases & Tools:
                MySQL (Advanced), Docker (Intermediate), Git (Advanced), JSON (Advanced), JDBC (Intermediate)
                Frontend Ecosystem:
                PrimeVue (Advanced), Vuex (Advanced), Bootstrap (Advanced)
                Other Skills:
                Data Structures, Object-Oriented Design, Algorithmic Thinking, API Testing (Postman), Deployment Automation
                ________________________________________
                Professional Experience:
                Kochar Infotech Pvt. Ltd. | Bengaluru, India
                Full Stack Developer | March 2024 – Present
                Roles & Responsibilities:
                ●	Developed and maintained end-to-end web application modules using Vue.js (frontend) and Spring Boot (backend).
                ●	Designed and integrated RESTful APIs for efficient data handling and seamless frontend-backend communication.
                ●	Built responsive and dynamic UI components using PrimeVue, Vuex, and Bootstrap for enhanced user experience.
                ●	Optimized MySQL database queries and schemas, improving backend performance and reducing latency.
                ●	Implemented JWT authentication and role-based access controls to secure user and admin sessions.
                ●	Deployed applications in Dockerized environments, ensuring scalable and reproducible deployments.
                ●	Participated in Agile sprint planning, code reviews, and cross-functional collaboration to deliver high-quality features.
                ●	Troubleshot production issues and optimized application performance, improving user engagement and reliability.
                Key Achievements:
                ●	Improved frontend load speed by 25% using optimized component rendering and lazy loading.
                ●	Streamlined backend performance and database queries, reducing API response times by 30%.
                ●	Delivered maintainable, scalable modules that supported concurrent user access efficiently.
                ________________________________________
                Project:
                CaptureNow — Online Photographer Booking & Management Platform
                Description:
                Developed a full-stack web application enabling users to search, book, and manage photographer services efficiently. The platform offers real-time booking updates, reviews, and an intuitive interface for both customers and photographers.
                Roles & Responsibilities:
                ●	Developed end-to-end full-stack solution with Vue.js frontend and Spring Boot backend.
                ●	Integrated RESTful APIs for secure and efficient data operations.
                ●	Implemented Vuex state management and local storage for session persistence and dynamic booking data.
                ●	Designed scalable MySQL schemas for users, photographers, bookings, and reviews.
                ●	Built responsive UI components using Vue.js, PrimeVue, and Bootstrap for cross-device compatibility.
                ●	Optimized API calls and database queries to reduce latency and enhance performance.
                ●	Implemented JWT authentication and role-based access control for secure user management.
                ●	Conducted testing, error handling, and performance optimization to ensure application reliability.
                Key Achievements:
                ●	Reduced page load times by 30% through optimized frontend and backend workflows.
                ●	Streamlined booking process, cutting user transaction time by 25%.
                ●	Built a robust, scalable backend architecture capable of supporting high concurrent usage.
                ________________________________________
                Education:
                Bachelor of Engineering (B.E.) in Computer Science & Engineering
                Maratha Mandal Engineering College, Belagavi, India
                Aug 2018 – Aug 2022
            ]

    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
        return JSON.parse(text);
    } catch (e) {
        console.error("Failed to parse JSON response:", text);
        return { resume_markdown: text, validation_summary: "Could not parse validation summary." };
    }
  } catch (error) {
    console.error("Error generating resume:", error);
    throw error;
  }
};
