export interface Template {
    id: string;
    name: string;
    icon: string;
    description: string;
}

export const templates: Template[] = [
    { id: 'modern', name: 'Modern Blue', icon: '✨', description: 'Clean, professional with vibrant blue accents.' },
    { id: 'executive', name: 'Executive', icon: '👔', description: 'Classic serif font with rich indigo tones.' },
    { id: 'minimal', name: 'Minimalist', icon: '🌱', description: 'Simple and elegant with fresh emerald accents.' },
    { id: 'technical', name: 'Technical', icon: '💻', description: 'Compact design with electric violet highlights.' }
];

export const getTemplateStyles = (templateId: string, isPrint = false) => {
    // Global Base (Apply to ALL templates)
    const baseCSS = `
        :root {
            --resume-primary: #2563eb;
            --resume-text: #0f172a; /* Slate 900 - High Visibility Primary Text */
            --resume-heading: #020617; /* Slate 950 - Maximum Contrast Header */
            --resume-border-color: #e2e8f0;
        }

        /* Base Reset */
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        body {
            margin: 0;
            padding: 0;
            font-size: 10pt;
            line-height: 1.5;
            color: var(--resume-text);
            font-family: 'Inter', Arial, sans-serif;
            background: #fff;
        }

        h1, h2, h3 {
            margin: 0;
            padding: 0;
            color: var(--resume-heading);
            font-weight: 700;
        }

        p {
            margin: 0 0 6pt 0;
        }

        ul {
            margin: 0;
            padding: 0;
            list-style: none !important;
        }

        li {
            position: relative;
            padding-left: 1.4rem;
            margin-bottom: 4pt;
            list-style: none !important;
        }

        a { color: inherit; text-decoration: none; border-bottom: 1px dotted currentColor; }

        @media print {
            body { -webkit-print-color-adjust: exact; }
            h1, h2, h3, li { page-break-inside: avoid; break-inside: avoid; }
        }
    `;

    const templateSpecificCSS: Record<string, string> = {
        modern: `
            h1 {
                font-size: 24pt;
                font-weight: 800;
                color: #2563eb;
                margin-bottom: 6pt;
                letter-spacing: -0.02em;
            }

            .resume-meta {
                font-size: 10pt;
                color: #475569;
                margin-bottom: 16pt;
                font-weight: 500;
            }

            h2 {
                font-size: 12pt;
                font-weight: 700;
                color: #2563eb;
                text-transform: uppercase;
                border-bottom: 2px solid #2563eb;
                padding-bottom: 4pt;
                margin-top: 18pt;
                margin-bottom: 8pt;
                letter-spacing: 0.05em;
            }

            h3 {
                font-size: 11pt;
                font-weight: 700;
                margin-top: 10pt;
                margin-bottom: 2pt;
            }

            li::before {
                content: "•";
                position: absolute;
                left: 0;
                color: #2563eb;
                font-weight: bold;
            }
        `,
        executive: `
            body {
                font-family: 'Georgia', serif;
            }

            h1 {
                font-size: 26pt;
                text-align: center;
                font-weight: 400;
                margin-bottom: 6pt;
                color: #4338ca;
            }

            .resume-meta {
                text-align: center;
                font-size: 10pt;
                border-bottom: 2px solid #4338ca;
                padding-bottom: 8pt;
                margin-bottom: 20pt;
                color: #6366f1;
            }

            h2 {
                font-size: 13pt;
                text-transform: uppercase;
                text-align: center;
                border-top: 2px solid #4338ca;
                border-bottom: 1px solid #4338ca;
                padding: 4pt 0;
                margin-top: 20pt;
                margin-bottom: 10pt;
                font-weight: 700;
                color: #4338ca;
            }

            h3 {
                font-size: 11.5pt;
                font-weight: 700;
                margin-top: 12pt;
                margin-bottom: 3pt;
                color: #1a202c;
            }

            li::before {
                content: "▪";
                position: absolute;
                left: 0;
                color: #4338ca;
            }
        `,
        minimal: `
            h1 {
                font-size: 22pt;
                font-weight: 300;
                margin-bottom: 4pt;
                color: #059669;
            }

            .resume-meta {
                font-size: 9pt;
                text-transform: uppercase;
                letter-spacing: 0.1em;
                color: #10b981;
                margin-bottom: 24pt;
            }

            h2 {
                font-size: 10pt;
                font-weight: 800;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                margin-top: 24pt;
                margin-bottom: 8pt;
                color: #059669;
                border-left: 4px solid #059669;
                padding-left: 10pt;
            }

            h3 {
                font-size: 11pt;
                font-weight: 600;
                margin-top: 12pt;
                margin-bottom: 3pt;
                color: #065f46;
            }

            li::before {
                content: "—";
                position: absolute;
                left: 0;
                color: #10b981;
                font-weight: 800;
            }
        `,
        technical: `
            body {
                font-family: 'JetBrains Mono', monospace;
                font-size: 9.5pt;
            }

            h1 {
                font-size: 22pt;
                font-weight: 800;
                border-left: 8px solid #7c3aed;
                padding: 6pt 12pt;
                background: #f5f3ff;
                margin-bottom: 6pt;
                color: #5b21b6;
            }

            .resume-meta {
                font-size: 9pt;
                background: #7c3aed;
                color: #fff;
                padding: 8pt 12pt;
                margin-bottom: 20pt;
                border-radius: 0 0 10px 10px;
                font-weight: 600;
            }

            h2 {
                font-size: 11pt;
                font-weight: 800;
                background: #f3f4f6;
                padding: 5pt 10pt;
                margin-top: 18pt;
                margin-bottom: 8pt;
                border-radius: 4px;
                color: #4c1d95;
                border-right: 4px solid #7c3aed;
            }

            h3 {
                font-size: 10.5pt;
                font-weight: 700;
                color: #7c3aed;
                border-bottom: 2px dashed #ddd6fe;
                display: inline-block;
                margin-top: 10pt;
                margin-bottom: 3pt;
            }

            li::before {
                content: "::";
                position: absolute;
                left: 0;
                color: #7c3aed;
                font-weight: 800;
            }
        `
    };

    return `
        ${baseCSS}
        ${templateSpecificCSS[templateId] || templateSpecificCSS.modern}
    `;
};
