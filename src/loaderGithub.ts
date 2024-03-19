import path from "path";
import { createClient } from "redis";

import { S3Loader } from "langchain/document_loaders/web/s3";
import { TokenTextSplitter } from "langchain/text_splitter";
import { RedisVectorStore } from "@langchain/redis";
import { OpenAIEmbeddings } from "@langchain/openai";
import { GithubRepoLoader } from "langchain/document_loaders/web/github";

import { config } from "dotenv";
config();

const loader = new GithubRepoLoader(
  "https://github.com/Igor-Mont/cs-portal-hub-rag",
  {
    branch: "main",
    recursive: false,
    unknown: "warn",
    maxConcurrency: 5,
  }
);

async function load() {
  const docs = await loader.load();
  console.log(docs);

  const textSplitter = new TokenTextSplitter({
    chunkSize: 600,
    chunkOverlap: 200,
    encodingName: "cl100k_base",
  });

  const splitDocs = await textSplitter.splitDocuments(docs);
  console.log({ splitDocs });

  // const redis = createClient({
  //   url: "redis://127.0.0.1:6379",
  // });

  // await redis.connect();

  // await RedisVectorStore.fromDocuments(
  //   splitDocs,
  //   new OpenAIEmbeddings({
  //     openAIApiKey: process.env.OPENAI_API_KEY,
  //   }),
  //   {
  //     indexName: "cc",
  //     redisClient: redis,
  //     keyPrefix: "cc ",
  //   }
  // );

  // await redis.disconnect();
}

load();
