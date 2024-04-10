## Integrantes

- Igor Nathan Monteiro Santos - 202100011495
- João Pablo da Paz de Jesus - 202100045911
- Unaldo Santos Vasconcelos Neto - 202100061085

## Como rodar o projeto

- Configure o seu .env para ter `OPENAI_API_KEY` e `GEMINI_API_KEY`, veja no arquivo `.env.example`.

- Com o node instalado: `npm install`
- Com o docker instalado: `docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest`
- Execute o arquivo `loader.ts`: `npx tsx src/loader.ts`
- Para ver a busca semântica sem uso do LLM: `npx tsx src/search.ts`
- Para ver o RAG com LLM GPT-3.5-turbo: `npx tsx src/gpt.ts`
