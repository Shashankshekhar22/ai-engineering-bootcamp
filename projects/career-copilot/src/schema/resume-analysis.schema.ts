import { z } from "zod";

export const ResumeAnalysisSchema = z.object({
  summary: z.string(),
  skills: z.array(z.string()),
  experienceLevel: z.enum([
    "Junior",
    "Mid-Level",
    "Senior",
    "Lead",
    "Architect",
  ]),
});

export type ResumeAnalysis = z.infer<
  typeof ResumeAnalysisSchema
>;