import React from "react";
import "../App.css";

export const Metric = ({ label, value, unit = "s", threshold = 1, good }) => {
  const isGood = good(value);
  const barColor = isGood ? "green" : "orange";
  const percentWidth = Math.min((value / threshold) * 100, 100);

  return (
    <div className="metric-card">
      <div className="metric-label">{label}</div>
      <div className="metric-value">
        {value} {unit}
      </div>
      <div className="metric-bar-bg">
        <div
          className="metric-bar-fill"
          style={{
            width: `${percentWidth}%`,
            backgroundColor: barColor,
          }}
        />
      </div>
    </div>
  );
};
