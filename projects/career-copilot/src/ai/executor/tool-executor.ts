// Validates a tool call's arguments against its schema and executes it. Takes an
// already-resolved tool definition - resolving a tool by name is the Tool Registry's
// job (registry.resolve), not the executor's. This keeps the executor's boundary
// strictly to: validate untrusted, model-generated input, then run the tool.
import { InvalidToolArgumentsError, ToolExecutionError } from "../errors.js";
import type { ToolDefinition } from "../types.js";

export interface ToolExecutionResult<TResult = unknown> {
  args: unknown;
  result: TResult;
}

export async function executeTool<TArgs, TResult>(
  tool: ToolDefinition<TArgs, TResult>,
  rawArguments: string,
): Promise<ToolExecutionResult<TResult>> {
  const parsedArguments = parseToolArguments(tool.name, rawArguments);
  const validatedArguments = validateToolArguments(tool, parsedArguments);

  try {
    const result = await tool.execute(validatedArguments);
    return { args: validatedArguments, result };
  } catch (error) {
    throw new ToolExecutionError(tool.name, error);
  }
}

// Never trust the raw JSON string the model produced for `arguments`: fail fast
// instead of silently falling back to an unparsed value.
function parseToolArguments(toolName: string, rawArguments: string): unknown {
  try {
    return JSON.parse(rawArguments);
  } catch (error) {
    throw new InvalidToolArgumentsError(
      toolName,
      "Tool arguments were not valid JSON",
      { cause: error },
    );
  }
}

// Never trust the shape of model-generated arguments either: validate against the
// tool's own schema before it ever reaches business logic.
function validateToolArguments<TArgs>(
  tool: ToolDefinition<TArgs>,
  rawArguments: unknown,
): TArgs {
  const validation = tool.schema.safeParse(rawArguments);

  if (!validation.success) {
    throw new InvalidToolArgumentsError(
      tool.name,
      "Tool arguments failed schema validation",
      { cause: validation.error },
    );
  }

  return validation.data;
}
