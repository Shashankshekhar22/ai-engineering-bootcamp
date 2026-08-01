// Tool definition exposing ATSService's calculateATSScore capability to the model.
import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { calculateATSScore } from "../../ats/ats.service.js";
import { ResumeAnalysisSchema } from "../../schema/resume-analysis.schema.js";

const calculateATSScoreArgsSchema = z.object({
  resumeAnalysis: ResumeAnalysisSchema,
  jobDescription: z.string().min(1, { message: "jobDescription cannot be empty" }),
});

export const calculateATSScoreTool: ToolDefinition<
  z.infer<typeof calculateATSScoreArgsSchema>,
  ReturnType<typeof calculateATSScore>
> = {
  name: "calculateATSScore",
  description:
    "Compares a previously analyzed resume against a job description and returns an ATS match score, matching/missing keywords, and recommendations.",
  parameters: {
    type: "object",
    properties: {
      resumeAnalysis: {
        type: "object",
        description:
          "The structured resume analysis previously produced by the analyzeResume tool.",
        properties: {
          summary: { type: "string" },
          skills: { type: "array", items: { type: "string" } },
          experienceLevel: {
            type: "string",
            enum: ["Junior", "Mid-Level", "Senior", "Lead", "Architect"],
          },
        },
        required: ["summary", "skills", "experienceLevel"],
        additionalProperties: false,
      },
      jobDescription: {
        type: "string",
        description: "The full text of the job description to compare the resume against.",
      },
    },
    required: ["resumeAnalysis", "jobDescription"],
    additionalProperties: false,
  },
  schema: calculateATSScoreArgsSchema,
  execute: async ({ resumeAnalysis, jobDescription }) =>
    calculateATSScore({ resumeAnalysis, jobDescription }),
};
