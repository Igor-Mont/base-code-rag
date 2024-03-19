import path from "path";
import { createClient } from "redis";
import { config } from "dotenv";
config();

import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { TokenTextSplitter } from "langchain/text_splitter";
import { RedisVectorStore } from "@langchain/redis";
import { OpenAIEmbeddings } from "@langchain/openai";

const loader = new DirectoryLoader(path.resolve(__dirname, "../tmp"), {
  ".pdf": (path) =>
    new PDFLoader(path, {
      parsedItemSeparator: " ",
    }),
});

async function load() {
  const docs = await loader.load();

  const textSplitter = new TokenTextSplitter({
    chunkSize: 600,
    chunkOverlap: 200,
    encodingName: "cl100k_base",
  });

  const splitDocs = await textSplitter.splitDocuments(docs);
  console.log({ splitDocs });

  const redis = createClient({
    url: "redis://127.0.0.1:6379",
  });

  await redis.connect();

  await RedisVectorStore.fromDocuments(
    splitDocs,
    new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    }),
    {
      indexName: "cc",
      redisClient: redis,
      keyPrefix: "cc ",
    }
  );

  await redis.disconnect();
}

load();
