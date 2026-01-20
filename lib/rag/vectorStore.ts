import { ChromaClient, Collection } from 'chromadb';
import { generateEmbedding } from '../ai/chat';

const COLLECTION_NAME = 'dar_sebastien_knowledge';

let client: ChromaClient | null = null;
let collection: Collection | null = null;

/**
 * Initialize ChromaDB client and collection
 */
export async function initVectorStore(): Promise<Collection> {
    if (collection) return collection;

    client = new ChromaClient({
        path: process.env.CHROMA_HOST
            ? `http://${process.env.CHROMA_HOST}:${process.env.CHROMA_PORT || 8000}`
            : undefined // Use ephemeral client if no host specified
    });

    // Get or create collection
    collection = await client.getOrCreateCollection({
        name: COLLECTION_NAME,
        metadata: {
            description: 'Knowledge base for Dar Sebastien cultural center',
            'hnsw:space': 'cosine'
        }
    });

    return collection;
}

export interface DocumentChunk {
    id: string;
    text: string;
    metadata: {
        source: string;
        chunkIndex: number;
        totalChunks: number;
        documentTitle?: string;
    };
}

/**
 * Add documents to the vector store
 */
export async function addDocuments(chunks: DocumentChunk[]): Promise<void> {
    const col = await initVectorStore();

    // Generate embeddings for all chunks
    const embeddings = await Promise.all(
        chunks.map(chunk => generateEmbedding(chunk.text))
    );

    await col.add({
        ids: chunks.map(c => c.id),
        embeddings: embeddings,
        documents: chunks.map(c => c.text),
        metadatas: chunks.map(c => c.metadata)
    });

    console.log(`Added ${chunks.length} chunks to vector store`);
}

/**
 * Query the vector store for relevant context
 */
export async function queryDocuments(
    query: string,
    nResults: number = 5
): Promise<string> {
    try {
        const col = await initVectorStore();

        // Check if collection has any documents
        const count = await col.count();
        if (count === 0) {
            return '';
        }

        const queryEmbedding = await generateEmbedding(query);

        const results = await col.query({
            queryEmbeddings: [queryEmbedding],
            nResults: Math.min(nResults, count)
        });

        if (!results.documents || results.documents.length === 0) {
            return '';
        }

        // Combine relevant documents into context
        const documents = results.documents[0];
        const metadatas = results.metadatas?.[0] || [];

        const contextParts = documents.map((doc, i) => {
            const meta = metadatas[i] as { source?: string; documentTitle?: string } | undefined;
            const source = meta?.documentTitle || meta?.source || 'Document';
            return `[Source: ${source}]\n${doc}`;
        });

        return contextParts.join('\n\n---\n\n');
    } catch (error) {
        console.error('Vector store query error:', error);
        return '';
    }
}

/**
 * Get the current document count
 */
export async function getDocumentCount(): Promise<number> {
    try {
        const col = await initVectorStore();
        return await col.count();
    } catch {
        return 0;
    }
}
