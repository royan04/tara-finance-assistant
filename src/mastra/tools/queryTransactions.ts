import { createTool } from "@mastra/core/tools";
import { z } from "zod";
import { pool } from "../../db/postgres";

export const queryTransactionsTool = createTool({
    id: "query-transactions",
    description:
        "Query transactions by category, merchant, and date range. Can also return totals.",

    inputSchema: z.object({
        category: z.string().optional(),
        merchant: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
    }),

    execute: async ({ context }) => {
        const { category, merchant, startDate, endDate } = context;

        const conditions: string[] = [];
        const values: any[] = [];

        if (category) {
            values.push(category);
            conditions.push(`category = $${values.length}`);
        }

        if (merchant) {
            values.push(merchant.toUpperCase());
            conditions.push(`merchant_normalized = $${values.length}`);
        }

        if (startDate) {
            values.push(startDate);
            conditions.push(`date >= $${values.length}`);
        }

        if (endDate) {
            values.push(endDate);
            conditions.push(`date <= $${values.length}`);
        }

        const whereClause =
            conditions.length > 0
                ? `WHERE ${conditions.join(" AND ")}`
                : "";

        const result = await pool.query(
            `
      SELECT
        COUNT(*) as transaction_count,
        ROUND(COALESCE(SUM(amount),0),2) as total_amount
      FROM transactions
      ${whereClause}
      `,
            values
        );

        return result.rows[0];
    },
});