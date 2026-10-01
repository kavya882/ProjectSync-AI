import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import API from '../api';
import { 
  LineChart, 
  CheckSquare, 
  Users, 
  AlertTriangle, 
  Clock, 
  Award, 
  Info,
  ShieldAlert
} from 'lucide-react';

const ProgressDashboard = () => {
  const { activeProject } = useProject();
  const [progress, setProgress] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!activeProject) return;
      try {
        setLoading(true);
        const [progRes, contribRes] = await Promise.all([
          API.get(`/projects/${activeProject._id}/progress`),
          API.get(`/projects/${activeProject._id}/contributions`)
        ]);

        if (progRes.data.success) setProgress(progRes.data);
        if (contribRes.data.success) setContributions(contribRes.data.contributions || []);
      } catch (err) {
        console.error('Error fetching progress data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [activeProject]);

  if (!activeProject) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <h3>No Active Project Selected</h3>
          <p style={{ margin: '0.5rem 0 1rem', color: '#94a3b8' }}>Please select a project to view progress monitoring statistics.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Collaboration & Progress Analytics</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          Project: <strong style={{ color: '#60a5fa' }}>{activeProject.title}</strong>
        </p>
      </div>

      {/* Mandatory Academic Disclaimer Banner */}
      <div className="disclaimer-banner">
        <Info size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Academic Responsibility Statement:</strong>
          <p style={{ marginTop: '0.25rem', fontSize: '0.82rem', lineHeight: 1.5, color: '#bfdbfe' }}>
            "Contribution is estimated from recorded project activity and should be used as a progress indicator rather than a final evaluation."
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="card-grid">
        <div className="card stat-card">
          <div>
            <div className="stat-label">Completion Percentage</div>
            <div className="stat-val" style={{ color: '#60a5fa' }}>{progress ? progress.completionPercentage : 0}%</div>
          </div>
          <div className="stat-icon primary"><LineChart size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Total / Completed Tasks</div>
            <div className="stat-val">{progress ? `${progress.completedTasks} / ${progress.totalTasks}` : '0 / 0'}</div>
          </div>
          <div className="stat-icon success"><CheckSquare size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Pending Work items</div>
            <div className="stat-val" style={{ color: '#f59e0b' }}>{progress ? progress.pendingTasks : 0}</div>
          </div>
          <div className="stat-icon warning"><Clock size={24} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Overdue Tasks Alert</div>
            <div className="stat-val" style={{ color: '#ef4444' }}>{progress ? progress.overdueTasks : 0}</div>
          </div>
          <div className="stat-icon danger"><AlertTriangle size={24} /></div>
        </div>
      </div>

      {/* Project Completion Bar */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>Overall Project Completion Gauge</h3>
        <div className="progress-bar-container" style={{ height: '14px' }}>
          <div className="progress-bar-fill" style={{ width: `${progress ? progress.completionPercentage : 0}%` }}></div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.8rem', color: '#94a3b8' }}>
          <span>Start: 0%</span>
          <span>Target: 100%</span>
        </div>
      </div>

      {/* Member Contributions Section */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem' }}><Users size={20} style={{ display: 'inline', marginRight: '0.5rem', color: '#60a5fa' }} /> Individual Member Activity Metrics</h3>
            <p style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>Calculated as: (Completed Tasks / Assigned Tasks) × 100%</p>
          </div>
        </div>

        {contributions.length === 0 ? (
          <p style={{ color: '#94a3b8' }}>No member activity data available.</p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Team Member</th>
                  <th>Student ID</th>
                  <th>Assigned Tasks</th>
                  <th>Completed</th>
                  <th>In Progress</th>
                  <th>Pending</th>
                  <th>Contribution %</th>
                </tr>
              </thead>
              <tbody>
                {contributions.map(c => (
                  <tr key={c.memberId}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{c.email}</div>
                    </td>
                    <td>{c.studentId || 'N/A'}</td>
                    <td style={{ fontWeight: 600 }}>{c.assignedTasks}</td>
                    <td style={{ color: '#10b981', fontWeight: 600 }}>{c.completedTasks}</td>
                    <td style={{ color: '#60a5fa' }}>{c.inProgressTasks}</td>
                    <td style={{ color: '#f59e0b' }}>{c.pendingTasks}</td>
                    <td style={{ width: '180px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.2rem' }}>
                        <span>{c.contributionPercentage}%</span>
                      </div>
                      <div className="progress-bar-container" style={{ height: '8px' }}>
                        <div className="progress-bar-fill" style={{ width: `${c.contributionPercentage}%` }}></div>
                      </div>
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

export default ProgressDashboard;
