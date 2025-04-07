import axios from "axios";

const sendToLLM = async (prompt) => {
  const hfApiKey = "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";

  const response = await axios.post(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1",
    { inputs: prompt },
    {
      headers: {
        Authorization: `Bearer ${hfApiKey}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const preparePrompt = (insights) => {
  return `
  I have run a Lighthouse audit on my website. Here are the results:
  
  Performance Score: ${insights.performanceScore}
  Accessibility Score: ${insights.accessibilityScore}
  SEO Score: ${insights.seoScore}
  Best Practices Score: ${insights.bestPracticesScore}
  
  Notable issues:
  - ${insights.issues.renderBlockingResources}
  - ${insights.issues.unusedCSS}
  - ${insights.issues.unusedJS}
  - LCP: ${insights.issues.largestContentfulPaint}
  - CLS: ${insights.issues.cumulativeLayoutShift}
  - ${insights.issues.imageSize}
  
  Based on the above, what improvements would you recommend to boost performance, SEO, and user experience?
  Keep it practical and technical where possible.
  `;
};

const extractInsights = (lhr) => {
  const { categories, audits } = lhr;

  return {
    performanceScore: categories.performance.score,
    accessibilityScore: categories.accessibility.score,
    seoScore: categories.seo.score,
    bestPracticesScore: categories["best-practices"].score,

    issues: {
      renderBlockingResources: audits["render-blocking-resources"]?.description,
      unusedCSS: audits["unused-css-rules"]?.description,
      unusedJS: audits["unused-javascript"]?.description,
      largestContentfulPaint: audits["largest-contentful-paint"]?.displayValue,
      cumulativeLayoutShift: audits["cumulative-layout-shift"]?.displayValue,
      imageSize: audits["uses-optimized-images"]?.description,
    },
  };
};

async function summarizeReportUsingLLM(lhr) {
  const insights = extractInsights(lhr);
  const prompt = preparePrompt(insights);
  const suggestions = await sendToLLM(prompt);
  return suggestions;
}
// Export the function for use in other modules
export { summarizeReportUsingLLM };
