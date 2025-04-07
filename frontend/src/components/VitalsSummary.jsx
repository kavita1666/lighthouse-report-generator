import React from "react";
import "../App.css";
import { Metric } from "./Metrics";

export const VitalsSummary = ({ metrics }) => {
  const { lcp, cls, fcp, ttfb, inp } = metrics;

  return (
    <div className="vitals-container">
      <div className="vitals-header">
        <h2>
          Core Web Vitals Assessment: <span className="status-pass">Passed</span>
        </h2>
        <p className="subtext">Latest 28-day collection</p>
      </div>
      <div className="metrics-grid">
        <Metric label="Largest Contentful Paint (LCP)" value={parseFloat(lcp)} unit="s" threshold={2.5} good={(v) => v <= 2.5} />
        <Metric label="Cumulative Layout Shift (CLS)" value={parseFloat(cls)} unit="" threshold={0.1} good={(v) => v <= 0.1} />
        <Metric label="First Contentful Paint (FCP)" value={parseFloat(fcp)} unit="s" threshold={1.8} good={(v) => v <= 1.8} />
        <Metric label="Time to First Byte (TTFB)" value={parseFloat(ttfb)} unit="s" threshold={0.8} good={(v) => v <= 0.8} />
        <Metric label="Interaction to Next Paint (INP)" value={parseFloat(inp)} unit="ms" threshold={200} good={(v) => v <= 200} />
      </div>
    </div>
  );
};
