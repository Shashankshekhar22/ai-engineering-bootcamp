# Lesson 04 – Implementing the Tool Execution Loop

## Architecture

```text
                User
                  │
                  ▼
        ResumeController
                  │
                  ▼
        AIOrchestratorService
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
 OpenAI Responses API    Tool Registry
        │                   │
        │            Resolve Tool
        ▼                   │
 Tool Call Requested        │
        │                   ▼
        └────────────► Tool Executor
                            │
                            ▼
                  ResumeService / ATSService /
                  SkillGapService
                            │
                            ▼
                      Tool Result
                            │
                            ▼
                  AIOrchestratorService
                            │
                            ▼
                 OpenAI Responses API
                            │
                            ▼
                     Final Response
```

---

# Components

## ResumeController

Responsibilities

- Accept HTTP request
- Validate input
- Call AIOrchestrator
- Return response

Should NOT

- Execute tools
- Call OpenAI directly
- Contain business logic

---

## AIOrchestratorService

Responsibilities

- Build conversation
- Register tools
- Send request to OpenAI
- Detect tool calls
- Execute tools
- Send tool results
- Return final response

This is the heart of the AI workflow.

---

## Tool Registry

Responsibilities

- Register all available tools
- Lookup tools by name
- Keep OpenAI definitions in one place
- Prevent duplicate definitions

Example tools

- analyzeResume
- calculateATSScore
- skillGapAnalysis

---

## Tool Executor

Responsibilities

- Validate arguments
- Execute requested tool
- Handle failures
- Return structured results

Should never contain HTTP logic.

---

## Business Services

Examples

- ResumeService
- ATSService
- SkillGapService

Responsibilities

- Business rules
- Domain logic
- Database access
- External APIs

These services should not know anything about OpenAI.

---

# Execution Flow

1. User sends request.
2. Controller calls AIOrchestrator.
3. AIOrchestrator sends prompt + tools.
4. OpenAI requests a tool.
5. Tool Registry resolves the tool.
6. Tool Executor validates input.
7. Business Service executes.
8. Result returned to OpenAI.
9. OpenAI generates final answer.
10. Controller returns response.

---

# Clean Architecture

Presentation Layer

- Controllers

Application Layer

- AIOrchestrator
- Tool Registry
- Tool Executor

Domain Layer

- ResumeService
- ATSService
- SkillGapService

Infrastructure Layer

- OpenAI SDK
- Database
- External APIs

---

# Assignment

Implement the following:

- AIOrchestratorService
- ToolRegistry
- ToolExecutor
- One working tool (analyzeResume)

Do not worry about ATS or Skill Gap yet.

The goal is to build the complete execution loop for a single tool.

---

# Deliverables

- AIOrchestratorService
- ToolRegistry
- ToolExecutor
- analyzeResume tool
- End-to-end Function Calling flow
