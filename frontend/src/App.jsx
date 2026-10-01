import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';

import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StudentDashboard from './pages/StudentDashboard';
import TeamPage from './pages/TeamPage';
import ProjectListPage from './pages/ProjectListPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import TaskManagementPage from './pages/TaskManagementPage';
import ProgressDashboard from './pages/ProgressDashboard';
import CollaborationPage from './pages/CollaborationPage';
import AIInsightsPage from './pages/AIInsightsPage';
import AdminDashboard from './pages/AdminDashboard';
import ProfilePage from './pages/ProfilePage';

// Layout wrapper for authenticated pages
const AppLayout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ProjectProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Student Authenticated Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AppLayout><StudentDashboard /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/teams" element={
              <ProtectedRoute>
                <AppLayout><TeamPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/projects" element={
              <ProtectedRoute>
                <AppLayout><ProjectListPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/projects/:id" element={
              <ProtectedRoute>
                <AppLayout><ProjectDetailsPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/tasks" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AppLayout><TaskManagementPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/progress" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AppLayout><ProgressDashboard /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/collaboration" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AppLayout><CollaborationPage /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/ai-insights" element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <AppLayout><AIInsightsPage /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Admin / Faculty Authenticated Routes */}
            <Route path="/admin" element={
              <ProtectedRoute allowedRoles={['ADMIN', 'FACULTY']}>
                <AppLayout><AdminDashboard /></AppLayout>
              </ProtectedRoute>
            } />

            <Route path="/profile" element={
              <ProtectedRoute>
                <AppLayout><ProfilePage /></AppLayout>
              </ProtectedRoute>
            } />

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </ProjectProvider>
    </AuthProvider>
  );
}

export default App;
