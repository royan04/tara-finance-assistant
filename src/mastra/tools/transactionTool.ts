import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { getCategorySpend } from "../../services/transactionService";

export const transactionTool = createTool({
    id: "transaction-tool",

    description:
        "Get spending amount for a transaction category such as food, travel, shopping, bills, etc.",

    inputSchema: z.object({
        category: z.string(),
    }),

    execute: async (args) => {
        console.log("TRANSACTION TOOL INPUT:", args);

        const result = await getCategorySpend(args.category);

        return result;
    },
});