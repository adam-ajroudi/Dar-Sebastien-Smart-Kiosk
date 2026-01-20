import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse, ChatMessage } from '@/lib/ai/chat';
import { queryDocuments } from '@/lib/rag/vectorStore';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { message, history = [] } = body as {
            message: string;
            history?: ChatMessage[];
        };

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { error: 'Message is required' },
                { status: 400 }
            );
        }

        // Retrieve relevant context from vector store
        const context = await queryDocuments(message, 5);

        // Generate response with RAG context
        const response = await generateChatResponse(message, context, history);

        return NextResponse.json({
            message: response.message,
            language: response.detectedLanguage,
            hasContext: context.length > 0
        });
    } catch (error) {
        console.error('Chat API error:', error);
        return NextResponse.json(
            { error: 'Failed to generate response' },
            { status: 500 }
        );
    }
}
