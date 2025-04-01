const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateAIReport(lhr, suggestions) {
    // Ensure suggestions is an array
    if (typeof suggestions === 'string') {
      suggestions = suggestions.split('\n'); // or split by other delimiter
    }
  
    const prompt = `
      A Lighthouse audit was performed on a website. Below are the results:
  
      - Performance: ${(lhr.categories.performance.score * 100).toFixed(0)}%
      - Accessibility: ${(lhr.categories.accessibility.score * 100).toFixed(0)}%
      - SEO: ${(lhr.categories.seo.score * 100).toFixed(0)}%
      - Best Practices: ${(lhr.categories["best-practices"].score * 100).toFixed(0)}%
  
      Issues detected:
      ${suggestions.join("\n")}
  
      **Task**: Provide a **brief summary** of the report and suggest **actionable fixes**.
    `;
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.5,
      });
  
      const aiText = response.choices[0].message.content;
      const [summary, ...recommendations] = aiText.split("\n\n");
  
      return { summary, recommendations };
    } catch (error) {
      console.error("Error generating AI summary:", error);
      return { summary: "Unable to generate summary", recommendations: [] };
    }
  }
  

async function getSuggestions(lhr) {
    try {
      const performanceScore = lhr.categories.performance.score * 100;
      const accessibilityScore = lhr.categories.accessibility.score * 100;
      const seoScore = lhr.categories.seo.score * 100;
      const bestPracticesScore = lhr.categories["best-practices"].score * 100;
  
      // Construct a prompt for AI summarization based on Lighthouse data
      const prompt = `
        Given the following Lighthouse audit results, provide suggestions for improving the website's performance, accessibility, SEO, and best practices.
  
        Performance Score: ${performanceScore}%
        Accessibility Score: ${accessibilityScore}%
        SEO Score: ${seoScore}%
        Best Practices Score: ${bestPracticesScore}%
  
        Please provide actionable suggestions for improving these areas.`;
  
      // Generate AI suggestions using OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // or any other model available
        messages: [{ role: "user", content: prompt }],
      });
  
      const suggestions = response.choices[0].message.content.trim();
      return suggestions;
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      return "No suggestions available at the moment.";
    }
  }

module.exports = { generateAIReport, getSuggestions };
