import React from "react";
import { useAuth } from "./AuthContext";
import PRTrendsChart from "./PRTrendsChart";

const App = () => {
  const { user, repositories, selectedRepo, fetchRepoMetrics } = useAuth();

  return (
    <div style={{ display: "flex", height: "100vh", width: "100vw", fontFamily: "Arial, sans-serif", background: "#181818", color: "#fff", overflow: "hidden" }}>

      {/* Sidebar (Repositories) */}
      <aside style={{ width: "250px", background: "#2c3e50", padding: "15px", overflowY: "auto", height: "100vh", boxSizing: "border-box" }}>
        {user && <h3 style={{ color: "#ecf0f1", textAlign: "center" }}>Welcome, {user.username}!</h3>}
        <h2 style={{ borderBottom: "2px solid #ecf0f1", paddingBottom: "10px", textAlign: "center", color: "#ecf0f1" }}>Repositories</h2>
        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px", maxHeight: "80vh", overflowY: "auto" }}>
          {repositories.length > 0 ? (
            repositories.map((repo) => (
              <li
                key={repo.id}
                onClick={() => fetchRepoMetrics(repo.name)}
                style={{
                  cursor: "pointer",
                  padding: "12px",
                  margin: "5px 0",
                  background: selectedRepo === repo.name ? "#3498db" : "transparent",
                  borderRadius: "6px",
                  textAlign: "center",
                  transition: "0.3s",
                  fontWeight: "bold",
                  color: selectedRepo === repo.name ? "#fff" : "#ecf0f1",
                  boxShadow: selectedRepo === repo.name ? "0px 0px 8px rgba(52, 152, 219, 0.8)" : "none",
                }}
              >
                {repo.name}
              </li>
            ))
          ) : (
            <p style={{ textAlign: "center", color: "#ecf0f1" }}>No repositories found.</p>
          )}
        </ul>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", padding: "20px", height: "100vh", overflowY: "auto" }}>

        {/* Header */}
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "10px 20px", boxSizing: "border-box" }}>
          <h1 style={{ color: "#ecf0f1", fontSize: "24px", fontWeight: "bold", textAlign: "center", flex: 1 }}>GitHub Dashboard</h1>
          {user && (
            <a href="http://localhost:5000/auth/logout">
              <button style={{ padding: "10px 16px", background: "#e74c3c", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", transition: "0.3s", fontSize: "16px" }}>
                Logout
              </button>
            </a>
          )}
        </header>

        {/* PR Trends */}
        {user ? (
          <section style={{ width: "90%", maxWidth: "1000px", background: "#2c3e50", padding: "20px", borderRadius: "10px", textAlign: "center", boxSizing: "border-box", flex: 1, overflowY: "auto" }}>
            {selectedRepo ? (
              <>
                <h2 style={{ color: "#3498db", marginBottom: "10px" }}>PR Trends for {selectedRepo}</h2>
                <PRTrendsChart />
              </>
            ) : (
              <p style={{ textAlign: "center", color: "#ecf0f1" }}>Select a repository to view PR trends.</p>
            )}
          </section>
        ) : (
          <a href="http://localhost:5000/auth/github">
            <button style={{ padding: "12px 20px", background: "#3498db", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", transition: "0.3s", fontSize: "18px" }}>
              Login with GitHub
            </button>
          </a>
        )}
      </main>

      {/* Contributors Section (Right Side) */}
      <aside style={{ width: "250px", background: "#2c3e50", padding: "15px", overflowY: "auto", height: "100vh", boxSizing: "border-box" }}>
        <h2 style={{ borderBottom: "2px solid #ecf0f1", paddingBottom: "10px", textAlign: "center", color: "#ecf0f1" }}>Contributors</h2>
        {/* Contributors List will be inside PRTrendsChart */}
      </aside>
    </div>
  );
};

export default App;
