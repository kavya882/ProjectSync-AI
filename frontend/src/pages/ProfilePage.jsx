import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api';
import { User, Shield, Mail, CheckCircle } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user ? user.name : '');
  const [studentId, setStudentId] = useState(user ? user.studentId || '' : '');
  const [department, setDepartment] = useState(user ? user.department || '' : '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const payload = { name, studentId, department };
      if (password) payload.password = password;

      const { data } = await API.put('/users/profile', payload);
      if (data.success) {
        updateProfile(data.user);
        setPassword('');
        setMessage({ type: 'success', text: 'Profile details updated successfully!' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Account Profile</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Manage your personal details and credentials</p>
      </div>

      {message.text && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: message.type === 'success' ? '#6ee7b7' : '#fca5a5', border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, fontSize: '0.88rem' }}>
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        {/* Profile Card Summary */}
        <div className="card" style={{ textAlign: 'center', padding: '2rem 1.5rem' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'white', marginBottom: '1rem' }}>
            <User size={36} />
          </div>
          <h2 style={{ fontSize: '1.4rem' }}>{user?.name}</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem', marginBottom: '1rem' }}>{user?.email}</p>
          <span className={`badge ${user?.role === 'ADMIN' ? 'badge-high' : 'badge-in-progress'}`}>
            {user?.role}
          </span>
        </div>

        {/* Profile Edit Form */}
        <div className="card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Update Profile Information</h3>
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address (Read Only)</label>
              <input
                type="email"
                className="form-input"
                disabled
                style={{ opacity: 0.6 }}
                value={user?.email || ''}
              />
            </div>

            {user?.role === 'STUDENT' ? (
              <div className="form-group">
                <label className="form-label">Student ID / Roll No.</label>
                <input
                  type="text"
                  className="form-input"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-input"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">New Password (Leave blank to keep current)</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '0.5rem' }}>
              {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
