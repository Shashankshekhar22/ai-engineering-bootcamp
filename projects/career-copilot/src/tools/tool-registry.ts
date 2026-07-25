// Keeps all available tools in one place: registers them, looks them up by name,
// and produces the OpenAI-facing tool schema list.
import type { AnyToolDefinition, ToolRegistry } from "./types.js";

export function createToolRegistry(): ToolRegistry {
  const tools = new Map<string, AnyToolDefinition>();

  return {
    register(tool) {
      if (tools.has(tool.name)) {
        throw new Error(`Tool "${tool.name}" is already registered`);
      }
      tools.set(tool.name, tool);
    },

    get(name) {
      return tools.get(name);
    },

    getDefinitions() {
      return [...tools.values()].map((tool) => ({
        type: "function" as const,
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
        strict: false,
      }));
    },
  };
}
