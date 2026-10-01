import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../api';
import { useProject } from '../context/ProjectContext';
import { 
  FolderKanban, 
  Users, 
  Calendar, 
  CheckSquare, 
  LineChart, 
  MessageSquare, 
  Sparkles, 
  Clock 
} from 'lucide-react';

const ProjectDetailsPage = () => {
  const { id } = useParams();
  const { selectProject } = useProject();
  const [project, setProject] = useState(null);
  const [tasksCount, setTasksCount] = useState({ total: 0, completed: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/projects/${id}`);
        if (data.success) {
          setProject(data.project);
          selectProject(data.project);

          const tasksRes = await API.get(`/projects/${id}/tasks`);
          if (tasksRes.data.success) {
            const all = tasksRes.data.tasks;
            const done = all.filter(t => t.status === 'Completed').length;
            setTasksCount({ total: all.length, completed: done });
          }
        }
      } catch (err) {
        console.error('Error fetching project details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [id]);

  if (loading) {
    return <div className="page-body">Loading project details...</div>;
  }

  if (!project) {
    return <div className="page-body">Project not found.</div>;
  }

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span className={`badge ${project.status === 'Completed' ? 'badge-completed' : project.status === 'Active' ? 'badge-in-progress' : 'badge-todo'}`}>
            {project.status}
          </span>
          <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Started: {new Date(project.startDate).toLocaleDateString()}</span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{project.title}</h1>
        <p style={{ color: '#94a3b8', maxWidth: '800px', fontSize: '0.95rem' }}>{project.description || 'No detailed description provided.'}</p>
      </div>

      {/* Quick Action Navigation Bar */}
      <div className="card-grid" style={{ marginBottom: '2rem' }}>
        <Link to="/tasks" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}>
          <div className="stat-icon primary"><CheckSquare size={24} /></div>
          <div>
            <h3 style={{ fontSize: '1rem' }}>Tasks Board</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{tasksCount.completed} / {tasksCount.total} Completed</p>
          </div>
        </Link>

        <Link to="/progress" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}>
          <div className="stat-icon success"><LineChart size={24} /></div>
          <div>
            <h3 style={{ fontSize: '1rem' }}>Progress Analytics</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Member Contributions</p>
          </div>
        </Link>

        <Link to="/collaboration" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}>
          <div className="stat-icon warning"><MessageSquare size={24} /></div>
          <div>
            <h3 style={{ fontSize: '1rem' }}>Team Updates</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Activity Feed</p>
          </div>
        </Link>

        <Link to="/ai-insights" className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'inherit' }}>
          <div className="stat-icon info"><Sparkles size={24} /></div>
          <div>
            <h3 style={{ fontSize: '1rem' }}>AI Insights</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Overdue & Risk Alerts</p>
          </div>
        </Link>
      </div>

      {/* Team info card */}
      <div className="card">
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}><Users size={20} style={{ display: 'inline', marginRight: '0.5rem', color: '#60a5fa' }} /> Assigned Team Details</h3>
        {project.team ? (
          <div>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.25rem', fontSize: '0.9rem' }}>
              <div><span style={{ color: '#94a3b8' }}>Team Name:</span> <strong>{project.team.name}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Team Leader:</span> <strong>{project.team.leader ? project.team.leader.name : 'N/A'}</strong></div>
              <div><span style={{ color: '#94a3b8' }}>Members Count:</span> <strong>{project.team.members ? project.team.members.length : 0}</strong></div>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Email</th>
                    <th>Student ID</th>
                  </tr>
                </thead>
                <tbody>
                  {project.team.members && project.team.members.map(m => (
                    <tr key={m._id}>
                      <td style={{ fontWeight: 600 }}>{m.name}</td>
                      <td style={{ color: '#94a3b8' }}>{m.email}</td>
                      <td>{m.studentId || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p style={{ color: '#94a3b8' }}>No team assigned to this project.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailsPage;
