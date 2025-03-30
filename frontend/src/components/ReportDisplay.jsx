import "../App.css";

const BACKEND_URL = "http://localhost:3000";

function ReportDisplay({ report }) {
  console.log("---report-----", report.jsonPath);

  const getFileName = (filePath) => filePath.split("/").pop(); // Extract filename

  const handleDownload = (filePath) => {
    const fileName = getFileName(filePath);
    const fileUrl = `${BACKEND_URL}/reports/${fileName}`;
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="report">
      <h2>Audit Results</h2>
      <p>Performance: {report.scores.performance * 100}%</p>
      <p>Accessibility: {report.scores.accessibility * 100}%</p>
      <p>SEO: {report.scores.seo * 100}%</p>
      <p>Best Practices: {report.scores.bestPractices * 100}%</p>
      <h3>AI Suggestions</h3>
      <p>{report.summary}</p>
      <div>
        <button onClick={() => handleDownload(report.jsonPath)}>Download JSON Report</button>

        <a href={`/reports/${getFileName(report.htmlPath)}`} target="_blank" rel="noopener noreferrer">
          <button>Open Report</button>
        </a>
      </div>
    </div>
  );
}

export default ReportDisplay;
