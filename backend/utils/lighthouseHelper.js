import lighthouse from "lighthouse";
import puppeteer from "puppeteer";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { getSuggestions } from "./aiHelper.js";

// Fix __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAudit(url) {
  const browser = await puppeteer.launch({ headless: true });
  const port = new URL(browser.wsEndpoint()).port;

  const result = await lighthouse(url, {
    port,
    output: "html", // Use a single format to avoid issues
  });

  const { lhr, report } = result;
  await browser.close();

  const reportDir = path.join(__dirname, "../reports");
  await fs.ensureDir(reportDir);

  const timestamp = Date.now();
  const jsonPath = path.join(reportDir, `${timestamp}.json`);
  const htmlPath = path.join(reportDir, `${timestamp}.html`);
  const suggestions = await getSuggestions(lhr);

  await fs.writeFile(jsonPath, JSON.stringify(lhr, null, 2));
  await fs.writeFile(htmlPath, report); // Fix here: use `report` directly

  return { lhr, jsonPath, htmlPath, suggestions };
}

export { runAudit };
