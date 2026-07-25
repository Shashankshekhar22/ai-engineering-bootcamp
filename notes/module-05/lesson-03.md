# Lesson 03 – OpenAI SDK Function Calling Workflow

## Learning Objectives

By the end of this lesson, you should be able to:

- Understand how the OpenAI Responses API handles Function Calling.
- Explain the complete tool execution lifecycle.
- Identify the responsibilities of the LLM and your application.
- Implement the Function Calling loop using the OpenAI SDK.
- Explain the architecture in an interview or design discussion.

---

# Agenda

1. Why the SDK Workflow Matters
2. High-Level Architecture
3. The Function Calling Lifecycle
4. Responsibilities of Each Component
5. The OpenAI Responses API Flow
6. Single Tool Call Example
7. Multiple Tool Calls
8. Common Mistakes
9. Production Best Practices
10. Assignment
11. Interview Questions

---

# Part 1 – Why the SDK Workflow Matters

In the previous lesson, we learned how to design Tool Schemas.

However, a Tool Schema alone does nothing.

Someone must:

- Send the tool definitions to the model.
- Receive tool call requests.
- Execute the requested tools.
- Return the tool results.
- Continue the conversation.

That "someone" is **your application**.

The OpenAI SDK provides the communication layer between your application and the model.

---

# High-Level Architecture

```text
                 User
                   │
                   ▼
        Career Copilot Backend
                   │
                   ▼
           OpenAI Responses API
                   │
                   ▼
                 LLM
          (Reasoning Engine)
                   │
         Requests Tool Call
                   │
                   ▼
        Career Copilot Backend
        (Executes the Tool)
                   │
          Tool Result Returned
                   │
                   ▼
                 LLM
                   │
                   ▼
            Final AI Response
                   │
                   ▼
                 User
```

Notice that the **LLM never executes code**.

It only decides **which tool should be called** and **with what arguments**.

---

# Separation of Responsibilities

## User

Provides natural language instructions.

Example:

> Compare my resume with this job description.

---

## LLM

Responsible for:

- Understanding intent.
- Reasoning.
- Selecting the appropriate tool.
- Generating tool arguments.

Not responsible for:

- Database access.
- API calls.
- Authentication.
- Business logic.
- Side effects.

---

## Application

Responsible for:

- Registering available tools.
- Sending tool definitions to the model.
- Validating generated arguments.
- Executing business logic.
- Calling databases and external APIs.
- Handling errors.
- Returning tool results.
- Logging and monitoring.

---

# The Function Calling Lifecycle

```text
User Prompt
      │
      ▼
Backend receives request
      │
      ▼
Backend sends:
- Prompt
- Tool Schemas
      │
      ▼
OpenAI Responses API
      │
      ▼
LLM reasons about the request
      │
      ▼
LLM requests a tool call
      │
      ▼
Backend validates arguments
      │
      ▼
Backend executes tool
      │
      ▼
Backend sends tool result
      │
      ▼
LLM generates final response
      │
      ▼
Backend returns response to user
```

This loop is the foundation of production AI applications.

---

# Single Tool Call Example

User:

> Calculate the ATS score for my resume.

### Step 1

The backend sends:

- User prompt
- Available tool definitions

---

### Step 2

The LLM determines:

> I should call `calculateATSScore`.

It generates the required arguments.

---

### Step 3

The backend:

- Validates arguments.
- Executes the ATS scoring service.
- Receives the result.

---

### Step 4

The backend sends the tool result back to the model.

Example:

```json
{
  "score": 87,
  "strengths": [
    "Strong React experience"
  ],
  "missingSkills": [
    "Kubernetes"
  ]
}
```

---

### Step 5

The model combines:

- User context
- Tool result

to generate a natural language response.

---

# Multiple Tool Calls

Sometimes one tool isn't enough.

Example:

> Compare my resume with this job description and recommend a learning roadmap.

Possible sequence:

```text
analyzeResume
        │
        ▼
calculateATSScore
        │
        ▼
skillGapAnalysis
        │
        ▼
generateLearningRoadmap
```

Each tool builds on the previous result.

The backend orchestrates the entire sequence.

---

# Why the Backend Remains in Control

The backend decides:

- Which tools are available.
- Whether the request is authorized.
- Whether arguments are valid.
- Whether execution should continue.
- How failures are handled.
- What gets logged.

The LLM suggests.

**The backend decides and executes.**

---

# Common Mistakes

Avoid:

- Allowing the model to execute arbitrary code.
- Trusting generated arguments without validation.
- Exposing internal helper methods as tools.
- Returning sensitive information.
- Ignoring failed tool executions.
- Creating tools with multiple unrelated responsibilities.

---

# Production Best Practices

- Validate every tool argument.
- Implement retries for transient failures.
- Add structured logging for every tool invocation.
- Monitor tool execution time.
- Keep tool execution idempotent when side effects exist.
- Restrict tool access using authorization checks.
- Design tools around business capabilities.

---

# Career Copilot Workflow

Example request:

> Analyze my resume and prepare me for this job.

Possible execution flow:

```text
User
   │
   ▼
Career Copilot Backend
   │
   ▼
OpenAI Responses API
   │
   ▼
LLM
   │
   ▼
analyzeResume()
   │
   ▼
compareJobDescription()
   │
   ▼
calculateATSScore()
   │
   ▼
skillGapAnalysis()
   │
   ▼
generateLearningRoadmap()
   │
   ▼
LLM
   │
   ▼
Final Career Advice
```

This orchestration pattern is the basis for more advanced AI systems, including agentic workflows.

---

# Assignment

## Workflow Design Exercise

Design the complete Function Calling workflow for the **Career Copilot** application.

Your design should include:

- User Request
- Backend
- OpenAI Responses API
- LLM
- Tool Calls
- Tool Execution
- Tool Results
- Final Response

Represent the workflow using a sequence diagram or a text-based architecture diagram.

Then answer:

1. Why does the backend remain in control?
2. What could go wrong if the LLM executed tools directly?
3. How would you handle a tool failure?

---

# Interview Questions

1. Describe the complete Function Calling lifecycle.
2. Who executes the tools in Function Calling?
3. What is the role of the OpenAI Responses API?
4. Why does the backend remain the system of control?
5. How do multiple tool calls work?
6. What production concerns must be addressed when executing tools?
7. How would you debug a failed tool invocation?

---

# Next Lesson Preview

In Lesson 04, we'll move beyond the SDK and design a production-ready architecture:

- Tool Registry
- AI Orchestrator
- Dependency Injection
- Clean Architecture
- Extensible Tool Management

This is where we'll transform simple Function Calling into an architecture that can scale from a few tools to dozens without becoming difficult to maintain.