// Domain logic for ATS scoring. Pure business service: no OpenAI/tool-calling
// awareness, and everything it returns is deterministic keyword matching (no
// embeddings/semantic similarity yet - that comes in a later module).
import type { ATSScoreRequest, ATSScoreResult } from "../ai/types.js";
import { KNOWN_SKILLS } from "../resume/known-skills.js";

export function calculateATSScore(request: ATSScoreRequest): ATSScoreResult {
  const normalizedJobDescription = request.jobDescription.toLowerCase();
  const candidateSkills = request.resumeAnalysis.skills;

  // Only the skills the job description actually mentions count as "required" -
  // this is what makes the score specific to this job, not a fixed generic checklist.
  const requiredKeywords = KNOWN_SKILLS.filter((skill) =>
    normalizedJobDescription.includes(skill),
  );

  const matchingKeywords = requiredKeywords.filter((keyword) =>
    candidateSkills.includes(keyword),
  );
  const missingKeywords = requiredKeywords.filter(
    (keyword) => !candidateSkills.includes(keyword),
  );

  const atsScore =
    requiredKeywords.length === 0
      ? 0
      : Math.round((matchingKeywords.length / requiredKeywords.length) * 100);

  const recommendations = missingKeywords.map(
    (keyword) => `Consider highlighting experience with "${keyword}".`,
  );

  return {
    atsScore,
    matchingKeywords,
    missingKeywords,
    recommendations,
  };
}
