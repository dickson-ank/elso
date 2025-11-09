import OpenAI from "openai";

const client = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_API_BASE_URL,
});

export default client;




