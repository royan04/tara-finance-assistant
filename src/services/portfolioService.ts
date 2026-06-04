import { pool } from "../db/postgres";

export async function getPortfolioValue() {
    const result = await pool.query(`
    SELECT
      h.fund_id,
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
  `);

    let totalCost = 0;
    let totalValue = 0;

    for (const row of result.rows) {
        const cost = Number(row.units) * Number(row.purchase_nav);
        const value = Number(row.units) * Number(row.current_nav);

        totalCost += cost;
        totalValue += value;
    }

    return {
        totalCost: Number(totalCost.toFixed(2)),
        totalValue: Number(totalValue.toFixed(2)),
        profit: Number((totalValue - totalCost).toFixed(2)),
    };
}