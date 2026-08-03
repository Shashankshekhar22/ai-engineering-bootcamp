# Module 06 – Prompt Engineering

## Goal

Learn how to design, build, test, version, and maintain production-quality prompts for AI applications.

By the end of this module, you should be able to build prompt systems that are:

- Reusable
- Maintainable
- Testable
- Secure
- Observable
- Versioned
- Production-ready

This module focuses on **Prompt Engineering as Software Engineering**, not trial-and-error prompting.

---

# Learning Objectives

By the end of this module, you will understand:

- Prompt anatomy
- Instruction hierarchy
- Role prompting
- Zero-shot, One-shot, and Few-shot prompting
- Prompt templates
- Prompt composition
- Dynamic prompt construction
- Prompt versioning
- Prompt security
- Prompt evaluation
- Prompt testing
- Prompt management architecture

---

# Lessons

## Lesson 01 – Foundations of Prompt Engineering

- What is a prompt?
- Prompt anatomy
- System vs Developer vs User messages
- Instruction hierarchy
- Context windows
- Token budgeting

---

## Lesson 02 – Prompt Design Patterns

- Zero-shot prompting
- One-shot prompting
- Few-shot prompting
- Chain-of-Thought (conceptual)
- Delimiters
- Structured instructions
- Output constraints

---

## Lesson 03 – Prompt Templates

- Why prompts should not be hardcoded
- Prompt builders
- Prompt variables
- Template composition
- Prompt reuse

---

## Lesson 04 – Production Prompt Engineering

- Prompt versioning
- Prompt repositories
- Feature flags
- Prompt rollout
- Backward compatibility

---

## Lesson 05 – Prompt Security

- Prompt Injection
- Jailbreak attacks
- Context poisoning
- Prompt leakage
- Defensive prompting

---

## Lesson 06 – Prompt Evaluation

- Golden datasets
- Prompt regression testing
- A/B testing
- Quality metrics
- Human evaluation

---

## Lesson 07 – Prompt Management for Career Copilot

We'll build:

- PromptRepository
- PromptBuilder
- PromptRenderer
- PromptVersioning

and refactor Career Copilot to stop using hardcoded prompts.

---

# Module Deliverables

By the end of this module, Career Copilot will include:

- Reusable prompt templates
- Prompt repository
- Prompt builder
- Prompt rendering engine
- Prompt versioning
- Prompt evaluation strategy
- Prompt testing strategy

---

# Definition of Done

You should be able to explain:

- Why prompts are software assets
- Why prompts should be versioned
- How prompts evolve safely
- How prompt regressions are detected
- How to defend against prompt injection
- How prompt templates improve maintainability

---

# Interview Readiness

After completing this module, you should be able to answer senior-level questions such as:

- How do you organize prompts in a production codebase?
- How do you test prompt quality?
- How do you version prompts?
- How do you safely roll out prompt changes?
- How do you protect against prompt injection?
- What is the difference between prompt engineering and prompt management?

---

# Career Copilot Evolution

Current:

Resume Analysis
↓

Hardcoded Prompt

Target:

Resume Analysis
↓

Prompt Repository
↓

Prompt Builder
↓

Prompt Renderer
↓

OpenAI

This architecture will become the foundation for later modules on RAG and AI Agents.