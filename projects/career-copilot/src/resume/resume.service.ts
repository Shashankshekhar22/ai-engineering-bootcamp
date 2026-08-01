// Domain logic for resume analysis. Knows nothing about OpenAI or tool calling.
import type { ResumeAnalysis } from "../schema/resume-analysis.schema.js";
import { KNOWN_SKILLS } from "./known-skills.js";

export function analyzeResume(resumeText: string): ResumeAnalysis {
  const normalized = resumeText.toLowerCase();

  const skills = KNOWN_SKILLS.filter((skill) => normalized.includes(skill));

  const yearsMatch = normalized.match(/(\d+)\+?\s*years?/);
  const years = yearsMatch?.[1] ? Number(yearsMatch[1]) : 0;

  const experienceLevel: ResumeAnalysis["experienceLevel"] =
    years >= 12
      ? "Architect"
      : years >= 8
        ? "Lead"
        : years >= 5
          ? "Senior"
          : years >= 2
            ? "Mid-Level"
            : "Junior";

  return {
    summary: `Candidate with ${skills.length} matched skill(s) and an estimated ${
      years > 0 ? `${years} year(s)` : "unspecified amount"
    } of experience.`,
    skills,
    experienceLevel,
  };
}
