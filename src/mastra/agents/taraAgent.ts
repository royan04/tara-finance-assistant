import { Agent } from "@mastra/core/agent";
import { portfolioTool } from "../tools/portfolioTool";
import { transactionTool } from "../tools/transactionTool";
import { topMerchantsTool } from "../tools/topMerchantsTool";
import { fundReturnTool } from "../tools/fundReturnTool";
import { biggestExpenseTool } from "../tools/biggestExpenseTool";
import { recurringTransactionsTool } from "../tools/recurringTransactionsTool";
import { holdingReturnsTool } from "../tools/holdingReturnsTool";

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

For spending questions involving dates,
use transactionTool with startDate and endDate.

Examples:
- March 2025 → 2025-03-01 to 2025-03-31
- January to March 2025 → 2025-01-01 to 2025-03-31

Use tools whenever financial data is required.

For spending questions involving dates,
use transactionTool with startDate and endDate.

Examples:

March 2025
= startDate 2025-03-01
= endDate 2025-03-31

January to March 2025
= startDate 2025-01-01
= endDate 2025-03-31

For questions asking to ignore transfers,
set excludeTransfers = true.

If a tool returns:

{
  found: false
}

tell the user that no matching data was found.

Never invent values.
`,

    model: "groq/llama-3.3-70b-versatile",

    tools: {
        portfolioTool,
        transactionTool,
        topMerchantsTool,
        fundReturnTool,
        biggestExpenseTool,
        holdingReturnsTool,
        recurringTransactionsTool,

    },
});