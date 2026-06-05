import { getBiggestExpense } from "../src/services/transactionService";

async function main() {
    const result = await getBiggestExpense();
    console.log(result);
}

main();