# ProjectSync AI

**An Intelligent Student Project Collaboration and Progress Monitoring System**

ProjectSync AI is an academic student-focused project management, collaboration, and progress monitoring platform designed to eliminate unequal contributions, poor team coordination, and lack of transparency.

---

## 🌟 Problem Addressed

Traditional project management tools (e.g. Jira, Trello, Notion) are designed for corporate software teams or general productivity and lack student-focused academic contribution monitoring. Key issues addressed:
- Unequal contribution among student team members
- Poor team coordination and task assignment tracking
- Missed academic deadlines
- Lack of transparency regarding individual effort
- Absence of intelligent, rule-based AI assistance for project delay risk detection

---

## 🚀 Approved Core Modules

1. **Module 1: User & Team Management**
   - Student & Faculty registration and JWT authentication.
   - Team creation with auto-generated 7-character join codes.
   - Member management by Student ID or Email.
2. **Module 2: Project & Task Management**
   - Academic project creation with start dates, deadlines, and status (`Planning`, `Active`, `Completed`).
   - Prioritized task items (`Low`, `Medium`, `High`) with progress percentages (0–100%) and assignment.
3. **Module 3: Collaboration & Progress Monitoring**
   - Real-time project completion percentage calculations.
   - Individual member contribution metrics computed as `(Completed Tasks / Assigned Tasks) * 100%`.
   - Explicit academic disclaimer statement: *"Contribution is estimated from recorded project activity and should be used as a progress indicator rather than a final evaluation."*
   - Team activity and update feed.
4. **Module 4: AI-Based Project Assistance**
   - Rule-based analysis engine evaluating real database state.
   - Generates Overdue Task Alerts, Upcoming Deadline Warnings, Workload Imbalance Observations, Project Risk Flags, Task Reallocation Recommendations, and Positive Progress Reinforcements.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, React Router DOM v6, Axios, Lucide React, Vanilla CSS (Design Tokens, Responsive CSS)
- **Backend:** Node.js, Express.js, Mongoose, Jsonwebtoken (JWT), Bcryptjs, Cors, Dotenv
- **Database:** MongoDB (Local Windows Service on port `27017`)
- **API:** RESTful APIs with JSON response structures

---

## 📁 Directory Structure

```
ProjectSync-AI/
├── backend/
│   ├── src/
│   │   ├── config/       # MongoDB Connection Handler
│   │   ├── controllers/  # Auth, Team, Project, Task, Progress, AI, Admin, Seed Controllers
│   │   ├── middleware/   # JWT Protect & Role-Based Authorization, Error Handler
│   │   ├── models/       # User, Team, Project, Task, Update, AIInsight Schemas
│   │   ├── routes/       # Express Route Declarations
│   │   └── server.js     # Express App Entry Point
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/   # Sidebar, Navbar, ProtectedRoute, Modal
│   │   ├── context/      # AuthContext, ProjectContext
│   │   ├── pages/        # LandingPage, LoginPage, RegisterPage, StudentDashboard, TeamPage, 
│   │   │                 # ProjectListPage, ProjectDetailsPage, TaskManagementPage, 
│   │   │                 # ProgressDashboard, CollaborationPage, AIInsightsPage, AdminDashboard, ProfilePage
│   │   ├── api.js        # Axios Client Configuration
│   │   ├── App.jsx       # React Router Definitions
│   │   ├── index.css     # CSS Design Tokens & Stylesheet
│   │   └── main.jsx      # Vite React Entry Point
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── ProjectSync_AI.postman_collection.json # API Postman Collection
├── README.md
└── PROJECT_STATUS.md
```

---

## ⚡ Quick Start Guide

### 1. Prerequisites
- **Node.js**: v18+ (Tested on v24.19.0)
- **MongoDB**: Active MongoDB server instance (mongodb://127.0.0.1:27017/projectsync_ai)

### 2. Running Backend Server
```bash
cd backend
npm install
npm start
```
*Backend runs on http://localhost:5000*

### 3. Running Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on http://localhost:3000*

---

## 🔑 Key API Endpoints

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register Student or Faculty account | Public |
| `POST` | `/api/auth/login` | Authenticate & acquire JWT Token | Public |
| `POST` | `/api/teams` | Create new team | Private (Student) |
| `POST` | `/api/teams/join` | Join team using join code | Private (Student) |
| `POST` | `/api/projects` | Create academic project | Private |
| `GET` | `/api/projects/:id/tasks` | Get project task board | Private |
| `PATCH` | `/api/tasks/:id/status` | Update task status & progress % | Private |
| `GET` | `/api/projects/:id/progress` | Get project overall progress stats | Private |
| `GET` | `/api/projects/:id/contributions` | Get per-member contribution stats | Private |
| `POST` | `/api/projects/:id/ai-analyze` | Run AI rule-based analysis engine | Private |
| `GET` | `/api/admin/reports` | Get global faculty monitoring metrics | Private (Admin/Faculty) |
| `POST` | `/api/seed` | Seed realistic demo dataset | Public |

---

## 🔑 Demo Login Credentials

- **Faculty Admin:** `admin@college.edu` / `admin123`
- **Student Leader (Team Alpha):** `alex@student.edu` / `student123`
- **Student Member:** `priya@student.edu` / `student123`
