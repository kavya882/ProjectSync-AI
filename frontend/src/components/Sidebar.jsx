import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  LineChart, 
  MessageSquare, 
  Sparkles, 
  User, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();
  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'FACULTY');

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Zap size={22} />
        </div>
        <div>
          <div className="sidebar-logo-text">ProjectSync AI</div>
          <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Academic Progress Monitor</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {isAdmin ? (
          <>
            <div className="nav-section-label">Faculty Monitor</div>
            <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <ShieldCheck size={18} /> Admin Dashboard
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FolderKanban size={18} /> All Projects
            </NavLink>
            <NavLink to="/teams" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Teams List
            </NavLink>
          </>
        ) : (
          <>
            <div className="nav-section-label">Student Workspace</div>
            <NavLink to="/dashboard" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/teams" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Users size={18} /> Teams
            </NavLink>
            <NavLink to="/projects" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <FolderKanban size={18} /> Projects
            </NavLink>
            <NavLink to="/tasks" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <CheckSquare size={18} /> Tasks
            </NavLink>
            <NavLink to="/progress" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <LineChart size={18} /> Progress & Stats
            </NavLink>
            <NavLink to="/collaboration" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <MessageSquare size={18} /> Team Updates
            </NavLink>
            <NavLink to="/ai-insights" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
              <Sparkles size={18} style={{ color: '#c084fc' }} /> AI Insights
            </NavLink>
          </>
        )}

        <div className="nav-section-label" style={{ marginTop: 'auto' }}>Account</div>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={18} /> Profile
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
