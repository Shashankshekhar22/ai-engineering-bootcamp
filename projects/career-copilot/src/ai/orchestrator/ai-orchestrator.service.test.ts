import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import type {
  Response,
  ResponseFunctionToolCall,
} from "openai/resources/responses/responses.js";
import { createAIOrchestrator } from "./ai-orchestrator.service.js";
import { createToolRegistry } from "../registry/tool-registry.js";
import { MaxToolIterationsExceededError } from "../errors.js";
import type { ToolDefinition } from "../types.js";

function buildEchoTool(): ToolDefinition<{ value: string }, { echoed: string }> {
  return {
    name: "echo",
    description: "Echoes the provided value.",
    parameters: {
      type: "object",
      properties: { value: { type: "string" } },
      required: ["value"],
      additionalProperties: false,
    },
    schema: z.object({ value: z.string() }),
    execute: async ({ value }) => ({ echoed: value }),
  };
}

function functionCallResponse(name: string, args: unknown, callId = "call_1"): Response {
  const toolCall: ResponseFunctionToolCall = {
    type: "function_call",
    call_id: callId,
    name,
    arguments: JSON.stringify(args),
  };

  return { output: [toolCall], output_text: "" } as unknown as Response;
}

function finalMessageResponse(text: string): Response {
  return { output: [], output_text: text } as unknown as Response;
}

test("executes a requested tool and returns the model's final response", async () => {
  const registry = createToolRegistry();
  registry.register(buildEchoTool());

  let callCount = 0;
  const orchestrator = createAIOrchestrator({
    registry,
    createResponse: async () => {
      callCount += 1;
      return callCount === 1
        ? functionCallResponse("echo", { value: "hello" })
        : finalMessageResponse("Echoed: hello");
    },
  });

  const result = await orchestrator.run("please echo hello");

  assert.equal(result.content, "Echoed: hello");
  assert.equal(result.toolCalls.length, 1);
  assert.equal(result.toolCalls[0]?.success, true);
  assert.deepEqual(result.toolCalls[0]?.output, { echoed: "hello" });
});

test("reports an explicit, structured failure when the model requests an unknown tool", async () => {
  const registry = createToolRegistry();

  let callCount = 0;
  const orchestrator = createAIOrchestrator({
    registry,
    createResponse: async () => {
      callCount += 1;
      return callCount === 1
        ? functionCallResponse("doesNotExist", {})
        : finalMessageResponse("Sorry, I could not do that.");
    },
  });

  const result = await orchestrator.run("do the impossible");

  assert.equal(result.toolCalls.length, 1);
  assert.equal(result.toolCalls[0]?.success, false);
  assert.match(
    (result.toolCalls[0]?.output as { error: string }).error,
    /Unknown tool "doesNotExist"/,
  );
});

test("reports an explicit, structured failure when tool arguments fail schema validation", async () => {
  const registry = createToolRegistry();
  registry.register(buildEchoTool());

  let callCount = 0;
  const orchestrator = createAIOrchestrator({
    registry,
    createResponse: async () => {
      callCount += 1;
      return callCount === 1
        ? functionCallResponse("echo", { wrongField: 123 })
        : finalMessageResponse("Handled the bad input.");
    },
  });

  const result = await orchestrator.run("break the tool");

  assert.equal(result.toolCalls[0]?.success, false);
  assert.match(
    (result.toolCalls[0]?.output as { error: string }).error,
    /schema validation/,
  );
});

test("throws an informative error when the tool-calling loop never terminates", async () => {
  const registry = createToolRegistry();
  registry.register(buildEchoTool());

  const orchestrator = createAIOrchestrator({
    registry,
    maxIterations: 2,
    createResponse: async () => functionCallResponse("echo", { value: "loop" }),
  });

  await assert.rejects(
    () => orchestrator.run("loop forever"),
    (error: unknown) => {
      assert.ok(error instanceof MaxToolIterationsExceededError);
      assert.equal(error.maxIterations, 2);
      assert.match(error.message, /echo/);
      return true;
    },
  );
});
