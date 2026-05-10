import { describe, expect, it } from 'vitest'
import { generateTextBasedPdf } from './textPdfGenerator'

const readBlobAsBinaryString = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsBinaryString(blob)
  })

describe('generateTextBasedPdf', () => {
  it('preserves contact markdown links as PDF URI annotations', async () => {
    const markdown = [
      '# Test Candidate',
      'Bangalore, India | test@example.com | [LinkedIn](https://linkedin.com/in/test) | [GitHub](https://github.com/test)',
      '',
      '## SUMMARY',
      '',
      'Frontend engineer focused on Vue and reliable resume tooling.',
    ].join('\n')

    const pdfBlob = await generateTextBasedPdf(markdown, '', 'modern', () => {})
    const pdfBytes = await readBlobAsBinaryString(pdfBlob)

    expect(pdfBytes).toContain('/URI (https://linkedin.com/in/test)')
    expect(pdfBytes).toContain('/URI (https://github.com/test)')
  })
})
