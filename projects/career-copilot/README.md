Career Copilot

                User
                  │
                  ▼
          Resume Controller
                  │
                  ▼
         AI Orchestrator
                  │
     ┌────────────┴────────────┐
     ▼                         ▼
 OpenAI Responses API     Tool Registry
                                   │
          ┌────────────────────────┼────────────────────────┐
          ▼                        ▼                        ▼
  Analyze Resume Tool     ATS Score Tool        Skill Gap Tool
          │                        │                        │
          ▼                        ▼                        ▼
   Resume Service          ATS Service          Skill Gap Service
          │                        │                        │
          └────────────────────────┴────────────────────────┘
                                   │
                                   ▼
                              PostgreSQL

# High Level Architecture

                User
                  │
                  ▼
        ResumeController
                  │
                  ▼
        AIOrchestratorService
                  │
                  ▼
         OpenAI Responses API
                  │
                  ▼
         Tool Call Requested
                  │
                  ▼
        AnalyzeResumeTool
                  │
                  ▼
          ResumeService
                  │
                  ▼
         Structured Result
                  │
                  ▼
         OpenAI Responses API
                  │
                  ▼
          Final AI Response

# Tool Structure

    Tool Definition
            │
            ▼
    Receive Arguments
            │
            ▼
    Validate
            │
            ▼
    Call Business Service
            │
            ▼
    Return Structured Result

# AI Architecture Example for most of the apps

User
 │
 ▼
ResumeController
 │
 ▼
AIOrchestrator
 │
 ▼
OpenAI
 │
 ▼
Tool Call
 │
 ▼
Tool Registry
 │
 ▼
AnalyzeResumeTool
 │
 ▼
ResumeService
 │
 ▼
Tool Result
 │
 ▼
OpenAI
 │
 ▼
Final Answer
 │
 ▼
HTTP Response


# What Does a Tool Look Like?

Every tool follows the same mental model:

Tool Definition
        │
        ▼
Receive Arguments
        │
        ▼
Validate
        │
        ▼
Call Business Service
        │
        ▼
Return Structured Result