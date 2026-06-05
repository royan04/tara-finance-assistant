import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import {
    getRecurringTransactions,
} from "../../services/transactionService";

export const recurringTransactionsTool =
    createTool({
        id: "recurring-transactions",

        description:
            "Find recurring merchants and possible subscriptions.",

        inputSchema: z.object({}),

        execute: async () => {
            return await getRecurringTransactions();
        },
    });