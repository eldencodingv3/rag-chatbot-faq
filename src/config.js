import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3000,
  openaiApiKey: process.env.OPENAI_API_KEY,
  openaiBaseUrl: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  embeddingModel: process.env.EMBEDDING_MODEL || 'text-embedding-3-small',
  chatModel: process.env.CHAT_MODEL || 'gpt-3.5-turbo',
  lanceDbPath: './data/lancedb',
  faqPath: './data/faqs.json',
  topK: 3,
};
