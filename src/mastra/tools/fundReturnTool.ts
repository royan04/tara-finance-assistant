import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { getFundReturn } from "../../services/fundService";

export const fundReturnTool = createTool({
    id: "fund-return",

    description:
        "Calculate mutual fund return between two dates.",

    inputSchema: z.object({
        fundId: z.string(),
        startDate: z.string(),
        endDate: z.string(),
    }),

    execute: async (args) => {
        return await getFundReturn(
            args.fundId,
            args.startDate,
            args.endDate
        );
    },
});