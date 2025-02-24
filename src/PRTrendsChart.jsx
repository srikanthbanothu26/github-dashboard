import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { useAuth } from "./AuthContext";
import { Eye, EyeOff } from "lucide-react";
import dayjs from "dayjs";

const PRTrendsChart = () => {
  const { allPRTrends, userPRTrends, contributors, toggleContributor } = useAuth();
  const [timeRange, setTimeRange] = useState("3m");
  const [showComparison, setShowComparison] = useState(true);
  const [showTeamTrend, setShowTeamTrend] = useState(true);
  const [showUserTrend, setShowUserTrend] = useState(true);

  // Filter PR trends based on selected time range
  const filterPRTrends = (data) => {
    if (!data) return [];
    const cutoffDate = dayjs().subtract(timeRange === "3m" ? 3 : 6, "month");
    return data.filter((pr) => dayjs(pr.date).isAfter(cutoffDate));
  };

  const teamChartData = showTeamTrend ? filterPRTrends(allPRTrends) : [];
  const userChartData = showUserTrend ? filterPRTrends(userPRTrends) : [];

  // Calculate Team Average PRs per Time Unit
  const calculateTeamAverages = () => {
    if (!teamChartData.length) return [];
    const totalPRs = teamChartData.reduce((sum, pr) => sum + pr.merged, 0);
    return totalPRs / teamChartData.length;
  };

  const teamAverage = calculateTeamAverages();

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>PRs Merged Per {timeRange === "3m" ? "3 Months" : "6 Months"}</h2>

      {/* Time Range & Comparison Toggle */}
      <div style={buttonContainerStyle}>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} style={dropdownStyle}>
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
        </select>
        <button onClick={() => setShowComparison(!showComparison)} style={buttonStyle(showComparison)}>
          {showComparison ? "Hide Comparison" : "Show Comparison"}
        </button>
      </div>

      {/* Checkboxes for Trend Lines */}
      <div style={checkboxContainerStyle}>
        <label style={checkboxLabelStyle}>
          <input type="checkbox" checked={showTeamTrend} onChange={() => setShowTeamTrend(!showTeamTrend)} />
          Show Team Trend
        </label>
        <label style={checkboxLabelStyle}>
          <input type="checkbox" checked={showUserTrend} onChange={() => setShowUserTrend(!showUserTrend)} />
          Show My Trend
        </label>
      </div>

      {/* Line Chart */}
      {teamChartData.length > 0 || userChartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <LineChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip />
            {/* Team Trend */}
            {showTeamTrend && <Line type="monotone" dataKey="merged" stroke="#3498db" strokeWidth={2} data={teamChartData} name="Team Trend" />}
            {/* User Trend */}
            {showUserTrend && showComparison && (
              <Line type="monotone" dataKey="merged" stroke="#e74c3c" strokeWidth={2} data={userChartData} name="Your PRs" />
            )}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p style={noDataStyle}>No PR data available.</p>
      )}

      {/* Team Averages */}
      {teamChartData.length > 0 && (
        <p style={teamAvgStyle}>
          <strong>Team Average PRs:</strong> {teamAverage.toFixed(2)}
        </p>
      )}

      {/* Contributors List */}
      <div style={contributorsContainerStyle}>
        <h3 style={titleStyle}>Contributors</h3>
        <div style={contributorsListStyle}>
          {contributors.map((contributor) => (
            <div key={contributor.username} style={contributorStyle}>
              <span>{contributor.username}</span>
              <button onClick={() => toggleContributor(contributor.username)} style={iconButtonStyle}>
                {contributor.active ? <Eye color="white" /> : <EyeOff color="gray" />}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* 🔥 Styles */
const containerStyle = { width: "100%", maxWidth: "700px", background: "#2c3e50", padding: "20px", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center" };
const titleStyle = { color: "white", textAlign: "center", marginBottom: "15px" };
const buttonContainerStyle = { textAlign: "center", marginBottom: "15px" };
const dropdownStyle = { padding: "8px", borderRadius: "5px", background: "#34495e", color: "white", border: "none", marginRight: "10px" };
const checkboxContainerStyle = { display: "flex", justifyContent: "center", gap: "20px", marginBottom: "15px" };
const checkboxLabelStyle = { color: "white", fontSize: "14px", display: "flex", alignItems: "center", gap: "5px" };
const buttonStyle = (active) => ({
  padding: "8px 16px",
  background: active ? "#3498db" : "#7f8c8d",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "0.3s",
});
const noDataStyle = { color: "white", textAlign: "center" };
const teamAvgStyle = { color: "#ecf0f1", textAlign: "center", marginTop: "10px", fontSize: "16px" };
const contributorsContainerStyle = { marginTop: "20px", width: "100%", textAlign: "center" };
const contributorsListStyle = { maxHeight: "120px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px" };
const contributorStyle = { display: "flex", alignItems: "center", justifyContent: "space-between", width: "90%", color: "white" };
const iconButtonStyle = { background: "transparent", border: "none", cursor: "pointer" };

export default PRTrendsChart;
