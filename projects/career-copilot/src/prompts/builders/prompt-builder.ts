// Prompt Builder: owns combining prompt fragments (system, safety, task, output),
// injecting variables, and selecting versions. Should NOT store prompts or call OpenAI.
//
// Scaffold only - see notes/module-06/lesson-04.md for the full design.

export interface PromptBuilder {
  // TODO: build(taskName: string, variables: Record<string, unknown>): string
}
