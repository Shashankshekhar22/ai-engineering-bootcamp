// Prompt Renderer: owns rendering the final prompt and replacing placeholders.
// Should NOT decide business logic or fetch prompts.
//
// Scaffold only - see notes/module-06/lesson-04.md for the full design.

export interface PromptRenderer {
  // TODO: render(template: string, variables: Record<string, unknown>): string
}
