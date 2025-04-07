import { useState } from "react";
import axios from "axios";

function AuditForm({ setReport, loading, setLoading, error, setError }) {
  const [url, setUrl] = useState("");

  const handleAudit = async () => {
    if (!url) return setError("Please enter a URL!");
    setLoading(true);
    setError(null);

    let formattedUrl = url.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    try {
      const response = await axios.post("http://localhost:3000/api/audit/generate", { url: formattedUrl });
      if (response.data?.error) {
        setError(response.data.error);
        setReport(null); // optionally clear previous report
      } else {
        setReport(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred while generating the report.");
      setReport(null); // optionally clear previous report
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleAudit();
      }}
      className="audit-form"
    >
      <div className="input-group">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" />
        {error && <p className="error-msg">{error}</p>}
      </div>
      <button type="submit" disabled={loading}>
        {loading ? "Auditing..." : "Run Audit"}
      </button>
    </form>
  );
}

export default AuditForm;
