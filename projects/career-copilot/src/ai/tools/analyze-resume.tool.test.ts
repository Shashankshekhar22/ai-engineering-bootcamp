import { test } from "node:test";
import assert from "node:assert/strict";
import { executeTool } from "../executor/tool-executor.js";
import { InvalidToolArgumentsError } from "../errors.js";
import { analyzeResumeTool } from "./analyze-resume.tool.js";

test("analyzeResume runs on valid, schema-validated resume text", async () => {
  const { result } = await executeTool(
    analyzeResumeTool,
    JSON.stringify({
      resumeText: "6 years of experience with React, Node.js, AWS, and Docker.",
    }),
  );

  assert.equal(result.experienceLevel, "Senior");
  assert.ok(result.skills.includes("react"));
});

test("rejects model-generated arguments missing the required field", async () => {
  await assert.rejects(
    () => executeTool(analyzeResumeTool, JSON.stringify({})),
    InvalidToolArgumentsError,
  );
});

test("rejects an empty resumeText instead of trusting the model blindly", async () => {
  await assert.rejects(
    () => executeTool(analyzeResumeTool, JSON.stringify({ resumeText: "" })),
    InvalidToolArgumentsError,
  );
});
