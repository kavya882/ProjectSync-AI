import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Users, CheckSquare, LineChart, Sparkles, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#f8fafc' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #334155', padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(30, 41, 59, 0.8)', backdropFilter: 'blur(10px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={22} color="white" />
          </div>
          <span style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 700, background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ProjectSync AI
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Get Started</Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '5rem 2rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.15)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '0.4rem 1rem', borderRadius: '20px', color: '#60a5fa', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Sparkles size={16} /> Intelligent Student Project Collaboration & Monitoring
        </div>
        <h1 style={{ fontSize: '3.2rem', lineHeight: 1.2, fontWeight: 800, marginBottom: '1.5rem', fontFamily: 'Outfit, sans-serif' }}>
          Eliminate Team Contribution Imbalance with <span style={{ background: 'linear-gradient(135deg, #60a5fa, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI-Driven Analytics</span>
        </h1>
        <p style={{ fontSize: '1.15rem', color: '#94a3b8', maxWidth: '780px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
          A student-focused academic management platform designed for equal project contribution tracking, transparent workload monitoring, seamless collaboration, and rule-based AI project risk assessment.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Start Student Project <ArrowRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
            Faculty Login
          </Link>
        </div>
      </section>

      {/* Core Modules Grid */}
      <section style={{ padding: '3rem 2rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem', fontSize: '2rem' }}>Four Core System Modules</h2>
        <div className="card-grid">
          <div className="card">
            <div className="stat-icon primary" style={{ marginBottom: '1rem' }}>
              <Users size={24} />
            </div>
            <h3>Module 1: User & Team Management</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Student registration, join-code team creation, role-based security, and member directory.
            </p>
          </div>

          <div className="card">
            <div className="stat-icon success" style={{ marginBottom: '1rem' }}>
              <CheckSquare size={24} />
            </div>
            <h3>Module 2: Project & Task Management</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Project lifecycles, prioritized task assignments, deadline tracking, and status progression.
            </p>
          </div>

          <div className="card">
            <div className="stat-icon warning" style={{ marginBottom: '1rem' }}>
              <LineChart size={24} />
            </div>
            <h3>Module 3: Progress & Contribution Monitoring</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Real-time activity-based individual contribution calculations with academic responsibility disclaimers.
            </p>
          </div>

          <div className="card">
            <div className="stat-icon info" style={{ marginBottom: '1rem' }}>
              <Sparkles size={24} />
            </div>
            <h3>Module 4: AI-Based Project Assistance</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Automated overdue alerts, deadline warnings, workload imbalance flags, and risk recommendations.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #334155', padding: '2rem', textAlign: 'center', color: '#64748b', fontSize: '0.85rem' }}>
        ProjectSync AI &copy; 2026 – Academic Student Project Collaboration and Progress Monitoring System
      </footer>
    </div>
  );
};

export default LandingPage;
