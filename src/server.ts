import express from "express";
import { taraAgent } from "./mastra/agents/taraAgent.js";

const app = express();

app.use(express.json());

app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        error: "question is required",
      });
    }

    const response = await taraAgent.generate(question);

    return res.json({
      answer: response.text,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`POST /ask server running on port ${PORT}`);
});