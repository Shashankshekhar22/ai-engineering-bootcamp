# # Design Document for AnalyzeResumeTool

# Purpose
 * Analyze a candidate's resume and extract structured information such as skills, work experience, education, certifications, and professional summary for downstream AI workflows.

# Input
 
| Parameter    | Type   | Required | Description                                      |
| ------------ | ------ | -------- | ------------------------------------------------ |
| `resumeText` | string | Yes      | Plain text extracted from the candidate's resume |


# Validation

 * Is the input safe and usable?

* Examples:
    Is resumeText present?
    Is it a string?
    Is it empty?
    Does it exceed the maximum supported size?
    Does it contain only whitespace?

# Dependencies

 * ResumeService (business logic)
 * ResumeValidator (optional, for input validation)
 * Logger (for observability)

# Output

* ResumeAnalysis

├── Summary
├── Skills
├── Experience
├── Education
├── Certifications
└── Projects

# Failure Scenarios

How should it respond if:

* the resume text is empty: Retun a message notifying the resume is empty
* the input is malformed: Notify the user to correct the input and share it again
* the service throws an exception: return the exception
* the analysis cannot be completed?: Notify the user with the message


# #DATA FLOW

```javascript
ResumeController
        │
        ▼
AIOrchestrator
        │
        ▼
AnalyzeResumeTool
        │
        ▼
ResumeService
        │
        ▼
ResumeAnalysis
```