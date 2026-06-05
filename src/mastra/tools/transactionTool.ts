import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import {
    getCategorySpend,
} from "../../services/transactionService";

export const transactionTool = createTool({
    id: "transaction-tool",

    description:
        "Calculate spending by category. Supports optional startDate and endDate.",

    inputSchema: z.object({
        category: z.string().optional(),

        startDate: z.string().optional(),

        endDate: z.string().optional(),

        excludeTransfers:
            z.boolean().optional(),
    }),

    execute: async (args) => {
        return await getCategorySpend(
            args.category,
            args.startDate,
            args.endDate,
            args.excludeTransfers
        );
    },
});