import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not set in environment variables.");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export const generateResume = async (jobDescription: string, userResume: string) => {
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
You are a senior technical recruiter and ATS optimization expert with extensive experience hiring software engineers for product companies and large-scale systems teams.

Task
Generate a highly targeted, ATS-friendly resume that dynamically adapts to the provided job description, using the provided resume strictly as a reference. The resume must maximize shortlisting probability while remaining technically honest, credible, and interview-safe. 

Context
I will provide:

A Job Description (JD)

The candidate's current resume (reference only)

You must:

Analyze the JD to extract required skills, preferred skills, responsibilities, and ATS keywords

Adapt, reorder, and reframe the candidate's experience to align with the JD without exaggeration or fabrication

Emphasize:

The experience and skills that match the JD

Quantified impact, performance, scalability, and reliability

Strictly limit skills and experience to those present in the reference resume

Clearly distinguish between:

Hands-on professional experience

Foundational / academic / conceptual knowledge

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
- Bold important keywords, technologies, and metrics.

7: ATS Safety
- Plain text/Markdown only. No tables or columns.

Optimization Rules

- Prioritize JD-critical keywords

- Reorder skills and bullets based on JD importance

- Use exact JD terminology only when defensible in an interview

- Keep networking and OS topics clearly labeled as foundational unless hands-on experience exists

- Optimize for both ATS parsing and human recruiter clarity

Formatting & Styling Rules (STRICT)

1: Header
- Place name on the first line only.
- Contact details on the second line (Location | Email | Phone | [LinkedIn](URL) | [GitHub](URL)).
- IMPORTANT: LinkedIn and GitHub MUST be clickable Markdown links: [Link Text](URL).
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

7: ATS Safety
- No tables, columns, text boxes, or background shading.
- Use plain text for the body. Clickable Markdown links are ONLY allowed in the header for social profiles.

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
    "original_ats_score": 45,
    "ats_score": 85,
    "optimization_report": [
        "Identified X as a key keyword and prioritized it.",
        "Reframed Y experience to highlight Z impact.",
        "Ensured education section aligns with JD requirements."
    ]
}
Job Description:

            ${jobDescription}


            The Candidate's Current Resume (Reference):
            [
              ${userResume}
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
        // Fallback for non-JSON responses
        return { 
            resume_markdown: text, 
            original_ats_score: 0,
            ats_score: 0,
            optimization_report: ["Failed to parse detailed report."]
        };
    }
  } catch (error) {
    console.error("Error generating resume:", error);
    throw error;
  }
};
