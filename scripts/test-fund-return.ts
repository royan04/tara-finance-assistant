import { getFundReturn } from "../src/services/fundService";

async function main() {
    const result = await getFundReturn(
        "fund_bluechip",
        "2024-01-01",
        "2025-01-01"
    );

    console.log(result);
}

main();