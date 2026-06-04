import { pool } from "../db/postgres";

export async function getFundReturn(
    fundId: string,
    startDate: string,
    endDate: string
) {
    const start = await pool.query(
        `
    SELECT nav
    FROM fund_navs
    WHERE fund_id = $1
      AND nav_date = $2
    `,
        [fundId, startDate]
    );

    const end = await pool.query(
        `
    SELECT nav
    FROM fund_navs
    WHERE fund_id = $1
      AND nav_date = $2
    `,
        [fundId, endDate]
    );

    if (!start.rows.length || !end.rows.length) {
        return null;
    }

    const startNav = Number(start.rows[0].nav);
    const endNav = Number(end.rows[0].nav);

    const returnPct =
        ((endNav - startNav) / startNav) * 100;

    return {
        startNav,
        endNav,
        returnPct: Number(returnPct.toFixed(2)),
    };
}