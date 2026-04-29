// @ts-ignore
import html2pdf from 'html2pdf.js';
import { getTemplateStyles } from '@/services/resumeStyles';
import { getFilename } from '@/utils/resumeUtils';
import { logger } from '@/utils/logger';

export function useResumeExporter() {
    const downloadPDF = async (
        resumeContainer: HTMLElement | null,
        generatedResumeMarkdown: string,
        companyName: string,
        onProgress: (msg: string) => void,
        onSuccess: (msg: string) => void,
        onError: (msg: string) => void
    ) => {
        if (!resumeContainer) return;

        const fileName = `${getFilename(generatedResumeMarkdown, companyName)}.pdf`;

        try {
            onProgress('Generating ATS-friendly multi-page PDF...');

            // Clone node to avoid mutating live UI
            const clonedNode = resumeContainer.cloneNode(true) as HTMLElement;

            // Apply print-specific styles
            clonedNode.classList.add('pdf-export');

            // Inject into hidden container
            const wrapper = document.createElement('div');
            wrapper.style.position = 'fixed';
            wrapper.style.left = '-9999px';
            wrapper.appendChild(clonedNode);
            document.body.appendChild(wrapper);

            const opt = {
                margin: [1, 1, 10, 1] as [number, number, number, number],
                filename: fileName,
                image: { type: 'jpeg' as const, quality: 0.95 },
                html2canvas: {
                    scale: 2, // reduce memory pressure for multi-page
                    useCORS: true,
                    backgroundColor: '#ffffff'
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait' as const
                },
                pagebreak: {
                    mode: ['css'], // ONLY CSS-based control
                    before: '.page-break',
                    avoid: [
                        '.section',
                        '.experience-item',
                        '.project-item',
                        '.education-item'
                    ]
                }
            };

            await html2pdf()
                .set(opt)
                .from(clonedNode)
                .toPdf()
                .get('pdf')
                .then((pdf: any) => {
                    // Ensure proper metadata (helps ATS slightly)
                    pdf.setProperties({
                        title: fileName,
                        subject: 'Resume',
                        author: 'Candidate',
                        keywords: 'resume, profile, cv'
                    });
                    pdf.save(fileName);
                });

            document.body.removeChild(wrapper);

            onSuccess('Multi-page ATS-friendly PDF downloaded!');
        } catch (error) {
            logger.error('PDF generation failed:', error);
            onError('Failed to generate PDF. Click "Copy Markdown" if needed.');
        }
    };

    const downloadDOC = (
        generatedResumeHtml: string, 
        generatedResumeMarkdown: string, 
        companyName: string, 
        selectedTemplate: string,
        onSuccess: (msg: string) => void
    ) => {
        if (!generatedResumeHtml) return;

        // Save as .doc with Word XML namespaces — opens in Word without needing Office installed
        const baseName = getFilename(generatedResumeMarkdown, companyName)
        const fileName = `${baseName}.doc`;
        const docTitle = companyName ? `Resume — ${companyName}` : 'Resume';
        const content = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                  xmlns:w='urn:schemas-microsoft-com:office:word' 
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>${docTitle}</title>
                <style>
                    @page { size: 21cm 29.7cm; margin: 1.27cm; }
                    body { font-family: Arial, sans-serif; line-height: 1.4; color: #1a202c; }
                    ${getTemplateStyles(selectedTemplate, true)}
                </style>
            </head>
            <body>
                ${generatedResumeHtml}
            </body>
            </html>
        `;

        const blob = new Blob([content], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        
        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);
        
        onSuccess('DOC downloaded successfully!');
    };

    const copyToClipboard = async (
        generatedResumeHtml: string, 
        generatedResumeMarkdown: string,
        onSuccess: (msg: string) => void,
        onError: (msg: string) => void
    ) => {
        if (!generatedResumeHtml) return;
        
        try {
            const blob = new Blob([generatedResumeHtml], { type: 'text/html' });
            const data = [new ClipboardItem({ 
                'text/html': blob, 
                'text/plain': new Blob([generatedResumeMarkdown], { type: 'text/plain' }) 
            })];
            await navigator.clipboard.write(data);
            onSuccess('Formatted resume copied to clipboard!');
        } catch (err) {
            try {
                await navigator.clipboard.writeText(generatedResumeMarkdown);
                onSuccess('Resume Markdown copied to clipboard!');
            } catch (innerErr) {
                logger.error('Copy failed:', innerErr);
                onError('Failed to copy. Please select and copy manually.');
            }
        }
    };

    return {
        downloadPDF,
        downloadDOC,
        copyToClipboard
    };
}
