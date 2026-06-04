import { pool } from "../src/db/postgres";

async function main() {
    const result = await pool.query(`
    SELECT COUNT(*) AS count
    FROM transactions
  `);

    console.log(result.rows);

    await pool.end();
}

main();