import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getBiggestExpense } from "../../services/transactionService";

export const biggestExpenseTool = createTool({
    id: "biggest-expense",

    description:
        "Returns the user's largest expense excluding transfers.",

    inputSchema: z.object({}),

    execute: async () => {
        return await getBiggestExpense();
    },
});