import fs from "fs";

const BASE_URL =
    "http://localhost:4111/api/agents/tara-agent/generate";

async function ask(question: string) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            messages: [
                {
                    role: "user",
                    content: question,
                },
            ],
        }),
    });

    return await response.json();
}

async function main() {
    const questions = JSON.parse(
        fs.readFileSync(
            "./eval/questions.json",
            "utf-8"
        )
    );

    const results = [];

    for (const item of questions) {
        console.log(`Running: ${item.question}`);

        try {
            const response = await ask(item.question);

            results.push({
                question: item.question,
                answer: response.text,
            });

        } catch (error) {
            results.push({
                question: item.question,
                error: String(error),
            });
        }
    }

    fs.writeFileSync(
        "./eval/results.json",
        JSON.stringify(results, null, 2)
    );

    console.log("Evaluation complete");
}

main();