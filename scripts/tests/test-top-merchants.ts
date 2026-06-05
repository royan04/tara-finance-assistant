import { getTopMerchants } from "../src/services/transactionService";

async function main() {
    const result = await getTopMerchants();

    console.log(result);
}

main();