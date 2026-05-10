import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

// pdfjs-dist v5 requires workerSrc to always be set — it removed the
// main-thread fallback in v4. iOS async-iteration crashes are instead
// prevented by passing disableStream/disableRange in each getDocument call.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/legacy/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

export { pdfjsLib };
