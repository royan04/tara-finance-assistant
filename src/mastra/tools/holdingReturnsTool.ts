import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { getAllHoldingReturns } from "../../services/holdingService";

export const holdingReturnsTool = createTool({
    id: "holding-returns",

    description:
        "Returns all holdings ranked by realised return percentage. Use this to identify the best performing holding and compare holdings.",

    inputSchema: z.object({}),

    execute: async () => {
        return await getAllHoldingReturns();
    },
});