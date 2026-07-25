// Orchestrates the Function Calling loop between the user, the OpenAI Responses API,
// and the registered tools. This is the heart of the AI workflow: it builds the
// conversation, sends it (with tool schemas) to OpenAI, detects requested tool calls,
// executes them via the Tool Registry/Executor, feeds the results back, and returns
// the model's final answer.
import { OpenAI } from "openai";
import type {
  ResponseFunctionToolCall,
  ResponseInputItem,
} from "openai/resources/responses/responses.js";
import { env } from "../config/env.js";
import { createToolRegistry } from "../tools/tool-registry.js";
import { executeTool } from "../tools/tool-executor.js";
import { analyzeResumeTool } from "../tools/definitions/analyze-resume.tool.js";

const openai = new OpenAI({ apiKey: env.openAIAPIKey });

const MODEL = "gpt-4.1-mini";
const INSTRUCTIONS =
  "You are Career Copilot, an AI assistant that helps candidates with their resume and job search. " +
  "Use the available tools whenever they can answer the user's request more accurately than your own knowledge.";

// Guards against a runaway tool-calling loop if the model never settles on a final answer.
const MAX_TOOL_ITERATIONS = 5;

// Register tools
const toolRegistry = createToolRegistry();
toolRegistry.register(analyzeResumeTool);

export interface ToolCallTrace {
  name: string;
  arguments: unknown;
  result: unknown;
}

export interface OrchestratorResponse {
  content: string;
  toolCalls: ToolCallTrace[];
  latencyMs: number;
}

export async function runAIOrchestrator(
  userMessage: string,
): Promise<OrchestratorResponse> {
  const startTime = Date.now();

  // Build conversation
  const conversation: ResponseInputItem[] = [
    { role: "user", content: userMessage },
  ];

  const toolDefinitions = toolRegistry.getDefinitions();
  const toolCallTrace: ToolCallTrace[] = [];

  for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
    // Send request to OpenAI
    const response = await openai.responses.create({
      model: MODEL,
      instructions: INSTRUCTIONS,
      input: conversation,
      tools: toolDefinitions,
    });

    console.log("RESPONSE for OPEN AI", JSON.stringify(response));
    // Detect tool calls
    const toolCalls = response.output.filter(
      (item): item is ResponseFunctionToolCall => item.type === "function_call",
    );

    if (toolCalls.length === 0) {
      // Return final response
      return {
        content: response.output_text,
        toolCalls: toolCallTrace,
        latencyMs: Date.now() - startTime,
      };
    }

    // Preserve the model's tool call requests in the conversation before answering them.
    // response.output items are structurally valid ResponseInputItems for the next turn;
    // the two types only diverge on a status literal for a tool kind we never use here.
    conversation.push(...(response.output as ResponseInputItem[]));

    // Execute tools
    for (const toolCall of toolCalls) {
      const result = await executeTool(
        toolRegistry,
        toolCall.call_id,
        toolCall.name,
        toolCall.arguments,
      );

      toolCallTrace.push({
        name: toolCall.name,
        arguments: parseArguments(toolCall.arguments),
        result: result.output,
      });

      // Send tool results back to OpenAI on the next iteration
      conversation.push({
        type: "function_call_output",
        call_id: result.callId,
        output: JSON.stringify(result.output),
      });
    }
  }

  throw new Error(
    "Exceeded maximum tool execution iterations without a final response",
  );
}

function parseArguments(rawArguments: string): unknown {
  try {
    return JSON.parse(rawArguments);
  } catch {
    return rawArguments;
  }
}
