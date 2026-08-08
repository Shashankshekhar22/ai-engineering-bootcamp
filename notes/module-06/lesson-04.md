# Lesson 04 – Prompt Templates & Prompt Management

## Learning Objectives

By the end of this lesson, you will be able to:

- Understand why prompts should be treated as software assets.
- Design a Prompt Management architecture.
- Build reusable prompt templates.
- Separate static instructions from dynamic context.
- Understand prompt composition.
- Prepare Career Copilot for prompt versioning.

---

# Engineering Blueprint

Before writing code, answer these questions:

1. Where should prompts live?
2. Who owns prompt composition?
3. What parts of a prompt are reusable?
4. How should prompts evolve over time?
5. How do we avoid prompt duplication?

---

# The Problem

Imagine this project after one year.

Career Copilot now contains:

- Resume Analysis
- ATS Score
- Skill Gap Analysis
- Learning Roadmap
- Resume Rewrite
- Cover Letter Generator
- LinkedIn Optimizer
- Interview Coach
- Career Advisor
- Job Search Assistant

Every feature contains:

```typescript
const prompt = `
You are an expert recruiter...
...
`;
```

Eventually you'll have:

- 50+ prompts
- 15 engineers
- 3 AI models
- Multiple prompt versions
- A/B testing
- Enterprise customers

This architecture doesn't scale.

---

# Production Architecture

Instead of hardcoding prompts:

```text
AI Orchestrator
        │
        ▼
Prompt Repository
        │
        ▼
Prompt Builder
        │
        ▼
Prompt Renderer
        │
        ▼
OpenAI
```

Notice how similar this is to the Tool architecture.

Everything becomes modular.

---

# Responsibilities

## Prompt Repository

Owns:

- Prompt storage
- Prompt lookup
- Prompt versions

Should NOT:

- Replace variables
- Build prompts
- Call OpenAI

---

## Prompt Builder

Owns:

- Combining prompt fragments
- Injecting variables
- Selecting versions

Should NOT:

- Store prompts
- Call OpenAI

---

## Prompt Renderer

Owns:

- Rendering the final prompt
- Replacing placeholders
- Returning the completed prompt

Should NOT:

- Decide business logic
- Fetch prompts

---

# Prompt Composition

Instead of:

```typescript
const prompt = `
Analyze this resume...
`
```

Think in reusable fragments.

```text
System Prompt
        │
        ▼
Safety Prompt
        │
        ▼
Role Prompt
        │
        ▼
Task Prompt
        │
        ▼
Output Prompt
```

The final prompt is assembled at runtime.

---

# Example

Resume Analysis

Instead of one giant prompt:

```text
You are...
Never invent...
Return JSON...
Analyze...
```

Split it into:

```
system.md
```

```
safety.md
```

```
resume-analysis.md
```

```
json-output.md
```

The Prompt Builder combines them.

---

# Suggested Folder Structure

```text
src/

prompts/

├── system/
│      system.prompt.md
│
├── safety/
│      safety.prompt.md
│
├── tasks/
│      resume-analysis.prompt.md
│      ats-score.prompt.md
│      skill-gap.prompt.md
│
├── output/
│      json.prompt.md
│      markdown.prompt.md
│
├── builders/
│      prompt-builder.ts
│
├── repository/
│      prompt-repository.ts
│
└── renderer/
       prompt-renderer.ts
```

Notice how this mirrors our Tool architecture.

---

# Prompt Lifecycle

```text
Developer

↓

Write Prompt

↓

Store Prompt

↓

Version Prompt

↓

Build Prompt

↓

Render Prompt

↓

OpenAI

↓

Evaluate

↓

Improve

↓

Repeat
```

Prompts become living software assets.

---

# Why This Design?

Benefits:

- Single source of truth
- Prompt reuse
- Easier maintenance
- Prompt versioning
- A/B testing
- Easier testing
- Clear separation of concerns

---

# Assignment

Design the Prompt Management architecture for Career Copilot.

Answer the following:

## Prompt Repository

- What should it store?
- Raw prompt fragment text (system, safety, task, output), one fragment per file/entry,
  keyed by name and version. Not assembled prompts - just the individual building
  blocks, exactly as they live under `src/prompts/{system,safety,tasks,output}/`.

- What should it return?
- The raw, unmodified template text for a requested name/version, placeholders
  (`{{variable}}`) still intact. A lookup for a name/version that doesn't exist should
  fail explicitly (a typed not-found error), the same way `ToolRegistry.resolve()`
  throws `ToolNotFoundError` instead of returning `undefined` and letting the caller
  silently proceed with nothing.

- What should it NOT do?
- Replace variables, decide which fragments belong together for a given task, or call
  OpenAI. It is pure storage/lookup - identical in spirit to how `ToolRegistry` only
  registers and resolves tools, and never executes them.

---

## Prompt Builder

- What inputs should it accept?
- A task name (e.g. `"resume-analysis"`), the variables to inject (e.g.
  `{ resumeText, jobDescription }`), and optionally a version/experiment selector for
  A/B testing.

- What output should it return?
- The final, fully composed prompt string, ready to hand to OpenAI's `instructions`/
  `input`.

- What responsibilities should it own?
- Deciding *which* fragments apply to a task (e.g. include `output/json.prompt.md`
  only when the task needs structured output), fetching them from the Repository in
  the right order (system -> safety -> task -> output), selecting which version of
  each fragment to use, and handing the combined template plus the variables map to
  the Renderer for substitution. It owns composition and version selection - not the
  low-level string replacement itself.

---

## Prompt Renderer

- Why shouldn't the repository replace variables?
- Because that would couple storage to a specific templating mechanism. If the
  Repository also substitutes placeholders, swapping template syntax (or how a value
  gets formatted) means touching every stored prompt's retrieval path. It also means
  you can never fetch a raw template for inspection, testing, or reuse with a
  different variable set - every read would force one specific rendering.

- Why separate rendering from storage?
- Single-responsibility and reusability: one Renderer implementation serves every
  prompt regardless of where it's stored, it can be unit-tested with throwaway
  template strings with no Repository involved at all, and the templating engine can
  be swapped independently of prompt content. It's the same reasoning that keeps
  `ToolExecutor` ignorant of how tools are looked up (`ToolRegistry`'s job) - each
  piece stays small, testable, and swappable on its own.

---

## Folder Structure

Design a production-ready prompt folder structure.

```text
src/prompts/
├── system/system.prompt.md
├── safety/safety.prompt.md
├── tasks/
│   ├── resume-analysis.prompt.md
│   ├── ats-score.prompt.md
│   └── skill-gap.prompt.md
├── output/
│   ├── json.prompt.md
│   └── markdown.prompt.md
├── builders/prompt-builder.ts
├── repository/prompt-repository.ts
└── renderer/prompt-renderer.ts
```

One deliberate deviation from the diagram earlier in this lesson: `prompts/` lives as
a sibling of `ai/`, `resume/`, and `ats/` under `src/`, not nested inside `ai/`.
Prompts are their own domain-level concern reused across every AI-facing feature, the
same way `resume/` and `ats/` sit alongside `ai/` rather than inside it.

---

## Prompt Evolution

Suppose Product changes the resume prompt every week.

How does this architecture make those changes safer than hardcoded prompts?

- The change is content-only: editing `tasks/resume-analysis.prompt.md` (or adding a
  new version in the Repository) touches no orchestrator, tool, or business-logic
  code, so it doesn't ride along with unrelated code changes in the same deploy.
- Versioning means the previous prompt is never lost - a regression can be rolled back
  by pointing the Builder at the prior version instantly, without a code revert/redeploy.
- Every past response stays reproducible, because you know exactly which prompt
  version produced it - useful for debugging a complaint about a response from three
  weeks ago.
- Product can experiment safely: two versions can run side by side (Builder selects
  by variant) and get compared before fully cutting over, instead of a single
  hardcoded string being replaced blind.

With hardcoded prompts, every one of these requires a code change, a review, a
deploy, and - if it goes wrong - another deploy to revert.

---

# Interview Questions

1. Why should prompts be treated as software assets?
- Because they directly determine product behavior and output quality, exactly like
  code does. That means they need the same discipline: version control, review,
  testing, and rollback - not ad-hoc inline strings that change unreviewed and
  untracked.

2. Why separate Prompt Repository and Prompt Builder?
- Same reason `ToolRegistry` and `ToolExecutor` are separate: storage/lookup is a
  different concern from composition. Separating them means you can change *how*
  prompts are stored (files today, a database or CMS tomorrow) without touching
  composition logic, and change *how* fragments are combined without touching storage.

3. Why shouldn't prompts be hardcoded?
- Hardcoded prompts can't be versioned or rolled back independently of a code deploy,
  can't be A/B tested without branching logic scattered through the codebase, get
  duplicated across features (the "50+ prompts, 15 engineers" problem this lesson
  opens with), and can't be edited or reviewed by non-engineers without touching
  application code.

4. How does prompt versioning reduce deployment risk?
- A prompt regression can be reverted on its own, instantly, without a code
  rollback. Multiple versions can be evaluated side by side before fully switching
  over. And any historical response can always be traced back to the exact prompt
  version that produced it, for debugging or auditing.

5. What responsibilities belong in a Prompt Renderer?
- Purely mechanical template substitution: take a template string and a variables
  object, replace the placeholders, and return the completed string. It should never
  decide which template to use, fetch anything itself, or apply business logic - it's
  a dumb, fully reusable templating engine.

6. How would you support A/B testing for prompts?
- Store multiple named versions of the same prompt in the Repository (e.g.
  `resume-analysis@v1`, `resume-analysis@v2`), have the Builder accept an
  experiment/variant selector (from a feature flag or user bucket) to decide which
  version to fetch and combine, and log which version produced each response so
  results can be measured per variant - all without touching orchestrator or tool code.

---

# Production Evolution

## V1

Hardcoded prompt strings.

---

## V2

Prompt files.

---

## V3

Prompt Repository + Builder.

---

## Production

- Versioned prompts
- Dynamic composition
- Prompt A/B testing
- Feature flags
- Prompt analytics
- Prompt evaluation
- Prompt rollback
- Model-specific prompt variants

This is how large-scale AI applications manage prompt complexity while keeping prompts maintainable, testable, and reusable.