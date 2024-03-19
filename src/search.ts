import { redis, redisVectorStore } from "./redisStore";
import { config } from "dotenv";
config();

async function search() {
  await redis.connect();

  const response = await redisVectorStore.similaritySearchWithScore(
    "Como foi assinado esse documento?",
    3
  );

  console.log(response);

  await redis.disconnect();
}

search();
