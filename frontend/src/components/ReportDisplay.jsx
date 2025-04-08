import { useEffect, useRef, useState } from "react";
import "../App.css";
import { VitalsSummary } from "./VitalsSummary";

// added these to explicitly open the report using backend port
const BACKEND_URL = "http://localhost:3000";

function ReportDisplay({ report }) {
  const [reportUrl, setReportUrl] = useState(null);
  const [notableIssues, setNotableIssues] = useState([]);
  const iframeRef = useRef(null);

  useEffect(() => {
    const match = report.summary.match(/Notable issues:\s*([\s\S]*?)\n\s*Based on the above/);
    if (match && match[1]) {
      const issues = match[1]
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("-"));

      setNotableIssues(issues);
    }
  }, [report.summary]);

  function loadReport(filePath) {
    const fileName = filePath.split("/").pop();
    const fileUrl = `${BACKEND_URL}/reports/${fileName}`;
    setReportUrl(fileUrl);
  }

  const metricsSummary = {
    lcp: (report.lhr.audits["largest-contentful-paint"]?.numericValue / 1000).toFixed(1), // in seconds
    cls: report.lhr.audits["cumulative-layout-shift"]?.numericValue.toFixed(2),
    fcp: (report.lhr.audits["first-contentful-paint"]?.numericValue / 1000).toFixed(1), // in seconds
    ttfb: (report.lhr.audits["server-response-time"]?.numericValue / 1000).toFixed(1), // in seconds
    inp: report.lhr.audits["interactive"]?.numericValue ? report.lhr.audits["interactive"].numericValue.toFixed(0) : "N/A", // in milliseconds
  };

  function formatIssueWithLink(text) {
    const urlRegex = /(https?:\/\/[^\s\]]+)/g;
    const linkTextRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/;

    // First handle markdown-style [text](url)
    const markdownMatch = text.match(linkTextRegex);
    if (markdownMatch) {
      const [_, linkText, url] = markdownMatch;
      const textBefore = text.split(markdownMatch[0])[0];
      return `${textBefore}<a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
    }

    // Fallback: auto-link plain URLs
    return text.replace(urlRegex, (url) => {
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
    });
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/([A-Z])/g, " $1");
  }

  return (
    <div className="report">
      {/* Audit results */}
      <div className="modal-container">
        <h2 className="heading">Audit Results</h2>
        {Object.entries(report.scores).map(([key, value]) => (
          <p key={key}>
            <b>{capitalizeFirstLetter(key)}:</b> <span style={{ color: "blue" }}>{value * 100}%</span>
          </p>
        ))}
      </div>

      {/* Vitals Summary */}
      <VitalsSummary metrics={metricsSummary} />

      {/* Display LLM report generated */}
      <div className="modal-container">
        <h2 className="heading">Notable Lighthouse Issues</h2>
        <ul className="llm-issues-list">
          {notableIssues?.map((issue, index) => (
            <li key={index} dangerouslySetInnerHTML={{ __html: formatIssueWithLink(issue.slice(2)) }} />
          ))}
        </ul>
      </div>

      {/* Button to display report in iframe */}
      <button onClick={() => loadReport(report.htmlPath)}>Load Report Below</button>
      
      {/* Display the loaded report */}
      {reportUrl && <iframe ref={iframeRef} src={reportUrl} title="Lighthouse Report" width="100%" height="600px" style={{ border: "1px solid #ccc", marginTop: "20px" }} />}
    </div>
  );
}

export default ReportDisplay;
