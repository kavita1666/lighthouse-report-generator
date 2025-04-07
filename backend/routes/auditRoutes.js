const express = require("express");
const { runAudit } = require("../utils/lighthouseHelper");
const Report = require("../models/Report");
const router = express.Router();

router.post("/generate", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "Add a valid url" });

  try {
    const { lhr, jsonPath, htmlPath } = await runAudit(url); //service called

    const scores = {
      performance: lhr?.categories?.performance?.score,
      accessibility: lhr?.categories?.accessibility?.score,
      seo: lhr?.categories?.seo?.score,
      bestPractices: lhr?.categories["best-practices"]?.score,
    };

    // Handle null scores — meaning audit failed silently
    const hasNullScores = Object.values(scores).some((score) => score === null);

    if (!lhr || hasNullScores) {
      return res.status(500).json({ error: "Audit failed or incomplete. Please check the URL and try again." });
    }

    const reportData = {
      url,
      scores,
      lhr,
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
