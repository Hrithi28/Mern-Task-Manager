import { createContext, useContext, useState, useCallback } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks]       = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats]       = useState(null);
  const [loading, setLoading]   = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  /* ── Projects ── */
  const fetchProjects = useCallback(async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data);
      return data;
    } catch { toast.error('Failed to load projects'); }
  }, []);

  const createProject = async (payload) => {
    try {
      const { data } = await api.post('/projects', payload);
      setProjects((p) => [data, ...p]);
      toast.success('Project created!');
      return data;
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const deleteProject = async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      setProjects((p) => p.filter((x) => x._id !== id));
      if (activeProject?._id === id) setActiveProject(null);
      toast.success('Project deleted');
    } catch { toast.error('Failed to delete project'); }
  };

  /* ── Tasks ── */
  const fetchTasks = useCallback(async (projectId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/tasks?project=${projectId}`);
      setTasks(data);
    } catch { toast.error('Failed to load tasks'); }
    finally { setLoading(false); }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/tasks/stats/overview');
      setStats(data);
    } catch {}
  }, []);

  const createTask = async (payload) => {
    try {
      const { data } = await api.post('/tasks', payload);
      setTasks((t) => [...t, data]);
      toast.success('Task created!');
      return data;
    } catch (err) { toast.error(err.response?.data?.message || 'Error'); }
  };

  const updateTask = async (id, payload) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, payload);
      setTasks((t) => t.map((x) => (x._id === id ? data : x)));
      toast.success('Task updated!');
      return data;
    } catch { toast.error('Failed to update task'); }
  };

  const moveTask = async (taskId, newStatus, newOrder) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus, order: newOrder } : t))
    );
    try {
      await api.patch(`/tasks/${taskId}/status`, { status: newStatus, order: newOrder });
    } catch {
      toast.error('Failed to move task');
      // refetch to revert
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((t) => t.filter((x) => x._id !== id));
      toast.success('Task deleted');
    } catch { toast.error('Failed to delete task'); }
  };

  return (
    <TaskContext.Provider value={{
      tasks, projects, stats, loading, activeProject,
      setActiveProject,
      fetchProjects, createProject, deleteProject,
      fetchTasks, fetchStats, createTask, updateTask, moveTask, deleteTask,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
