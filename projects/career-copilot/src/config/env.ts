// Loads and validates environment configuration such as API keys.

import dotenv from "dotenv";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envCandidates = [
  path.resolve(__dirname, "../../.env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(process.cwd(), "projects/career-copilot/.env"),
];

const envPath = envCandidates.find((candidate) => existsSync(candidate));

if (envPath) {
  dotenv.config({ path: envPath });
}

const openAIAPIKey = process.env.OPENAI_API_KEY;

if (!openAIAPIKey) {
  throw new Error("OPENAI_API_KEY is not configured");
}

export const env = {
  openAIAPIKey,
};