// Shared skill vocabulary used for simple substring keyword matching - by
// ResumeService (extracting skills from resume text) and ATSService (deriving a job
// description's required keywords). One list, so the two never drift out of sync.
//
// This is deliberately a flat list matched via plain substring `.includes()`, per the
// lesson's scope: "simple keyword matching is sufficient here; we'll improve it in
// later modules with embeddings/semantic similarity." That means:
//  - No synonyms/variants are resolved (e.g. "k8s" won't match "kubernetes").
//  - Single-letter or very short, common-word language names are deliberately
//    excluded (bare "c", "r", "go") because a plain substring check would false-positive
//    match inside unrelated words (e.g. "go" inside "google", "going", "algorithm").
export const KNOWN_SKILLS = [
  // Programming languages
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "c#",
  "golang",
  "ruby",
  "php",
  "swift",
  "kotlin",
  "rust",
  "scala",
  "perl",
  "dart",
  "elixir",
  "haskell",
  "matlab",
  "sql",
  "bash",

  // Frontend
  "react",
  "angular",
  "vue",
  "next.js",
  "svelte",
  "html",
  "css",
  "sass",
  "tailwind",
  "redux",
  "webpack",
  "vite",

  // Backend / frameworks
  "node.js",
  "express",
  "django",
  "flask",
  "spring boot",
  "ruby on rails",
  "laravel",
  "fastapi",
  "nestjs",
  "asp.net",
  "graphql",
  "rest",
  "grpc",

  // Mobile
  "react native",
  "flutter",
  "android",
  "ios",
  "swiftui",
  "xamarin",

  // Cloud & infrastructure
  "aws",
  "azure",
  "gcp",
  "terraform",
  "ansible",
  "pulumi",
  "cloudformation",

  // DevOps / CI-CD
  "docker",
  "kubernetes",
  "ci/cd",
  "jenkins",
  "github actions",
  "gitlab ci",
  "circleci",
  "helm",
  "prometheus",
  "grafana",

  // Databases
  "postgresql",
  "mysql",
  "mongodb",
  "redis",
  "elasticsearch",
  "dynamodb",
  "cassandra",
  "sqlite",
  "oracle",
  "firebase",

  // Data / ML / AI
  "machine learning",
  "deep learning",
  "tensorflow",
  "pytorch",
  "pandas",
  "numpy",
  "scikit-learn",
  "data engineering",
  "etl",
  "spark",
  "hadoop",
  "nlp",
  "computer vision",
  "llm",
  "generative ai",

  // Testing / QA
  "unit testing",
  "integration testing",
  "jest",
  "cypress",
  "selenium",
  "playwright",
  "junit",
  "pytest",
  "tdd",
  "bdd",

  // Tools / collaboration
  "git",
  "jira",
  "confluence",
  "figma",
  "postman",
  "slack",

  // Architecture / practices
  "microservices",
  "event-driven architecture",
  "design patterns",
  "agile",
  "scrum",
  "kanban",
  "solid principles",
  "system design",

  // Security
  "oauth",
  "jwt",
  "penetration testing",
  "owasp",

  // Professional / soft skills
  "communication",
  "leadership",
  "problem solving",
  "teamwork",
  "collaboration",
  "time management",
  "critical thinking",
  "adaptability",
  "project management",
  "stakeholder management",
  "mentoring",
  "conflict resolution",
];
