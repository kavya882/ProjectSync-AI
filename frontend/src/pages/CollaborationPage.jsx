import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { MessageSquare, Send, User, Tag, Clock } from 'lucide-react';

const CollaborationPage = () => {
  const { activeProject } = useProject();
  const { user } = useAuth();
  
  const [updates, setUpdates] = useState([]);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);

  const fetchUpdates = async () => {
    if (!activeProject) return;
    try {
      const { data } = await API.get(`/projects/${activeProject._id}/updates`);
      if (data.success) {
        setUpdates(data.updates);
      }
    } catch (err) {
      console.error('Error fetching project updates:', err);
    }
  };

  useEffect(() => {
    fetchUpdates();
  }, [activeProject]);

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    if (!content.trim() || !activeProject) return;
    setLoading(true);
    try {
      const { data } = await API.post(`/projects/${activeProject._id}/updates`, {
        content,
        category
      });
      if (data.success) {
        setContent('');
        await fetchUpdates();
      }
    } catch (err) {
      console.error('Failed to post update:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!activeProject) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <h3>No Active Project Selected</h3>
          <p style={{ margin: '0.5rem 0 1rem', color: '#94a3b8' }}>Select a project to view team updates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Team Collaboration & Updates</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Project: <strong style={{ color: '#60a5fa' }}>{activeProject.title}</strong></p>
      </div>

      {/* Post Update Form */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}><MessageSquare size={18} style={{ display: 'inline', marginRight: '0.5rem', color: '#60a5fa' }} /> Post Team Update</h3>
        <form onSubmit={handlePostUpdate}>
          <div className="form-group">
            <textarea
              className="form-input"
              rows={3}
              required
              placeholder="Share a milestone, blocker, or progress update with your project team..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Tag size={16} color="#94a3b8" />
              <label className="form-label" style={{ marginBottom: 0 }}>Category:</label>
              <select
                className="form-select"
                style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="General">General</option>
                <option value="Progress Update">Progress Update</option>
                <option value="Milestone">Milestone</option>
                <option value="Blocker">Blocker</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-sm" disabled={loading}>
              <Send size={16} /> {loading ? 'Posting...' : 'Post Update'}
            </button>
          </div>
        </form>
      </div>

      {/* Updates Stream */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {updates.length === 0 ? (
          <div className="empty-state">
            <p>No team updates posted yet. Be the first to post an update!</p>
          </div>
        ) : (
          updates.map(u => (
            <div key={u._id} className="card" style={{ padding: '1.15rem 1.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <User size={16} />
                  </div>
                  <div>
                    <span style={{ fontWeight: 600, fontSize: '0.92rem' }}>{u.user ? u.user.name : 'Unknown User'}</span>
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginLeft: '0.5rem' }}>
                      ({u.user ? u.user.role : 'Student'})
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span className={`badge ${u.category === 'Blocker' ? 'badge-high' : u.category === 'Milestone' ? 'badge-completed' : 'badge-in-progress'}`}>
                    {u.category}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={12} /> {new Date(u.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              <p style={{ color: '#f8fafc', fontSize: '0.92rem', lineHeight: 1.5, paddingLeft: '2.5rem' }}>
                {u.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CollaborationPage;
