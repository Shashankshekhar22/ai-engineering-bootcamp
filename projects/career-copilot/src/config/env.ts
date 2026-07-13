// Loads and validates environment configuration such as API keys.

import "dotenv/config";

const openAIAPIKey = process.env.OPENAI_API_KEY;

if (!openAIAPIKey) {
  throw new Error("OPENAI_API_KEY is not configured");
}

export const env = {
  openAIAPIKey,
};