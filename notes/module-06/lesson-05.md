# Lesson 05 – Prompt Versioning & Lifecycle Management

## Learning Objectives

By the end of this lesson, you will understand:

- Why prompts must be versioned.
- Prompt lifecycle management.
- Prompt rollback strategies.
- Prompt release management.
- Prompt A/B testing.
- Feature flags for prompts.
- Prompt governance in production.

---

# Engineering Blueprint

Before designing a Prompt Repository, answer these questions:

1. How do prompts change over time?
2. How do you know a new prompt is better?
3. How do you safely roll back a bad prompt?
4. How do you experiment without affecting all users?
5. Who owns prompt changes?

---

# Why Version Prompts?

Imagine this scenario.

Today:

```text
Resume Prompt v1

↓

95% Success Rate
```

A Product Manager requests:

> "Make the summaries more conversational."

A developer updates the prompt.

Tomorrow:

```text
Resume Prompt v2

↓

ATS extraction accuracy drops
```

What now?

Without versioning:

- Which prompt caused the regression?
- How do you roll back?
- Which users were affected?
- Which model was using which prompt?

You probably can't answer those questions.

---

# Prompt Lifecycle

A production prompt should follow a lifecycle similar to application code.

```text
Design

↓

Review

↓

Version

↓

Test

↓

Deploy

↓

Monitor

↓

Evaluate

↓

Improve

↓

Retire
```

Prompts are software assets.

Treat them accordingly.

---

# Prompt Versioning

Example:

```text
resume-analysis/

    v1.prompt.md

    v2.prompt.md

    v3.prompt.md
```

Never overwrite production prompts.

Every meaningful change should create a new version.

---

# Prompt Metadata

A prompt is more than text.

Example:

```yaml
name: resume-analysis

version: v3

author: AI Team

created: 2026-08-08

status: production

model: gpt-5.5

description: Improved skill categorization
```

Metadata enables governance.

---

# Prompt Release Strategy

Avoid releasing new prompts to everyone immediately.

Instead:

```text
v2

↓

Internal Testing

↓

5% Users

↓

20% Users

↓

50% Users

↓

100% Users
```

This is identical to feature rollouts in software engineering.

---

# Prompt Rollback

Suppose:

```
v3

↓

Error Rate ↑

↓

Rollback

↓

v2
```

Because prompts are versioned, rollback is a configuration change—not a code deployment.

---

# Prompt A/B Testing

Example:

Group A

↓

Prompt v2

Group B

↓

Prompt v3

Compare:

- User satisfaction
- ATS accuracy
- Token usage
- Latency
- Completion quality

Choose the better prompt using evidence rather than intuition.

---

# Feature Flags

Example:

```text
Enterprise Customers

↓

Prompt v3

Free Users

↓

Prompt v2
```

or

```text
GPT

↓

Prompt A

Claude

↓

Prompt B
```

Feature flags separate deployment from release.

---

# Prompt Governance

Who should be allowed to modify prompts?

Not everyone.

Define:

- Owners
- Reviewers
- Approval process
- Change history
- Rollback policy

Treat prompts with the same governance as production code.

---

# Career Copilot Architecture

```text
Prompt Repository
        │
        ▼
Prompt Metadata
        │
        ▼
Prompt Version
        │
        ▼
Prompt Builder
        │
        ▼
Prompt Renderer
        │
        ▼
OpenAI
```

Notice that version selection happens before rendering.

---

# Folder Structure

```text
prompts/

resume-analysis/

    metadata.yaml

    v1.prompt.md

    v2.prompt.md

    v3.prompt.md

ats-score/

    metadata.yaml

    v1.prompt.md

skill-gap/

    metadata.yaml

    v1.prompt.md
```

Everything related to one prompt lives together.

---

# Assignment

Design the prompt versioning strategy for Career Copilot.

Answer the following:

## Prompt Repository

- How should prompts be identified?
- How should versions be stored?
- How should the active version be selected?

### Answer

- **Identification** — each prompt gets a stable slug matching its purpose (`resume-analysis`, `ats-score`, `skill-gap`), and every change to that prompt gets a new semantic version under it (`v1`, `v2`, `v3`, …). The fully-qualified identifier is `name@version` (e.g. `resume-analysis@v3`), which is what gets logged against every request for traceability.
- **Storage** — versions are stored as immutable files in a git-backed prompt repository, one file per version (`v1.prompt.md`, `v2.prompt.md`, …), matching the folder structure already shown in this lesson. A version is never edited in place; any change produces a new file. Each prompt family also has a `metadata.yaml` that tracks the version history, status of each version (`draft` / `staging` / `production` / `deprecated`), author, and model compatibility.
- **Active version selection** — selection happens through a pointer/config, not by renaming or overwriting files: a `status: production` field in metadata, or a rollout config the Prompt Builder reads at request time (optionally per-segment via feature flags — e.g. enterprise vs. free users, or per model). This keeps "which version is live" a config change, decoupled from the prompt content itself.

---

## Rollback

A new prompt version causes poor resume summaries.

- How would you roll back?
- Should rollback require a code deployment?
- Why?

### Answer

- **How to roll back** — flip the production pointer/status in metadata (or the feature-flag config) from `v3` back to `v2`. Because both versions already exist as immutable files, this is just changing which one the Prompt Builder resolves as "active." Mark `v3` as `deprecated`/`rolled-back` in metadata for the post-mortem, but keep the file for investigation.
- **Should it require a code deployment?** No.
- **Why** — the whole point of externalizing prompts from application code is that a bad prompt is a content/config problem, not a code bug. Requiring a code deploy to fix it reintroduces CI/CD latency and engineering-review overhead for what should be a near-instant revert. Decoupling rollback from deployment means mean-time-to-recovery is measured in minutes, and (under the right governance rules) can even be triggered by a non-engineer prompt owner rather than waiting on an engineering release cycle.

---

## A/B Testing

How would you compare Prompt v2 and Prompt v3?

Which metrics would you collect?

### Answer

Split live traffic between v2 (control) and v3 (treatment) using a feature flag or random assignment (e.g. start at 90/10, not 50/50, until v3 is proven safe), and log the prompt version used against every request so results can be attributed correctly. Metrics to collect:

- **User satisfaction** — explicit thumbs up/down or rating on the generated summary.
- **ATS extraction accuracy** — measured against a labeled/ground-truth set of resumes, since this is the metric most likely to regress silently.
- **Completion quality** — human or rubric-based eval (e.g. LLM-as-judge) scoring tone, coherence, factual grounding.
- **Token usage / cost** — v3 may be "more conversational" but also more verbose and expensive.
- **Latency** — end-to-end response time per version.
- **Regeneration rate** — how often users re-request or edit the output, a strong implicit dissatisfaction signal.
- **Downstream conversion** — e.g. resume actually submitted, interview requests generated, if traceable.

Run until a fixed sample size/time window is reached before deciding — don't eyeball early results — and require the winning version to be neutral-or-better on ATS accuracy specifically, since that's a hard functional requirement, not just a quality preference.

---

## Prompt Metadata

Design a metadata structure for prompts.

What fields would you include?

Why?

### Answer

```yaml
name: resume-analysis
version: v3
status: production        # draft | staging | canary | production | deprecated
author: AI Team
reviewer: jdoe
created: 2026-08-08
last_modified: 2026-08-10
model: gpt-5.5
description: Improved skill categorization; more conversational tone
input_schema: [resume_text, job_description]
rollout_percentage: 100
eval_score: 0.94
tags: [resume-analysis, tone:conversational]
```

- `name` / `version` — identification and the basis for rollback (never overwrite, always a new version).
- `status` / `rollout_percentage` — enables staged/canary release instead of an all-or-nothing switch.
- `author` / `reviewer` — accountability; who wrote it and who signed off.
- `model` — a prompt tuned for one model family can behave differently on another; needed for compatibility checks when models change.
- `description` — a human-readable changelog of *why* the version changed, without having to diff raw prompt text.
- `input_schema` — documents the contract the Prompt Builder depends on, so a version can't silently break callers.
- `eval_score` — a data point for promotion decisions (production status should require passing an eval bar, not just review approval).
- `tags` — searchability/filterability across the repository as it grows.

---

## Governance

Who should approve prompt changes?

How should prompt changes be reviewed?

How would you prevent accidental production regressions?

### Answer

- **Who approves** — the prompt owner (e.g. the AI/Applied-AI team member responsible for that prompt family) drafts the change, but a second reviewer with relevant domain knowledge (e.g. someone who understands ATS/resume parsing, or the PM who requested the change) must approve before it can be promoted to `production` status. This mirrors code review: author ≠ approver.
- **Review process** — treat it like a pull request: diff the new version against the previous one, attach eval/A-B results, and check it against a checklist (does it preserve the existing input/output contract? does it pass the golden regression test set?). Merging only promotes the version to `staging`; it then goes through canary rollout (5% → 20% → 50% → 100%) with a monitoring window before being marked `production`.
- **Preventing accidental regressions** — (1) an automated eval suite with golden test cases (e.g. known resumes with expected ATS keyword extraction) must pass in CI before a version can be flagged `production`; (2) staged/canary rollout with automatic rollback if error rate or quality metrics cross a threshold; (3) an explicit approval gate — status can't flip to `production` without a recorded reviewer; (4) immutability of versions, so a bad version is isolated to its own file and can never silently mutate a version that's still serving traffic.

---

# Interview Questions

1. Why should prompts be versioned?
2. Why is prompt rollback important?
3. How is prompt versioning similar to application versioning?
4. How would you safely release a new prompt?
5. What metrics would you collect during prompt A/B testing?
6. Why should prompts have metadata?

### Answers

1. **Why should prompts be versioned?** — Prompts directly drive production behavior, and a "small wording tweak" can silently regress accuracy (e.g. ATS extraction) even while making outputs look nicer. Without versions you can't answer which prompt was in use when a regression appeared, compare old vs. new behavior, or reproduce past outputs. Versioning turns prompts into auditable, reproducible artifacts instead of a mutable blob of text.

2. **Why is prompt rollback important?** — Prompt quality issues surface in production, often only after real user traffic hits edge cases an internal review missed. Rollback is the fastest way to stop user-facing harm (bad summaries, lost ATS accuracy) without waiting on a new fix to be written, reviewed, and shipped. It's the prompt-equivalent of reverting a bad code deploy — speed of recovery matters more than root-causing under pressure.

3. **How is prompt versioning similar to application versioning?** — Both treat every meaningful change as a new immutable artifact rather than an in-place edit; both go through design → review → test → deploy → monitor lifecycles; both support staged rollout (canary/percentage-based release), rollback via pointer/config change, and ownership/approval gates. The difference is prompts are evaluated on qualitative/behavioral correctness (tone, accuracy, hallucination) rather than purely functional correctness, so eval suites and human review matter more relative to unit tests.

4. **How would you safely release a new prompt?** — Draft the new version alongside (not replacing) the old one, run it through an automated eval suite of golden test cases, get reviewer approval, then roll out gradually: internal testing → 5% → 20% → 50% → 100% of traffic, monitoring quality/error metrics at each stage with an automatic or manual rollback trigger if thresholds are breached. Only promote to full `production` status after the monitoring window shows it's stable.

5. **What metrics would you collect during prompt A/B testing?** — User satisfaction (ratings/thumbs), task-specific accuracy (e.g. ATS extraction correctness against ground truth), completion/output quality (human or LLM-judge eval), token usage/cost, latency, and regeneration/edit rate as an implicit dissatisfaction signal. The mix should include at least one hard functional metric (accuracy) alongside softer quality/UX metrics, since a prompt can "feel" better while quietly failing its core job.

6. **Why should prompts have metadata?** — Metadata is what makes governance possible: it records who owns a prompt, what model it's built for, what changed and why, what status/rollout stage it's in, and what eval score it achieved. Without it, prompt management is just a folder of text files with no way to answer "is this safe to promote," "who approved this," or "what changed between versions" — metadata is the difference between prompts-as-files and prompts-as-managed-assets.

---

# Production Evolution

## V1

Hardcoded prompt.

---

## V2

Prompt files.

---

## V3

Versioned prompt repository.

---

## Production

- Prompt repository
- Metadata
- Versioning
- Feature flags
- Canary releases
- Prompt A/B testing
- Prompt analytics
- Prompt rollback
- Multi-model support
- Approval workflow
- Audit history

At scale, prompt management becomes an engineering discipline, not a collection of text files.


Imagine the following production incident.

On Monday, Prompt v4 is deployed.

By Tuesday:

ATS score quality drops by 20%.
Token usage increases by 35%.
Response latency increases.
User satisfaction decreases.

However:

Resume summaries improve.
Learning Roadmap quality improves.

You now have conflicting signals.

Question

As the AI Platform Architect:

Would you immediately roll back?
Which metrics matter most?
Should all users receive the same prompt version?
Would feature flags help?
How would you design an experiment to decide between v3 and v4?

Don't optimize for one metric. Think about product goals, engineering trade-offs, and business impact. This is the kind of decision AI platform teams make regularly in production.


