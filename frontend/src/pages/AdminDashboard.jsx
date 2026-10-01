import React, { useState, useEffect } from 'react';
import API from '../api';
import { 
  ShieldCheck, 
  Users, 
  FolderKanban, 
  CheckSquare, 
  AlertTriangle, 
  RefreshCw,
  Database
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  const fetchAdminReports = async () => {
    try {
      setLoading(true);
      const { data } = await API.get('/admin/reports');
      if (data.success) {
        setReports(data);
      }
    } catch (err) {
      console.error('Error fetching admin reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminReports();
  }, []);

  const handleSeedData = async () => {
    if (!window.confirm('This will seed demo student team, project, tasks, and AI insights into MongoDB. Continue?')) return;
    try {
      setSeeding(true);
      const { data } = await API.post('/seed');
      if (data.success) {
        setSeedMessage('Demo dataset successfully seeded!');
        await fetchAdminReports();
      }
    } catch (err) {
      setSeedMessage('Failed to seed demo dataset.');
    } finally {
      setSeeding(false);
    }
  };

  if (loading) {
    return <div className="page-body">Loading Faculty Monitor...</div>;
  }

  const stats = reports?.stats || {};
  const projects = reports?.projects || [];

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck color="#c084fc" /> Faculty & Admin Monitoring Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Global academic project progress, team contributions, and risk status</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleSeedData} className="btn btn-secondary btn-sm" disabled={seeding}>
            <Database size={16} /> {seeding ? 'Seeding...' : 'Load Demo Seed Data'}
          </button>
          <button onClick={fetchAdminReports} className="btn btn-primary btn-sm">
            <RefreshCw size={16} /> Refresh Metrics
          </button>
        </div>
      </div>

      {seedMessage && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', background: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '0.88rem' }}>
          {seedMessage}
        </div>
      )}

      {/* Stats Grid */}
      <div className="card-grid">
        <div className="card stat-card">
          <div>
            <div className="stat-label">Registered Students</div>
            <div className="stat-val" style={{ color: '#60a5fa' }}>{stats.totalStudents || 0}</div>
          </div>
          <div className="stat-icon primary"><Users size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Student Teams</div>
            <div className="stat-val">{stats.totalTeams || 0}</div>
          </div>
          <div className="stat-icon warning"><Users size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Active Projects</div>
            <div className="stat-val">{stats.totalProjects || 0}</div>
          </div>
          <div className="stat-icon info"><FolderKanban size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Overdue Flags</div>
            <div className="stat-val" style={{ color: '#ef4444' }}>{stats.overdueTasks || 0}</div>
          </div>
          <div className="stat-icon danger"><AlertTriangle size={24} /></div>
        </div>
      </div>

      {/* Projects Monitoring Table */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>All Student Projects Overview</h3>
        {projects.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No student projects registered yet.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Project Title</th>
                  <th>Assigned Team</th>
                  <th>Team Leader</th>
                  <th>Members</th>
                  <th>Status</th>
                  <th>Completion %</th>
                  <th>Overdue Tasks</th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p._id}>
                    <td style={{ fontWeight: 600 }}>{p.title}</td>
                    <td style={{ color: '#94a3b8' }}>{p.teamName}</td>
                    <td>{p.teamLeader}</td>
                    <td>{p.memberCount}</td>
                    <td>
                      <span className={`badge ${p.status === 'Completed' ? 'badge-completed' : p.status === 'Active' ? 'badge-in-progress' : 'badge-todo'}`}>
                        {p.status}
                      </span>
                    </td>
                    <td style={{ width: '150px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>{p.completionPercentage}%</div>
                      <div className="progress-bar-container" style={{ height: '6px' }}>
                        <div className="progress-bar-fill" style={{ width: `${p.completionPercentage}%` }}></div>
                      </div>
                    </td>
                    <td>
                      {p.overdueTasks > 0 ? (
                        <span style={{ color: '#ef4444', fontWeight: 700 }}>⚠️ {p.overdueTasks} Overdue</span>
                      ) : (
                        <span style={{ color: '#10b981' }}>On Track</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
