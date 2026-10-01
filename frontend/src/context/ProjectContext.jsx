import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../api';
import { useAuth } from './AuthContext';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchProjects = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const { data } = await API.get('/projects');
      if (data.success) {
        setProjects(data.projects);
        
        // Restore active project or pick first
        const savedId = localStorage.getItem('projectsync_active_project');
        const found = data.projects.find(p => p._id === savedId);
        if (found) {
          setActiveProject(found);
        } else if (data.projects.length > 0) {
          setActiveProject(data.projects[0]);
          localStorage.setItem('projectsync_active_project', data.projects[0]._id);
        } else {
          setActiveProject(null);
        }
      }
    } catch (err) {
      console.error('Error fetching user projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    if (!user) return;
    try {
      const { data } = await API.get('/teams');
      if (data.success) {
        setTeams(data.teams);
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchProjects();
      fetchTeams();
    } else {
      setProjects([]);
      setActiveProject(null);
      setTeams([]);
    }
  }, [user]);

  const selectProject = (project) => {
    setActiveProject(project);
    if (project) {
      localStorage.setItem('projectsync_active_project', project._id);
    } else {
      localStorage.removeItem('projectsync_active_project');
    }
  };

  const refreshProjects = async () => {
    await fetchProjects();
    await fetchTeams();
  };

  return (
    <ProjectContext.Provider value={{
      projects,
      activeProject,
      teams,
      loading,
      selectProject,
      refreshProjects
    }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
