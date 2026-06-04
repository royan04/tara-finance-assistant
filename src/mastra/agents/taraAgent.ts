import { Agent } from "@mastra/core/agent";
import { portfolioTool } from "../tools/portfolioTool";

export const taraAgent = new Agent({
    id: "tara-agent",

    name: "Tara Finance Assistant",

    instructions: `
You are Tara, a financial assistant.

You help users:
- Analyze spending
- Review transactions
- Calculate portfolio performance
- Analyze mutual fund returns
- Answer finance-related questions

Use tools whenever financial data is required.
`,

    model: "groq/llama-3.3-70b-versatile",

    tools: {
        portfolioTool,
    },
});