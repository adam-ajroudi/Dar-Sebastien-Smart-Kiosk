import { addDocuments, DocumentChunk } from './vectorStore';

const CHUNK_SIZE = 500;
const CHUNK_OVERLAP = 100;

/**
 * Split text into overlapping chunks for better context preservation
 */
export function chunkText(
    text: string,
    chunkSize: number = CHUNK_SIZE,
    overlap: number = CHUNK_OVERLAP
): string[] {
    const chunks: string[] = [];

    // Clean up the text
    const cleanText = text
        .replace(/\s+/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .trim();

    if (cleanText.length <= chunkSize) {
        return [cleanText];
    }

    let start = 0;
    while (start < cleanText.length) {
        let end = start + chunkSize;

        // Try to end at a sentence boundary
        if (end < cleanText.length) {
            const lastPeriod = cleanText.lastIndexOf('.', end);
            const lastNewline = cleanText.lastIndexOf('\n', end);
            const bestBreak = Math.max(lastPeriod, lastNewline);

            if (bestBreak > start + chunkSize / 2) {
                end = bestBreak + 1;
            }
        }

        const chunk = cleanText.slice(start, end).trim();
        if (chunk.length > 0) {
            chunks.push(chunk);
        }

        start = end - overlap;
        if (start < 0) start = 0;
        if (end >= cleanText.length) break;
    }

    return chunks;
}

/**
 * Process and ingest a text document
 */
export async function ingestText(
    text: string,
    source: string,
    documentTitle?: string
): Promise<number> {
    const chunks = chunkText(text);
    const timestamp = Date.now();

    const documentChunks: DocumentChunk[] = chunks.map((chunk, index) => ({
        id: `${source}-${timestamp}-${index}`,
        text: chunk,
        metadata: {
            source,
            chunkIndex: index,
            totalChunks: chunks.length,
            documentTitle
        }
    }));

    await addDocuments(documentChunks);

    return chunks.length;
}

/**
 * Parse PDF buffer and extract text
 * Note: pdf-parse is used on the server side only
 */
export async function parsePDF(buffer: Buffer): Promise<string> {
    // Use require for CommonJS module compatibility
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');

    const data = await pdfParse(buffer);
    return data.text;
}

/**
 * Ingest a PDF document
 */
export async function ingestPDF(
    buffer: Buffer,
    filename: string
): Promise<number> {
    const text = await parsePDF(buffer);
    return ingestText(text, filename, filename.replace('.pdf', ''));
}
