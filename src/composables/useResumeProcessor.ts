import { ref } from 'vue';
import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

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
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
                let text = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const content = await page.getTextContent();
                    const strings = content.items.map((item: any) => item.str);
                    text += strings.join(' ') + '\n';
                }
                extractedResumeText.value = text;
            } else if (
                fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                fileName.endsWith('.docx')
            ) {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                extractedResumeText.value = result.value;
            } else {
                throw new Error('Unsupported file format. Please upload a PDF or DOCX file.');
            }

            if (!extractedResumeText.value.trim()) {
                throw new Error('Failed to extract text from the file. The file might be empty or scanned as an image.');
            }
        } catch (error: any) {
            console.error('Text extraction failed:', error);
            errorMessage.value = error.message || 'Failed to read the resume file.';
            throw error;
        } finally {
            isExtracting.value = false;
        }
    };

    return {
        isExtracting,
        extractedResumeText,
        errorMessage,
        extractTextFromFile
    };
}
