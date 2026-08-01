// Accepts the HTTP request, validates input, and delegates to the AI Orchestrator.
// Contains no business logic and never calls OpenAI or any tool directly.
import type { Request, Response } from "express";
import { logger } from "../lib/logger.js";
import { runAIOrchestrator } from "../ai/orchestrator/ai-orchestrator.service.js";

export async function analyze(req: Request, res: Response) {
  const { message } = req.body;

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Message must be a non-empty string",
    });
  }

  try {
    const response = await runAIOrchestrator(message.trim());

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    logger.error("Resume orchestration request failed", {
      error: error instanceof Error ? error.message : String(error),
    });

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
