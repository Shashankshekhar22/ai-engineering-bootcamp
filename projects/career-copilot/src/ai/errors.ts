// Typed failure modes for tool resolution, validation, and execution. Keeping these
// distinct lets callers (the orchestrator, tests) handle each case explicitly instead
// of branching on string messages.

export class ToolNotFoundError extends Error {
  constructor(public readonly toolName: string) {
    super(`Unknown tool "${toolName}"`);
    this.name = "ToolNotFoundError";
  }
}

export class InvalidToolArgumentsError extends Error {
  constructor(
    public readonly toolName: string,
    message: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = "InvalidToolArgumentsError";
  }
}

export class ToolExecutionError extends Error {
  constructor(public readonly toolName: string, cause: unknown) {
    super(
      `Tool "${toolName}" execution failed: ${
        cause instanceof Error ? cause.message : String(cause)
      }`,
      { cause },
    );
    this.name = "ToolExecutionError";
  }
}

export class MaxToolIterationsExceededError extends Error {
  constructor(
    public readonly maxIterations: number,
    public readonly toolNamesInvoked: string[],
  ) {
    super(
      `Exceeded maximum of ${maxIterations} tool-calling iteration(s) without a final response. ` +
        `Tools invoked so far: ${toolNamesInvoked.length > 0 ? toolNamesInvoked.join(", ") : "none"}.`,
    );
    this.name = "MaxToolIterationsExceededError";
  }
}
