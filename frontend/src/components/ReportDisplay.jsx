import { useRef, useState } from "react";
import "../App.css";
import { VitalsSummary } from "./VitalsSummary";

// added these to explicitly open the report using backend port
const BACKEND_URL = "http://localhost:3000";

function ReportDisplay({ report }) {
  const [reportUrl, setReportUrl] = useState(null);
  const iframeRef = useRef(null);

  function loadReport(filePath) {
    const fileName = filePath.split("/").pop();
    const fileUrl = `${BACKEND_URL}/reports/${fileName}`;
    setReportUrl(fileUrl);
  }

  const metricsSummary = {
    lcp: (report.lhr.audits["largest-contentful-paint"].numericValue / 1000).toFixed(1), // in seconds
    cls: report.lhr.audits["cumulative-layout-shift"].numericValue.toFixed(2),
    fcp: (report.lhr.audits["first-contentful-paint"].numericValue / 1000).toFixed(1), // in seconds
    ttfb: (report.lhr.audits["server-response-time"].numericValue / 1000).toFixed(1), // in seconds
  };

  return (
    <div className="report">
      <h2>Audit Results</h2>
      <p>Performance: {report.scores.performance * 100}%</p>
      <p>Accessibility: {report.scores.accessibility * 100}%</p>
      <p>SEO: {report.scores.seo * 100}%</p>
      <p>Best Practices: {report.scores.bestPractices * 100}%</p>

      <VitalsSummary metrics={metricsSummary} />

      <button onClick={() => loadReport(report.htmlPath)}>Load Report Below</button>

      {/* Display the loaded report */}
      {reportUrl && <iframe ref={iframeRef} src={reportUrl} title="Lighthouse Report" width="100%" height="600px" style={{ border: "1px solid #ccc", marginTop: "20px" }} />}
    </div>
  );
}

export default ReportDisplay;
