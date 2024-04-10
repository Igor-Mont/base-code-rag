import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RetrievalQAChain } from "langchain/chains";
import { redis, redisVectorStore } from "./redisStore";
import { Document } from "langchain/document";
import { config } from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

config();

const GeminiAi = new ChatGoogleGenerativeAI({
  modelName: "gemini-pro",
  maxOutputTokens: 2048,
  temperature: 0.8,
  apiKey: process.env.GEMINI_API_KEY,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
    },
  ],
});

const prompt = new PromptTemplate({
  template: `
    Você é um especialista em procurar perguntas relacionadas com temas de provas do ENADE.

    identifique o número da questão com prefixo "QuES tã O".

    Questões:
    {context}

    Pergunta:
    {question}
  `.trim(),
  inputVariables: ["context", "question"],
});

const chain = RetrievalQAChain.fromLLM(
  GeminiAi,
  redisVectorStore.asRetriever(),
  {
    prompt,
    returnSourceDocuments: true,
    verbose: false,
  }
);

async function main() {
  await redis.connect();

  const response = await chain._call({
    query: "Poderia me fornecer questões sobre LGPD?",
  });
  console.log(response);
  await redis.disconnect();
}

main();
