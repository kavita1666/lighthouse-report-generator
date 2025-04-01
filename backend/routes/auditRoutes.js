const express = require("express");
const { runAudit } = require("../utils/lighthouseHelper");
const Report = require("../models/Report");
const { generateAIReport } = require("../utils/aiHelper");
const router = express.Router();


router.post("/generate", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const { lhr, jsonPath, htmlPath, suggestions } = await runAudit(url);

    const aiReport = await generateAIReport(lhr, suggestions);

    const reportData = {
      url,
      scores: {
        performance: lhr.categories.performance.score,
        accessibility: lhr.categories.accessibility.score,
        seo: lhr.categories.seo.score,
        bestPractices: lhr.categories["best-practices"].score,
      },
      summary: aiReport.summary, // AI-generated summary
      recommendations: aiReport.recommendations, // Fixing plan
      jsonPath,
      htmlPath,
    };

    const newReport = new Report(reportData);
    await newReport.save();

    res.json(reportData);
  } catch (error) {
    console.error("Audit Error:", error);
    res.status(500).json({ error: "Failed to run Lighthouse audit" });
  }
});

module.exports = router;
