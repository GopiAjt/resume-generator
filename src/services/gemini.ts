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
You are a senior technical recruiter and ATS optimization expert with extensive experience hiring backend, platform, and infrastructure-adjacent software engineers for product companies and large-scale systems teams.

Task
Generate a highly targeted, ATS-friendly resume that dynamically adapts to the provided job description, using my existing resume strictly as a reference. The resume must maximize shortlisting probability while remaining technically honest, credible, and interview-safe. The candidate must be positioned as a Backend / Distributed Systems Engineer with strong system and networking fundamentals, not as a specialist system or firmware engineer.

Context
I will provide:

A Job Description (JD)

My current resume (reference only)

You must:

Analyze the JD to extract required skills, preferred skills, responsibilities, and ATS keywords

Adapt, reorder, and reframe my experience to align with the JD without exaggeration or fabrication

Emphasize:

Backend engineering experience

Distributed systems thinking

Performance, scalability, and reliability

Strong academic and foundational knowledge in Operating Systems and Networking

Clearly distinguish between:

Hands-on professional experience

Foundational / academic / conceptual knowledge

Avoid claiming direct experience in:

System software

Switch/router firmware

Network protocol implementation

ASIC / SDK development
unless explicitly present in my reference resume

Constraints

Resume length: 1 to 1.5 pages

Plain-text, ATS-safe formatting only (no tables, icons, graphics, columns, or emojis)

Use standard resume section headings

Bullet points must start with strong action verbs

Quantify impact wherever possible

Do NOT invent tools, protocols, or low-level experience

Do NOT present conceptual knowledge as hands-on expertise

Format
Generate the resume using the following structure:

# [Candidate Name]
[Location | Email | Phone | [LinkedIn Link](URL) | [GitHub Link](URL)]

## PROFESSIONAL SUMMARY
[2–3 short lines of summary text]

## CORE SKILLS
### [Category Title]
- [Skill 1, Skill 2, Skill 3.]
[Repeat for other categories]

## PROFESSIONAL EXPERIENCE
### [Company Name]
**[Role] | [Dates]**
[Blank line]
- [Bullet points]

## PROJECTS
### [Project Name]
[2–4 bullets]

## EDUCATION
### [Degree]
**[Institution] | [Dates]**
- [Relevant coursework]

Formatting & Styling Rules (STRICT)

1: Header
- Place name in # header.
- Contact details on the second line.
- Use pipe separators (|) consistently.
- Do NOT use icons, emojis, or symbols.
- Left-aligned.

2: Section Headings
- Use ## for section headings (SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION).
- These will be styled by the frontend.

3: Core Skills
- Use ### for category titles.
- List skills as a comma-separated list under each category.
- Remove skill-level labels (Advanced/Intermediate).

4: Experience & Projects
- Company/Project name as ### header.
- Role and Dates on the next line (bolded).
- Ensure a blank line before the bullet point list.

6: Bullet Points
- Use round bullets (•) or hyphens (-).
- 1–2 lines maximum per bullet.
- Start with strong action verbs.
- Bold important keywords, technologies, and metrics (**30% reduction**, **Java**, **Spring Boot**, etc.).

7: ATS Safety
- Plain text/Markdown only. No tables or columns.

Optimization Rules

- Prioritize JD-critical backend and infrastructure-adjacent keywords

- Reorder skills and bullets based on JD importance

- Use exact JD terminology only when defensible in an interview

- Keep networking and OS topics clearly labeled as foundational unless hands-on experience exists

- Optimize for both ATS parsing and human recruiter clarity

Formatting & Styling Rules (STRICT)

1: Header
- Place name on the first line only.
- Contact details on the second line (Location | Email | Phone | LinkedIn | GitHub).
- Use pipe separators (|) consistently.
- Do NOT use icons, emojis, or symbols.
- Left-aligned (no centering).

2: Section Headings
- Convert all section headings (SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION) to ALL CAPS.
- Use one blank line before and after each section heading.

3: Professional Summary
- Limit to 2–3 short lines.
- Break long sentences for readability.
- Left-aligned, no indentation.

4: Core Skills
- Place skill category title on its own line.
- List skills on the next line, ending with a period.
- Do NOT use skill-level labels (Advanced/Intermediate).

5: Bullet Points
- Use round bullets (•) or hyphens (-).
- 1–2 lines maximum per bullet.
- Start with strong action verbs.
- Place metrics early.
- No multi-clause/run-on bullets.

6: Experience & Projects
- Company/Project name on one line.
- Role/Dates on the next line.
- One blank line before bullet lists.
- Frame projects as distributed application systems.

7: ATS Safety
- No tables, columns, text boxes, or background shading.
- Plain text only. No embedded links behind text.

Final Validation (Mandatory)
Before outputting the resume, verify that:

- The resume appears custom-written for this specific JD

- ATS keyword alignment is strong without overclaiming

- A backend or platform hiring manager can identify clear role fit within 10 seconds

- All claims are technically honest and interview-safe

- ALL formatting rules above are strictly followed.

Format
You MUST return a JSON object with the following structure:
{
    "resume_markdown": "The full resume content in Markdown format...",
    "validation_summary": "The final validation summary/report..."
}
Job Description:

            ${jobDescription}


            My Current Resume (Reference):
            [
                Gopi Ajatarao
                Bengaluru, India
                gopi.ajatarao@gmail.com | 📞 +91 90088 30298
                LinkedIn: linkedin.com/in/gopi-ajt | GitHub: github.com/GopiAjt
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
        console.log(text);

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
