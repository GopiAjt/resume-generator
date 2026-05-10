import { getTemplateStyles } from '@/services/resumeStyles'
import { getFilename } from '@/utils/resumeUtils'
import { logger } from '@/utils/logger'
import { generateTextBasedPdf } from '@/utils/textPdfGenerator'

type NavigatorWithFileShare = Navigator & {
  canShare?: (data: ShareData) => boolean
}

type DownloadDevice = {
  isIOSWebKit: boolean
  isMobile: boolean
}

type SaveMethod = 'downloaded' | 'opened' | 'shared'

export function useResumeExporter() {
  const getDownloadDevice = (): DownloadDevice => {
    if (typeof navigator === 'undefined') {
      return {
        isIOSWebKit: false,
        isMobile: false,
      }
    }

    const ua = navigator.userAgent || navigator.vendor || ''
    const isIOS =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    const isAndroid = /Android/i.test(ua)
    const isMobile = isIOS || isAndroid || /Mobile|Tablet/i.test(ua)

    return {
      isIOSWebKit: isIOS && /AppleWebKit/i.test(ua),
      isMobile,
    }
  }

  const blobToDataUrl = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(reader.error || new Error('FileReader error'))
      reader.readAsDataURL(blob)
    })

  const createPreparedDownloadWindow = (fileName: string, device: DownloadDevice) => {
    if (!device.isIOSWebKit) {
      return null
    }

    logger.info(`[Mobile Download] Opening prepared window for "${fileName}"`)
    const preparedWindow = window.open('', '_blank')

    if (!preparedWindow) {
      logger.warn('[Mobile Download] Prepared window blocked by browser')
      return null
    }

    preparedWindow.document.write(`
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Preparing download</title>
        </head>
        <body style="font-family: system-ui, sans-serif; padding: 24px; line-height: 1.5;">
          <p>Preparing <strong>${fileName}</strong>...</p>
          <p style="color: #475569;">When it opens, use Share and choose Save to Files.</p>
        </body>
      </html>
    `)

    return preparedWindow
  }

  const canShareFile = (file: File) => {
    if (typeof navigator === 'undefined' || typeof File === 'undefined') {
      return false
    }

    if (typeof navigator.share !== 'function') {
      return false
    }

    const navigatorWithShare = navigator as NavigatorWithFileShare
    const shareData: ShareData = { files: [file], title: file.name }

    return typeof navigatorWithShare.canShare === 'function'
      ? navigatorWithShare.canShare(shareData)
      : true
  }

  const shareBlobOnMobile = async (blob: Blob, fileName: string, mimeType: string) => {
    if (typeof File === 'undefined' || typeof navigator.share !== 'function') {
      return false
    }

    const file = new File([blob], fileName, { type: mimeType })
    const shareData: ShareData = { files: [file], title: fileName }

    if (!canShareFile(file)) {
      logger.info(`[Mobile Download] File sharing unsupported for "${fileName}"`)
      return false
    }

    try {
      logger.info(`[Mobile Download] Opening share sheet for "${fileName}"`)
      await navigator.share(shareData)
      return true
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        logger.info(`[Mobile Download] Share cancelled for "${fileName}"`)
        throw new Error('UserCancelledError')
      }
      logger.warn(`[Mobile Download] Share failed for "${fileName}"`, error)
      return false
    }
  }

  const triggerAnchorDownload = (blob: Blob, fileName: string) => {
    const objectUrl = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.style.display = 'none'
    link.href = objectUrl
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
  }

  const openBlobInPreparedWindow = async (
    blob: Blob,
    fileName: string,
    preparedWindow: Window | null,
  ): Promise<boolean> => {
    const targetWindow = preparedWindow && !preparedWindow.closed ? preparedWindow : null

    if (!targetWindow) {
      logger.warn(`[Mobile Download] No prepared window available for "${fileName}"`)
      return false
    }

    const objectUrl = URL.createObjectURL(blob)

    try {
      targetWindow.location.href = objectUrl
      logger.info(`[Mobile Download] Opened "${fileName}" from blob URL`)
      return true
    } catch (error) {
      logger.warn(`[Mobile Download] Blob URL open failed for "${fileName}", trying data URL`, error)
      const dataUrl = await blobToDataUrl(blob)
      targetWindow.location.href = dataUrl
      return true
    } finally {
      setTimeout(() => URL.revokeObjectURL(objectUrl), 60000)
    }
  }

  const saveBlob = async (
    blob: Blob,
    fileName: string,
    mimeType: string,
    device: DownloadDevice,
    preparedWindow: Window | null,
  ): Promise<SaveMethod> => {
    if (device.isMobile && (await shareBlobOnMobile(blob, fileName, mimeType))) {
      preparedWindow?.close()
      return 'shared'
    }

    if (device.isIOSWebKit && (await openBlobInPreparedWindow(blob, fileName, preparedWindow))) {
      return 'opened'
    }

    preparedWindow?.close()
    triggerAnchorDownload(blob, fileName)
    return 'downloaded'
  }

  const buildDocBlob = (
    generatedResumeHtml: string,
    companyName: string,
    selectedTemplate: string,
  ) => {
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

    return new Blob(['\ufeff', content], { type: 'application/msword;charset=utf-8' })
  }

  const downloadPDF = async (
    _resumeContainer: HTMLElement | null,
    generatedResumeMarkdown: string,
    companyName: string,
    selectedTemplate: string,
    onProgress: (msg: string) => void,
    onSuccess: (msg: string) => void,
    onError: (msg: string) => void,
  ) => {
    if (!generatedResumeMarkdown) return

    const device = getDownloadDevice()
    const fileName = `${getFilename(generatedResumeMarkdown, companyName)}.pdf`
    const mimeType = 'application/pdf'
    const preparedWindow = createPreparedDownloadWindow(fileName, device)
    logger.info(
      `[Download][PDF] Starting — fileName: "${fileName}" | mobile: ${device.isMobile} | iOS: ${device.isIOSWebKit} | preparedWindow: ${!!preparedWindow}`,
    )

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

      const saveMethod = await saveBlob(pdfBlob, fileName, mimeType, device, preparedWindow)

      onSuccess(
        saveMethod === 'shared'
          ? 'PDF ready. Choose Save to Files from the share sheet.'
          : saveMethod === 'opened'
            ? 'PDF opened. Use Share → Save to Files to keep it.'
          : 'ATS-friendly PDF with selectable text downloaded!',
      )
      logger.info('[Download][PDF] Download flow complete')
    } catch (error) {
      preparedWindow?.close()
      if (error instanceof Error && error.message === 'UserCancelledError') {
        logger.info('[Download][PDF] User cancelled the share dialog.')
        return
      }
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

    const device = getDownloadDevice()
    let preparedWindow: Window | null = null

    try {
      const baseName = getFilename(generatedResumeMarkdown, companyName)
      const fileName = `${baseName}.doc`
      const mimeType = 'application/msword'
      preparedWindow = createPreparedDownloadWindow(fileName, device)
      logger.info(
        `[Download][DOC] Starting — fileName: "${fileName}" | mobile: ${device.isMobile} | iOS: ${device.isIOSWebKit} | preparedWindow: ${!!preparedWindow}`,
      )

      const blob = buildDocBlob(
        generatedResumeHtml,
        companyName,
        selectedTemplate,
      )
      logger.info(`[Download][DOC] Blob created — size: ${(blob.size / 1024).toFixed(1)} KB`)

      const saveMethod = await saveBlob(blob, fileName, mimeType, device, preparedWindow)

      onSuccess(
        saveMethod === 'shared'
          ? 'DOC ready. Choose Save to Files from the share sheet.'
          : saveMethod === 'opened'
            ? 'DOC opened. Use Share → Save to Files to keep it.'
          : 'DOC downloaded successfully!',
      )
      logger.info('[Download][DOC] Download flow complete')
    } catch (error) {
      preparedWindow?.close()
      if (error instanceof Error && error.message === 'UserCancelledError') {
        logger.info('[Download][DOC] User cancelled the share dialog.')
        return
      }
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
