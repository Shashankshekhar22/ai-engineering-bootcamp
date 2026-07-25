import { test } from "node:test";
import assert from "node:assert/strict";
import { z } from "zod";
import { createToolRegistry } from "./tool-registry.js";
import { ToolNotFoundError } from "../errors.js";
import type { ToolDefinition } from "../types.js";

function buildTool(name: string): ToolDefinition<{ value: string }, string> {
  return {
    name,
    description: "test tool",
    parameters: {
      type: "object",
      properties: { value: { type: "string" } },
      required: ["value"],
      additionalProperties: false,
    },
    schema: z.object({ value: z.string() }),
    execute: async ({ value }) => value,
  };
}

test("registers and looks up a tool by name", () => {
  const registry = createToolRegistry();
  const tool = buildTool("foo");
  registry.register(tool);

  assert.equal(registry.get("foo"), tool);
  assert.equal(registry.resolve("foo"), tool);
});

test("get returns undefined for an unregistered tool", () => {
  const registry = createToolRegistry();
  assert.equal(registry.get("missing"), undefined);
});

test("resolve throws ToolNotFoundError for an unregistered tool", () => {
  const registry = createToolRegistry();
  assert.throws(() => registry.resolve("missing"), ToolNotFoundError);
});

test("register throws when a tool name is registered twice", () => {
  const registry = createToolRegistry();
  registry.register(buildTool("dup"));
  assert.throws(() => registry.register(buildTool("dup")), /already registered/);
});

test("getDefinitions produces OpenAI-compatible function tool schemas", () => {
  const registry = createToolRegistry();
  registry.register(buildTool("foo"));

  const definitions = registry.getDefinitions();
  assert.equal(definitions.length, 1);
  assert.equal(definitions[0]?.type, "function");
  assert.equal(definitions[0]?.name, "foo");
});
