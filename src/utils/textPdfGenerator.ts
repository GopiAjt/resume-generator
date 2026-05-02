import { jsPDF } from 'jspdf';
import { logger } from '@/utils/logger';

interface PdfSection {
    type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list' | 'meta';
    text: string;
    bold?: boolean;
}

interface TemplateConfig {
    heading1Font: string;
    heading1Size: number;
    heading1Color: [number, number, number];
    heading2Font: string;
    heading2Size: number;
    heading2Color: [number, number, number];
    heading3Font: string;
    heading3Size: number;
    heading3Color: [number, number, number];
    bodyFont: string;
    bodySize: number;
    bodyColor: [number, number, number];
    accentColor: [number, number, number];
}

const templates: Record<string, TemplateConfig> = {
    modern: {
        heading1Font: 'helvetica',
        heading1Size: 20,
        heading1Color: [37, 99, 235], // Blue
        heading2Font: 'helvetica',
        heading2Size: 14,
        heading2Color: [37, 99, 235], // Blue
        heading3Font: 'helvetica',
        heading3Size: 12,
        heading3Color: [37, 99, 235], // Blue
        bodyFont: 'helvetica',
        bodySize: 10,
        bodyColor: [15, 23, 42], // Slate 900
        accentColor: [37, 99, 235], // Blue
    },
    executive: {
        heading1Font: 'times',
        heading1Size: 22,
        heading1Color: [67, 56, 202], // Indigo
        heading2Font: 'times',
        heading2Size: 15,
        heading2Color: [67, 56, 202], // Indigo
        heading3Font: 'times',
        heading3Size: 12,
        heading3Color: [26, 32, 44], // Dark
        bodyFont: 'times',
        bodySize: 10,
        bodyColor: [15, 23, 42], // Slate 900
        accentColor: [67, 56, 202], // Indigo
    },
    minimal: {
        heading1Font: 'helvetica',
        heading1Size: 18,
        heading1Color: [5, 150, 105], // Emerald
        heading2Font: 'helvetica',
        heading2Size: 13,
        heading2Color: [5, 150, 105], // Emerald
        heading3Font: 'helvetica',
        heading3Size: 11,
        heading3Color: [6, 95, 70], // Dark Emerald
        bodyFont: 'helvetica',
        bodySize: 10,
        bodyColor: [15, 23, 42], // Slate 900
        accentColor: [5, 150, 105], // Emerald
    },
    technical: {
        heading1Font: 'courier',
        heading1Size: 18,
        heading1Color: [124, 58, 237], // Violet
        heading2Font: 'courier',
        heading2Size: 12,
        heading2Color: [76, 29, 149], // Dark Violet
        heading3Font: 'courier',
        heading3Size: 11,
        heading3Color: [124, 58, 237], // Violet
        bodyFont: 'courier',
        bodySize: 9,
        bodyColor: [15, 23, 42], // Slate 900
        accentColor: [124, 58, 237], // Violet
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
            const lineHeight = template.bodySize * 0.6;
            let currentY = margin;

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
                // Check if we need a new page
                if (currentY > pageHeight - margin) {
                    doc.addPage();
                    currentY = margin;
                }

                switch (section.type) {
                    case 'heading1':
                        doc.setFont(template.heading1Font, 'bold');
                        doc.setFontSize(template.heading1Size);
                        doc.setTextColor(...template.heading1Color);
                        currentY = addWrappedText(doc, section.text, margin, currentY, maxWidth, template.heading1Size * 0.6);
                        currentY += lineHeight;
                        break;

                    case 'heading2':
                        doc.setFont(template.heading2Font, 'bold');
                        doc.setFontSize(template.heading2Size);
                        doc.setTextColor(...template.heading2Color);
                        currentY = addWrappedText(doc, section.text.toUpperCase(), margin, currentY, maxWidth, template.heading2Size * 0.6);
                        currentY += lineHeight * 0.5;
                        break;

                    case 'heading3':
                        doc.setFont(template.heading3Font, 'bold');
                        doc.setFontSize(template.heading3Size);
                        doc.setTextColor(...template.heading3Color);
                        currentY = addWrappedText(doc, section.text, margin, currentY, maxWidth, template.heading3Size * 0.6);
                        currentY += lineHeight * 0.3;
                        break;

                    case 'meta':
                        doc.setFont(template.bodyFont, 'normal');
                        doc.setFontSize(template.bodySize);
                        doc.setTextColor(...template.bodyColor);
                        currentY = addWrappedText(doc, section.text, margin, currentY, maxWidth, lineHeight);
                        currentY += lineHeight * 0.5;
                        break;

                    case 'paragraph':
                        doc.setFont(template.bodyFont, section.bold ? 'bold' : 'normal');
                        doc.setFontSize(template.bodySize);
                        doc.setTextColor(...template.bodyColor);
                        currentY = addWrappedText(doc, section.text, margin, currentY, maxWidth, lineHeight);
                        currentY += lineHeight * 0.5;
                        break;

                    case 'list':
                        doc.setFont(template.bodyFont, 'normal');
                        doc.setFontSize(template.bodySize);
                        doc.setTextColor(...template.bodyColor);
                        const lines = doc.splitTextToSize(section.text, maxWidth - 5);
                        for (const line of lines) {
                            if (currentY > pageHeight - margin) {
                                doc.addPage();
                                currentY = margin;
                            }
                            doc.setTextColor(...template.accentColor);
                            doc.text('•', margin, currentY);
                            doc.setTextColor(...template.bodyColor);
                            doc.text(line, margin + 5, currentY);
                            currentY += lineHeight;
                        }
                        currentY += lineHeight * 0.3;
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
        // Regular paragraph
        else {
            flushList(sections, currentList);
            currentList = [];
            sections.push({
                type: 'paragraph',
                text: trimmed
            });
        }
    }

    // Flush any remaining list
    flushList(sections, currentList);

    return sections;
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
    lineHeight: number
): number {
    const lines = doc.splitTextToSize(text, maxWidth);
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 12.7;

    for (const line of lines) {
        if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }
        doc.text(line, x, y);
        y += lineHeight;
    }

    return y;
}
