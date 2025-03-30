const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

exports.runLighthouse = async (url) => {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });
  const options = { logLevel: "info", output: "json", port: chrome.port };
  const runnerResult = await lighthouse(url, options);
  await chrome.kill();
  return runnerResult.lhr;
};