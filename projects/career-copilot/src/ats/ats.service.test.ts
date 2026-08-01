import { test } from "node:test";
import assert from "node:assert/strict";
import { calculateATSScore } from "./ats.service.js";

test("scores 100 when every JD keyword is present in the resume", () => {
  const result = calculateATSScore({
    resumeAnalysis: {
      summary: "",
      skills: ["react", "typescript", "aws"],
      experienceLevel: "Senior",
    },
    jobDescription: "Looking for a React and TypeScript engineer with AWS experience.",
  });

  assert.equal(result.atsScore, 100);
  assert.deepEqual(result.matchingKeywords.sort(), ["aws", "react", "typescript"]);
  assert.deepEqual(result.missingKeywords, []);
  assert.deepEqual(result.recommendations, []);
});

test("reports missing keywords and a partial score when some JD requirements aren't met", () => {
  const result = calculateATSScore({
    resumeAnalysis: {
      summary: "",
      skills: ["react"],
      experienceLevel: "Mid-Level",
    },
    jobDescription: "React role, Docker and Kubernetes experience required.",
  });

  assert.equal(result.atsScore, 33);
  assert.deepEqual(result.matchingKeywords, ["react"]);
  assert.deepEqual(result.missingKeywords.sort(), ["docker", "kubernetes"]);
  assert.equal(result.recommendations.length, 2);
  assert.match(result.recommendations[0] ?? "", /docker|kubernetes/);
});

test("scores 0 without dividing by zero when the JD mentions no known keywords", () => {
  const result = calculateATSScore({
    resumeAnalysis: {
      summary: "",
      skills: ["react"],
      experienceLevel: "Junior",
    },
    jobDescription: "We need a great communicator who is a team player.",
  });

  assert.equal(result.atsScore, 0);
  assert.deepEqual(result.matchingKeywords, []);
  assert.deepEqual(result.missingKeywords, []);
});

test("is job-specific: the same resume scores differently against different job descriptions", () => {
  const resumeAnalysis = {
    summary: "",
    skills: ["react", "node.js"],
    experienceLevel: "Senior" as const,
  };

  const frontendRole = calculateATSScore({
    resumeAnalysis,
    jobDescription: "React frontend engineer needed.",
  });
  const devOpsRole = calculateATSScore({
    resumeAnalysis,
    jobDescription: "Docker and Kubernetes platform engineer needed.",
  });

  assert.equal(frontendRole.atsScore, 100);
  assert.equal(devOpsRole.atsScore, 0);
});
