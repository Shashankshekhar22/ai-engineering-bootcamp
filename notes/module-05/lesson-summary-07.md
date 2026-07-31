# Lesson Summary 07 – Multi-Tool Orchestration Design for Career Copilot

## Scenario

> "Analyze my resume against a job description and recommend a personalized learning roadmap."

This single request can't be satisfied by one tool call. It requires chaining several
independent capabilities, each owned by its own business service, coordinated entirely
by the LLM's reasoning — the orchestrator only executes whatever tool call it's handed
and reports the result back.

---

## Why one tool isn't enough

The request implicitly asks for four distinct things:

1. Understand the resume — skills, experience, summary.
2. Understand how well the resume matches the job description — an ATS-style score.
3. Understand what's missing — the skill gap between the candidate and the role.
4. Turn that gap into a plan — a learning roadmap.

Each is a separate business capability, each has its own inputs/outputs, and each
should be independently reusable outside this one flow (e.g. `calculateATSScore` might
also be invoked on its own from a "check my ATS score" feature). Collapsing them into
one giant tool would violate single-responsibility and make the model's job — deciding
what to call — impossible to reason about.

---

## Tool execution order

Important: the backend does **not** hardcode this order. The LLM decides which tool to
call next, on every turn, based on what it has seen so far in the conversation. The
order below is what the model should naturally converge on for this request, given
each tool's description and the dependency between them:

```text
1. analyzeResume            (needs: resumeText)
2. calculateATSScore        (needs: resume skills + jobDescription)
3. skillGapAnalysis         (needs: resume skills + JD missing keywords)
4. generateLearningRoadmap  (needs: skill gaps + experience level)
        │
        ▼
   Final synthesized response
```

Nothing forces this order in code — it emerges because each tool's JSON schema and
description only make sense once the prior tool's output exists in the conversation.
If the model tried to call `skillGapAnalysis` before `analyzeResume`, it would have no
candidate skills to compare, so the conversation state naturally steers it into this
sequence.

---

## Step-by-step: inputs, outputs, why each tool is needed

### Step 1 — analyzeResume

- **Why:** Establish a structured, machine-usable picture of the candidate before any
  comparison is possible.
- **Input:** `{ resumeText: string }`
- **Output:** `{ summary, skills: string[], experienceLevel }`
- **Owned by:** ResumeService (pure domain logic, no OpenAI awareness)

### Step 2 — calculateATSScore

- **Why:** Quantify fit against *this specific* job description. This is a deterministic
  scoring capability, not a language task — the model shouldn't eyeball a match score
  itself.
- **Input:** `{ skills: string[] (from step 1), jobDescription: string (from the user's request) }`
- **Output:** `{ atsScore: number, matchedKeywords: string[], missingKeywords: string[] }`
- **Owned by:** ATSService

### Step 3 — skillGapAnalysis

- **Why:** Turn "missing keywords" into a ranked, explainable skill gap. Raw missing
  keywords aren't yet actionable; this step adds prioritization and rationale.
- **Input:** `{ candidateSkills: string[] (from step 1), missingKeywords: string[] (from step 2) }`
- **Output:** `{ gaps: [{ skill, priority, rationale }] }`
- **Owned by:** SkillGapService

### Step 4 — generateLearningRoadmap

- **Why:** Convert an abstract gap list into something the candidate can act on —
  resources, sequencing, and a timeline appropriate to their existing experience level.
- **Input:** `{ gaps: [...] (from step 3), experienceLevel (from step 1) }`
- **Output:** `{ roadmap: [{ skill, resources: string[], estimatedWeeks, order }], totalEstimatedWeeks }`
- **Owned by:** LearningRoadmapService

### Final step — synthesis

The model receives all four tool outputs across the conversation and writes one
cohesive answer — the ATS score, the biggest gaps, and the roadmap — in natural
language. No new tool call happens here; this is the "no more tool calls" branch.

---

## How data actually moves between tools

Tools never call each other directly, and there is no service-to-service coupling —
each service only knows its own domain (single-responsibility). Data flows through the
**conversation**, mediated by the LLM itself:

```text
analyzeResume                              → { skills, experienceLevel }
                                                     │
                          LLM reads this from conversation history
                                                     │
                                                     ▼
calculateATSScore(skills, jobDescription)  → { missingKeywords }
                                                     │
                          LLM reads BOTH prior outputs
                                                     │
                                                     ▼
skillGapAnalysis(candidateSkills, missingKeywords)  → { gaps }
                                                     │
                          LLM reads gaps + experienceLevel (from step 1)
                                                     │
                                                     ▼
generateLearningRoadmap(gaps, experienceLevel)      → { roadmap }
```

The orchestrator's role in this handoff is purely mechanical: after each tool executes,
it appends a `function_call_output` to the conversation array and sends the *whole*
conversation back to the model. It never extracts or rewires fields between tool calls
itself — the model is the integration layer, deciding which prior field goes into the
next call's arguments.

---

## Failure scenarios and how each is handled

| Failure | Where it happens | Orchestrator's handling | Does the loop continue? |
|---|---|---|---|
| Model requests a tool name that isn't registered (hallucinated tool) | Registry resolution | Caught, logged as a warning, structured `{ error }` sent back as the tool's output | Yes — model sees the error and can correct itself or apologize to the user |
| Model generates malformed JSON or arguments that fail the tool's schema (e.g. missing `jobDescription`) | Argument validation | Caught before the business service ever runs; structured `{ error }` returned | Yes — model can retry with corrected arguments or ask the user for the missing input |
| A business service throws (e.g. `ATSService` can't parse the job description, `LearningRoadmapService` has no resources for a gap) | Tool execution | Caught, logged as an error (an application-level failure, not a model mistake), structured `{ error }` returned | Yes — model degrades gracefully, e.g. skips the roadmap and reports the ATS score and gaps only |
| Step 1 (`analyzeResume`) fails outright, so steps 2–4 have no valid input to work from | Anywhere in the chain | Nothing special — the orchestrator doesn't know the steps are dependent; it just returns whatever error step 1 produced | The model decides — it may stop and tell the user "I couldn't read your resume" rather than blindly calling the next tool with empty data |
| The model never stops requesting tools (bad prompt, a tool recommending itself again, cyclical reasoning) | Iteration loop | Hard circuit breaker: after N iterations, the orchestrator throws and aborts the whole request, regardless of what the model wants next | No — the one case where the orchestrator overrides the model instead of feeding it another turn |

---

## Where the orchestrator decides "continue" vs. "stop"

This is deliberately the *only* decision the orchestrator makes on its own — everything
else (which tool, in what order, whether to give up early) is the model's call:

1. **Continue** — the latest response contains one or more `function_call` items:
   execute each, append the results, send the conversation back for another turn.
2. **Stop (success)** — the latest response contains zero `function_call` items: treat
   the model's text output as the final answer and return it.
3. **Stop (forced)** — the loop has run for `maxIterations` turns without ever
   reaching (2): abort with an explicit error rather than looping forever.

The orchestrator never inspects *which* tool was called or *what* it returned to make
this decision — it only checks "are there tool calls in this response, yes or no?"
That keeps the orchestration logic identical no matter how many tools exist (four
today, more later), and keeps all business/workflow reasoning where it belongs: in the
model's context, not hardcoded in the backend.
