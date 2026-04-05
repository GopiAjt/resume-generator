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
