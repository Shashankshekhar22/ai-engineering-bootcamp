First, design the ATSService.

Answer these questions:

* What should its public method signature be?
- ```typescript
export async function calculateATSScore(
  resumeText: string,
  jobDescription: string,
): Promise<ATSScoreResult>
```

* What input type(s) should it accept?

- ```typescript
resumeText: string,
jobDescription: string,
```

* What output type should it return?

- ```typescript
interface ATSScoreResult {
  atsScore: number;
  matchingKeywords: string[];
  missingKeywords: string[];
}
```

* Which parts of the logic should be deterministic?
- All of it. Since the service never calls an LLM, every field it returns has to be
  computed deterministically: `matchingKeywords`/`missingKeywords` come from matching
  extracted resume keywords against the job description, and `atsScore` is a formula
  derived from those two lists (e.g. `matchedCount / totalRequiredCount * 100`). A pure
  business service can't have a "partially deterministic" result — there's no LLM call
  anywhere inside it to produce the rest.

* Should the service use an LLM internally, or should it remain a pure business service? Why?

- It should remain a pure business service. It needs to be independent, unit-testable
  in isolation, and reusable outside of any single AI workflow (e.g. a standalone
  "check my ATS score" feature with no chat interface at all). It should not know that
  an LLM, an orchestrator, or tool calling exist.

* Which pieces of this result could be reused by future tools (Skill Gap, Learning Roadmap, Interview Preparation)?

- `missingKeywords` -> Skill Gap Analysis: the primary input for building the ranked
  gap list.
- `atsScore` -> Learning Roadmap: can inform how urgently/aggressively the roadmap
  should be sequenced.
- `matchingKeywords` -> Interview Preparation: talking points on the candidate's
  existing strengths.

Don't write code yet. Think like the engineer defining a reusable domain service.
