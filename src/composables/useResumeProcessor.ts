import { ref } from 'vue';
import mammoth from 'mammoth';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { logger } from '@/utils/logger';
import { pdfjsLib } from '@/utils/pdfjs';
import Tesseract from 'tesseract.js';
import type { PDFPageProxy } from 'pdfjs-dist/types/src/display/api';

const MIN_TEXT_CHARS_PER_PAGE = 40;
const DESKTOP_OCR_SCALE = 2.0;
const MOBILE_OCR_SCALE = 1.5;
const MAX_OCR_CANVAS_SIDE = 2200;

type PdfTextContentLike = {
    items?: unknown[];
};

type PdfTextItem = {
    str?: string;
};

type OcrProgress = {
    status?: string;
    progress: number;
};

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

const isLikelyMobileBrowser = () => {
    if (typeof navigator === 'undefined') return false;

    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
};

const getOcrViewport = (page: PDFPageProxy) => {
    const baseScale = isLikelyMobileBrowser() ? MOBILE_OCR_SCALE : DESKTOP_OCR_SCALE;
    const viewport = page.getViewport({ scale: baseScale });
    const largestSide = Math.max(viewport.width, viewport.height);

    if (largestSide <= MAX_OCR_CANVAS_SIDE) {
        return viewport;
    }

    const cappedScale = baseScale * (MAX_OCR_CANVAS_SIDE / largestSide);
    return page.getViewport({ scale: cappedScale });
};

const extractTextFromPdfPageWithOCR = async (page: PDFPageProxy, pageNumber: number): Promise<string> => {
    const viewport = getOcrViewport(page);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    if (!context) {
        throw new Error('Failed to get canvas context for OCR');
    }

    canvas.height = Math.ceil(viewport.height);
    canvas.width = Math.ceil(viewport.width);

    await page.render({
        canvas,
        canvasContext: context,
        viewport,
    }).promise;

    const { data: { text: ocrText } } = await Tesseract.recognize(
        canvas,
        'eng',
        {
            logger: (m: OcrProgress) => {
                if (m.status === 'recognizing text') {
                    logger.info(`OCR Page ${pageNumber} Progress: ${(m.progress * 100).toFixed(0)}%`);
                }
            }
        }
    );

    canvas.width = 0;
    canvas.height = 0;

    return ocrText;
};

const isUsefulPdfText = (text: string) => text.replace(/\s+/g, '').length >= MIN_TEXT_CHARS_PER_PAGE;

const getPdfTextItemString = (item: unknown): string => {
    if (typeof item === 'object' && item !== null && 'str' in item) {
        const text = (item as PdfTextItem).str;
        return typeof text === 'string' ? text : '';
    }

    return '';
};

const extractTextFromPdfPage = async (page: PDFPageProxy, pageNumber: number): Promise<string> => {
    const content = await page.getTextContent() as PdfTextContentLike;
    const items = Array.isArray(content.items) ? content.items : [];
    const strings = items.map(getPdfTextItemString).filter(Boolean);
    const text = strings.join(' ').trim();

    if (isUsefulPdfText(text)) {
        return text;
    }

    logger.info(`Low or no text found on PDF page ${pageNumber}, attempting OCR...`);
    const ocrText = await extractTextFromPdfPageWithOCR(page, pageNumber);

    return isUsefulPdfText(ocrText) || !text ? ocrText : `${text}\n${ocrText}`;
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
                    text += `${await extractTextFromPdfPage(page, i)}\n`;
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
                throw new Error('Failed to extract text from the file. The file might be empty, corrupted, or OCR failed on a scanned document.');
            }
        } catch (error: unknown) {
            logger.error('Text extraction failed:', error);
            errorMessage.value = error instanceof Error ? error.message : 'Failed to read the resume file.';
            throw error;
        } finally {
            isExtracting.value = false;
        }
    };

    const formatResumeHtml = async (markdown: string) => {
        if (!markdown) return '';
        try {
            const rawHtml = await marked.parse(markdown || '')
            const sanitizedHtml = DOMPurify.sanitize(rawHtml || '');
            return sanitizedHtml.replace(/<p>(.*?)<\/p>/, '<p class="resume-meta">$1</p>');
        } catch (error) {
            logger.error('Markdown parsing failed:', error);
            return markdown; // Fallback to original markdown
        }
    }

    return {
        isExtracting,
        extractedResumeText,
        errorMessage,
        extractTextFromFile,
        formatResumeHtml
    };
}
