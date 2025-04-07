import { useState } from "react";
import AuditForm from "./components/AuditForm";
import ReportDisplay from "./components/ReportDisplay";
import "./App.css";

function App() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  return (
    <div className="container">
      <h1>Lighthouse Report Generator</h1>
      <AuditForm setReport={setReport} setLoading={setLoading} loading={loading} setError={setError} error={error} />
      {loading ? <h3>Running Analysis....</h3> : report && <ReportDisplay report={report} />}
    </div>
  );
}

export default App;
