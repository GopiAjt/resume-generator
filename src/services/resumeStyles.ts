export interface Template {
    id: string;
    name: string;
    icon: string;
    description: string;
}

export interface ResumeTemplateStyle {
    cssFontFamily: string;
    pdfFontFamily: 'helvetica' | 'times' | 'courier';
    heading1Size: number;
    heading1Weight: number;
    heading1Color: string;
    heading1Align: 'left' | 'center';
    heading2Size: number;
    heading2Weight: number;
    heading2Color: string;
    heading2Align: 'left' | 'center';
    heading2Uppercase: boolean;
    heading2Underline: boolean;
    heading3Size: number;
    heading3Weight: number;
    heading3Color: string;
    bodySize: number;
    bodyColor: string;
    metaSize: number;
    metaColor: string;
    metaWeight: number;
    metaAlign: 'left' | 'center';
    accentColor: string;
    bulletChar: string;
}

export const templates: Template[] = [
    { id: 'modern', name: 'Modern Blue', icon: '✨', description: 'Clean, professional with vibrant blue accents.' },
    { id: 'executive', name: 'Executive', icon: '👔', description: 'Classic serif font with rich indigo tones.' },
    { id: 'minimal', name: 'Minimalist', icon: '🌱', description: 'Simple and elegant with fresh emerald accents.' },
    { id: 'technical', name: 'Technical', icon: '💻', description: 'Compact design with electric violet highlights.' }
];

export const resumeTemplateStyles: Record<string, ResumeTemplateStyle> = {
    modern: {
        cssFontFamily: 'Arial, Helvetica, sans-serif',
        pdfFontFamily: 'helvetica',
        heading1Size: 24,
        heading1Weight: 800,
        heading1Color: '#2563eb',
        heading1Align: 'left',
        heading2Size: 10,
        heading2Weight: 700,
        heading2Color: '#2563eb',
        heading2Align: 'left',
        heading2Uppercase: true,
        heading2Underline: true,
        heading3Size: 9.5,
        heading3Weight: 700,
        heading3Color: '#0f172a',
        bodySize: 8.5,
        bodyColor: '#0f172a',
        metaSize: 8.5,
        metaColor: '#475569',
        metaWeight: 500,
        metaAlign: 'left',
        accentColor: '#2563eb',
        bulletChar: '•',
    },
    executive: {
        cssFontFamily: '"Times New Roman", Times, serif',
        pdfFontFamily: 'times',
        heading1Size: 26,
        heading1Weight: 600,
        heading1Color: '#4338ca',
        heading1Align: 'center',
        heading2Size: 11,
        heading2Weight: 700,
        heading2Color: '#4338ca',
        heading2Align: 'center',
        heading2Uppercase: true,
        heading2Underline: false,
        heading3Size: 9.5,
        heading3Weight: 700,
        heading3Color: '#1a202c',
        bodySize: 8.5,
        bodyColor: '#0f172a',
        metaSize: 8.5,
        metaColor: '#6366f1',
        metaWeight: 400,
        metaAlign: 'center',
        accentColor: '#4338ca',
        bulletChar: '▪',
    },
    minimal: {
        cssFontFamily: 'Arial, Helvetica, sans-serif',
        pdfFontFamily: 'helvetica',
        heading1Size: 22,
        heading1Weight: 500,
        heading1Color: '#059669',
        heading1Align: 'left',
        heading2Size: 9.5,
        heading2Weight: 800,
        heading2Color: '#059669',
        heading2Align: 'left',
        heading2Uppercase: true,
        heading2Underline: false,
        heading3Size: 9,
        heading3Weight: 600,
        heading3Color: '#065f46',
        bodySize: 8,
        bodyColor: '#0f172a',
        metaSize: 8,
        metaColor: '#10b981',
        metaWeight: 500,
        metaAlign: 'left',
        accentColor: '#10b981',
        bulletChar: '—',
    },
    technical: {
        cssFontFamily: '"Courier New", Courier, monospace',
        pdfFontFamily: 'courier',
        heading1Size: 22,
        heading1Weight: 800,
        heading1Color: '#5b21b6',
        heading1Align: 'left',
        heading2Size: 10,
        heading2Weight: 800,
        heading2Color: '#4c1d95',
        heading2Align: 'left',
        heading2Uppercase: false,
        heading2Underline: false,
        heading3Size: 9,
        heading3Weight: 700,
        heading3Color: '#7c3aed',
        bodySize: 9.5,
        bodyColor: '#0f172a',
        metaSize: 9.5,
        metaColor: '#0f172a',
        metaWeight: 400,
        metaAlign: 'left',
        accentColor: '#7c3aed',
        bulletChar: '▶',
    },
};

export const getTemplateStyles = (templateId: string, isPrint = false, scopeSelector?: string) => {
    const template: ResumeTemplateStyle = resumeTemplateStyles[templateId] ?? resumeTemplateStyles.modern!;
    const rootSelector = scopeSelector || 'body';
    const select = (suffix = '') => `${rootSelector}${suffix}`;
    const contentSelector = scopeSelector ? `${scopeSelector} *` : '*';
    const headingSelector = `${select(' h1')}, ${select(' h2')}, ${select(' h3')}`;

    return `
        ${contentSelector} { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }

        ${rootSelector} {
            margin: 0;
            padding: 0;
            font-size: ${template.bodySize}pt;
            line-height: ${isPrint ? '1.15' : '1.3'};
            color: ${template.bodyColor};
            font-family: ${template.cssFontFamily};
            background: #fff;
            text-align: left;
        }

        ${headingSelector} {
            padding: 0;
            font-weight: 700;
            margin-top: ${isPrint ? '2pt' : '4pt'};
            margin-bottom: ${isPrint ? '1pt' : '2pt'};
        }

        ${select(' p')} {
            margin: 0 0 ${isPrint ? '1.5pt' : '2pt'} 0;
            font-size: ${template.bodySize}pt;
            color: ${template.bodyColor};
        }

        ${select(' ul')} {
            margin: 0;
            padding: 0;
            list-style: none !important;
        }

        ${select(' li')} {
            position: relative;
            padding-left: 0.9rem;
            margin-bottom: ${isPrint ? '1pt' : '1.5pt'};
            list-style: none !important;
            font-size: ${template.bodySize}pt;
            line-height: ${isPrint ? '1.15' : '1.3'};
        }

        ${select(' strong')}, ${select(' b')} { font-weight: 700; }
        ${select(' em')}, ${select(' i')} { font-style: italic; }
        ${select(' a')} { color: inherit; text-decoration: none; border-bottom: 1px dotted currentColor; }

        ${select(' h1')} {
            font-size: ${template.heading1Size}pt;
            font-weight: ${template.heading1Weight};
            color: ${template.heading1Color};
            text-align: ${template.heading1Align};
            margin-bottom: 6pt;
            letter-spacing: ${templateId === 'modern' ? '-0.02em' : '0'};
        }

        ${select(' .resume-meta')} {
            font-size: ${template.metaSize}pt;
            color: ${template.metaColor};
            font-weight: ${template.metaWeight};
            text-align: ${template.metaAlign};
            text-transform: ${templateId === 'minimal' ? 'uppercase' : 'none'};
            letter-spacing: ${templateId === 'minimal' ? '0.1em' : '0'};
            margin-bottom: 6pt;
        }

        ${select(' h2')} {
            font-size: ${template.heading2Size}pt;
            font-weight: ${template.heading2Weight};
            color: ${template.heading2Color};
            text-align: ${template.heading2Align};
            text-transform: ${template.heading2Uppercase ? 'uppercase' : 'none'};
            letter-spacing: ${templateId === 'modern' ? '0.05em' : templateId === 'minimal' ? '0.2em' : '0'};
            border-bottom: ${template.heading2Underline ? `2px solid ${template.heading2Color}` : 'none'};
            margin-top: 6pt;
            margin-bottom: 2pt;
            padding-bottom: ${template.heading2Underline ? '1pt' : '0'};
        }

        ${select(' h3')} {
            font-size: ${template.heading3Size}pt;
            font-weight: ${template.heading3Weight};
            color: ${template.heading3Color};
            margin-top: 3pt;
            margin-bottom: 1pt;
        }

        ${select(' li::before')} {
            content: "${template.bulletChar}";
            position: absolute;
            left: 0;
            color: ${template.accentColor};
            font-weight: 700;
        }

        ${!scopeSelector ? `
        @page {
            size: A4;
            margin: 12mm 15mm;
        }

        @media print {
            body { -webkit-print-color-adjust: exact; }
            h1, h2, h3, li { page-break-inside: avoid; break-inside: avoid; }
            section, .section { page-break-inside: avoid; }
        }` : ''}
    `;
};
