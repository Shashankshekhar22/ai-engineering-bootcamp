# Lesson 01 – Foundations of Prompt Engineering.


- Why shouldn't prompts be hardcoded throughout the application?
* Prompts should not be hardcoded because of the following reasons

    * Slower Iteration Cycles: Tweaking a prompt to improve tone or fix an issue requires a code deployment. Externalizing prompts allows for dynamic hot-fixing and rapid A/B testing.

    * Collaboration Bottlenecks: Non-technical stakeholders (e.g., product managers, copywriters) are blocked from refining prompts if they have to navigate a Git repository and codebase.

    * Difficult Version Control: When prompts are embedded inside application code (like in raw string variables), tracking history and rolling back bad prompt changes becomes difficult.

    * Security and Auditing: Hardcoding makes it tough to track what exact prompt is running in production. Externalizing prompts through a Dedicated Prompt Management Registry allows for versioning and auditing.

    * Poor Extensibility: LLMs frequently get updated, often breaking previously tuned hardcoded prompts. Decoupling them allows you to easily adapt prompts for different model families (e.g., swapping a prompt for Claude with one for GPT-4)
---

- If Product wants to change the resume analysis prompt tomorrow, how many files should you need to edit?
    * As of date one file ai-orchestrtor.service.ts
---

- What information in a prompt is static, and what is dynamic?

* Static
    * System Prompts: The foundational directives that dictate the AI's persona, tone, and formatting constraints (e.  g., "Act as a Python tutor" or "Always output in JSON").
    * Security Policies: Guardrails preventing the AI from performing unauthorized actions (e.g., "Do not provide financial advice").
    * Static Examples: Hard-coded few-shot examples used to shape the expected output structure

* Variable
    * User Input
    * Variables
    * Memory history
    * External Dates
---

- If two features use similar prompts, how can you avoid duplication?

    * To avoid duplication when two features use similar prompts, modularize your prompts by separating the core instructions from the task-specific variables and context. Treat prompts as reusable software components rather than hardcoding identical blocks of text across different features

        ┌────────────────────────────┐
        │ System Instructions        │
        ├────────────────────────────┤
        │ Developer Instructions     │
        ├────────────────────────────┤
        │ Dynamic Context            │
        ├────────────────────────────┤
        │ User Request               │
        ├────────────────────────────┤
        │ Output Constraints         │
        └────────────────────────────┘

---

- Where would you store prompts in the Career Copilot project?

* We can create a seprate prompt repository and access all the prompts from there

Don't think about APIs or syntax. Think like the architect responsible for maintaining 50 prompts over the next two years.
