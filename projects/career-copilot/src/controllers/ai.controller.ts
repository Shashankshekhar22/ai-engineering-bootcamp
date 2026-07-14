import type { Request, Response } from "express";
import { generateAIResponse } from "../services/ai.service.js";

export async function chat(req: Request, res: Response) {
  const { message } = req.body;

  if (typeof message !== "string" || message.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: "Message must be a non-empty string",
    });
  }

  try {
    const response = await generateAIResponse(message.trim());

    return res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("AI request failed:", error);

    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
}
