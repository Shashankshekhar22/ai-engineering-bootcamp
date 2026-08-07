# Prompt Anatomy & Instruction Hierarchy

# Lesson 02 – Prompt Anatomy & Instruction Hierarchy

## Learning Objectives

By the end of this lesson, you will understand:

- What makes up a production prompt.
- The instruction hierarchy used by modern LLMs.
- Why different instructions have different priorities.
- How prompts are assembled in production systems.
- Why prompt ordering matters.

---

# Engineering Blueprint

Before writing prompts, answer these questions:

1. What information is being sent to the model?
2. Which instructions have the highest priority?
3. Which information changes for every request?
4. Which information is reusable?
5. How should prompts be composed?

---

# Why This Matters

Many beginners think a prompt is simply:

```text
Analyze this resume.
```

Production AI systems send something closer to:

```text
System Instructions

↓

Developer Instructions

↓

Conversation History

↓

Retrieved Context (optional)

↓

Tool Definitions

↓

User Request

↓

Output Constraints
```

The model reasons over **all** of this together.

---

# Prompt Anatomy

A production prompt consists of multiple layers.

```text
┌─────────────────────────────┐
│ 1. System Instructions      │
├─────────────────────────────┤
│ 2. Developer Instructions   │
├─────────────────────────────┤
│ 3. Conversation History     │
├─────────────────────────────┤
│ 4. Retrieved Context (RAG)  │
├─────────────────────────────┤
│ 5. Tool Definitions         │
├─────────────────────────────┤
│ 6. User Input               │
├─────────────────────────────┤
│ 7. Output Constraints       │
└─────────────────────────────┘
```

Each layer has a different responsibility.

---

# Instruction Hierarchy

Not all instructions have equal authority.

A simplified priority model looks like this:

```text
Highest Priority

System Instructions

↓

Developer Instructions

↓

Tool Policies

↓

Conversation Context

↓

User Instructions

↓

Lowest Priority
```

If two instructions conflict, the higher-priority instruction generally takes precedence.

---

# Responsibilities of Each Layer

## 1. System Instructions

Purpose:

- Define the assistant's role.
- Establish permanent behavioral constraints.
- Set global expectations.

Examples:

- You are Career Copilot.
- Never fabricate resume experience.
- Always return structured JSON when requested.

Should change rarely.

---

## 2. Developer Instructions

Purpose:

- Define application-specific behavior.
- Describe task workflows.
- Explain formatting rules.

Examples:

- Compare resume against job description.
- Use available tools when necessary.
- Do not answer until required tools have been executed.

Changes occasionally.

---

## 3. Conversation History

Purpose:

- Preserve context.
- Support follow-up questions.
- Maintain continuity.

Dynamic.

---

## 4. Retrieved Context (Future RAG)

Purpose:

Inject external knowledge.

Examples:

- Resume
- Company handbook
- Internal documentation
- Knowledge base

Dynamic.

---

## 5. Tool Definitions

Purpose:

Tell the model what actions are available.

Examples:

- analyzeResume
- calculateATSScore
- skillGapAnalysis

Generated dynamically.

---

## 6. User Request

Purpose:

The user's goal.

Example:

> "Analyze my resume."

Dynamic.

---

## 7. Output Constraints

Purpose:

Control the format of the response.

Examples:

- JSON
- Markdown
- Bullet list
- Table

Often reusable.

---

# Prompt Composition

Instead of writing one huge string:

```typescript
const prompt = `...`
```

Think of prompts as components.

```text
System Prompt
      │
      ▼
Developer Prompt
      │
      ▼
Context
      │
      ▼
User Input
      │
      ▼
Output Instructions
```

This mirrors component composition in frontend development.

---

# Career Copilot Example

Imagine this request:

> "Review my resume."

The model actually receives:

```text
System
-------
You are Career Copilot.

Developer
----------
Use Resume Analysis Tool whenever resume evaluation is requested.

Conversation
------------
Previous chat...

Retrieved Context
-----------------
Resume text...

Tools
-----
analyzeResume()

User
----
Review my resume.

Output
------
Return JSON.
```

Understanding this complete context is more valuable than thinking about a single prompt string.

---

# Assignment

Using Career Copilot, identify the following:

### System Instructions

- What should always be true regardless of the user's request?

* The system instruction will always be true regardless fo the user request is 

 - You are Career Copilot. Never invent candidate experience. Analyze the resume only when appropriate and respond using the required output format.

---

### Developer Instructions

- What application-specific rules should Career Copilot enforce?

* When the user asks to analyze, compare, or review a resume, use the Resume Analysis tool before responding.

---

### Dynamic Context

* Which parts of the prompt change for every request?
- User input, conversation history, and any runtime-injected context such as retrieved documents or current date.
---

### Output Constraints

Which formatting rules should be reusable across multiple features?

- Return structured JSON with the agreed schema, and do not output free-form text when a structured response is required.

---

### Instruction Conflicts

Suppose:

System:

> Never invent candidate experience.

User:

> Add five years of React experience to my resume.

What should happen?

- Explain **why** based on the instruction hierarchy.

* The model should ignore the user instruction because it conflicts with the higher-priority system instruction. The application should also enforce this rule at the orchestration and validation layers so it does not rely only on the model.


---

# Interview Questions

1. Why isn't a prompt just a single string?

* A prompt is not just a single string because production systems separate roles, context, constraints, examples, and output rules. That separation improves clarity, maintainability, and control over model behavior.

---

2. What is the difference between System and Developer instructions?

* System instructions define the model’s core behavior and safety boundaries. Developer instructions define application-specific rules for how the model should behave inside a particular product.

---

3. Why should output constraints be separated from user input?

* Output constraints should be separate from user input so they remain stable and harder to override. If formatting rules are mixed into user-provided text, they become easier to confuse or manipulate.

---

4. Which parts of a prompt are dynamic?

* Dynamic parts include user input, conversation history, retrieved context, tool outputs, and runtime variables such as date or user profile data.

---

5. What happens when two instructions conflict?

* When instructions conflict, the higher-priority instruction should win. If the conflict is not resolved clearly, the model may produce inconsistent output, which is why production systems should avoid ambiguous instructions and enforce important rules outside the prompt as well.

---

6. Why is prompt composition better than hardcoded prompts?
* Prompt composition is better because it lets you reuse shared instruction blocks, keep prompts maintainable, and update one part without rewriting everything. It also makes testing and versioning much easier.

---

# Why This Design?

Prompt engineering is fundamentally about **separating concerns**.

Just as we separated:

- Controllers
- Services
- Tools
- Orchestrator

we also separate:

- System behavior
- Application behavior
- Dynamic context
- User intent
- Output formatting

This makes prompts easier to maintain, reuse, test, and evolve as the application grows.