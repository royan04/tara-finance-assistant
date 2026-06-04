import { pool } from "../db/postgres";

export async function getCategorySpend(
    category: string,
    startDate?: string,
    endDate?: string
) {
    const values: any[] = [category];
    const conditions = ["LOWER(category) = LOWER($1)"];

    if (startDate) {
        values.push(startDate);
        conditions.push(`date >= $${values.length}`);
    }

    if (endDate) {
        values.push(endDate);
        conditions.push(`date <= $${values.length}`);
    }

    const result = await pool.query(
        `
    SELECT
      ROUND(COALESCE(SUM(amount),0),2) AS total
    FROM transactions
    WHERE ${conditions.join(" AND ")}
    `,
        values
    );

    return result.rows[0];
}

export async function getTopMerchants(limit = 10) {
    const result = await pool.query(
        `
    SELECT
      merchant_normalized,
      ROUND(SUM(amount), 2) AS total_spent
    FROM transactions
    GROUP BY merchant_normalized
    ORDER BY total_spent DESC
    LIMIT $1
    `,
        [limit]
    );

    return result.rows;
}