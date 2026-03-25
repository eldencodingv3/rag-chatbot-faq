import * as lancedb from '@lancedb/lancedb';
import OpenAI from 'openai';
import { readFile } from 'fs/promises';
import { config } from './config.js';

const openai = new OpenAI({ apiKey: config.openaiApiKey });

let table = null;

async function getEmbedding(text) {
  const response = await openai.embeddings.create({
    model: config.embeddingModel,
    input: text,
  });
  return response.data[0].embedding;
}

export async function initializeRAG() {
  console.log('Loading FAQ data...');
  const raw = await readFile(config.faqPath, 'utf-8');
  const faqs = JSON.parse(raw);

  console.log(`Generating embeddings for ${faqs.length} FAQs...`);
  const records = [];
  for (const faq of faqs) {
    const text = `Q: ${faq.question}\nA: ${faq.answer}`;
    const vector = await getEmbedding(text);
    records.push({
      id: faq.id,
      question: faq.question,
      answer: faq.answer,
      text,
      vector,
    });
  }

  console.log('Storing embeddings in LanceDB...');
  const db = await lancedb.connect(config.lanceDbPath);

  // Drop existing table if it exists, then create new one
  try {
    await db.dropTable('faqs');
  } catch (e) {
    // Table doesn't exist yet, that's fine
  }

  table = await db.createTable('faqs', records);
  console.log('RAG system initialized successfully.');
}

export async function query(userMessage) {
  if (!table) {
    throw new Error('RAG system not initialized');
  }

  const queryVector = await getEmbedding(userMessage);

  const results = await table.vectorSearch(queryVector)
    .limit(config.topK)
    .toArray();

  const context = results
    .map((r, i) => `[${i + 1}] Q: ${r.question}\nA: ${r.answer}`)
    .join('\n\n');

  const sources = results.map(r => ({
    question: r.question,
    answer: r.answer,
  }));

  const completion = await openai.chat.completions.create({
    model: config.chatModel,
    messages: [
      {
        role: 'system',
        content: `You are a helpful customer support assistant. Answer the user's question based on the following FAQ context. If the context doesn't contain relevant information, say you don't have that information and suggest contacting support.\n\nContext:\n${context}`,
      },
      {
        role: 'user',
        content: userMessage,
      },
    ],
    temperature: 0.7,
    max_tokens: 500,
  });

  return {
    reply: completion.choices[0].message.content,
    sources,
  };
}
