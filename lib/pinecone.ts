import { Pinecone } from '@pinecone-database/pinecone';

/**
 * Initialize Pinecone client and get the index
 */
function getPineconeIndex() {
  const apiKey = process.env.PINECONE_API_KEY;
  const indexName = process.env.PINECONE_INDEX_NAME || 'storytelling';
  const namespace = process.env.PINECONE_NAMESPACE || 'stories';

  if (!apiKey) {
    throw new Error('PINECONE_API_KEY is not set in environment variables');
  }

  // SDK v6+ only requires apiKey for serverless indexes
  const pc = new Pinecone({ apiKey });
  const index = pc.index(indexName);

  return { index, namespace };
}

/**
 * Query Pinecone for the top N most relevant chunks based on a text query
 * 
 * @param queryText - The text to search for (e.g., transcript content)
 * @param topK - Number of results to return (default: 3)
 * @returns Array of relevant chunks with their metadata
 */
export async function queryPinecone(
  queryText: string,
  topK: number = 3
): Promise<Array<{ text: string; source?: string; author?: string; score?: number }>> {
  try {
    const { index, namespace } = getPineconeIndex();

    // Get namespace for model-bound index query
    const ns = index.namespace(namespace);

    // Query Pinecone using searchRecords for model-bound indexes (handles text embedding automatically)
    console.log(`   - Calling searchRecords...`);
    const queryResponse = await ns.searchRecords({
      query: {
        topK,
        inputs: { text: queryText },
      },
      fields: ['text', 'source', 'author'],
    });

    // SDK v6 returns result.hits with _id, _score, fields
    const hits = queryResponse.result?.hits ?? [];
    const results = hits.map((hit) => {
      const fields = hit.fields as Record<string, unknown>;
      return {
        text: (fields?.text as string) || '',
        source: fields?.source as string | undefined,
        author: fields?.author as string | undefined,
        score: hit._score,
      };
    });

    console.log(`🔍 Found ${results.length} relevant chunks from Pinecone`);
    if (results.length > 0) {
      results.forEach((r, i) => {
        console.log(`   Chunk ${i + 1}:`, {
          textLength: r.text.length,
          textPreview: r.text.substring(0, 50) + '...',
          source: r.source,
          author: r.author,
          score: r.score,
        });
      });
    }
    
    return results;
  } catch (error) {
    console.error('❌ Error querying Pinecone:', error);
    if (error instanceof Error) {
      console.error('   Error message:', error.message);
      console.error('   Error stack:', error.stack);
    }
    // Return empty array on error so the analysis can still proceed
    return [];
  }
}
