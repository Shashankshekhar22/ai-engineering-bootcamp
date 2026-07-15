import { ResumeAnalysisSchema } from "./resume-analysis.schema.js";

const validData = {
    summary: "Senior engineer with cloud experience",
    skills: ["TypeScript", "AWS", "React"],
    experienceLevel: "Senior",
  };
  
  const invalidData = {
    summary: 123,
    skills: "TypeScript",
    experienceLevel: "Expert",
  };

  const result = ResumeAnalysisSchema.safeParse(validData);
  const result2 = ResumeAnalysisSchema.safeParse(invalidData);
console.log(result);
console.log(result2);