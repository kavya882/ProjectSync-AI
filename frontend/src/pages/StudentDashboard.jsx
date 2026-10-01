import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import API from '../api';
import { 
  CheckSquare, 
  Clock, 
  AlertTriangle, 
  LineChart, 
  Users, 
  Sparkles, 
  ArrowRight,
  PlusCircle,
  Calendar
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { activeProject, projects, selectProject } = useProject();
  
  const [progressData, setProgressData] = useState(null);
  const [contributions, setContributions] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!activeProject) return;
      setLoading(true);
      try {
        const [progRes, contribRes, aiRes, tasksRes] = await Promise.all([
          API.get(`/projects/${activeProject._id}/progress`),
          API.get(`/projects/${activeProject._id}/contributions`),
          API.get(`/projects/${activeProject._id}/ai-insights`),
          API.get(`/projects/${activeProject._id}/tasks`)
        ]);

        if (progRes.data.success) setProgressData(progRes.data);
        if (contribRes.data.success) setContributions(contribRes.data.contributions || []);
        if (aiRes.data.success) setAiInsights(aiRes.data.insights || []);
        if (tasksRes.data.success) {
          const pending = tasksRes.data.tasks.filter(t => t.status !== 'Completed');
          setUpcomingTasks(pending.slice(0, 4));
        }
      } catch (err) {
        console.error('Error fetching dashboard statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [activeProject]);

  if (!activeProject && projects.length === 0) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <div className="empty-state-icon">🚀</div>
          <h2>Welcome to ProjectSync AI, {user?.name}!</h2>
          <p style={{ margin: '0.75rem 0 1.5rem', color: '#94a3b8' }}>
            You are not part of any project yet. Create or join a team to get started.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/teams" className="btn btn-primary">
              <Users size={18} /> Manage Teams
            </Link>
            <Link to="/projects" className="btn btn-secondary">
              <PlusCircle size={18} /> Create Project
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      {/* Header Banner */}
      <div style={{ marginBottom: '1.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Welcome back, {user?.name}! 👋</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
            Monitoring progress for <strong style={{ color: '#60a5fa' }}>{activeProject ? activeProject.title : 'Project'}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/tasks" className="btn btn-primary btn-sm">
            <PlusCircle size={16} /> Manage Tasks
          </Link>
          <Link to="/ai-insights" className="btn btn-secondary btn-sm">
            <Sparkles size={16} color="#c084fc" /> AI Insights
          </Link>
        </div>
      </div>

      {/* Progress Disclaimer Banner */}
      <div className="disclaimer-banner">
        <LineChart size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Academic Contribution Indicator:</strong> Contribution percentages are computed from recorded task activities to encourage balanced team participation. They serve as a progress indicator rather than a final grading evaluation.
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="card-grid">
        <div className="card stat-card">
          <div>
            <div className="stat-label">Total Tasks</div>
            <div className="stat-val">{progressData ? progressData.totalTasks : 0}</div>
          </div>
          <div className="stat-icon primary"><CheckSquare size={22} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Completed Tasks</div>
            <div className="stat-val" style={{ color: '#10b981' }}>{progressData ? progressData.completedTasks : 0}</div>
          </div>
          <div className="stat-icon success"><CheckSquare size={22} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Pending Tasks</div>
            <div className="stat-val" style={{ color: '#f59e0b' }}>{progressData ? progressData.pendingTasks : 0}</div>
          </div>
          <div className="stat-icon warning"><Clock size={22} /></div>
        </div>

        <div className="card stat-card">
          <div>
            <div className="stat-label">Overdue Tasks</div>
            <div className="stat-val" style={{ color: '#ef4444' }}>{progressData ? progressData.overdueTasks : 0}</div>
          </div>
          <div className="stat-icon danger"><AlertTriangle size={22} /></div>
        </div>
      </div>

      {/* Overall Completion Gauge */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Overall Project Completion</h3>
          <span style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: '#60a5fa' }}>
            {progressData ? progressData.completionPercentage : 0}%
          </span>
        </div>
        <div className="progress-bar-container" style={{ height: '12px' }}>
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressData ? progressData.completionPercentage : 0}%` }}
          ></div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Left Column: Member Contribution breakdown */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3><Users size={18} style={{ display: 'inline', marginRight: '0.5rem', color: '#60a5fa' }} /> Team Contributions</h3>
            <Link to="/progress" style={{ fontSize: '0.82rem' }}>Full Stats <ArrowRight size={14} style={{ display: 'inline' }} /></Link>
          </div>

          {contributions.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No member activity recorded yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {contributions.map(c => (
                <div key={c.memberId} style={{ background: '#0f172a', padding: '0.85rem', borderRadius: '8px', border: '1px solid #334155' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                    <span style={{ fontWeight: 600 }}>{c.name}</span>
                    <span style={{ color: '#60a5fa', fontWeight: 700 }}>{c.contributionPercentage}%</span>
                  </div>
                  <div className="progress-bar-container" style={{ height: '6px' }}>
                    <div className="progress-bar-fill" style={{ width: `${c.contributionPercentage}%` }}></div>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
                    <span>Assigned: {c.assignedTasks}</span>
                    <span>Done: {c.completedTasks}</span>
                    <span>Pending: {c.pendingTasks}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: AI Insights & Upcoming Deadlines */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* AI Insights Summary */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#c084fc' }}><Sparkles size={18} style={{ display: 'inline', marginRight: '0.5rem' }} /> AI Assistance Alerts</h3>
              <Link to="/ai-insights" style={{ fontSize: '0.82rem' }}>View All</Link>
            </div>

            {aiInsights.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No AI alerts generated yet. Perform task updates to run analysis.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {aiInsights.slice(0, 3).map(insight => (
                  <div key={insight._id} className={`ai-alert-card ${insight.severity}`}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{insight.title}</div>
                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>{insight.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Deadlines */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3><Calendar size={18} style={{ display: 'inline', marginRight: '0.5rem', color: '#f59e0b' }} /> Upcoming Deadlines</h3>
              <Link to="/tasks" style={{ fontSize: '0.82rem' }}>Tasks Board</Link>
            </div>

            {upcomingTasks.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>No pending tasks with upcoming deadlines.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {upcomingTasks.map(t => (
                  <div key={t._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: '#0f172a', borderRadius: '6px', border: '1px solid #334155', fontSize: '0.85rem' }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{t.title}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                        Assignee: {t.assignedTo ? t.assignedTo.name : 'Unassigned'}
                      </div>
                    </div>
                    <span className={`badge badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
