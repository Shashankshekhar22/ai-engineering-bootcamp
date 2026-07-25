// Orchestrates the Function Calling loop between the user, the OpenAI Responses API,
// and the registered tools. This is the heart of the AI workflow: it builds the
// conversation, sends it (with tool schemas) to OpenAI, detects requested tool calls,
// resolves + executes them, feeds the results back, and returns the model's final answer.
import { OpenAI } from "openai";
import type {
  Response,
  ResponseCreateParamsNonStreaming,
  ResponseFunctionToolCall,
  ResponseInputItem,
} from "openai/resources/responses/responses.js";
import { env } from "../../config/env.js";
import { logger } from "../../lib/logger.js";
import { analyzeResumeTool } from "../tools/analyze-resume.tool.js";
import {
  InvalidToolArgumentsError,
  MaxToolIterationsExceededError,
  ToolExecutionError,
  ToolNotFoundError,
} from "../errors.js";
import { executeTool } from "../executor/tool-executor.js";
import { createToolRegistry } from "../registry/tool-registry.js";
import type { ToolRegistry } from "../types.js";

const DEFAULT_MODEL = "gpt-4.1-mini";
const DEFAULT_INSTRUCTIONS =
  "You are Career Copilot, an AI assistant that helps candidates with their resume and job search. " +
  "Use the available tools whenever they can answer the user's request more accurately than your own knowledge.";

// Guards against a runaway tool-calling loop if the model never settles on a final answer.
const DEFAULT_MAX_ITERATIONS = 5;

function createDefaultRegistry(): ToolRegistry {
  const registry = createToolRegistry();
  registry.register(analyzeResumeTool);
  return registry;
}

export type CreateResponseFn = (
  params: ResponseCreateParamsNonStreaming,
) => Promise<Response>;

export interface AIOrchestratorDeps {
  createResponse: CreateResponseFn;
  registry: ToolRegistry;
  instructions: string;
  model: string;
  maxIterations: number;
}

export interface ToolCallTrace {
  callId: string;
  name: string;
  success: boolean;
  args?: unknown;
  output: unknown;
}

export interface OrchestratorResponse {
  content: string;
  toolCalls: ToolCallTrace[];
  latencyMs: number;
}

// A tool call failure (unknown tool, invalid arguments, or a thrown execution error)
// is still fed back to the model as a structured error so it can react or retry -
// but it is always logged first, and never silently swallowed.
function describeToolFailure(toolName: string, callId: string, error: unknown): { error: string } {
  if (error instanceof ToolNotFoundError) {
    logger.warn("Tool call referenced an unregistered tool", { toolName, callId });
    return { error: error.message };
  }

  if (error instanceof InvalidToolArgumentsError) {
    logger.warn("Tool call had invalid arguments", {
      toolName,
      callId,
      cause: error.cause instanceof Error ? error.cause.message : error.cause,
    });
    return { error: error.message };
  }

  if (error instanceof ToolExecutionError) {
    logger.error("Tool execution threw", { toolName, callId, cause: error.cause });
    return { error: error.message };
  }

  logger.error("Unexpected error while handling tool call", {
    toolName,
    callId,
    error: error instanceof Error ? error.message : String(error),
  });
  return { error: "Unexpected error while executing tool" };
}

function createDefaultCreateResponse(): CreateResponseFn {
  const openai = new OpenAI({ apiKey: env.openAIAPIKey });
  return (params) => openai.responses.create(params);
}

export function createAIOrchestrator(
  overrides: Partial<AIOrchestratorDeps> = {},
): { run: (userMessage: string) => Promise<OrchestratorResponse> } {
  const deps: AIOrchestratorDeps = {
    // Only construct a real OpenAI client when the caller hasn't supplied its own
    // createResponse (e.g. tests stubbing the loop) - avoids requiring an API key
    // for pure unit tests of the orchestration logic.
    createResponse: overrides.createResponse ?? createDefaultCreateResponse(),
    registry: overrides.registry ?? createDefaultRegistry(),
    instructions: overrides.instructions ?? DEFAULT_INSTRUCTIONS,
    model: overrides.model ?? DEFAULT_MODEL,
    maxIterations: overrides.maxIterations ?? DEFAULT_MAX_ITERATIONS,
  };

  async function run(userMessage: string): Promise<OrchestratorResponse> {
    const startTime = Date.now();

    // Build conversation
    const conversation: ResponseInputItem[] = [{ role: "user", content: userMessage }];

    // Register tools
    const toolDefinitions = deps.registry.getDefinitions();
    const toolCallTrace: ToolCallTrace[] = [];

    for (let iteration = 0; iteration < deps.maxIterations; iteration++) {
      // Send request to OpenAI
      const response = await deps.createResponse({
        model: deps.model,
        instructions: deps.instructions,
        input: conversation,
        tools: toolDefinitions,
      });

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
        let output: unknown;
        let args: unknown;
        let success = true;

        try {
          const tool = deps.registry.resolve(toolCall.name);
          const executed = await executeTool(tool, toolCall.arguments);
          args = executed.args;
          output = executed.result;
        } catch (error) {
          success = false;
          output = describeToolFailure(toolCall.name, toolCall.call_id, error);
        }

        toolCallTrace.push({
          callId: toolCall.call_id,
          name: toolCall.name,
          success,
          args,
          output,
        });

        // Send tool results back to OpenAI on the next iteration
        conversation.push({
          type: "function_call_output",
          call_id: toolCall.call_id,
          output: JSON.stringify(output),
        });
      }
    }

    const toolNamesInvoked = toolCallTrace.map((trace) => trace.name);
    logger.error("Tool-calling loop exceeded maximum iterations", {
      maxIterations: deps.maxIterations,
      toolCalls: toolCallTrace,
    });
    throw new MaxToolIterationsExceededError(deps.maxIterations, toolNamesInvoked);
  }

  return { run };
}

const defaultOrchestrator = createAIOrchestrator();

export const runAIOrchestrator = (userMessage: string): Promise<OrchestratorResponse> =>
  defaultOrchestrator.run(userMessage);
