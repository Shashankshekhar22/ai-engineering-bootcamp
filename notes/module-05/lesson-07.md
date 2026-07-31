                   User
                     │
                     ▼
             AI Orchestrator
                     │
                     ▼
                OpenAI Model
                     │
      ┌──────────────┴──────────────┐
      ▼                             ▼
 Tool Call #1                Tool Call #2
      │                             │
      ▼                             ▼
 Tool Executor               Tool Executor
      │                             │
      ▼                             ▼
 Resume Service             ATS Service
      │                             │
      └──────────────┬──────────────┘
                     ▼
                OpenAI Model
                     │
             Additional Tool Calls?
                     │
          Yes ───────┴─────── No
                     │
                     ▼
              Final AI Response

# Tool Call Data Flow

User
 │
 ▼
Controller
 │
 ▼
AI Orchestrator
 │
 ▼
OpenAI
 │
 ▼
Tool Calls
 │
 ▼
Tool Executor
 │
 ▼
Business Services
 │
 ▼
Tool Results
 │
 ▼
OpenAI
 │
 ▼
More Tool Calls?
 │
 ├── Yes → Repeat
 │
 └── No → Final Response

* This loop continues until there are no more tool calls.


# Interview Questions

* Why might an LLM request multiple tools?

-  One tool might not be sufficent to solve the problems that is LLM may request multiple tool to get the desired result.

* Who decides the next tool to execute—the orchestrator or the LLM?

- LLM

* How do you prevent infinite tool loops?

- By adding maximum token number which it can consume
- By setting up the timeout 
- By identifying and stoping the duplicate calls
- By using circuit braker
- By Setting up amx iteration in which it can go

* Should tools call other tools directly? Why or why not?ne tool should not know what the other tool business logic is. This should strictly follow the SOLID pronciple

* What is the difference between orchestration and execution?
- Orchestration is the high-level planning and coordination of multiple tasks, whereas execution is the actual doing or running of those individual tasks. 

* How does this pattern evolve into AI agents?
- an orchestrator,
- a set of tools,
- memory (optional),
- planning,
- and an execution loop.