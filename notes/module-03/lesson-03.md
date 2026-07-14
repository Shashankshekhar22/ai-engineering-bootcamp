Why should the OpenAI SDK call live inside ai.service.ts instead of directly inside ai.controller.ts?

OpenAI Sdk call should live inside ai.service.ts instead of ai.controller.ts because we do not want to wire this stictly to one LLM, in future if we want use any othe LLM then we can easily switch