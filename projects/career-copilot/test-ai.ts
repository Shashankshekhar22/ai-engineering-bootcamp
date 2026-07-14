import { generateAIResponse } from "./src/services/ai.service.js";

const result = await generateAIResponse("Say hello in exactly one word.");
console.log(JSON.stringify(result, null, 2));
