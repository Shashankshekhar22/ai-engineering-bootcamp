# Lesson 03 – Prompt Design Patterns

## Learning Objectives

By the end of this lesson, you will understand:

- Zero-shot prompting
- One-shot prompting
- Few-shot prompting
- Role prompting
- Delimiter patterns
- Output constraint patterns
- When to use each pattern
- Trade-offs between different prompting techniques

---

# Engineering Blueprint

Before writing prompts, answer these questions:

1. Does the model already know how to perform this task?
2. Does the task require examples?
3. Is the expected output highly structured?
4. How much context can we afford to send?
5. Which prompt pattern best balances accuracy, cost, and maintainability?

---

# Why Prompt Patterns Matter

Consider two prompts.

## Prompt A

```text
Summarize this resume.
```

---

## Prompt B

```text
You are an experienced technical recruiter.

Your task is to summarize the candidate's resume.

Return:

- Professional Summary
- Technical Skills
- Years of Experience
- Education

Do not invent information.
```

Both prompts ask for a summary.

The second prompt is far more likely to produce consistent, structured output because it provides:

- Role
- Task
- Constraints
- Expected output

Prompt design patterns improve reliability without changing the model.

---

# Pattern 1 – Zero-Shot Prompting

Definition:

Give the model only the task.

Example:

```text
Analyze this resume.
```

### Advantages

- Simple
- Fast
- Low token cost

### Disadvantages

- Less predictable
- More variation
- Higher chance of inconsistent formatting

### Best For

- Simple tasks
- General knowledge
- Low-risk interactions

---

# Pattern 2 – One-Shot Prompting

Provide exactly one example.

Example:

```text
Input:
Resume...

Output:
{
  "summary": "...",
  "skills": [...]
}

Now analyze:

Resume...
```

### Advantages

- Establishes expectations
- Improves consistency
- Low token overhead

### Disadvantages

- Limited guidance
- May not cover edge cases

### Best For

- Structured outputs
- Consistent formatting

---

# Pattern 3 – Few-Shot Prompting

Provide multiple examples.

Example:

```text
Example 1

Input...

Output...

------------------

Example 2

Input...

Output...

------------------

Now analyze:

Resume...
```

### Advantages

- Highest consistency
- Better handling of complex tasks
- Helps the model infer patterns

### Disadvantages

- Increased token cost
- Larger prompts
- More maintenance

### Best For

- Classification
- Extraction
- Domain-specific tasks

---

# Pattern 4 – Role Prompting

Assign a role.

Example:

```text
You are a Senior Technical Recruiter.
```

Examples of roles:

- ATS Expert
- Career Coach
- Software Architect
- Interviewer
- Code Reviewer

### Why?

The role influences:

- Vocabulary
- Tone
- Decision-making style
- Level of detail

---

# Pattern 5 – Delimiter Pattern

Separate sections clearly.

Instead of:

```text
Resume:

Job Description:

Question:
```

Use:

```text
### Resume

...

### Job Description

...

### Task

...
```

or

```text
<resume>

...

</resume>
```

Delimiters reduce ambiguity.

---

# Pattern 6 – Output Constraints

Always specify the desired output.

Examples:

- JSON
- Markdown
- Table
- Bullet list

Avoid:

```text
Analyze this.
```

Prefer:

```text
Return valid JSON following this schema...
```

---

# Choosing the Right Pattern

| Pattern | Token Cost | Consistency | Best Use Case |
|----------|-----------:|------------:|---------------|
| Zero-shot | Low | Medium | Simple tasks |
| One-shot | Low-Medium | High | Structured outputs |
| Few-shot | High | Very High | Complex reasoning |
| Role Prompting | Very Low | Medium-High | Tone & expertise |
| Delimiters | Very Low | High | Context separation |
| Output Constraints | Very Low | Very High | Reliable formatting |

Patterns are often combined rather than used individually.

---

# Career Copilot Example

Resume Analysis Prompt

```text
System

You are Career Copilot.

Developer

You are an ATS expert.

### Resume

{{resume}}

### Task

Analyze the resume.

### Output

Return valid JSON.
```

Patterns used:

- Role Prompting
- Delimiters
- Output Constraints

No few-shot examples needed because the task is straightforward and the schema already constrains the output.

---

# Assignment

For each Career Copilot feature below, choose the most appropriate prompt pattern(s) and explain why.

## Feature 1

Resume Analysis

---

## Feature 2

ATS Score Comparison

---

## Feature 3

Skill Gap Analysis

---

## Feature 4

Learning Roadmap Generation

---

## Feature 5

Mock Interview

For each feature answer:

1. Which prompt pattern(s) would you use?
2. Why?
3. What are the trade-offs?
4. Would adding few-shot examples improve quality?

---

# Interview Questions

1. What is the difference between Zero-shot, One-shot, and Few-shot prompting?
2. When should Few-shot prompting be avoided?
3. Why is role prompting useful?
4. What problem do delimiters solve?
5. Why are output constraints important?
6. Can multiple prompt patterns be combined? Give an example.

---

# Production Evolution

## V1

Hardcoded prompt.

---

## V2

Prompt templates with reusable components.

---

## Production

Prompt composition engine.

Features:

- Shared prompt fragments
- Versioned prompts
- Dynamic prompt assembly
- Prompt A/B testing
- Prompt evaluation
- Feature flags
- Observability
- Rollback support

This is how large AI products manage hundreds of prompts while maintaining consistency and reliability.