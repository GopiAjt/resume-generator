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
        
        // Temporary style overrides to remove borders and shadows for clean capture
        resumeContainer.classList.add('is-printing');

        const opt = {
            margin: 10, // Applies even margin to EVERY page
            filename: fileName,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { 
                scale: 2.5, 
                useCORS: true,
                letterRendering: true,
                logging: false,
                backgroundColor: '#ffffff'
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait' as const 
            },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            onProgress('Generating clean PDF... Please wait.');
            await html2pdf().set(opt).from(resumeContainer).save();
            onSuccess('PDF downloaded successfully!');
        } catch (error) {
            logger.error('PDF generation failed:', error);
            onError('Failed to generate PDF. Click "Copy Markdown" if needed.');
        } finally {
            resumeContainer.classList.remove('is-printing');
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

        const fileName = `${getFilename(generatedResumeMarkdown, companyName)}.doc`;
        const content = `
            <html xmlns:o='urn:schemas-microsoft-com:office:office' 
                  xmlns:w='urn:schemas-microsoft-com:office:word' 
                  xmlns='http://www.w3.org/TR/REC-html40'>
            <head>
                <meta charset='utf-8'>
                <title>Resume</title>
                <style>
                    @page { size: 8.5in 11in; margin: 0.75in 0.75in 0.75in 0.75in; }
                    body { font-family: 'Arial', sans-serif; line-height: 1.4; color: #1a202c; }
                    ${getTemplateStyles(selectedTemplate, false)}
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
        
        onSuccess('DOC download started!');
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
