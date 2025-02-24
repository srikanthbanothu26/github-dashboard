import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [allPRTrends, setAllPRTrends] = useState([]);
  const [userPRTrends, setUserPRTrends] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [timeRange, setTimeRange] = useState("week");
  const [showUserOnly, setShowUserOnly] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/auth/user", { withCredentials: true })
      .then((response) => {
        setUser(response.data.user || null);
      })
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (user) {
      axios.get("http://localhost:5000/api/repositories", { withCredentials: true })
        .then((response) => setRepositories(response.data.repositories))
        .catch(() => setRepositories([]));
    }
  }, [user]);

  const fetchRepoMetrics = (repoName) => {
    setSelectedRepo(repoName);
    setAllPRTrends([]);
    setUserPRTrends([]);

    axios.get(`http://localhost:5000/api/metrics/prs/${repoName}`, { withCredentials: true })
      .then((response) => {
        processPRTrends(response.data.allPRs, setAllPRTrends);
        processPRTrends(response.data.userPRs, setUserPRTrends);
      })
      .catch(() => {
        setAllPRTrends([]);
        setUserPRTrends([]);
      });
  };

  const processPRTrends = (prs, setTrends) => {
    const groupedCounts = prs.reduce((acc, pr) => {
      const key = timeRange === "week"
        ? dayjs(pr.merged_at).startOf("week").format("YYYY-MM-DD")
        : dayjs(pr.merged_at).startOf("month").format("YYYY-MM");

      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const chartData = Object.keys(groupedCounts).map((date) => ({
      date,
      merged: groupedCounts[date],
    }));

    setTrends(chartData);
  };

  const changeTimeRange = (range) => {
    setTimeRange(range);
  };

  const toggleUserView = () => {
    setShowUserOnly(!showUserOnly);
  };


  const toggleContributor = (username) => {
    setContributors(prev =>
      prev.map(contributor =>
        contributor.username === username ? { ...contributor, active: !contributor.active } : contributor
      )
    );

    // Filter PRs based on active contributors
    const activeContributors = contributors.filter(contributor => contributor.active).map(c => c.username);
    const filteredPRs = allPRTrends.filter(pr => activeContributors.includes(pr.user));

    processPRTrends(filteredPRs, setFilteredPRTrends);
  };

  return (
    <AuthContext.Provider value={{ user, repositories, selectedRepo, allPRTrends, userPRTrends, fetchRepoMetrics, contributors ,toggleContributor,timeRange, changeTimeRange, showUserOnly, toggleUserView }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
