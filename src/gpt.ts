import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import { RetrievalQAChain } from "langchain/chains";
import { redis, redisVectorStore } from "./redisStore";
import { Document } from "langchain/document";
import { config } from "dotenv";
config();

const openAiChat = new ChatOpenAI({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-3.5-turbo",
  temperature: 0.3,
  verbose: false,
});

const prompt = new PromptTemplate({
  template: `
    Você é um especialista em procurar perguntas relacionadas com temas de provas do ENADE.

    Antes preciso que você identifique o ano da prova de cada questão que abaixo (não o código, apenas o ano).

    Com base nas questões dadas abaixo preciso que você verifique se o tema da questão está condizente com o tema da pergunta que irá ser feita.
    O número da questão tem o prefixo "QUeSTÃo" (preste atenção nisso para não se confundir).

    O formato ideal seria "A questão x do ENADE XXXX está condizente com a sua pergunta." (fazer isso para cada questão dada).
    E quando não for condizente, o formato ideal seria "E as questões XX, XX e XX não condizem"

    Não tente inventar respostas.

    Questões:
    {context}

    Pergunta:
    {question}
  `.trim(),
  inputVariables: ["context", "question"],
});

const chain = RetrievalQAChain.fromLLM(
  openAiChat,
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
    query:
      "Poderia me fornecer questões relacionadas a DER (Diagrama Entidade Relacionamento)?",
  });
  console.log(response);
  await redis.disconnect();
}

main();
