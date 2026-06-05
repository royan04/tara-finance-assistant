import { getAllHoldingReturns }
    from "../src/services/holdingService";

async function main() {
    const result =
        await getAllHoldingReturns();

    console.log(result);
}

main();