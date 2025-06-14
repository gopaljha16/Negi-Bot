const express = require("express");
const liveRouter = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

liveRouter.post("/", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  try {
    const result = await model.generateContent(message); // PASS STRING ONLY
    const response = result.response.text();
    res.json({ reply: response });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Gemini AI error occurred" });
  }
});

module.exports = liveRouter;
