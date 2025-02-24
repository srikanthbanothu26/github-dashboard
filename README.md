# GitHub Repository Activity Dashboard

## Overview
This project is a **GitHub OAuth application** that enables users to authenticate via GitHub, select repositories, and explore a **repository activity dashboard**. The dashboard visualizes both **team-level and individual** contributions using interactive charts.

---

##  Features
### **1️⃣ GitHub OAuth Authentication**
- Users can **log in via GitHub** using OAuth.
- Allows users to **select multiple repositories** to monitor.

### **2️⃣ Repository Selection & Sidebar Navigation**
- Displays a **list of selected repositories** in a sidebar.
- Clicking a repository **updates the dashboard** with relevant metrics.

### **3️⃣ Interactive Repository Activity Dashboard**
- **Visualizes key repository metrics over time.**
- **Team-Level Trends**: Provides an overview of collective repository activity.
- **Individual Trends**: Highlights a selected developer’s contributions.

### **4️⃣ Metrics Displayed**
- **PRs Merged Per Week/Month**: Tracks the number of pull requests merged.
- **Average Merge Time**: Calculates the average duration from PR creation to merge.
- **Branch Activity**: Monitors branch creation/deletion frequency.

### **5️⃣ Data Presentation**
#### **Line Chart for Trends Over Time**
- **Time Range Filters**: Users can select **3 months, 6 months, or custom date range**.
- **Enable/Disable Trend Lines**: Checkboxes allow toggling of trend lines.

#### **Comparison Overlay**
- **Team vs. Individual Performance**: Users can overlay **individual developer’s PR trends** on top of the team’s trends.
- **Team Averages**: Displays the average PR merge count for the team.

#### **Contributors List with Eye Icon**
- Displays **a list of contributors** under the chart.
- Users can **toggle visibility** of individual contributor data using an **eye icon**.

---

##  Tech Stack
- **Frontend:** React, Recharts, Axios
- **Backend:** Node.js, Express
- **Authentication:** GitHub OAuth (via Passport.js)
- **API:** GitHub REST API

---

## Getting Started
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/your-username/github-dashboard.git
cd github-dashboard
```

### **2️⃣ Install Dependencies**
```sh
# Backend Setup
cd backend
npm install

# Frontend Setup
cd ../frontend
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a `.env` file in the `backend/` folder and add:
```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
SESSION_SECRET=random_secret
CALLBACK_URL=http://localhost:5000/auth/github/callback
FRONTEND_URL=http://localhost:5173
```

### **4️⃣ Run the Application**
```sh
# Start Backend Server
cd backend
node server.js

# Start Frontend
cd frontend
npm run dev
```

### **5️⃣ Open in Browser**
Go to `http://localhost:5173` and log in via GitHub.

---



## License
This project is open-source under the **MIT License**.
