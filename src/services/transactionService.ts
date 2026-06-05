import { pool } from "../db/postgres";

export async function getCategorySpend(
    category?: string,
    startDate?: string,
    endDate?: string,
    excludeTransfers: boolean = false
) {
    const values: any[] = [];
    const conditions: string[] = [];

    if (category && category !== "all") {
        values.push(category);

        conditions.push(
            `LOWER(category) = LOWER($${values.length})`
        );
    }

    if (excludeTransfers) {
        conditions.push(
            `LOWER(category) <> 'transfer'`
        );
    }

    if (startDate) {
        values.push(startDate);

        conditions.push(
            `date >= $${values.length}`
        );
    }

    if (endDate) {
        values.push(endDate);

        conditions.push(
            `date <= $${values.length}`
        );
    }

    const whereClause =
        conditions.length > 0
            ? `WHERE ${conditions.join(" AND ")}`
            : "";

    const result = await pool.query(
        `
        SELECT
            COUNT(*) AS transaction_count,
            ROUND(COALESCE(SUM(amount),0),2) AS total
        FROM transactions
        ${whereClause}
        `,
        values
    );

    const row = result.rows[0];

    if (
        Number(row.transaction_count) === 0
    ) {
        return {
            found: false,
            message: "No matching data found",
        };
    }

    return {
        found: true,
        total: row.total,
        transactionCount:
            Number(row.transaction_count),
    };
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

export async function getBiggestExpense() {
    const result = await pool.query(
        `
    SELECT
      id,
      date,
      merchant,
      merchant_normalized,
      category,
      amount
    FROM transactions
    WHERE amount > 0
      AND category <> 'transfer'
    ORDER BY amount DESC
    LIMIT 1
    `
    );

    return result.rows[0];
}

export async function getActualSpend(
    startDate?: string,
    endDate?: string
) {
    const values: any[] = [];
    const conditions = [
        "category <> 'transfer'"
    ];

    if (startDate) {
        values.push(startDate);
        conditions.push(
            `date >= $${values.length}`
        );
    }

    if (endDate) {
        values.push(endDate);
        conditions.push(
            `date <= $${values.length}`
        );
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

export async function getRecurringTransactions() {
    const result = await pool.query(`
        SELECT
            merchant_normalized,
            COUNT(*) AS occurrences,
            ROUND(AVG(amount),2) AS avg_amount,
            MIN(date) AS first_seen,
            MAX(date) AS last_seen
        FROM transactions
        WHERE category <> 'transfer'
        GROUP BY merchant_normalized
        HAVING COUNT(*) >= 3
        ORDER BY occurrences DESC
    `);

    return result.rows;
}