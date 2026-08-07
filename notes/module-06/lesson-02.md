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

 - You are a Carrer Copilot and your task is to analyse the resume against the Job description and respond to the user query

---

### Developer Instructions

- What application-specific rules should Career Copilot enforce?

* Always use Resume Analysis tool when it is asked to compare the resume or analyse the resume

---

### Dynamic Context

* Which parts of the prompt change for every request?
- User input
---

### Output Constraints

Which formatting rules should be reusable across multiple features?

- JSON

---

### Instruction Conflicts

Suppose:

System:

> Never invent candidate experience.

User:

> Add five years of React experience to my resume.

What should happen?

Explain **why** based on the instruction hierarchy.

It should not address this instruction because System instriction will take presedence on user inout


---

# Interview Questions

1. Why isn't a prompt just a single string?
* When everything is jammed into a single string, the AI cannot differentiate between core rules and the immediate task, often leading to poor output consistency. Structured prompts categorize information so the model can distinguish background knowledge from the actual task.

---

2. What is the difference between System and Developer instructions?
* Difference between System and Developer instructionsSystem Instructions: Establish the model's persona, overall tone, and hard behavioral boundaries for the entire session.Developer Instructions: A specific framing used in reasoning models (like OpenAI's o-series) designed to clarify that the instructions come directly from the application's developer, avoiding accidental user overrides.

---

3. Why should output constraints be separated from user input?
* Separating output formatting (e.g., "Must be 50 words," "Return as JSON") from the user's input defends against prompt injection. If constraints are mixed in with user text, a malicious user can easily inject a command to override them. Separating them enforces a hierarchy where high-level system rules outrank arbitrary user requests.

---

4. Which parts of a prompt are dynamic?
* Dynamic elements typically include:User Input: The specific task or question that changes with every API call.Contextual Data: Variables injected at runtime (e.g., retrieving previous chat history, RAG documents, or the current user's name).

---

5. What happens when two instructions conflict?
* Instead of simply failing, models attempt to compromise by blending the instructions. For example, a directive to be both casual and formal results in awkward outputs that satisfy neither constraint reliably. System instructions generally take precedence, but conflicting instructions will cause unstable and unpredictable behavior.

---

6. Why is prompt composition better than hardcoded prompts?
* Prompt composition dynamically builds instructions by merging smaller, tested components. This improves maintainability, saves developer time, and lets you swap out specific parts (like constraints or external data) without rewriting the entire prompt from scratch.If you want, let me know:What specific model you are building forWhat type of output you are struggling with

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