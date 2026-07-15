import Table from "cli-table3";
import { generateAIResponse } from "./src/services/ai.service.js";

const result = await generateAIResponse("Explain RAG in simple terms");
const result2 = await generateAIResponse("Explain RAG in simple terms");
const result3 = await generateAIResponse("Explain RAG in simple terms");

// store the result in a table

// | Run | Input Tokens | Output Tokens | Latency |
// | --- | -----------: | ------------: | ------: |
// | 1   |              |               |         |
// | 2   |              |               |         |
// | 3   |              |               |         |


const table = new Table({
  head: ["Run", "Input Tokens", "Output Tokens", "Latency"],
});
table.push([1, result?.usage?.input_tokens, result?.usage?.output_tokens, result.latencyMs]);
table.push([2, result2?.usage?.input_tokens, result2?.usage?.output_tokens, result2.latencyMs]);
table.push([3, result3?.usage?.input_tokens, result3?.usage?.output_tokens, result3.latencyMs]);
console.log(table.toString());

console.log(JSON.stringify(result, null, 2));
