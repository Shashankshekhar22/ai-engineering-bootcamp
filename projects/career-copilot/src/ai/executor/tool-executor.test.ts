import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import { executeTool } from "./tool-executor.js";
import { InvalidToolArgumentsError, ToolExecutionError } from "../errors.js";
import type { ToolDefinition } from "../types.js";

function buildTool(
  execute: (args: { value: string }) => Promise<string>,
): ToolDefinition<{ value: string }, string> {
  return {
    name: "sample",
    description: "sample tool",
    parameters: {
      type: "object",
      properties: { value: { type: "string" } },
      required: ["value"],
      additionalProperties: false,
    },
    schema: z.object({ value: z.string() }),
    execute,
  };
}

test("executes a tool with valid, schema-validated arguments", async () => {
  const tool = buildTool(async ({ value }) => value.toUpperCase());

  const result = await executeTool(tool, JSON.stringify({ value: "hi" }));

  assert.deepEqual(result.args, { value: "hi" });
  assert.equal(result.result, "HI");
});

test("throws InvalidToolArgumentsError when arguments are not valid JSON", async () => {
  const tool = buildTool(async ({ value }) => value);

  await assert.rejects(
    () => executeTool(tool, "{not json"),
    (error: unknown) => {
      assert.ok(error instanceof InvalidToolArgumentsError);
      assert.equal((error as InvalidToolArgumentsError).toolName, "sample");
      return true;
    },
  );
});

test("throws InvalidToolArgumentsError when arguments fail schema validation", async () => {
  const tool = buildTool(async ({ value }) => value);

  await assert.rejects(
    () => executeTool(tool, JSON.stringify({ wrongField: 1 })),
    (error: unknown) => {
      assert.ok(error instanceof InvalidToolArgumentsError);
      assert.match((error as Error).message, /schema validation/);
      return true;
    },
  );
});

test("never calls execute() when validation fails", async () => {
  let executeCalled = false;
  const tool = buildTool(async ({ value }) => {
    executeCalled = true;
    return value;
  });

  await assert.rejects(() => executeTool(tool, JSON.stringify({ wrongField: 1 })));
  assert.equal(executeCalled, false);
});

test("wraps a thrown execution error in ToolExecutionError", async () => {
  const tool = buildTool(async () => {
    throw new Error("boom");
  });

  await assert.rejects(
    () => executeTool(tool, JSON.stringify({ value: "hi" })),
    (error: unknown) => {
      assert.ok(error instanceof ToolExecutionError);
      assert.match((error as Error).message, /boom/);
      return true;
    },
  );
});
