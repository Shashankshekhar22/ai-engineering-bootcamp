// Contains the AI business/integration logic and communicates with the LLM provider.
import { OpenAI } from "openai";
import { env } from "../config/env.js";

const openai = new OpenAI({
  apiKey: env.openAIAPIKey,
});

export async function generateAIResponse(userMessage: string) {
  const startTime = Date.now();

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    instructions:
      "You are a helpful AI assistant. Answer clearly and concisely.",
    input: userMessage,
  });

  const latencyMs = Date.now() - startTime;

  return {
    content: response.output_text,
    usage: response.usage,
    latencyMs,
  };
}