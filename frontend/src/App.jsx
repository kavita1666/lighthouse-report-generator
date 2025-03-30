import { useState } from "react";
import AuditForm from "./components/AuditForm";
import ReportDisplay from "./components/ReportDisplay";
import './App.css';

function App() {
  const [report, setReport] = useState(null);

  console.log('-----here response', report);

  return (
    <div className="container">
      <h1>Lighthouse Report Generator</h1>
      <AuditForm setReport={setReport} />
      {report && <ReportDisplay report={report} />}
    </div>
  );
}

export default App;
