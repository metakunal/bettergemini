import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./usageDashboard.css";

const dummyUsageData = {
  tokensLeft: 3200,
  avgTokensPerPrompt: 160,
  promptUsageLast7Days: [
    { day: "Sun", prompts: 5 },
    { day: "Mon", prompts: 8 },
    { day: "Tue", prompts: 4 },
    { day: "Wed", prompts: 7 },
    { day: "Thu", prompts: 6 },
    { day: "Fri", prompts: 9 },
    { day: "Sat", prompts: 3 },
  ],
};

const UsageDashboard = ({ onClose }) => {
  const { tokensLeft, avgTokensPerPrompt, promptUsageLast7Days } =
    dummyUsageData;
  const estPromptsLeft = Math.floor(tokensLeft / avgTokensPerPrompt);

  return (
    <div className="dashboard-overlay" onClick={onClose}>
      <div className="dashboard" onClick={(e) => e.stopPropagation()}>
        <h2>Usage Analytics</h2>
        <div className="stats">
          <p><strong>Tokens Left Today:</strong> {tokensLeft}</p>
          <p><strong>Avg Tokens per Prompt:</strong> {avgTokensPerPrompt}</p>
          <p><strong>Estimated Prompts Left:</strong> {estPromptsLeft}</p>
        </div>
        <div className="chart-container">
          <h3>Prompt Usage (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={promptUsageLast7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="prompts" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default UsageDashboard;
