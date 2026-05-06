import { getTemplateStyles } from '@/services/resumeStyles'
import { getFilename } from '@/utils/resumeUtils'
import { logger } from '@/utils/logger'
import { generateTextBasedPdf } from '@/utils/textPdfGenerator'

type NavigatorWithFileShare = Navigator & {
  canShare?: (data: ShareData) => boolean
}

export function useResumeExporter() {
  const isIOSWebKit = () => {
    if (typeof navigator === 'undefined') {
      return false
    }

    const ua = navigator.userAgent || navigator.vendor || ''
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

    return isIOS && /AppleWebKit/i.test(ua)
  }

  // Convert a Blob to a base64 data: URL — always navigable in iOS Safari
  const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error || new Error('FileReader error'))
      reader.readAsDataURL(blob)
    })

  const createPendingDownloadWindow = () => {
    if (!isIOSWebKit()) {
      return null
    }

    logger.info('[iOS] Opening pending download window before blob is ready')
    const pendingWindow = window.open('', '_blank')
    if (!pendingWindow) {
      logger.warn('[iOS] window.open blocked — popup guard may be active')
    }
    pendingWindow?.document.write(
      '<p style="font-family: system-ui, sans-serif;">Preparing your file...</p>',
    )
    return pendingWindow
  }

  const canUseNativeFileShare = (fileName: string, mimeType: string) => {
    if (!isIOSWebKit() || typeof File === 'undefined' || typeof navigator.share !== 'function') {
      return false
    }

    const file = new File([], fileName, { type: mimeType })
    const shareData: ShareData = { files: [file], title: fileName }
    const navigatorWithShare = navigator as NavigatorWithFileShare

    const supported =
      typeof navigatorWithShare.canShare === 'function'
        ? navigatorWithShare.canShare(shareData)
        : true
    logger.info(`[iOS] canUseNativeFileShare("${fileName}") → ${supported}`)
    return supported
  }

  const shareBlobOnIOS = async (blob: Blob, fileName: string) => {
    if (!isIOSWebKit() || typeof File === 'undefined' || typeof navigator.share !== 'function') {
      return false
    }

    const file = new File([blob], fileName, {
      type: blob.type || 'application/octet-stream',
    })
    const shareData: ShareData = {
      files: [file],
      title: fileName,
    }
    const navigatorWithShare = navigator as NavigatorWithFileShare

    if (
      typeof navigatorWithShare.canShare === 'function' &&
      !navigatorWithShare.canShare(shareData)
    ) {
      logger.warn(`[iOS] navigator.canShare() returned false for "${fileName}" — skipping share sheet`)
      return false
    }

    logger.info(`[iOS] Invoking navigator.share() for "${fileName}"`)
    await navigator.share(shareData)
    logger.info(`[iOS] navigator.share() resolved for "${fileName}"`)
    return true
  }

  const triggerBlobDownload = async (
    blob: Blob,
    fileName: string,
    pendingWindow: Window | null = null,
  ) => {
    const objectUrl = URL.createObjectURL(blob)

    try {
      if (isIOSWebKit()) {
        const hadPendingWindow = pendingWindow !== null && !pendingWindow.closed
        const targetWindow = hadPendingWindow
          ? pendingWindow
          : window.open('', '_blank')

        logger.info(`[iOS] triggerBlobDownload — hadPendingWindow: ${hadPendingWindow} | targetWindow opened: ${!!targetWindow}`)

        if (targetWindow) {
          // Try blob: URL first (faster, no base64 overhead)
          try {
            targetWindow.location.href = objectUrl
            logger.info('[iOS] Navigated target window to blob: URL')
          } catch (blobNavErr) {
            // blob: navigation failed (e.g. cross-origin restriction) — fall back to data: URL
            logger.warn('[iOS] blob: URL navigation failed — falling back to data: URL', blobNavErr)
            const dataUrl = await blobToDataUrl(blob)
            targetWindow.location.href = dataUrl
            logger.info('[iOS] Navigated target window to data: URL (fallback)')
          }
        } else {
          // No window available — fall back to data: URL on current page
          logger.warn('[iOS] Could not open target window — navigating current page to data: URL')
          const dataUrl = await blobToDataUrl(blob)
          window.location.href = dataUrl
        }
        return
      }

      // Desktop: standard anchor download
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = objectUrl
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      setTimeout(
        () => {
          URL.revokeObjectURL(objectUrl)
        },
        isIOSWebKit() ? 60000 : 1000,
      )
    }
  }

  const downloadPDF = async (
    resumeContainer: HTMLElement | null,
    generatedResumeMarkdown: string,
    companyName: string,
    selectedTemplate: string,
    onProgress: (msg: string) => void,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
  ) => {
    if (!generatedResumeMarkdown) return

    const onIOS = isIOSWebKit()
    const fileName = `${getFilename(generatedResumeMarkdown, companyName)}.pdf`
    logger.info(`[Download][PDF] Starting — fileName: "${fileName}" | iOS: ${onIOS}`)

    const useShare = canUseNativeFileShare(fileName, 'application/pdf')
    const pendingWindow = useShare ? null : createPendingDownloadWindow()
    logger.info(`[Download][PDF] useShare: ${useShare} | pendingWindow opened: ${!!pendingWindow}`)

    try {
      onProgress('Generating ATS-friendly text-based PDF...')

      // Generate text-based PDF with selectable text and template styling
      const pdfBlob = await generateTextBasedPdf(
        generatedResumeMarkdown,
        companyName,
        selectedTemplate,
        onProgress,
      )
      logger.info(`[Download][PDF] Blob generated — size: ${(pdfBlob.size / 1024).toFixed(1)} KB | type: "${pdfBlob.type}"`)

      if (await shareBlobOnIOS(pdfBlob, fileName)) {
        pendingWindow?.close()
        onSuccess('PDF ready. Choose Save to Files from the share sheet.')
        return
      }

      logger.info('[Download][PDF] Proceeding with triggerBlobDownload…')
      await triggerBlobDownload(pdfBlob, fileName, pendingWindow)

      onSuccess(
        onIOS
          ? 'PDF opened. Use Share → Save to Files to keep it.'
          : 'ATS-friendly PDF with selectable text downloaded!',
      )
      logger.info('[Download][PDF] Download flow complete')
    } catch (error) {
      pendingWindow?.close()
      logger.error('[Download][PDF] Failed:', error)
      onError('Failed to generate PDF. Click "Copy Markdown" if needed.')
    }
  }

  const downloadDOC = async (
    generatedResumeHtml: string,
    generatedResumeMarkdown: string,
    companyName: string,
    selectedTemplate: string,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
  ) => {
    if (!generatedResumeHtml) return

    const onIOS = isIOSWebKit()
    let pendingWindow: Window | null = null

    try {
      // Save as .doc with Word XML namespaces — opens in Word without needing Office installed
      const baseName = getFilename(generatedResumeMarkdown, companyName)
      const fileName = `${baseName}.doc`
      logger.info(`[Download][DOC] Starting — fileName: "${fileName}" | iOS: ${onIOS}`)

      const useShare = canUseNativeFileShare(fileName, 'application/msword')
      pendingWindow = useShare ? null : createPendingDownloadWindow()
      logger.info(`[Download][DOC] useShare: ${useShare} | pendingWindow opened: ${!!pendingWindow}`)

      const docTitle = companyName ? `Resume — ${companyName}` : 'Resume'
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
        `

      const blob = new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' })
      logger.info(`[Download][DOC] Blob created — size: ${(blob.size / 1024).toFixed(1)} KB`)

      if (await shareBlobOnIOS(blob, fileName)) {
        pendingWindow?.close()
        onSuccess('DOC ready. Choose Save to Files from the share sheet.')
        return
      }

      logger.info('[Download][DOC] Proceeding with triggerBlobDownload…')
      await triggerBlobDownload(blob, fileName, pendingWindow)

      onSuccess(
        onIOS
          ? 'DOC opened. Use Share → Save to Files to keep it.'
          : 'DOC downloaded successfully!',
      )
      logger.info('[Download][DOC] Download flow complete')
    } catch (error) {
      pendingWindow?.close()
      logger.error('[Download][DOC] Failed:', error)
      onError('Failed to generate DOC. Click "Copy Markdown" if needed.')
    }
  }

  const copyToClipboard = async (
    generatedResumeHtml: string,
    generatedResumeMarkdown: string,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
  ) => {
    if (!generatedResumeHtml) return

    try {
      const blob = new Blob([generatedResumeHtml], { type: 'text/html' })
      const data = [
        new ClipboardItem({
          'text/html': blob,
          'text/plain': new Blob([generatedResumeMarkdown], { type: 'text/plain' }),
        }),
      ]
      await navigator.clipboard.write(data)
      onSuccess('Formatted resume copied to clipboard!')
    } catch {
      try {
        await navigator.clipboard.writeText(generatedResumeMarkdown)
        onSuccess('Resume Markdown copied to clipboard!')
      } catch (innerErr) {
        logger.error('Copy failed:', innerErr)
        onError('Failed to copy. Please select and copy manually.')
      }
    }
  }

  return {
    downloadPDF,
    downloadDOC,
    copyToClipboard,
  }
}
