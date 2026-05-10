export const getScoreClass = (score: number) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
};

export const getFilename = (generatedResumeMarkdown: string, companyName: string = '') => {
    if (!generatedResumeMarkdown) return 'resume';

    // Extract name from the first H1 header in markdown
    const nameMatch = generatedResumeMarkdown.match(/^#\s+(.+)$/m);
    let rawName = 'Tailored';
    if (nameMatch && nameMatch[1]) {
        rawName = nameMatch[1].trim();
    }

    // Sanitize name for filename
    const sanitizedName = rawName.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_');
    const companySuffix = companyName ? `_${companyName.replace(/[^a-z0-9]/gi, '_').replace(/_+/g, '_')}` : '';

    return `${sanitizedName}${companySuffix}_resume`;
};

const EMPTY_SOCIAL_LINK_PATTERN = /^\[?(LinkedIn|GitHub|Portfolio|Website)\]?\s*(?:\(\s*\))?$/i;
const EMPTY_MARKDOWN_LINK_PATTERN = /\[([^\]]+)\]\(\s*\)/g;

const stripEmptyMarkdownLinks = (text: string) =>
    text.replace(EMPTY_MARKDOWN_LINK_PATTERN, (_match, label: string) =>
        EMPTY_SOCIAL_LINK_PATTERN.test(label) ? '' : label,
    );

const isEmptyContactItem = (item: string) => {
    const normalized = item
        .replace(/\*\*/g, '')
        .replace(/:/g, '')
        .trim();

    return !normalized || EMPTY_SOCIAL_LINK_PATTERN.test(normalized);
};

const sanitizeContactLine = (line: string) => {
    if (!line.includes('|')) return stripEmptyMarkdownLinks(line).trim();

    return line
        .split('|')
        .map((item) => stripEmptyMarkdownLinks(item).trim())
        .filter((item) => !isEmptyContactItem(item))
        .join(' | ')
        .trim();
};

const splitSentences = (text: string) => {
    const cleaned = text
        .replace(/\s+/g, ' ')
        .replace(/^[-*]\s*/, '')
        .trim();

    return cleaned
        .match(/[^.!?]+[.!?]+|[^.!?]+$/g)
        ?.map((sentence) => sentence.trim())
        .filter(Boolean) || [];
};

const trimSummaryLine = (line: string, maxWords: number) => {
    const words = line.split(/\s+/).filter(Boolean);
    if (words.length <= maxWords) return line;

    return `${words.slice(0, maxWords).join(' ').replace(/[.,;:]$/, '')}.`;
};

const sanitizeSummarySection = (markdown: string) => {
    const lines = markdown.split('\n');
    const summaryIndex = lines.findIndex((line) => /^##\s+SUMMARY\s*$/i.test(line.trim()));
    if (summaryIndex === -1) return markdown;

    let nextSectionIndex = lines.length;
    for (let i = summaryIndex + 1; i < lines.length; i += 1) {
        if (/^##\s+/.test(lines[i]!.trim())) {
            nextSectionIndex = i;
            break;
        }
    }

    const summaryLines = lines
        .slice(summaryIndex + 1, nextSectionIndex)
        .map((line) => stripEmptyMarkdownLinks(line).trim())
        .filter(Boolean);

    const sentences = splitSentences(summaryLines.join(' '));
    if (sentences.length === 0) return markdown;

    const shortSummary = sentences
        .slice(0, 2)
        .map((sentence) => trimSummaryLine(sentence, 14));

    return [
        ...lines.slice(0, summaryIndex + 1),
        '',
        ...shortSummary,
        '',
        ...lines.slice(nextSectionIndex),
    ].join('\n');
};

export const sanitizeResumeMarkdown = (markdown: string) => {
    if (!markdown) return '';

    const lines = stripEmptyMarkdownLinks(markdown)
        .split('\n')
        .map((line, index) => {
            if (index <= 2 || (line.includes('|') && /LinkedIn|GitHub|Portfolio|Website/i.test(line))) {
                return sanitizeContactLine(line);
            }

            return line.replace(/\s+\|$/g, '').trimEnd();
        })
        .filter((line) => !isEmptyContactItem(line));

    return sanitizeSummarySection(lines.join('\n'))
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};
