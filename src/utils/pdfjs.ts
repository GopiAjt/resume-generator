import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import workerUrl from 'pdfjs-dist/legacy/build/pdf.worker.min.mjs?url';

// iOS Safari (pre-16.4) cannot load ES-module workers.
// When the worker fails, pdfjs enters a broken state that causes
// "undefined is not a function (near '...i of e...')" on getDocument().
// On iOS we skip the workerSrc so pdfjs uses its built-in fake-worker
// (main-thread fallback) which is fully compatible with all iOS versions.
const isIOSSafari = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  return isIOS && /AppleWebKit/i.test(ua);
};

if (!isIOSSafari()) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;
}

export { pdfjsLib };
