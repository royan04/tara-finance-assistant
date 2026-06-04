import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { getPortfolioValue } from "../../services/portfolioService";

export const portfolioTool = createTool({
    id: "portfolio-summary",
    description: "Get current portfolio value, cost basis and profit",

    inputSchema: z.object({}),

    execute: async () => {
        return await getPortfolioValue();
    },
});