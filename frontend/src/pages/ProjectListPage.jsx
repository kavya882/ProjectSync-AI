import React, { useState } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import Modal from '../components/Modal';
import { FolderKanban, Plus, Calendar, Users, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const ProjectListPage = () => {
  const { user } = useAuth();
  const { projects, teams, selectProject, refreshProjects } = useProject();
  const navigate = useNavigate();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [teamId, setTeamId] = useState('');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('Active');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!teamId) {
      setError('Please select a team for this project.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await API.post('/projects', {
        title,
        description,
        team: teamId,
        deadline,
        status
      });

      if (data.success) {
        setTitle('');
        setDescription('');
        setDeadline('');
        setIsCreateModalOpen(false);
        await refreshProjects();
        selectProject(data.project);
        navigate(`/projects/${data.project._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Projects Overview</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Academic projects across your assigned teams</p>
        </div>
        {user?.role === 'STUDENT' && (
          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={16} /> New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📁</div>
          <h3>No Projects Created Yet</h3>
          <p style={{ margin: '0.5rem 0 1.25rem', color: '#94a3b8' }}>
            Start by creating a new academic project for your team.
          </p>
          {user?.role === 'STUDENT' && (
            <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Create Project
            </button>
          )}
        </div>
      ) : (
        <div className="card-grid">
          {projects.map(p => (
            <div key={p._id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1.15rem' }}>{p.title}</h3>
                  <span className={`badge ${p.status === 'Completed' ? 'badge-completed' : p.status === 'Active' ? 'badge-in-progress' : 'badge-todo'}`}>
                    {p.status}
                  </span>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {p.description || 'No project description provided.'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem', color: '#64748b', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Users size={15} color="#60a5fa" /> Team: <strong style={{ color: '#f8fafc' }}>{p.team ? p.team.name : 'Unassigned'}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Calendar size={15} color="#f59e0b" /> Deadline: <strong style={{ color: '#f8fafc' }}>{new Date(p.deadline).toLocaleDateString()}</strong>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => {
                    selectProject(p);
                    navigate(`/projects/${p._id}`);
                  }}
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                >
                  Project Hub <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Create Project */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Academic Project">
        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1rem', color: '#fca5a5', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleCreateProject}>
          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Student Management Portal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Team *</label>
            <select
              className="form-select"
              required
              value={teamId}
              onChange={(e) => setTeamId(e.target.value)}
            >
              <option value="">-- Select Team --</option>
              {teams.map(t => (
                <option key={t._id} value={t._id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Project Description</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Project objective, technologies, scope..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Deadline *</label>
              <input
                type="date"
                className="form-input"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Planning">Planning</option>
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectListPage;
