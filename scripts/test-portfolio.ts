import { getPortfolioValue } from "../src/services/portfolioService";

async function main() {
    const result = await getPortfolioValue();
    console.log(result);
}

main();