import { getCategorySpend } from "../src/services/transactionService";

async function main() {
    const result = await getCategorySpend("food");
    console.log(result);
}

main();