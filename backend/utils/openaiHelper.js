const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

exports.generateSummary = async (report) => {
  const prompt = `Summarize this Lighthouse report and suggest improvements:\n${JSON.stringify(report.categories, null, 2)}`;
  
  const response = await openai.completions.create({
    model: "gpt-4",
    prompt,
    max_tokens: 200,
  });

  return response.choices[0].text.trim();
};
