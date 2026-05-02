import { ref } from 'vue';
import mammoth from 'mammoth';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { logger } from '@/utils/logger';
import { pdfjsLib } from '@/utils/pdfjs';

const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    if (typeof file.arrayBuffer === 'function') {
        return file.arrayBuffer();
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            if (reader.result instanceof ArrayBuffer) {
                resolve(reader.result);
                return;
            }

            reject(new Error('Failed to read the selected file.'));
        };
        reader.onerror = () => reject(reader.error || new Error('Failed to read the selected file.'));
        reader.readAsArrayBuffer(file);
    });
};

export function useResumeProcessor() {
    const isExtracting = ref(false);
    const extractedResumeText = ref('');
    const errorMessage = ref('');

    const extractTextFromFile = async (file: File) => {
        isExtracting.value = true;
        errorMessage.value = '';
        extractedResumeText.value = '';

        try {
            const fileType = file.type;
            const fileName = file.name.toLowerCase();

            if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
                const arrayBuffer = await readFileAsArrayBuffer(file);
                const pdf = await pdfjsLib.getDocument({
                    data: new Uint8Array(arrayBuffer),
                    disableFontFace: true,
                    isOffscreenCanvasSupported: false,
                }).promise;
                let text = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items
                        .map((item: any) => (typeof item.str === 'string' ? item.str : ''))
                        .filter(Boolean);
                    text += strings.join(' ') + '\n';
                }
                extractedResumeText.value = text;
                logger.info('Extracted PDF Text:', text);
            } else if (
                fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                fileName.endsWith('.docx')
            ) {
                const arrayBuffer = await readFileAsArrayBuffer(file);
                const result = await mammoth.extractRawText({ arrayBuffer });
                extractedResumeText.value = result.value;
                logger.info('Extracted DOCX Text:', result.value);
            } else {
                throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
            }

            if (!extractedResumeText.value.trim()) {
                throw new Error('Failed to extract text from the file. The file might be empty or scanned as an image.');
            }
        } catch (error: any) {
            logger.error('Text extraction failed:', error);
            errorMessage.value = error.message || 'Failed to read the resume file.';
            throw error;
        } finally {
            isExtracting.value = false;
        }
    };

    const formatResumeHtml = async (markdown: string) => {
        const rawHtml = await marked.parse(markdown)
        const sanitizedHtml = DOMPurify.sanitize(rawHtml);
        return sanitizedHtml.replace(/<p>(.*?)<\/p>/, '<p class="resume-meta">$1</p>');
    }

    return {
        isExtracting,
        extractedResumeText,
        errorMessage,
        extractTextFromFile,
        formatResumeHtml
    };
}
