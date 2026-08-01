import { test } from "node:test";
import assert from "node:assert/strict";
import { executeTool } from "../executor/tool-executor.js";
import { InvalidToolArgumentsError } from "../errors.js";
import { calculateATSScoreTool } from "./calculate-ats-score.tool.js";

test("calculateATSScore runs on valid, schema-validated arguments", async () => {
  const { result } = await executeTool(
    calculateATSScoreTool,
    JSON.stringify({
      resumeAnalysis: {
        summary: "Senior engineer",
        skills: ["react", "aws"],
        experienceLevel: "Senior",
      },
      jobDescription: "Looking for a React engineer with AWS and Docker experience.",
    }),
  );

  assert.equal(result.matchingKeywords.includes("react"), true);
  assert.equal(result.missingKeywords.includes("docker"), true);
  assert.ok(result.atsScore > 0 && result.atsScore < 100);
});

test("rejects model-generated arguments missing the required resumeAnalysis field", async () => {
  await assert.rejects(
    () =>
      executeTool(
        calculateATSScoreTool,
        JSON.stringify({ jobDescription: "React role." }),
      ),
    InvalidToolArgumentsError,
  );
});

test("rejects an empty jobDescription instead of trusting the model blindly", async () => {
  await assert.rejects(
    () =>
      executeTool(
        calculateATSScoreTool,
        JSON.stringify({
          resumeAnalysis: { summary: "", skills: [], experienceLevel: "Junior" },
          jobDescription: "",
        }),
      ),
    InvalidToolArgumentsError,
  );
});
