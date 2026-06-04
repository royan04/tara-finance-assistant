import { pool } from "../db/postgres";

export async function getHoldingReturn(fundId: string) {
    const result = await pool.query(
        `
    SELECT
      h.units,
      h.purchase_nav,
      fn.nav AS current_nav
    FROM holdings h
    JOIN (
      SELECT DISTINCT ON (fund_id)
        fund_id,
        nav
      FROM fund_navs
      ORDER BY fund_id, nav_date DESC
    ) fn
    ON h.fund_id = fn.fund_id
    WHERE h.fund_id = $1
    `,
        [fundId]
    );

    if (!result.rows.length) {
        return null;
    }

    const row = result.rows[0];

    const cost =
        Number(row.units) * Number(row.purchase_nav);

    const currentValue =
        Number(row.units) * Number(row.current_nav);

    return {
        fundId,
        cost: Number(cost.toFixed(2)),
        currentValue: Number(currentValue.toFixed(2)),
        profit: Number((currentValue - cost).toFixed(2)),
    };
}