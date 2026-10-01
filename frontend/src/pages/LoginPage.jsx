import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, LogIn, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedUser = await login(email, password);
      if (loggedUser.role === 'ADMIN' || loggedUser.role === 'FACULTY') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoUser = (userType) => {
    if (userType === 'studentLeader') {
      setEmail('alex@student.edu');
      setPassword('student123');
    } else if (userType === 'studentMember') {
      setEmail('priya@student.edu');
      setPassword('student123');
    } else if (userType === 'facultyAdmin') {
      setEmail('admin@college.edu');
      setPassword('admin123');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '440px', padding: '2.25rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
          <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', borderRadius: '12px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <Zap size={26} color="white" />
          </div>
          <h2 style={{ fontSize: '1.6rem', marginBottom: '0.25rem' }}>Welcome Back</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Sign in to access ProjectSync AI</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', padding: '0.75rem', marginBottom: '1.25rem', color: '#fca5a5', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              required
              placeholder="e.g. alex@student.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            <LogIn size={18} /> {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Demo Accounts Quick-Fill Box */}
        <div style={{ marginTop: '1.75rem', paddingTop: '1.25rem', borderTop: '1px solid #334155' }}>
          <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, marginBottom: '0.65rem', textAlign: 'center' }}>
            Quick Demo Login Credentials
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <button type="button" onClick={() => fillDemoUser('studentLeader')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>
              👨‍🎓 Student Leader: alex@student.edu
            </button>
            <button type="button" onClick={() => fillDemoUser('studentMember')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>
              👩‍🎓 Student Member: priya@student.edu
            </button>
            <button type="button" onClick={() => fillDemoUser('facultyAdmin')} className="btn btn-secondary btn-sm" style={{ justifyContent: 'flex-start' }}>
              👨‍🏫 Faculty Admin: admin@college.edu
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.88rem', color: '#94a3b8' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
