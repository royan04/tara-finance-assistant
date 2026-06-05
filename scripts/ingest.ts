import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { pool } from "../src/db/postgres.js";

dotenv.config();

function normalizeMerchant(merchant: string): string {

    const upper = merchant.toUpperCase();

    if (upper.includes("SWIGGY")) {
        return "SWIGGY";
    }

    if (upper.includes("ZOMATO")) {
        return "ZOMATO";
    }

    if (upper.includes("AMAZON")) {
        return "AMAZON";
    }

    if (upper.includes("FLIPKART")) {
        return "FLIPKART";
    }

    if (upper.includes("UBER")) {
        return "UBER";
    }

    return upper
        .replace(/[^A-Z0-9 ]/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")[0];
}

async function ingest() {
    const dataDir = process.env.DATA_DIR;

    if (!dataDir) {
        throw new Error("DATA_DIR not provided");
    }

    console.log(`Loading data from: ${dataDir}`);

    const transactions = JSON.parse(
        fs.readFileSync(path.join(dataDir, "transactions.json"), "utf8")
    );

    const funds = JSON.parse(
        fs.readFileSync(path.join(dataDir, "funds.json"), "utf8")
    );

    const holdings = JSON.parse(
        fs.readFileSync(path.join(dataDir, "holdings.json"), "utf8")
    );

    await pool.query("TRUNCATE fund_navs, holdings, funds, transactions RESTART IDENTITY CASCADE");

    console.log("Old data cleared");

    for (const tx of transactions) {
        await pool.query(
            `
      INSERT INTO transactions
      (
        id,
        date,
        merchant,
        merchant_normalized,
        category,
        amount,
        currency,
        memo
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `,
            [
                tx.id,
                tx.date,
                tx.merchant,
                normalizeMerchant(tx.merchant),
                tx.category,
                tx.amount,
                tx.currency,
                tx.memo,
            ]
        );
    }

    console.log(`Inserted ${transactions.length} transactions`);

    for (const fund of funds) {
        await pool.query(
            `
      INSERT INTO funds
      (
        fund_id,
        fund_name,
        category
      )
      VALUES ($1,$2,$3)
      `,
            [
                fund.id,
                fund.name,
                fund.category,
            ]
        );

        for (const navPoint of fund.nav) {
            await pool.query(
                `
        INSERT INTO fund_navs
        (
          fund_id,
          nav_date,
          nav
        )
        VALUES ($1,$2,$3)
        `,
                [
                    fund.id,
                    navPoint.date,
                    navPoint.value,
                ]
            );
        }
    }

    console.log(`Inserted ${funds.length} funds`);

    for (const holding of holdings) {
        await pool.query(
            `
      INSERT INTO holdings
      (
        fund_id,
        units,
        purchase_date,
        purchase_nav
      )
      VALUES ($1,$2,$3,$4)
      `,
            [
                holding.fund_id,
                holding.units,
                holding.purchase_date,
                holding.purchase_nav,
            ]
        );
    }

    console.log(`Inserted ${holdings.length} holdings`);

    console.log("Ingestion completed");

    await pool.end();
}

ingest().catch((err) => {
    console.error(err);
});