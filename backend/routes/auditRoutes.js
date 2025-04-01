const express = require("express");
const { runAudit } = require("../utils/lighthouseHelper");
const Report = require("../models/Report");
const router = express.Router();

router.post("/generate", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    const { lhr, jsonPath, htmlPath } = await runAudit(url); //service called

    const reportData = {
      url,
      scores: {
        performance: lhr.categories.performance.score,
        accessibility: lhr.categories.accessibility.score,
        seo: lhr.categories.seo.score,
        bestPractices: lhr.categories["best-practices"].score,
      },
      summary: "AI-generated summary here...",
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
