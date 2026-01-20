import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_CONTEXT_TEMPLATE } from './persona';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Using Gemini 2.5 Flash - Free tier model
const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-preview-05-20',
    generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 1024,
    }
});

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatResponse {
    message: string;
    detectedLanguage?: string;
}

/**
 * Detect the primary language of the input text
 */
export function detectLanguage(text: string): 'ar' | 'fr' | 'en' {
    // Check for Arabic characters
    const arabicPattern = /[\u0600-\u06FF\u0750-\u077F]/;
    if (arabicPattern.test(text)) {
        return 'ar';
    }

    // Check for French-specific patterns
    const frenchPatterns = /\b(je|tu|il|elle|nous|vous|ils|elles|le|la|les|un|une|des|est|sont|avoir|être|quel|quelle|quand|comment|pourquoi|où|qui)\b/i;
    if (frenchPatterns.test(text)) {
        return 'fr';
    }

    // Default to English
    return 'en';
}

/**
 * Generate a chat response using Gemini with RAG context
 */
export async function generateChatResponse(
    userMessage: string,
    context: string,
    chatHistory: ChatMessage[] = []
): Promise<ChatResponse> {
    const systemPrompt = SYSTEM_CONTEXT_TEMPLATE(context);
    const detectedLanguage = detectLanguage(userMessage);

    // Build conversation history for context
    const historyText = chatHistory
        .slice(-6) // Keep last 6 messages for context
        .map(msg => `${msg.role === 'user' ? 'Visitor' : 'Elishaar'}: ${msg.content}`)
        .join('\n');

    const fullPrompt = `${systemPrompt}

${historyText ? `## Previous Conversation\n${historyText}\n` : ''}
## Current Question
Visitor: ${userMessage}

Elishaar:`;

    try {
        const result = await model.generateContent(fullPrompt);
        const response = result.response;
        const text = response.text();

        return {
            message: text.trim(),
            detectedLanguage
        };
    } catch (error) {
        console.error('Gemini API error:', error);

        // Fallback response in detected language
        const fallbacks: Record<string, string> = {
            ar: 'عذراً، حدث خطأ تقني. يرجى المحاولة مرة أخرى أو التواصل مع موظفي الاستقبال.',
            fr: 'Désolé, une erreur technique s\'est produite. Veuillez réessayer ou contacter notre personnel.',
            en: 'I apologize, but I encountered a technical issue. Please try again or speak with our staff.'
        };

        return {
            message: fallbacks[detectedLanguage] || fallbacks.en,
            detectedLanguage
        };
    }
}

/**
 * Generate embeddings for text using Gemini
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' });

    const result = await embeddingModel.embedContent(text);
    return result.embedding.values;
}
