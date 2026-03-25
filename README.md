# RAG Chatbot FAQ

A Node.js RAG (Retrieval-Augmented Generation) chatbot that answers customer support questions by loading FAQ documents, storing embeddings in LanceDB, and generating responses via OpenAI GPT-3.5-turbo.

## Features

- FAQ document loading from JSON
- Vector embeddings via OpenAI text-embedding-3-small
- Vector similarity search via LanceDB (embedded)
- Response generation via GPT-3.5-turbo
- Clean HTML/CSS/JS chat interface
- Health check endpoint

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/eldencodingv3/rag-chatbot-faq.git
   cd rag-chatbot-faq
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```

4. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=sk-your-key-here
   PORT=3000
   ```

5. Start the server:
   ```bash
   npm start
   ```

6. Open http://localhost:3000 in your browser.

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `OPENAI_API_KEY` | Yes | — | Your OpenAI API key (or OpenRouter/Together AI key) |
| `OPENAI_BASE_URL` | No | `https://api.openai.com/v1` | API base URL (use `https://openrouter.ai/api/v1` for OpenRouter) |
| `CHAT_MODEL` | No | `gpt-3.5-turbo` | Chat model name (use `openai/gpt-3.5-turbo` for OpenRouter) |
| `EMBEDDING_MODEL` | No | `text-embedding-3-small` | Embedding model (use `openai/text-embedding-3-small` for OpenRouter) |
| `PORT` | No | `3000` | Server port |

## Updating the FAQ Dataset

Edit `data/faqs.json` to add, remove, or modify FAQ entries. Each entry should have:

```json
{
  "id": 1,
  "question": "Your question here?",
  "answer": "Your answer here."
}
```

Restart the server after making changes — embeddings are regenerated on startup.

## API Endpoints

- `GET /` — Chat interface
- `GET /api/health` — Health check (returns `{ "status": "ok" }`)
- `POST /api/chat` — Send a message (body: `{ "message": "your question" }`, returns `{ "reply": "...", "sources": [...] }`)

## Tech Stack

- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Vector DB:** LanceDB (embedded)
- **AI:** OpenAI GPT-3.5-turbo + text-embedding-3-small
- **Frontend:** Vanilla HTML/CSS/JS
