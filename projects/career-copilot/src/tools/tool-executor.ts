// Validates a requested tool call's arguments, executes the tool, and returns a
// structured result. Never touches HTTP concerns - only the registry and the tool itself.
import type { ToolRegistry } from "./types.js";

export interface ToolExecutionResult {
  callId: string;
  toolName: string;
  success: boolean;
  output: unknown;
}

export async function executeTool(
  registry: ToolRegistry,
  callId: string,
  toolName: string,
  rawArguments: string,
): Promise<ToolExecutionResult> {
  const tool = registry.get(toolName);

  if (!tool) {
    return {
      callId,
      toolName,
      success: false,
      output: { error: `Unknown tool "${toolName}"` },
    };
  }

  let parsedArguments: unknown;
  try {
    parsedArguments = JSON.parse(rawArguments);
  } catch {
    return {
      callId,
      toolName,
      success: false,
      output: { error: "Tool arguments were not valid JSON" },
    };
  }

  const validation = tool.schema.safeParse(parsedArguments);
  if (!validation.success) {
    return {
      callId,
      toolName,
      success: false,
      output: {
        error: "Invalid tool arguments",
        issues: validation.error.issues,
      },
    };
  }

  try {
    const result = await tool.execute(validation.data);
    return { callId, toolName, success: true, output: result };
  } catch (error) {
    return {
      callId,
      toolName,
      success: false,
      output: {
        error: error instanceof Error ? error.message : "Tool execution failed",
      },
    };
  }
}
