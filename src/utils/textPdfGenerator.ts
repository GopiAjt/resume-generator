import { jsPDF } from 'jspdf';
import { logger } from '@/utils/logger';

interface PdfSection {
    type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list' | 'meta';
    text: string;
    bold?: boolean;
    inlineText?: Array<{ text: string; bold: boolean }>;
}

interface TemplateConfig {
    heading1Font: string;
    heading1Size: number;
    heading1Color: [number, number, number];
    heading1Align: 'left' | 'center';
    heading2Font: string;
    heading2Size: number;
    heading2Color: [number, number, number];
    heading2Align: 'left' | 'center';
    heading2Uppercase: boolean;
    heading2Underline: boolean;
    heading3Font: string;
    heading3Size: number;
    heading3Color: [number, number, number];
    bodyFont: string;
    bodySize: number;
    bodyColor: [number, number, number];
    accentColor: [number, number, number];
    bulletChar: string;
}

const templates: Record<string, TemplateConfig> = {
    modern: {
        heading1Font: 'helvetica',
        heading1Size: 24,
        heading1Color: [37, 99, 235], // Blue
        heading1Align: 'left',
        heading2Font: 'helvetica',
        heading2Size: 10,
        heading2Color: [37, 99, 235], // Blue
        heading2Align: 'left',
        heading2Uppercase: true,
        heading2Underline: true,
        heading3Font: 'helvetica',
        heading3Size: 9.5,
        heading3Color: [15, 23, 42], // Slate 900
        bodyFont: 'helvetica',
        bodySize: 8.5,
        bodyColor: [15, 23, 42], // Slate 900
        accentColor: [37, 99, 235], // Blue
        bulletChar: '•',
    },
    executive: {
        heading1Font: 'times',
        heading1Size: 26,
        heading1Color: [67, 56, 202], // Indigo
        heading1Align: 'center',
        heading2Font: 'times',
        heading2Size: 11,
        heading2Color: [67, 56, 202], // Indigo
        heading2Align: 'center',
        heading2Uppercase: true,
        heading2Underline: false,
        heading3Font: 'times',
        heading3Size: 9.5,
        heading3Color: [26, 32, 44], // Dark
        bodyFont: 'times',
        bodySize: 8.5,
        bodyColor: [15, 23, 42], // Slate 900
        accentColor: [67, 56, 202], // Indigo
        bulletChar: '▪',
    },
    minimal: {
        heading1Font: 'helvetica',
        heading1Size: 22,
        heading1Color: [5, 150, 105], // Emerald
        heading1Align: 'left',
        heading2Font: 'helvetica',
        heading2Size: 9.5,
        heading2Color: [5, 150, 105], // Emerald
        heading2Align: 'left',
        heading2Uppercase: true,
        heading2Underline: false,
        heading3Font: 'helvetica',
        heading3Size: 9,
        heading3Color: [6, 95, 70], // Dark Emerald
        bodyFont: 'helvetica',
        bodySize: 8,
        bodyColor: [15, 23, 42], // Slate 900
        accentColor: [16, 185, 129], // Emerald (lighter for bullets)
        bulletChar: '—',
    },
    technical: {
        heading1Font: 'courier',
        heading1Size: 22,
        heading1Color: [91, 33, 182], // Dark Violet
        heading1Align: 'left',
        heading2Font: 'courier',
        heading2Size: 10,
        heading2Color: [76, 29, 149], // Dark Violet
        heading2Align: 'left',
        heading2Uppercase: false,
        heading2Underline: false,
        heading3Font: 'courier',
        heading3Size: 9,
        heading3Color: [124, 58, 237], // Violet
        bodyFont: 'courier',
        bodySize: 9.5,
        bodyColor: [15, 23, 42], // Slate 900
        accentColor: [124, 58, 237], // Violet
        bulletChar: '▶',
    },
};

export function generateTextBasedPdf(
    markdown: string,
    companyName: string,
    selectedTemplate: string,
    onProgress: (msg: string) => void
): Promise<Blob> {
    return new Promise((resolve, reject) => {
        try {
            onProgress('Generating ATS-friendly text-based PDF...');

            const doc = new jsPDF({
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            });

            // Get template configuration
            const template = templates[selectedTemplate] || templates.modern;
            if (!template) {
                throw new Error('Template configuration not found');
            }

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const margin = 12.7; // 0.5 inch margin
            const maxWidth = pageWidth - (margin * 2);
            let currentY = margin;

            // Helper function to check and handle page breaks
            const checkPageBreak = (y: number, requiredSpace: number = template.bodySize * 0.5): number => {
                if (y > pageHeight - margin - requiredSpace) {
                    doc.addPage();
                    return margin;
                }
                return y;
            };

            // Parse markdown into sections
            const sections = parseMarkdownToSections(markdown);

            // Add metadata
            const fileName = companyName ? `Resume — ${companyName}` : 'Resume';
            doc.setProperties({
                title: fileName,
                subject: 'Resume',
                author: 'Candidate',
                keywords: 'resume, profile, cv'
            });

            // Process each section
            for (const section of sections) {
                currentY = checkPageBreak(currentY);

                switch (section.type) {
                    case 'heading1':
                        doc.setFont(template.heading1Font, 'bold');
                        doc.setFontSize(template.heading1Size);
                        doc.setTextColor(...template.heading1Color);
                        const h1X = template.heading1Align === 'center' ? pageWidth / 2 : margin;
                        const h1Align = template.heading1Align === 'center' ? 'center' : 'left';
                        const h1LineHeight = template.heading1Size * 0.5;
                        currentY = addWrappedText(doc, section.text, h1X, currentY, maxWidth, h1LineHeight, h1Align, checkPageBreak);
                        currentY += h1LineHeight;
                        break;

                    case 'heading2':
                        doc.setFont(template.heading2Font, 'bold');
                        doc.setFontSize(template.heading2Size);
                        doc.setTextColor(...template.heading2Color);
                        const h2Text = template.heading2Uppercase ? section.text.toUpperCase() : section.text;
                        const h2X = template.heading2Align === 'center' ? pageWidth / 2 : margin;
                        const h2Align = template.heading2Align === 'center' ? 'center' : 'left';
                        const h2LineHeight = template.heading2Size * 0.5;
                        const beforeUnderlineY = currentY;
                        currentY = addWrappedText(doc, h2Text, h2X, currentY, maxWidth, h2LineHeight, h2Align, checkPageBreak);
                        if (template.heading2Underline) {
                            const textWidth = doc.getTextWidth(h2Text);
                            const underlineX = template.heading2Align === 'center' ? (pageWidth / 2) - (textWidth / 2) : margin;
                            doc.setDrawColor(...template.heading2Color);
                            doc.setLineWidth(0.3);
                            doc.line(underlineX, currentY + 1, underlineX + textWidth, currentY + 1);
                            currentY += 2;
                        }
                        currentY += h2LineHeight * 0.5;
                        break;

                    case 'heading3':
                        doc.setFont(template.heading3Font, 'bold');
                        doc.setFontSize(template.heading3Size);
                        doc.setTextColor(...template.heading3Color);
                        const h3LineHeight = template.heading3Size * 0.5;
                        currentY = addWrappedText(doc, section.text, margin, currentY, maxWidth, h3LineHeight, 'left', checkPageBreak);
                        currentY += h3LineHeight * 0.3;
                        break;

                    case 'meta':
                        doc.setFont(template.bodyFont, 'normal');
                        doc.setFontSize(template.bodySize);
                        doc.setTextColor(...template.bodyColor);
                        const metaLineHeight = template.bodySize * 0.5;
                        currentY = addWrappedText(doc, section.text, margin, currentY, maxWidth, metaLineHeight, 'left', checkPageBreak);
                        currentY += metaLineHeight * 0.5;
                        break;

                    case 'paragraph':
                        doc.setFont(template.bodyFont, 'normal');
                        doc.setFontSize(template.bodySize);
                        doc.setTextColor(...template.bodyColor);
                        const paraLineHeight = template.bodySize * 0.5;
                        if (section.inlineText && section.inlineText.length > 0) {
                            // Handle inline bold text
                            currentY = addInlineText(doc, section.inlineText, margin, currentY, maxWidth, paraLineHeight, template.bodyFont, template.bodyColor, checkPageBreak);
                        } else {
                            doc.setFont(template.bodyFont, section.bold ? 'bold' : 'normal');
                            currentY = addWrappedText(doc, section.text, margin, currentY, maxWidth, paraLineHeight, 'left', checkPageBreak);
                        }
                        currentY += paraLineHeight * 0.5;
                        break;

                    case 'list':
                        doc.setFont(template.bodyFont, 'normal');
                        doc.setFontSize(template.bodySize);
                        doc.setTextColor(...template.bodyColor);
                        const listLineHeight = template.bodySize * 0.5;
                        const items = section.text.split('\n');
                        for (const item of items) {
                            currentY = checkPageBreak(currentY, listLineHeight);
                            const lines = doc.splitTextToSize(item, maxWidth - 8);
                            for (let i = 0; i < lines.length; i++) {
                                currentY = checkPageBreak(currentY, listLineHeight);
                                if (i === 0) {
                                    doc.setTextColor(...template.accentColor);
                                    doc.text(template.bulletChar, margin, currentY);
                                    doc.setTextColor(...template.bodyColor);
                                    doc.text(lines[i], margin + 8, currentY);
                                } else {
                                    // Wrapped lines align with text, not bullet
                                    doc.text(lines[i], margin + 8, currentY);
                                }
                                currentY += listLineHeight;
                            }
                        }
                        currentY += listLineHeight * 0.3;
                        break;
                }
            }

            // Generate blob
            const pdfBlob = doc.output('blob');
            resolve(pdfBlob);
        } catch (error) {
            logger.error('Text-based PDF generation failed:', error);
            reject(error);
        }
    });
}

function parseMarkdownToSections(markdown: string): PdfSection[] {
    const sections: PdfSection[] = [];
    const lines = markdown.split('\n');
    let currentList: string[] = [];

    for (const line of lines) {
        const trimmed = line.trim();

        // Empty line - flush any current list
        if (!trimmed) {
            if (currentList.length > 0) {
                sections.push({
                    type: 'list',
                    text: currentList.join('\n')
                });
                currentList = [];
            }
            continue;
        }

        // Heading 1
        if (trimmed.startsWith('# ')) {
            flushList(sections, currentList);
            currentList = [];
            sections.push({
                type: 'heading1',
                text: trimmed.substring(2).trim()
            });
        }
        // Heading 2
        else if (trimmed.startsWith('## ')) {
            flushList(sections, currentList);
            currentList = [];
            sections.push({
                type: 'heading2',
                text: trimmed.substring(3).trim()
            });
        }
        // Heading 3
        else if (trimmed.startsWith('### ')) {
            flushList(sections, currentList);
            currentList = [];
            sections.push({
                type: 'heading3',
                text: trimmed.substring(4).trim()
            });
        }
        // List item
        else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            currentList.push(trimmed.substring(2).trim());
        }
        // Bold text (convert to normal for PDF)
        else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
            flushList(sections, currentList);
            currentList = [];
            sections.push({
                type: 'paragraph',
                text: trimmed.substring(2, trimmed.length - 2).trim(),
                bold: true
            });
        }
        // Meta section (contact info - typically contains | separators)
        else if (trimmed.includes('|') && !trimmed.startsWith('#')) {
            flushList(sections, currentList);
            currentList = [];
            sections.push({
                type: 'meta',
                text: trimmed
            });
        }
        // Regular paragraph - check for inline bold
        else {
            flushList(sections, currentList);
            currentList = [];
            const inlineText = parseInlineBold(trimmed);
            if (inlineText.length > 1) {
                sections.push({
                    type: 'paragraph',
                    text: trimmed,
                    inlineText
                });
            } else {
                sections.push({
                    type: 'paragraph',
                    text: trimmed
                });
            }
        }
    }

    // Flush any remaining list
    flushList(sections, currentList);

    return sections;
}

function parseInlineBold(text: string): Array<{ text: string; bold: boolean }> {
    const parts: Array<{ text: string; bold: boolean }> = [];
    const regex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
        // Add text before bold
        if (match.index > lastIndex) {
            const normalText = text.substring(lastIndex, match.index);
            if (normalText) {
                parts.push({ text: normalText, bold: false });
            }
        }
        // Add bold text
        parts.push({ text: match[1], bold: true });
        lastIndex = regex.lastIndex;
    }

    // Add remaining text
    if (lastIndex < text.length) {
        const remainingText = text.substring(lastIndex);
        if (remainingText) {
            parts.push({ text: remainingText, bold: false });
        }
    }

    // If no bold found, return empty array
    if (parts.length === 0) {
        return [];
    }

    return parts;
}

function flushList(sections: PdfSection[], currentList: string[]) {
    if (currentList.length > 0) {
        sections.push({
            type: 'list',
            text: currentList.join('\n')
        });
    }
}

function addWrappedText(
    doc: jsPDF,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    align: 'left' | 'center' = 'left',
    checkPageBreak?: (y: number, requiredSpace?: number) => number
): number {
    const lines = doc.splitTextToSize(text, maxWidth);
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12.7;

    for (const line of lines) {
        if (checkPageBreak) {
            y = checkPageBreak(y, lineHeight);
        } else {
            if (y > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
        }
        doc.text(line, x, y, { align });
        y += lineHeight;
    }

    return y;
}

function addInlineText(
    doc: jsPDF,
    inlineText: Array<{ text: string; bold: boolean }>,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
    font: string,
    color: [number, number, number],
    checkPageBreak: (y: number, requiredSpace?: number) => number
): number {
    let currentX = x;
    let currentY = y;
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12.7;

    for (const part of inlineText) {
        doc.setFont(font, part.bold ? 'bold' : 'normal');
        doc.setTextColor(...color);

        const words = part.text.split(' ');
        for (const word of words) {
            const wordWithSpace = word + ' ';
            const wordWidth = doc.getTextWidth(wordWithSpace);

            // Check if word fits on current line
            if (currentX + wordWidth > x + maxWidth) {
                currentX = x;
                currentY += lineHeight;
                currentY = checkPageBreak(currentY, lineHeight);
            }

            doc.text(word, currentX, currentY);
            currentX += wordWidth;
        }
    }

    return currentY;
}
