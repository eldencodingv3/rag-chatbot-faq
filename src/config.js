import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY,
  embeddingModel: 'text-embedding-3-small',
  chatModel: 'gpt-3.5-turbo',
  lanceDbPath: './data/lancedb',
  faqPath: './data/faqs.json',
  topK: 3,
};
