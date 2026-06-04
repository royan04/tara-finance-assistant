import { getHoldingReturn } from "../src/services/holdingService";

async function main() {
    const result =
        await getHoldingReturn("fund_bluechip");

    console.log(result);
}

main();