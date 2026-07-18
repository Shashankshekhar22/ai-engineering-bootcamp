# Lesson 01 – Function Calling Fundamentals

## Learning Objectives

By the end of this lesson, you should be able to:

- Explain the motivation behind Function Calling.
- Differentiate Function Calling from Structured Outputs.
- Understand the Function Calling lifecycle.
- Identify when Function Calling is the right choice.
- Explain the design to an interviewer or a teammate.

---

# Agenda

Today's lesson will cover:

1. The evolution of LLM capabilities
2. The limitations of Structured Outputs
3. Why Function Calling was introduced
4. The Function Calling lifecycle
5. When to use Function Calling vs Structured Outputs
6. Real-world production examples
7. Best practices
8. Assignment
9. Interview questions

---

# Part 1 — The Evolution of LLM Applications

Let's look at how AI applications have evolved.

## Stage 1 — Text Generation

The earliest applications looked like this:

```text
User
   │
   ▼
LLM
   │
   ▼
Natural Language Response
```

### Example

> Summarize this resume.

The model returns plain text.

**Limitation:** Great for humans, difficult for software to consume reliably.

---

## Stage 2 — Structured Outputs

To make responses machine-readable, we introduced schemas.

```text
User
   │
   ▼
LLM
   │
   ▼
Structured JSON
```

### Example

```json
{
  "name": "Shashank Shekhar",
  "skills": ["React", "Angular", "AWS"]
}
```

This is ideal when the model's job is **extracting or generating structured information**.

---

## Stage 3 — Function Calling

Now consider this request:

> Find React jobs in Bangalore.

Can Structured Outputs solve this?

It can produce JSON like:

```json
{
  "skill": "React",
  "location": "Bangalore"
}
```

But it **cannot** actually search a jobs database.

### Why?

Because an LLM doesn't have direct access to:

- Your database
- REST APIs
- Files
- Email systems
- Calendars
- Payment gateways
- Vector databases

It can only predict tokens.

This is the gap Function Calling fills.

---

# First Principles

One of the most important concepts in AI Engineering is:

> **An LLM is a reasoning engine, not an execution engine.**

### Example

Suppose the user says:

> Schedule an interview for tomorrow at 3 PM.

The model can reason about:

- The user's intent
- The date and time
- Which calendar should be used

But it **cannot create the meeting**.

Your backend must execute that action.

Therefore:

### Model Responsibility

> "I have determined that the `scheduleInterview` tool should be called with these arguments."

### Application Responsibility

> "I'll validate those arguments, call the calendar API, handle failures, and return the result."

This separation of responsibilities is one of the foundations of production AI systems.

---

# Why Not Just Ask the Model?

A common question is:

> Why can't the model simply generate the API call?

Because it cannot safely perform execution.

Problems include:

- It doesn't know your application's APIs.
- It can't authenticate.
- It can't authorize users.
- It can't guarantee side effects occur only once.
- It can't safely communicate with external systems.

Your application must remain in control.

---

# Structured Outputs vs Function Calling

| Structured Outputs | Function Calling |
|--------------------|------------------|
| Produces structured data | Requests execution of a tool |
| No side effects | May trigger side effects |
| Best for extraction, classification and generation | Best for interacting with external systems |
| Output is consumed by your application | Output comes from a tool executed by your application |

### Use Structured Outputs For

- Resume parsing
- Invoice extraction
- Sentiment analysis
- Classification
- Summarization into a schema

### Use Function Calling For

- Searching jobs
- Saving to a database
- Sending emails
- Retrieving documents
- Booking interviews
- Querying a vector database

---

# The Function Calling Lifecycle

```text
User
   │
   ▼
Application
   │
   ▼
LLM (receives available tools)
   │
   ▼
Tool Call Requested
   │
   ▼
Application Executes Tool
   │
   ▼
Tool Result
   │
   ▼
LLM
   │
   ▼
Final Response
```

Notice that the application participates twice:

1. Sending tool definitions to the model.
2. Executing the requested tool and returning its result.

This orchestration layer is what transforms an LLM integration into a production AI application.

---

# Production Example — Career Copilot

Suppose a user asks:

> Compare my resume against this job description and recommend a learning plan.

The LLM alone cannot:

- Parse a PDF
- Retrieve the job description
- Calculate an ATS score
- Search a learning knowledge base

Instead, it requests tools such as:

1. `analyzeResume`
2. `compareJobDescription`
3. `calculateATS`
4. `generateLearningRoadmap`

The application executes these tools, and the LLM synthesizes the final response.

---

# Best Practices

- Expose business capabilities instead of helper methods.
- Keep each tool focused on a single responsibility.
- Validate all arguments before execution.
- Treat the model as an untrusted caller.
- Log every tool invocation.
- Design tool execution to be idempotent whenever side effects are involved.

---

# Assignment

## Architecture Exercise

If Function Calling had never been introduced, how would you build an AI application that needs to interact with:

- Databases
- REST APIs
- External services

Describe:

- Your architecture
- The challenges you would face
- Why Function Calling provides a cleaner solution

Focus on system design rather than implementation.

---

# Interview Questions

1. Why was Function Calling introduced when Structured Outputs already existed?
2. Can an LLM execute your backend code directly? Why or why not?
3. What is the role of the application in the Function Calling lifecycle?
4. When would you choose Structured Outputs over Function Calling?
5. What are the security implications of exposing tools to an LLM?

---

# Think Before the Next Lesson

## Architecture Question

> **Who is actually in control during Function Calling—the LLM or your application?**

Think about this from a system architecture perspective. Your answer will influence how we design the Tool Registry and AI Orchestrator in the next lesson.