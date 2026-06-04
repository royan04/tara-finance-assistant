import { createTool } from "@mastra/core/tools";
import { z } from "zod";

import { getTopMerchants } from "../../services/transactionService";

export const topMerchantsTool = createTool({
    id: "top-merchants",

    description:
        "Returns the merchants where the user spends the most money.",

    inputSchema: z.object({}),

    execute: async () => {
        return await getTopMerchants();
    },
});