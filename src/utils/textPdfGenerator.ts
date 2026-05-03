import { jsPDF } from 'jspdf'
import { logger } from '@/utils/logger'
import { resumeTemplateStyles } from '@/services/resumeStyles'
const FONT_SCALE = 1.08 // 8% increase (safe range: 1.05–1.12)

interface PdfSection {
  type: 'heading1' | 'heading2' | 'heading3' | 'paragraph' | 'list' | 'meta'
  text: string
  bold?: boolean
  inlineText?: Array<{ text: string; bold: boolean }>
}

interface TemplateConfig {
  heading1Font: 'helvetica' | 'times' | 'courier'
  heading1Size: number
  heading1Color: [number, number, number]
  heading1Align: 'left' | 'center'
  heading2Font: 'helvetica' | 'times' | 'courier'
  heading2Size: number
  heading2Color: [number, number, number]
  heading2Align: 'left' | 'center'
  heading2Uppercase: boolean
  heading2Underline: boolean
  heading3Font: 'helvetica' | 'times' | 'courier'
  heading3Size: number
  heading3Color: [number, number, number]
  bodyFont: 'helvetica' | 'times' | 'courier'
  bodySize: number
  bodyColor: [number, number, number]
  metaSize: number
  metaColor: [number, number, number]
  metaAlign: 'left' | 'center'
  accentColor: [number, number, number]
  bulletChar: string
}

const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '')
  const value =
    normalized.length === 3
      ? normalized
          .split('')
          .map((char) => char + char)
          .join('')
      : normalized

  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ]
}

const templates: Record<string, TemplateConfig> = Object.entries(resumeTemplateStyles || {}).reduce(
  (configs, [key, style]) => {
    configs[key] = {
      heading1Font: style.pdfFontFamily,
      heading1Size: style.heading1Size,
      heading1Color: hexToRgb(style.heading1Color),
      heading1Align: style.heading1Align,
      heading2Font: style.pdfFontFamily,
      heading2Size: style.heading2Size * FONT_SCALE,
      heading2Color: hexToRgb(style.heading2Color),
      heading2Align: style.heading2Align,
      heading2Uppercase: style.heading2Uppercase,
      heading2Underline: style.heading2Underline,
      heading3Font: style.pdfFontFamily,
      heading3Size: style.heading3Size * FONT_SCALE,
      heading3Color: hexToRgb(style.heading3Color),
      bodyFont: style.pdfFontFamily,
      bodySize: style.bodySize * FONT_SCALE,
      bodyColor: hexToRgb(style.bodyColor),
      metaSize: style.metaSize * FONT_SCALE,
      metaColor: hexToRgb(style.metaColor),
      metaAlign: style.metaAlign,
      accentColor: hexToRgb(style.accentColor),
      bulletChar: style.pdfBulletChar || style.bulletChar,
    }

    return configs
  },
  {} as Record<string, TemplateConfig>,
)

const PT_TO_MM = 0.352778
const SECTION_SPACING = {
  heading1Bottom: 6,
  heading2Top: 6,
  heading2Bottom: 6,
  heading3Top: 3,
  heading3Bottom: 1,
  metaBottom: 6,
  paragraphBottom: 2,
  listBottom: 1.5,
}

function ptToMm(value: number): number {
  return value * PT_TO_MM
}

function getLineHeightMm(fontSizePt: number, multiplier: number = 1.3): number {
  return ptToMm(fontSizePt * multiplier)
}

export function generateTextBasedPdf(
  markdown: string,
  companyName: string,
  selectedTemplate: string,
  onProgress: (msg: string) => void,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      onProgress('Generating ATS-friendly text-based PDF...')

      const doc = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait',
      })

      // Verify jsPDF methods are available (mobile compatibility check)
      if (typeof doc.splitTextToSize !== 'function') {
        throw new Error('jsPDF splitTextToSize method not available on this browser')
      }

      // Get template configuration
      const template = templates[selectedTemplate] || templates.modern
      if (!template) {
        throw new Error('Template configuration not found')
      }

      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 12.7 // 0.5 inch margin
      const maxWidth = pageWidth - margin * 2
      let currentY = margin
      let previousSectionType: PdfSection['type'] | null = null

      // Helper function to check and handle page breaks
      const checkPageBreak = (
        y: number,
        requiredSpace: number = template.bodySize * 0.5,
      ): number => {
        if (y > pageHeight - margin - requiredSpace) {
          doc.addPage()
          return margin
        }
        return y
      }

      // Parse markdown into sections
      const sections = parseMarkdownToSections(markdown) || []

      // Add metadata
      const fileName = companyName ? `Resume — ${companyName}` : 'Resume'
      doc.setProperties({
        title: fileName,
        subject: 'Resume',
        author: 'Candidate',
        keywords: 'resume, profile, cv',
      })

      // Process each section
      for (let sectionIndex = 0; sectionIndex < sections.length; sectionIndex += 1) {
        const section = sections[sectionIndex]!
        currentY = checkPageBreak(currentY)
        currentY += getSpacingBeforeSection(section.type, previousSectionType)

        switch (section.type) {
          case 'heading1':
            doc.setFont(template.heading1Font, 'bold')
            doc.setFontSize(template.heading1Size)
            doc.setTextColor(...template.heading1Color)
            const h1X = template.heading1Align === 'center' ? pageWidth / 2 : margin
            const h1Align = template.heading1Align === 'center' ? 'center' : 'left'
            const h1LineHeight = getLineHeightMm(template.heading1Size)
            currentY = addWrappedText(
              doc,
              section.text,
              h1X,
              currentY,
              maxWidth,
              h1LineHeight,
              h1Align,
              checkPageBreak,
            )
            currentY += ptToMm(SECTION_SPACING.heading1Bottom)
            break

          case 'heading2':
            doc.setFont(template.heading2Font, 'bold')
            doc.setFontSize(template.heading2Size)
            doc.setTextColor(...template.heading2Color)
            const h2Text = template.heading2Uppercase ? section.text.toUpperCase() : section.text
            const h2X = template.heading2Align === 'center' ? pageWidth / 2 : margin
            const h2Align = template.heading2Align === 'center' ? 'center' : 'left'
            const h2LineHeight = getLineHeightMm(template.heading2Size)
            currentY = addWrappedText(
              doc,
              h2Text,
              h2X,
              currentY,
              maxWidth,
              h2LineHeight,
              h2Align,
              checkPageBreak,
            )
            if (template.heading2Underline) {
              doc.setDrawColor(...template.heading2Color)
              doc.setLineWidth(0.3)
              doc.line(margin, currentY + ptToMm(1), margin + maxWidth, currentY + ptToMm(1))
            }
            currentY += ptToMm(SECTION_SPACING.heading2Bottom)
            break

          case 'heading3':
            doc.setFont(template.heading3Font, 'bold')
            doc.setFontSize(template.heading3Size)
            doc.setTextColor(...template.heading3Color)
            const h3LineHeight = getLineHeightMm(template.heading3Size)
            currentY = addWrappedText(
              doc,
              section.text,
              margin,
              currentY,
              maxWidth,
              h3LineHeight,
              'left',
              checkPageBreak,
            )
            currentY += ptToMm(SECTION_SPACING.heading3Bottom)
            break

          case 'meta':
            doc.setFont(template.bodyFont, 'normal')
            doc.setFontSize(template.metaSize)
            doc.setTextColor(...template.metaColor)
            const metaLineHeight = getLineHeightMm(template.metaSize)
            const metaX = template.metaAlign === 'center' ? pageWidth / 2 : margin
            currentY = addWrappedText(
              doc,
              section.text,
              metaX,
              currentY,
              maxWidth,
              metaLineHeight,
              template.metaAlign,
              checkPageBreak,
            )
            currentY += ptToMm(SECTION_SPACING.metaBottom)
            break

          case 'paragraph':
            doc.setFont(template.bodyFont, 'normal')
            doc.setFontSize(template.bodySize)
            doc.setTextColor(...template.bodyColor)
            const paraLineHeight = getLineHeightMm(template.bodySize)
            if (section.inlineText && section.inlineText.length > 0) {
              // Handle inline bold text
              currentY = addInlineText(
                doc,
                section.inlineText,
                margin,
                currentY,
                maxWidth,
                paraLineHeight,
                template.bodyFont,
                template.bodyColor,
                checkPageBreak,
              )
            } else {
              doc.setFont(template.bodyFont, section.bold ? 'bold' : 'normal')
              currentY = addWrappedText(
                doc,
                section.text,
                margin,
                currentY,
                maxWidth,
                paraLineHeight,
                'left',
                checkPageBreak,
              )
            }
            currentY += ptToMm(SECTION_SPACING.paragraphBottom)
            break

          case 'list':
            doc.setFont(template.bodyFont, 'normal')
            doc.setFontSize(template.bodySize)
            doc.setTextColor(...template.bodyColor)
            const listLineHeight = getLineHeightMm(template.bodySize)
            const items = section.text.split('\n')
            for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
              const item = items[itemIndex]!
              currentY = checkPageBreak(currentY, listLineHeight)
              doc.setTextColor(...template.accentColor)
              doc.text(template.bulletChar, margin, currentY)
              doc.setTextColor(...template.bodyColor)

              const inlineItemText = parseInlineBold(item)
              if (inlineItemText.length > 0) {
                currentY = addInlineText(
                  doc,
                  inlineItemText,
                  margin + 8,
                  currentY,
                  maxWidth - 8,
                  listLineHeight,
                  template.bodyFont,
                  template.bodyColor,
                  checkPageBreak,
                )
              } else {
                currentY = addWrappedText(
                  doc,
                  stripMarkdownMarkers(item),
                  margin + 8,
                  currentY,
                  maxWidth - 8,
                  listLineHeight,
                  'left',
                  checkPageBreak,
                )
              }
            }
            currentY += ptToMm(SECTION_SPACING.listBottom)
            break
        }

        previousSectionType = section.type
      }

      // Generate blob
      const pdfBlob = doc.output('blob')
      resolve(pdfBlob)
    } catch (error) {
      logger.error('Text-based PDF generation failed:', error)
      reject(error)
    }
  })
}

function parseMarkdownToSections(markdown: string): PdfSection[] {
  const sections: PdfSection[] = []
  const lines = markdown.split('\n')
  let currentList: string[] = []

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex]!
    const trimmed = line.trim()

    // Empty line - flush any current list
    if (!trimmed) {
      if (currentList.length > 0) {
        sections.push({
          type: 'list',
          text: currentList.join('\n'),
        })
        currentList = []
      }
      continue
    }

    // Heading 1
    if (trimmed.startsWith('# ')) {
      flushList(sections, currentList)
      currentList = []
      sections.push({
        type: 'heading1',
        text: trimmed.substring(2).trim(),
      })
    }
    // Heading 2
    else if (trimmed.startsWith('## ')) {
      flushList(sections, currentList)
      currentList = []
      sections.push({
        type: 'heading2',
        text: trimmed.substring(3).trim(),
      })
    }
    // Heading 3
    else if (trimmed.startsWith('### ')) {
      flushList(sections, currentList)
      currentList = []
      sections.push({
        type: 'heading3',
        text: trimmed.substring(4).trim(),
      })
    }
    // List item
    else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(trimmed.substring(2).trim())
    }
    // Bold text (convert to normal for PDF)
    else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      flushList(sections, currentList)
      currentList = []
      sections.push({
        type: 'paragraph',
        text: trimmed.substring(2, trimmed.length - 2).trim(),
        bold: true,
      })
    }
    // Meta section (contact info - typically contains | separators)
    else if (trimmed.includes('|') && !trimmed.startsWith('#')) {
      flushList(sections, currentList)
      currentList = []
      sections.push({
        type: 'meta',
        text: normalizeMetaText(trimmed),
      })
    }
    // Regular paragraph - check for inline bold
    else {
      flushList(sections, currentList)
      currentList = []
      const inlineText = parseInlineBold(trimmed)
      if (inlineText.length > 0) {
        sections.push({
          type: 'paragraph',
          text: stripMarkdownMarkers(trimmed),
          inlineText,
        })
      } else {
        sections.push({
          type: 'paragraph',
          text: stripMarkdownMarkers(trimmed),
        })
      }
    }
  }

  // Flush any remaining list
  flushList(sections, currentList)

  return sections
}

function parseInlineBold(text: string): Array<{ text: string; bold: boolean }> {
  const parts: Array<{ text: string; bold: boolean }> = []
  const regex = /\*\*(.*?)\*\*/g
  let lastIndex = 0
  let match

  while ((match = regex.exec(text)) !== null) {
    // Add text before bold
    if (match.index > lastIndex) {
      const normalText = text.substring(lastIndex, match.index)
      if (normalText) {
        parts.push({ text: normalText, bold: false })
      }
    }
    // Add bold text
    parts.push({ text: match[1]!, bold: true })
    lastIndex = regex.lastIndex
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex)
    if (remainingText) {
      parts.push({ text: remainingText, bold: false })
    }
  }

  // If no bold found, return empty array
  if (parts.length === 0) {
    return []
  }

  return parts
}

function stripMarkdownMarkers(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, '$1')
}

function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1')
}

function normalizeMetaText(text: string): string {
  return stripMarkdownLinks(text)
    .replace(/\s*\|\s*/g, ' | ')
    .replace(/\s+\|$/g, '')
    .trim()
}

function getSpacingBeforeSection(
  current: PdfSection['type'],
  previous: PdfSection['type'] | null,
): number {
  if (!previous) {
    return 0
  }

  if (current === 'heading2') {
    return ptToMm(SECTION_SPACING.heading2Top)
  }

  if (current === 'heading3') {
    return ptToMm(SECTION_SPACING.heading3Top)
  }

  return 0
}

function flushList(sections: PdfSection[], currentList: string[]) {
  if (currentList.length > 0) {
    sections.push({
      type: 'list',
      text: currentList.join('\n'),
    })
  }
}

function addWrappedText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: 'left' | 'center' = 'left',
  checkPageBreak?: (y: number, requiredSpace?: number) => number,
): number {
  let lines: string[]
  try {
    const result = doc.splitTextToSize(text, maxWidth)
    lines = Array.isArray(result) ? result : []
  } catch (error) {
    logger.error('splitTextToSize failed:', error)
    lines = [text] // Fallback to original text
  }

  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 12.7

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex += 1) {
    const line = lines[lineIndex]!
    if (checkPageBreak) {
      y = checkPageBreak(y, lineHeight)
    } else {
      if (y > pageHeight - margin) {
        doc.addPage()
        y = margin
      }
    }
    doc.text(line, x, y, { align })
    y += lineHeight
  }

  return y
}

function addInlineText(
  doc: jsPDF,
  inlineText: Array<{ text: string; bold: boolean }>,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: string,
  color: [number, number, number],
  checkPageBreak: (y: number, requiredSpace?: number) => number,
): number {
  let currentX = x
  let currentY = y
  let hasRenderedTextOnLine = false

  for (let partIndex = 0; partIndex < inlineText.length; partIndex += 1) {
    const part = inlineText[partIndex]!
    doc.setFont(font, part.bold ? 'bold' : 'normal')
    doc.setTextColor(...color)

    const tokens = part.text.split(/(\s+)/).filter((token) => token.length > 0)
    for (let tokenIndex = 0; tokenIndex < tokens.length; tokenIndex += 1) {
      const token = tokens[tokenIndex]!
      const isWhitespace = /^\s+$/.test(token)
      const tokenWidth = doc.getTextWidth(token)

      if (!isWhitespace && hasRenderedTextOnLine && currentX + tokenWidth > x + maxWidth) {
        currentX = x
        currentY += lineHeight
        currentY = checkPageBreak(currentY, lineHeight)
        hasRenderedTextOnLine = false
      }

      if (isWhitespace && !hasRenderedTextOnLine) {
        continue
      }

      doc.text(token, currentX, currentY)
      currentX += tokenWidth
      if (!isWhitespace) {
        hasRenderedTextOnLine = true
      }
    }
  }

  return currentY + lineHeight
}
