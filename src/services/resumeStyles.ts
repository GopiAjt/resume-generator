export interface Template {
    id: string;
    name: string;
    icon: string;
    description: string;
}

export const templates: Template[] = [
    { id: 'modern', name: 'Modern Blue', icon: '✨', description: 'Clean, professional with blue accents.' },
    { id: 'executive', name: 'Executive', icon: '👔', description: 'Classic serif font for a senior look.' },
    { id: 'minimal', name: 'Minimalist', icon: '🌱', description: 'Simple, spacious and elegant.' },
    { id: 'technical', name: 'Technical', icon: '💻', description: 'Compact and focused on skills.' }
];

export const getTemplateStyles = (templateId: string, isPrint = false) => {
    const baseStyles = `
        font-family: 'Inter', -apple-system, system-ui, sans-serif;
        color: #1a202c;
        line-height: 1.4;
    `;

    const templateCSS: Record<string, string> = {
        modern: `
            h1 { font-size: 24pt; color: #1a365d; margin-bottom: 4pt; font-weight: 800; letter-spacing: -0.02em; }
            p:first-of-type { font-size: 10pt; color: #4a5568; margin-bottom: 16pt; font-weight: 500; }
            h2 { font-size: 12pt; color: #2b6cb0; text-transform: uppercase; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 4pt; margin-top: 20pt; margin-bottom: 10pt; font-weight: 700; letter-spacing: 0.05em; }
            h3 { font-size: 11pt; color: #1a202c; margin-top: 12pt; margin-bottom: 4pt; font-weight: 700; }
            p, li { font-size: 10pt; color: #2d3748; margin-bottom: 5pt; }
            li::before { content: "•"; color: #2b6cb0; font-weight: bold; margin-right: 8pt; }
        `,
        executive: `
            body { font-family: 'Georgia', serif; }
            h1 { font-size: 26pt; color: #000; text-align: center; margin-bottom: 6pt; font-weight: normal; }
            p:first-of-type { font-size: 10pt; color: #333; text-align: center; margin-bottom: 24pt; border-bottom: 1px solid #333; padding-bottom: 10pt; }
            h2 { font-size: 13pt; color: #000; border-top: 2px solid #000; border-bottom: 1px solid #000; padding: 4pt 0; margin-top: 22pt; margin-bottom: 12pt; text-align: center; font-weight: bold; }
            h3 { font-size: 11.5pt; color: #000; margin-top: 14pt; margin-bottom: 4pt; font-weight: bold; }
            p, li { font-size: 10.5pt; color: #111; margin-bottom: 6pt; }
            li::before { content: "▪"; color: #000; margin-right: 8pt; }
        `,
        minimal: `
            h1 { font-size: 22pt; color: #111; margin-bottom: 2pt; font-weight: 300; }
            p:first-of-type { font-size: 9pt; color: #718096; margin-bottom: 30pt; text-transform: uppercase; letter-spacing: 0.1em; }
            h2 { font-size: 10pt; color: #111; text-transform: uppercase; letter-spacing: 0.2em; margin-top: 30pt; margin-bottom: 10pt; font-weight: 600; }
            h3 { font-size: 11pt; color: #111; margin-top: 15pt; margin-bottom: 5pt; font-weight: 600; }
            p, li { font-size: 10pt; color: #4a5568; margin-bottom: 8pt; }
            li::before { content: "—"; color: #cbd5e0; margin-right: 8pt; }
        `,
        technical: `
            body { font-family: 'JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', monospace; font-size: 9.5pt; }
            h1 { font-size: 22pt; color: #000; margin-bottom: 4pt; border-left: 8px solid #000; padding: 6pt 15pt; background: #f7fafc; letter-spacing: -0.02em; font-weight: 800; }
            p:first-of-type { font-size: 9pt; color: #fff; background: #1a202c; padding: 10pt 20pt; border-radius: 0 0 12px 12px; margin-bottom: 25pt; }
            h2 { font-size: 11pt; color: #000; background: #edf2f7; padding: 6pt 12pt; margin-top: 20pt; margin-bottom: 10pt; font-weight: 800; border-radius: 4px; }
            h3 { font-size: 10.5pt; color: #2b6cb0; border-bottom: 1px dashed #cbd5e0; display: inline-block; padding-bottom: 2pt; margin-top: 12pt; font-weight: 800; }
            p, li { font-size: 9.5pt; color: #2d3748; margin-bottom: 5pt; }
            li { padding-left: 1.5rem; }
            li::before { content: "::"; color: #718096; font-weight: 800; position: absolute; left: 0; font-size: 0.9em; }
        `
    };

    return `
        ${baseStyles}
        ${templateCSS[templateId] || templateCSS.modern}
        ul { list-style: none; padding-left: 0; }
        li { position: relative; }
        strong { font-weight: 600; }
        a { color: inherit; text-decoration: none; border-bottom: 1px dotted currentColor; }
        * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        h1, h2, h3, li { page-break-inside: avoid; break-inside: avoid; }
    `;
};
