# Lesson 02 – Tool Schema Design

## Learning Objectives

By the end of this lesson, you should be able to:

- Explain what a Tool Schema is.
- Understand why Tool Schemas are required.
- Design production-quality tool definitions.
- Follow naming and schema design best practices.
- Avoid common schema design mistakes.
- Design reusable tools for AI applications.

---

# Agenda

1. What is a Tool Schema?
2. Why do LLMs need Tool Schemas?
3. Anatomy of a Tool Definition
4. JSON Schema Fundamentals
5. Tool Naming Best Practices
6. Parameter Design
7. Common Design Mistakes
8. Production Best Practices
9. Assignment
10. Interview Questions

---

# Part 1 – What is a Tool Schema?

A Tool Schema is a structured contract that tells the LLM:

- What tools are available
- What each tool does
- What inputs are required
- What inputs are optional
- The expected format of each parameter

Think of it as an **API contract** between your application and the LLM.

Without this contract, the model has no knowledge of:

- Which tools exist
- When to use them
- How to call them
- What arguments are expected

---

# Why Do LLMs Need Tool Schemas?

Remember one important fact:

> The LLM cannot inspect your codebase.

It cannot:

- Read your TypeScript files
- Discover Express routes
- Understand your service layer
- Infer database structure

Instead, your application explicitly tells the model:

> "These are the only tools you are allowed to use."

The schema becomes the model's interface to your application.

---

# Tool Schema Analogy

Imagine you hire a new developer.

Without documentation, they don't know:

- Available APIs
- Request formats
- Required fields
- Response structure

A Tool Schema serves the same purpose for an LLM.

It is the documentation and contract combined into one machine-readable format.

---

# Anatomy of a Tool Definition

A typical tool definition contains:

- Name
- Description
- Parameters
- Required fields
- Parameter types

Conceptually:

```text
Tool
├── Name
├── Description
└── Parameters
    ├── Type
    ├── Properties
    └── Required Fields
```

Each part helps the model determine:

- Should I use this tool?
- Which arguments should I generate?
- Are all required values present?

---

# Why Descriptions Matter

Many developers focus only on parameter names.

In reality, the **description** is one of the strongest signals the model uses when deciding whether a tool is appropriate.

Poor description:

> Gets resume

Better description:

> Analyze a candidate's resume and extract skills, experience, education, and achievements.

The second description gives the model much better context.

---

# Parameter Design

Good parameter names are:

- Clear
- Specific
- Business-oriented

Good examples:

- resumeText
- jobDescription
- candidateId

Avoid:

- data
- input
- value
- payload

Ambiguous parameter names increase the likelihood of incorrect tool calls.

---

# Required vs Optional Parameters

Every parameter should be intentionally classified.

Required:

- Information without which the tool cannot function.

Optional:

- Filters
- Preferences
- Configuration values

Avoid making everything required "just in case."

---

# JSON Schema Fundamentals

Tool Schemas commonly use JSON Schema concepts such as:

- type
- properties
- required
- description
- enum
- items

These definitions help the model generate correctly structured arguments.

Understanding JSON Schema is essential because it is the language used to describe tool inputs.

---

# Common Design Mistakes

Avoid:

- Generic tool names
- Generic parameter names
- Missing descriptions
- Overloaded tools that perform multiple responsibilities
- Too many optional parameters
- Business logic hidden inside tool descriptions

A well-designed tool should have a single, clear responsibility.

---

# Production Best Practices

- Design tools around business capabilities, not implementation details.
- Keep tools focused on one responsibility.
- Use meaningful names and descriptions.
- Validate every generated argument before execution.
- Version tool contracts when making breaking changes.
- Keep schemas stable to reduce unexpected model behavior.

---

# Career Copilot Example

Instead of creating a generic tool like:

- processData

Design business-focused tools such as:

- analyzeResume
- calculateATSScore
- compareJobDescription
- generateLearningRoadmap

These names clearly communicate intent to both the LLM and human developers.

---

# Assignment

Design Tool Schemas for the following Career Copilot features:

1. Resume Analysis
2. ATS Score Calculation
3. Skill Gap Analysis

For each tool, define:

- Tool Name
- Description
- Parameters
- Required Parameters
- Optional Parameters

Do not write code yet.

Focus on designing clear, production-ready contracts.

---

# Interview Questions

1. What is a Tool Schema?
2. Why are descriptions important in Function Calling?
3. What information does a Tool Schema provide to an LLM?
4. What makes a good tool name?
5. Why should tools follow the Single Responsibility Principle?
6. Why is JSON Schema used for tool definitions?
7. What are common mistakes when designing Tool Schemas?

---

# Next Lesson Preview

In Lesson 03, we will move from **design** to **implementation** by exploring the OpenAI Responses API.

You'll learn:

- How tools are registered with the model
- How the model requests tool execution
- How your application executes the tool
- How results are returned to the model
- The complete Function Calling workflow used in production systems