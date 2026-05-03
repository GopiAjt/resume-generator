
import { getTemplateStyles } from '@/services/resumeStyles';
import { getFilename } from '@/utils/resumeUtils';
import { logger } from '@/utils/logger';
import { generateTextBasedPdf } from '@/utils/textPdfGenerator';

export function useResumeExporter() {
    const isIOSWebKit = () => {
        if (typeof navigator === 'undefined') {
            return false;
        }

        const ua = navigator.userAgent || navigator.vendor || '';
        const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        return isIOS && /AppleWebKit/i.test(ua);
    };

    const triggerBlobDownload = async (blob: Blob, fileName: string) => {
        const objectUrl = URL.createObjectURL(blob);

        try {
            if (isIOSWebKit()) {
                const dataUrl = await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(String(reader.result || ''));
                    reader.onerror = () => reject(reader.error || new Error('Failed to read generated file.'));
                    reader.readAsDataURL(blob);
                });

                window.location.href = dataUrl.replace(/^data:[^;]*;/, 'data:attachment/file;');
                return;
            }

            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = objectUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } finally {
            setTimeout(() => {
                URL.revokeObjectURL(objectUrl);
            }, 1000);
        }
    };

    const downloadPDF = async (
        resumeContainer: HTMLElement | null,
        generatedResumeMarkdown: string,
        companyName: string,
        selectedTemplate: string,
        onProgress: (msg: string) => void,
        onSuccess: (msg: string) => void,
        onError: (msg: string) => void
    ) => {
        if (!generatedResumeMarkdown) return;

        const fileName = `${getFilename(generatedResumeMarkdown, companyName)}.pdf`;

        try {
            onProgress('Generating ATS-friendly text-based PDF...');

            // Generate text-based PDF with selectable text and template styling
            const pdfBlob = await generateTextBasedPdf(generatedResumeMarkdown, companyName, selectedTemplate, onProgress);
            await triggerBlobDownload(pdfBlob, fileName);

            onSuccess('ATS-friendly PDF with selectable text downloaded!');
        } catch (error) {
            logger.error('PDF generation failed:', error);
            onError('Failed to generate PDF. Click "Copy Markdown" if needed.');
        }
    };

    const downloadDOC = async (
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

        const blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' });
        await triggerBlobDownload(blob, fileName);
        
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
        } catch {
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
