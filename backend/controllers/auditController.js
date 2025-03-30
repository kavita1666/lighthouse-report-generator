import lighthouse from "lighthouse";
//`const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");
const fs = require("fs");
const path = require("path");
const { generateSummary } = require("../utils/openaiHelper");

async function runLighthouse(url) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const options = { logLevel: "info", output: "json", port: chrome.port };
  const runnerResult = await lighthouse(url, options);
  await chrome.kill();
  return runnerResult.lhr;
}

exports.runAudit = async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });
    
    const report = await runLighthouse(url);
    const summary = await generateSummary(report);
    
    const filename = `report-${Date.now()}.json`;
    const filePath = path.join(__dirname, "../public", filename);
    fs.writeFileSync(filePath, JSON.stringify(report, null, 2));
    
    res.json({
      summary,
      scores: {
        performance: report.categories.performance.score,
        accessibility: report.categories.accessibility.score,
        seo: report.categories.seo.score,
        bestPractices: report.categories["best-practices"].score,
      },
      downloadUrl: `/public/${filename}`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
