# Assignment

Design Tool Schemas for the following Career Copilot features:

1. Resume Analysis
2. ATS Score Calculation
3. Skill Gap Analysis

For each tool, define:

- Tool Name
- Description
- Parameters
- Required Parameters
- Optional Parameters

Do not write code yet.

Focus on designing clear, production-ready contracts.

---

# Resume Analysis Tool Schema

{
    name: "resume_analysis",
    description: "Analyses resume of the candiate"
    parameter:{
        type: "object",
        properties: {
           "name": {
                "type": "string",
                "description": "It contains Candidate Name"
            },
            "contact_number": {
                "type": "number",
                "description": "it contains Candidate contact number"
            },
            "email": {
                "type": "string",
                "description": "it contains Candidate email address"
            },
            "address" :{
                "type": "string",
                "description": "it contains Candidate residential address"
            }
            "introduction"{
                "tyoe": "string",
                description: "This conatins canidate intriduction"
            },
            "year_of_experince":{
                tyoe": "number",
                description: "This conatins canidate year of exprience"
            },
            "skill_set":{
                type:"string"
                "description": "it contains Candidate skill set"
            },
             "certification":{
                type:"string"
                "description": "it contains Candidate certification"
            },
             "recognization":{
                type:"string"
                "description": "it contains Candidate recognization"
            },
             "qualification":{
                type:"string"
                "description": "it contains Candidate qualification"
            },
            "past_experience":{
                type:"string",
                "description": "it contains Candidate past experince"

            }
        },
        required:[
            "name",
            "qualification",
            "skill_set",
            "year_of_experince",
            "contact_number"
            "email"
            
        ]
    }
}



# ATS Score

{
  "name": "calculate_ats_score",
  "description": "Calculates an ATS compatibility score by analyzing resume text against a specific job description for keyword density, formatting structures, and section headers.",
  "parameters": {
    "type": "object",
    "properties": {
      "resume_text": {
        "type": "string",
        "description": "The full, raw text extracted from the candidate's resume."
      },
      "job_description_text": {
        "type": "string",
        "description": "The full text of the target job posting to match against."
      },
      "include_formatting_check": {
        "type": "boolean",
        "description": "If true, evaluates structural elements like headers, dates, and potential parsing blocks.",
        "default": true
      }
    },
    "required": [
      "resume_text",
      "job_description_text"
    ]
  }
}

# Skill Gap 

{
  "name": "analyze_skill_gaps",
  "description": "Identifies missing hard skills, soft skills, and certifications by comparing a user's current skill profile against a target job role.",
  "parameters": {
    "type": "object",
    "properties": {
      "candidate_skills": {
        "type": "array",
        "items": {
          "type": "string"
        },
        "description": "A list of skills currently possessed by the candidate."
      },
      "target_job_title": {
        "type": "string",
        "description": "The specific job title or role the candidate is targeting (e.g., 'Senior Data Analyst')."
      },
      "industry_type": {
        "type": "string",
        "description": "The professional sector to contextualize skill relevance.",
        "enum": ["technology", "healthcare", "finance", "marketing", "education", "other"]
      }
    },
    "required": [
      "candidate_skills",
      "target_job_title"
    ]
  }
}

# Interview Questions

1. What is a Tool Schema?

 - Tool Schema is a Contract between LLM and the application, based on tool shema llm knows which tool is available to use and which is not. 

2. Why are descriptions important in Function Calling?

 - Decription are important in Function Calling because this gives LLM clear understanding of the what is the purpose of the tool and what it will be used for.

3. What information does a Tool Schema provide to an LLM?
 - Tool Schema provides instruction such as
  - name
  - description
  - enum
  - parameter
   - required fields
   - properties
   - types
4. What makes a good tool name?
 - A good tool name should be descripptive should be relevant to the purse whcih it solves

5. Why should tools follow the Single Responsibility Principle?
 - A single rersponsibility principle tool helps to understand LLM what purpose does it solves and will not mess up or mix up the features/functionality

6. Why is JSON Schema used for tool definitions?
 - Tool Schemas commonly use JSON Schema concepts such as:
    - type
    - properties
    - required
    - description
    - enum
    - items
These definitions help the model generate correctly structured arguments.
Understanding JSON Schema is essential because it is the language used to describe tool inputs.

7. What are common mistakes when designing Tool Schemas?

 - Common mistakes include 
  - Genric Name
  - Generic desription
  - Generic/missing type
  - Generic/missing parameter
  - Too many optional parameters
  - Tool performing more than one responsibility
  - Business logic hidden inside tool descriptions




