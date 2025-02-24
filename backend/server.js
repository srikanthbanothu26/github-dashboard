require("dotenv").config();
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const axios = require("axios");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// GitHub OAuth
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      profile.accessToken = accessToken;
      profile.username = profile._json.login;
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, { id: user.id, username: user.username, accessToken: user.accessToken });
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Authentication Routes
app.get("/auth/github", passport.authenticate("github", { scope: ["repo"] }));
app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: process.env.FRONTEND_URL,
    successRedirect: process.env.FRONTEND_URL,
  })
);
app.get("/auth/user", (req, res) => {
  res.json({ user: req.isAuthenticated() ? req.user : null });
});
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect(process.env.FRONTEND_URL);
  });
});

// Fetch user repositories
app.get("/api/repositories", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: {
        Authorization: `Bearer ${req.user.accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    res.json({ repositories: response.data });
  } catch (error) {
    console.error("Error fetching repositories:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch repositories" });
  }
});

// Fetch all merged PRs for a repository (team + individual)
app.get("/api/metrics/prs/:repoName", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { repoName } = req.params;

  try {
    const response = await axios.get(
      `https://api.github.com/repos/${req.user.username}/${repoName}/pulls?state=closed`,
      {
        headers: {
          Authorization: `Bearer ${req.user.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    const allPRs = response.data.filter(pr => pr.merged_at !== null);
    const userPRs = allPRs.filter(pr => pr.user.login === req.user.username);

    const contributors = [...new Set(allPRs.map(pr => pr.user.login))].map(username => ({
      username,
      active: true, // Default: All contributors visible
    }));

    res.json({ allPRs, userPRs, contributors});
  } catch (error) {
    console.error("Error fetching PRs:", error.response?.data || error.message);
    res.status(500).json({ message: "Failed to fetch PRs" });
  }
});


// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
