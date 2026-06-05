import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getActualSpend } from "../../services/transactionService";

export const actualSpendTool = createTool({
    id: "actual-spend",

    description:
        "Calculate spending excluding transfers.",

    inputSchema: z.object({
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),

    execute: async (args) => {
        return await getActualSpend(
            args.startDate,
            args.endDate
        );
    },
});