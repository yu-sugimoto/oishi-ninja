import OpenAI from "openai";
import dotenv from "dotenv";

export const getOpenAi = (function createOpenAiGetter () {
  dotenv.config();

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return function getOpenAi () {
    return openai;
  }
})();
