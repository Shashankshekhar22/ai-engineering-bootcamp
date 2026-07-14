// Handles HTTP request/response concerns, validates input, and calls the service.

import { generateAIResponse } from "../services/ai.service.js";

export async function readRequestBody(req: any) {
    const message = req.body.message;
    if (!message) {
        return { 
            errorCode: 400,
            errorMessage: "Message is missing" 
        };
    } else {
        try {
            const response = await generateAIResponse(message);
            return {
                success: true,
                data: {
                    content: response.content,
                    usage: response.usage,
                    latencyMs: response.latencyMs
                }
            };
        } catch (error) {
            return {
                errorCode: 500,
                errorMessage: "Internal server error"
            };
        }
    }
  
}