import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProject } from '../context/ProjectContext';
import API from '../api';
import Modal from '../components/Modal';
import { Users, UserPlus, Key, Plus, Shield, Mail, Check } from 'lucide-react';

const TeamPage = () => {
  const { user } = useAuth();
  const { teams, refreshProjects } = useProject();
  
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [teamDesc, setTeamDesc] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [memberIdentifier, setMemberIdentifier] = useState('');

  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (teams.length > 0 && !selectedTeam) {
      setSelectedTeam(teams[0]);
    }
  }, [teams]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await API.post('/teams', { name: teamName, description: teamDesc });
      if (data.success) {
        setMessage({ type: 'success', text: `Team '${data.team.name}' created successfully!` });
        setTeamName('');
        setTeamDesc('');
        setIsCreateModalOpen(false);
        await refreshProjects();
        setSelectedTeam(data.team);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to create team.' });
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await API.post('/teams/join', { joinCode: joinCodeInput });
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setJoinCodeInput('');
        setIsJoinModalOpen(false);
        await refreshProjects();
        setSelectedTeam(data.team);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to join team.' });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const { data } = await API.post(`/teams/${selectedTeam._id}/members`, { identifier: memberIdentifier });
      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setMemberIdentifier('');
        setIsAddMemberModalOpen(false);
        await refreshProjects();
        setSelectedTeam(data.team);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to add member.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Team Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Create, join, and manage academic project teams</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={() => setIsJoinModalOpen(true)} className="btn btn-secondary btn-sm">
            <Key size={16} /> Join Team via Code
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary btn-sm">
            <Plus size={16} /> Create Team
          </button>
        </div>
      </div>

      {message.text && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.88rem', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: message.type === 'success' ? '#6ee7b7' : '#fca5a5', border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
          {message.text}
        </div>
      )}

      {teams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No Teams Found</h3>
          <p style={{ margin: '0.5rem 0 1.25rem', color: '#94a3b8' }}>
            You aren't a member of any team yet. Create a team or enter a join code.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button onClick={() => setIsJoinModalOpen(true)} className="btn btn-secondary">
              <Key size={16} /> Join via Code
            </button>
            <button onClick={() => setIsCreateModalOpen(true)} className="btn btn-primary">
              <Plus size={16} /> Create Team
            </button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '1.5rem' }}>
          {/* Teams Selector List */}
          <div className="card" style={{ padding: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#94a3b8' }}>Your Teams</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {teams.map(t => (
                <button
                  key={t._id}
                  onClick={() => setSelectedTeam(t)}
                  style={{
                    padding: '0.75rem 0.85rem',
                    borderRadius: '8px',
                    border: selectedTeam && selectedTeam._id === t._id ? '1px solid #3b82f6' : '1px solid #334155',
                    background: selectedTeam && selectedTeam._id === t._id ? 'rgba(59, 130, 246, 0.15)' : '#0f172a',
                    color: selectedTeam && selectedTeam._id === t._id ? '#60a5fa' : '#f8fafc',
                    textAlign: 'left',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }}
                >
                  <div>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 400, marginTop: '0.2rem' }}>
                    {t.members ? t.members.length : 0} members
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Team Details */}
          {selectedTeam && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem' }}>{selectedTeam.name}</h2>
                  <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginTop: '0.25rem' }}>{selectedTeam.description || 'No description provided.'}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: '#0f172a', border: '1px solid #334155', padding: '0.4rem 0.85rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                    <span style={{ color: '#94a3b8' }}>Join Code: </span>
                    <strong style={{ color: '#f59e0b', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{selectedTeam.joinCode}</strong>
                  </div>
                  <button onClick={() => setIsAddMemberModalOpen(true)} className="btn btn-primary btn-sm">
                    <UserPlus size={16} /> Add Member
                  </button>
                </div>
              </div>

              {/* Members Table */}
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.85rem' }}>Team Roster</h3>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Student ID</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTeam.members && selectedTeam.members.map(member => {
                      const isLeader = selectedTeam.leader && (selectedTeam.leader._id === member._id || selectedTeam.leader === member._id);
                      return (
                        <tr key={member._id}>
                          <td style={{ fontWeight: 600 }}>
                            {member.name} {isLeader && <span style={{ fontSize: '0.72rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', padding: '0.15rem 0.5rem', borderRadius: '10px', marginLeft: '0.5rem' }}>Leader</span>}
                          </td>
                          <td style={{ color: '#94a3b8' }}>{member.email}</td>
                          <td>{member.studentId || 'N/A'}</td>
                          <td><span className={`badge ${member.role === 'ADMIN' ? 'badge-high' : 'badge-low'}`}>{member.role}</span></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Create Team */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create New Team">
        <form onSubmit={handleCreateTeam}>
          <div className="form-group">
            <label className="form-label">Team Name *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Team Alpha"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Team Description</label>
            <textarea
              className="form-input"
              rows={3}
              placeholder="Brief description of team objective..."
              value={teamDesc}
              onChange={(e) => setTeamDesc(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Team'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Join Team */}
      <Modal isOpen={isJoinModalOpen} onClose={() => setIsJoinModalOpen(false)} title="Join Team via Code">
        <form onSubmit={handleJoinTeam}>
          <div className="form-group">
            <label className="form-label">Team Join Code *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. ALPHA26"
              style={{ textTransform: 'uppercase', fontFamily: 'monospace', letterSpacing: '0.05em' }}
              value={joinCodeInput}
              onChange={(e) => setJoinCodeInput(e.target.value)}
            />
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem' }}>
              Ask your team leader for the 7-character join code.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsJoinModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Joining...' : 'Join Team'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Add Member */}
      <Modal isOpen={isAddMemberModalOpen} onClose={() => setIsAddMemberModalOpen(false)} title="Add Team Member">
        <form onSubmit={handleAddMember}>
          <div className="form-group">
            <label className="form-label">Student Email or Student ID *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. priya@student.edu or STU202602"
              value={memberIdentifier}
              onChange={(e) => setMemberIdentifier(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsAddMemberModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Member'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamPage;
