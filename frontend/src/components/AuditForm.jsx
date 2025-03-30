import { useState } from "react";
import axios from "axios";

function AuditForm({ setReport }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAudit = async () => {
    if (!url) return alert("Please enter a URL!");
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/api/audit/generate", { url });
      setReport(response.data);
    } catch (err) {
      alert("Error running audit", err);
    }
    setLoading(false);
  };

  return (
    <div>
      <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Enter website URL" />
      <button onClick={handleAudit} disabled={loading}>{loading ? "Auditing..." : "Run Audit"}</button>
    </div>
  );
}

export default AuditForm;
