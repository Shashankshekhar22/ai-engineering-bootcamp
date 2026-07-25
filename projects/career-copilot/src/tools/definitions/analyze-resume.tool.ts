// Tool definition exposing the ResumeService's analyzeResume capability to the model.
import { z } from "zod";
import type { ToolDefinition } from "../types.js";
import { analyzeResume } from "../../services/resume.service.js";

const analyzeResumeArgsSchema = z.object({
  resumeText: z.string().min(1, "resumeText must not be empty"),
});

export const analyzeResumeTool: ToolDefinition<
  z.infer<typeof analyzeResumeArgsSchema>,
  ReturnType<typeof analyzeResume>
> = {
  name: "analyzeResume",
  description:
    "Analyzes raw resume text and extracts a short summary, matched skills, and an estimated experience level.",
  parameters: {
    type: "object",
    properties: {
      resumeText: {
        type: "string",
        description: "The full plain-text content of the candidate's resume.",
      },
    },
    required: ["resumeText"],
    additionalProperties: false,
  },
  schema: analyzeResumeArgsSchema,
  execute: async ({ resumeText }) => analyzeResume(resumeText),
};
