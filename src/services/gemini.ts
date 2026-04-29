import { GoogleGenerativeAI } from '@google/generative-ai';
import { logger } from '@/utils/logger';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  logger.error("VITE_GEMINI_API_KEY is not set in environment variables.");
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

                    Input Validation & Fallback Rules
                    1. Missing/Short JD: If the Job Description is missing, less than 50 characters, or nonsensical, generate a best-effort generic professional resume based ONLY on the provided resume.
                    2. Language Output: ALWAYS generate the resume in the SAME LANGUAGE as the Job Description. If the JD language and Resume language differ, translate the Resume to match the JD language.

                    Constraints

                    Resume length: STRICTLY 1 page (absolute maximum). Emphasize brevity and conciseness above all else. 
                    Limit bullet points to maximum 3-4 per job role.
                    Aggressively truncate older or less relevant experience to fit a single page.

                    Plain-text, ATS-safe formatting only (no tables, icons, graphics, columns, or emojis)

                    Formatting & Styling Rules (STRICT) - CANONICAL VERSION

                    1: Header
                    - Place name on the first line only using a # header.
                    - Contact details on the second line (Location | Email | Phone | [LinkedIn](URL) | [GitHub](URL)).
                    - IMPORTANT: LinkedIn and GitHub MUST be clickable Markdown links.
                    - Use pipe separators (|) consistently. Left-aligned, no emojis.

                    2: Section Headings
                    - Convert all section headings (SUMMARY, SKILLS, EXPERIENCE, PROJECTS, EDUCATION) to ALL CAPS.
                    - Use ## for section headings.
                    - Use exactly one blank line before and after each section heading.

                    3: Professional Summary
                    - Limit to EXACTLY 2 short lines. Break long sentences for readability.
                    - Left-aligned, no indentation.

                    4: Core Skills
                    - Use ### for category titles. Place category title on its own line.
                    - List skills on the next line as a comma-separated list ending with a period.
                    - Remove all skill-level labels (e.g., Advanced, Intermediate).

                    5: Experience & Projects
                    - Company/Project name on one line using ### header.
                    - Role and Dates on the next line (bolded).
                    - Ensure a blank line before the bullet point list.

                    6: Bullet Points
                    - Use ONLY hyphens (-) for bullet points. Do NOT use custom unicode characters like "•". This is critical so the Markdown parser recognizes them as lists.
                    - 1–2 lines maximum per bullet. Start with strong action verbs. Place metrics early.
                    - Bold important keywords, technologies, and metrics.
                    - NEGATIVE EXAMPLE (DO NOT DO THIS): Multi-clause/run-on bullets. 
                    BAD: "Developed the backend using Node.js and MongoDB and also implemented the frontend using React while managing the CI/CD pipeline and writing tests."
                    GOOD: "Architected a scalable Node.js/MongoDB backend, accelerating core API response times by 30%."

                    7: ATS Safety
                    - Plain Markdown text ONLY. No tables, columns, text boxes, or background shading.

                    Final Validation (Mandatory)
                    Before outputting the resume, verify that ALL formatting rules above are strictly followed. Note: Consider ATS Scores as "keyword match estimates" rather than rigid parser scores.

                    Format
                    You MUST return a JSON object with the following structure:
                    {
                        "resume_markdown": "The full resume content in Markdown format...",
                        "original_ats_score": 45,
                        "ats_score": 85,
                        "optimization_report": [
                            { "category": "Keywords", "action": "Added 'distributed systems' to align with JD", "impact": "High" },
                            { "category": "Input Validation", "action": "JD was missing, generated generic best-effort professional resume", "impact": "Medium" }
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
        // Clean the response text: 
        // 1. Remove markdown code blocks if present (```json or ```)
        // 2. Remove leading/trailing whitespace
        let cleanedText = text.trim();
        if (cleanedText.startsWith('```')) {
            cleanedText = cleanedText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
        }

        // Try to parse the cleaned text
        // 2. Try to extract a balanced JSON object manually if direct parsing fails
        const extractBalancedJson = (text: string) => {
            const startIdx = text.indexOf('{');
            if (startIdx === -1) return null;
            
            let count = 0;
            for (let i = startIdx; i < text.length; i++) {
                if (text[i] === '{') count++;
                else if (text[i] === '}') count--;
                
                if (count === 0) {
                    return text.substring(startIdx, i + 1);
                }
            }
            return null;
        };

        const jsonCandidate = extractBalancedJson(cleanedText) || cleanedText;

        try {
            return JSON.parse(jsonCandidate);
        } catch (initialParseError) {
            logger.warn("JSON.parse failed on candidate, falling back to manual extraction", initialParseError);
            throw initialParseError;
        }
    } catch (e) {
        logger.error("Failed to parse JSON response. Raw text:", text);
        // Fallback for non-JSON responses or malformed output
        return {
            resume_markdown: text,
            original_ats_score: 0,
            ats_score: 0,
            optimization_report: [
                { category: "Error", action: "Failed to parse the detailed report from the AI. The content might have been cut off or malformed.", impact: "High" }
            ]
        };
    }
} catch (error) {
    logger.error("Error generating resume:", error);
    throw error;
  }
};
