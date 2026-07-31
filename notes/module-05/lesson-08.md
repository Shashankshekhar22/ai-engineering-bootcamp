# Lesson 08 – Production Hardening

## Learning Objectives

By the end of this lesson, you will be able to:

- Design AI systems for production environments.
- Handle retries and transient failures.
- Implement idempotent tool execution.
- Improve observability with structured logging and tracing.
- Design secure tool execution.
- Understand AI-specific production risks.

---

# Engineering Blueprint

Before writing any code, answer these questions:

1. What production problem are we solving?
2. Why is this problem unique to AI systems?
3. Which component owns the responsibility?
4. What trust boundary does it cross?
5. What happens when it fails?
6. Can the system recover?
7. How do we observe and debug it?

---

# Why Production Hardening?

Most tutorials stop here:

User
↓

LLM
↓

Tool

↓

Done

Production systems look more like this:

```text
                 User
                   │
                   ▼
             API Gateway
                   │
                   ▼
            ResumeController
                   │
                   ▼
           AI Orchestrator
          ┌──────┼────────┐
          ▼      ▼        ▼
      Logger   Metrics   Tracing
          │
          ▼
        OpenAI
          │
          ▼
     Tool Executor
          │
          ▼
     Business Services
          │
          ▼
 Database / External APIs
```

Everything important happens **around** the model.

---

# Production Concerns

## 1. Validation

Question:

Can we trust tool arguments?

No.

Even though the model generated them.

Always validate:

- Required fields
- Types
- Length
- Allowed values

Validation belongs in:

Tool Executor

---

## 2. Authorization

Question:

Can every user execute every tool?

Example:

```text
deleteUser()
```

Should the LLM decide?

No.

Authorization belongs to:

Application

Never the LLM.

---

## 3. Rate Limiting

Prevent:

- Prompt abuse
- Tool abuse
- Infinite loops

Examples:

- Max requests/minute
- Max tool calls/request
- Max tokens

---

## 4. Idempotency

Imagine:

sendEmail()

↓

Timeout

↓

Retry

↓

sendEmail()

The user receives two emails.

Some tools are safe to retry.

Some are not.

Always identify:

Read operations

vs

Write operations

---

## 5. Retry Strategy

Retry:

- Temporary network failures
- OpenAI timeouts
- Database reconnects

Don't retry:

- Invalid schema
- Authorization failure
- Validation errors

---

## 6. Logging

Never log:

- API keys
- Resume text
- Personal information

Instead log:

- Tool name
- Duration
- Success/Failure
- Correlation ID

---

## 7. Metrics

Useful metrics include:

- Tool execution count
- Tool failure rate
- Validation failures
- Retry count
- Average execution time
- Average LLM latency

---

## 8. Tracing

A single request should be traceable:

Request

↓

OpenAI

↓

Tool

↓

Database

↓

Response

Without tracing, debugging production AI systems becomes very difficult.

---

## 9. Timeouts

Every external dependency should have a timeout.

Examples:

OpenAI

5–30 seconds

Database

1–5 seconds

Third-party APIs

Configurable

Never wait forever.

---

## 10. Security

Treat the LLM as an untrusted planner.

The application must enforce:

- Authentication
- Authorization
- Input validation
- Output sanitization
- Tool allow-list

---

# Trust Boundaries

```text
User
 │
 ▼
──────────────────────────
Application Boundary
──────────────────────────

Controller

↓

AI Orchestrator

↓

Tool Executor

↓

Business Services

──────────────────────────
External Services
──────────────────────────

OpenAI

Database

REST APIs
```

Each boundary requires validation.

---

# Failure Recovery

Question:

What if one tool fails?

Should the entire workflow stop?

Not always.

Example:

Resume Analysis

↓

ATS Score ✅

↓

Skill Gap ❌

↓

Roadmap ✅

The LLM can still produce a useful answer using partial results.

Design for graceful degradation where appropriate.

---

# Assignment

Review your current Career Copilot implementation.

For each component:

- AI Orchestrator
- Tool Registry
- Tool Executor
- AnalyzeResumeTool

Answer:

1. What are the production risks?
2. What logging would you add?
3. What metrics would you collect?
4. What should be retried?
5. What should never be retried?
6. Which failures should be exposed to the user?
7. Which failures should only be logged?

Document your reasoning.

---

# Interview Questions

1. Why should the backend never blindly trust tool arguments?
2. What is idempotency and why is it important?
3. How would you debug a failed AI request in production?
4. Which operations are safe to retry?
5. Why shouldn't authorization be delegated to the LLM?
6. How would you monitor an AI orchestration service?
7. What is graceful degradation?

---

# Why This Design?

A production AI system is much more than an LLM call.

Its reliability depends on:

- Clear trust boundaries
- Validation
- Observability
- Error handling
- Security
- Operational resilience

The model provides reasoning.

Your application provides safety and reliability.

That division of responsibilities is what distinguishes production AI engineering from experimentation.