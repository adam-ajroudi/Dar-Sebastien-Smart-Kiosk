import { NextRequest, NextResponse } from 'next/server';
import { ingestPDF, ingestText } from '@/lib/rag/ingest';
import { getDocumentCount } from '@/lib/rag/vectorStore';

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type') || '';

        if (contentType.includes('multipart/form-data')) {
            // Handle file upload
            const formData = await request.formData();
            const file = formData.get('file') as File | null;

            if (!file) {
                return NextResponse.json(
                    { error: 'No file provided' },
                    { status: 400 }
                );
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            const filename = file.name;

            let chunksAdded: number;

            if (filename.toLowerCase().endsWith('.pdf')) {
                chunksAdded = await ingestPDF(buffer, filename);
            } else if (filename.toLowerCase().endsWith('.txt')) {
                const text = buffer.toString('utf-8');
                chunksAdded = await ingestText(text, filename, filename.replace('.txt', ''));
            } else {
                return NextResponse.json(
                    { error: 'Unsupported file type. Please upload PDF or TXT files.' },
                    { status: 400 }
                );
            }

            const totalCount = await getDocumentCount();

            return NextResponse.json({
                success: true,
                filename,
                chunksAdded,
                totalDocuments: totalCount
            });
        } else {
            // Handle raw text
            const body = await request.json();
            const { text, source, title } = body as {
                text: string;
                source?: string;
                title?: string;
            };

            if (!text || typeof text !== 'string') {
                return NextResponse.json(
                    { error: 'Text content is required' },
                    { status: 400 }
                );
            }

            const chunksAdded = await ingestText(
                text,
                source || 'manual-entry',
                title
            );

            const totalCount = await getDocumentCount();

            return NextResponse.json({
                success: true,
                chunksAdded,
                totalDocuments: totalCount
            });
        }
    } catch (error) {
        console.error('Ingest API error:', error);
        return NextResponse.json(
            { error: 'Failed to ingest document' },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const count = await getDocumentCount();
        return NextResponse.json({ documentCount: count });
    } catch (error) {
        console.error('Get document count error:', error);
        return NextResponse.json({ documentCount: 0 });
    }
}
