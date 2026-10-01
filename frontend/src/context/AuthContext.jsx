import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('projectsync_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('projectsync_token') || '');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoggedInUser = async () => {
      if (token) {
        try {
          const { data } = await API.get('/users/profile');
          if (data.success) {
            setUser(data.user);
            localStorage.setItem('projectsync_user', JSON.stringify(data.user));
          }
        } catch (err) {
          console.error('Failed to verify session token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, [token]);

  const login = async (email, password) => {
    const { data } = await API.post('/auth/login', { email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('projectsync_token', data.token);
      localStorage.setItem('projectsync_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message || 'Login failed');
  };

  const register = async (userData) => {
    const { data } = await API.post('/auth/register', userData);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('projectsync_token', data.token);
      localStorage.setItem('projectsync_user', JSON.stringify(data.user));
      return data.user;
    }
    throw new Error(data.message || 'Registration failed');
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('projectsync_token');
    localStorage.removeItem('projectsync_user');
    localStorage.removeItem('projectsync_active_project');
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('projectsync_user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
