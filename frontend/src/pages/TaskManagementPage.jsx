import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import API from '../api';
import Modal from '../components/Modal';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Edit, 
  User, 
  Calendar, 
  Filter, 
  ArrowUpDown,
  AlertCircle,
  Clock
} from 'lucide-react';

const TaskManagementPage = () => {
  const { activeProject } = useProject();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filters & Sorting
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortBy, setSortBy] = useState('deadline');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [deadline, setDeadline] = useState('');
  const [status, setStatus] = useState('To Do');
  const [progress, setProgress] = useState(0);

  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchTasks = async () => {
    if (!activeProject) return;
    try {
      setLoading(true);
      const { data } = await API.get(`/projects/${activeProject._id}/tasks`);
      if (data.success) {
        setTasks(data.tasks);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [activeProject]);

  const openCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setAssignedTo('');
    setPriority('Medium');
    setDeadline('');
    setStatus('To Do');
    setProgress(0);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setAssignedTo(task.assignedTo ? task.assignedTo._id : '');
    setPriority(task.priority);
    setDeadline(task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : '');
    setStatus(task.status);
    setProgress(task.progress || 0);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeProject) return;
    try {
      if (editingTask) {
        const { data } = await API.put(`/tasks/${editingTask._id}`, {
          title,
          description,
          assignedTo: assignedTo || null,
          priority,
          deadline,
          status,
          progress: Number(progress)
        });
        if (data.success) {
          setMessage({ type: 'success', text: 'Task updated successfully' });
        }
      } else {
        const { data } = await API.post('/tasks', {
          project: activeProject._id,
          title,
          description,
          assignedTo: assignedTo || null,
          priority,
          deadline,
          status,
          progress: Number(progress)
        });
        if (data.success) {
          setMessage({ type: 'success', text: 'Task created successfully' });
        }
      }
      setIsModalOpen(false);
      await fetchTasks();

      // Trigger AI re-analysis automatically in background on task updates
      API.post(`/projects/${activeProject._id}/ai-analyze`).catch(() => {});
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Task action failed' });
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      let newProgress = 0;
      if (newStatus === 'Completed') newProgress = 100;
      else if (newStatus === 'In Progress') newProgress = 50;

      const { data } = await API.patch(`/tasks/${taskId}/status`, {
        status: newStatus,
        progress: newProgress
      });

      if (data.success) {
        await fetchTasks();
        if (activeProject) {
          API.post(`/projects/${activeProject._id}/ai-analyze`).catch(() => {});
        }
      }
    } catch (err) {
      console.error('Failed to change status:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const { data } = await API.delete(`/tasks/${taskId}`);
      if (data.success) {
        setMessage({ type: 'success', text: 'Task deleted' });
        await fetchTasks();
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to delete task' });
    }
  };

  if (!activeProject) {
    return (
      <div className="page-body">
        <div className="empty-state">
          <h3>No Active Project Selected</h3>
          <p style={{ margin: '0.5rem 0 1rem', color: '#94a3b8' }}>Please select or create a project first.</p>
        </div>
      </div>
    );
  }

  // Filter & Sort tasks
  const filteredTasks = tasks.filter(t => {
    if (statusFilter !== 'All' && t.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && t.priority !== priorityFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'deadline') {
      return new Date(a.deadline) - new Date(b.deadline);
    } else if (sortBy === 'priority') {
      const pMap = { High: 3, Medium: 2, Low: 1 };
      return pMap[b.priority] - pMap[a.priority];
    }
    return 0;
  });

  const members = activeProject.team && activeProject.team.members ? activeProject.team.members : [];

  return (
    <div className="page-body">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>Task Management</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Project: <strong style={{ color: '#60a5fa' }}>{activeProject.title}</strong></p>
        </div>
        <button onClick={openCreateModal} className="btn btn-primary btn-sm">
          <Plus size={16} /> Add Task
        </button>
      </div>

      {message.text && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: '8px', marginBottom: '1.25rem', fontSize: '0.88rem', background: message.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: message.type === 'success' ? '#6ee7b7' : '#fca5a5', border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}>
          {message.text}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#94a3b8' }}>
          <Filter size={16} /> Status:
          <select className="form-select" style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#94a3b8' }}>
          <Filter size={16} /> Priority:
          <select className="form-select" style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }} value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.88rem', color: '#94a3b8', marginLeft: 'auto' }}>
          <ArrowUpDown size={16} /> Sort By:
          <select className="form-select" style={{ width: 'auto', padding: '0.35rem 0.65rem', fontSize: '0.85rem' }} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="deadline">Deadline</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📋</div>
          <h3>No Tasks Found</h3>
          <p style={{ margin: '0.5rem 0 1rem', color: '#94a3b8' }}>Create a task or change the current filter criteria.</p>
          <button onClick={openCreateModal} className="btn btn-primary">
            <Plus size={16} /> Add Task
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Task Title</th>
                <th>Assigned Member</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map(t => {
                const isOverdue = t.status !== 'Completed' && new Date(t.deadline) < new Date();
                return (
                  <tr key={t._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{t.title}</div>
                      {t.description && <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{t.description}</div>}
                    </td>
                    <td>
                      {t.assignedTo ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                          <User size={14} color="#60a5fa" /> {t.assignedTo.name}
                        </div>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.82rem', italic: 'true' }}>Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge badge-${t.priority.toLowerCase()}`}>{t.priority}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: isOverdue ? '#ef4444' : '#f8fafc' }}>
                        <Calendar size={14} /> {new Date(t.deadline).toLocaleDateString()}
                        {isOverdue && <span style={{ fontSize: '0.7rem', background: 'rgba(239, 68, 68, 0.2)', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>OVERDUE</span>}
                      </div>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.82rem', width: 'auto' }}
                        value={t.status}
                        onChange={(e) => handleStatusChange(t._id, e.target.value)}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td style={{ width: '130px' }}>
                      <div style={{ fontSize: '0.75rem', textAlign: 'right', fontWeight: 600 }}>{t.progress || 0}%</div>
                      <div className="progress-bar-container" style={{ height: '6px' }}>
                        <div className="progress-bar-fill" style={{ width: `${t.progress || 0}%` }}></div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => openEditModal(t)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.4rem' }}>
                          <Edit size={14} />
                        </button>
                        <button onClick={() => handleDeleteTask(t._id)} className="btn btn-danger btn-sm" style={{ padding: '0.25rem 0.4rem' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Create/Edit Task */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? 'Edit Task' : 'Create Task'}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Backend API Endpoint Implementation"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-input"
              rows={2}
              placeholder="Task details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Assigned Team Member</label>
            <select
              className="form-select"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              <option value="">-- Unassigned --</option>
              {members.map(m => (
                <option key={m._id} value={m._id}>{m.name} ({m.studentId || m.email})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

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
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Progress Percentage ({progress}%)</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                style={{ width: '100%', marginTop: '0.5rem' }}
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskManagementPage;
