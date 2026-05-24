import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import StatsCard from '../components/StatsCard';
import ProjectCard from '../components/ProjectCard';
import TaskModal from '../components/TaskModal';
import {
  LayoutDashboard, Plus, Folder, CheckCircle2,
  Clock, AlertCircle, TrendingUp, ListTodo
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { projects, stats, fetchProjects, fetchStats, createProject } = useTasks();
  const navigate = useNavigate();
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', color: '#6c63ff' });
  const [creating, setCreating] = useState(false);

  const COLORS = ['#6c63ff','#00d4aa','#ff4757','#ffa502','#3742fa','#ff6b81','#2ed573','#eccc68'];

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, [fetchProjects, fetchStats]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;
    setCreating(true);
    await createProject(newProject);
    setCreating(false);
    setShowProjectModal(false);
    setNewProject({ name: '', description: '', color: '#6c63ff' });
  };

  const statCards = [
    { label: 'Total Tasks', value: stats?.total ?? 0, icon: <ListTodo size={20} />, color: '#6c63ff', bg: 'rgba(108,99,255,0.15)' },
    { label: 'In Progress', value: stats?.inprogress ?? 0, icon: <TrendingUp size={20} />, color: '#00d4aa', bg: 'rgba(0,212,170,0.15)' },
    { label: 'Completed',   value: stats?.done ?? 0,       icon: <CheckCircle2 size={20} />, color: '#2ed573', bg: 'rgba(46,213,115,0.15)' },
    { label: 'Overdue',     value: stats?.overdue ?? 0,    icon: <AlertCircle size={20} />,  color: '#ff4757', bg: 'rgba(255,71,87,0.15)' },
  ];

  return (
    <div className="app-layout">
      <Sidebar activePage="dashboard" />
      <div className="main-content">
        <Header title="Dashboard" />
        <div className="page-body fade-in">

          {/* Welcome */}
          <div style={{ marginBottom: 28 }}>
            <h1 className="page-title">
              Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="page-subtitle">Here's what's happening with your projects today.</p>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            {statCards.map((s, i) => (
              <StatsCard key={i} {...s} delay={i * 60} />
            ))}
          </div>

          {/* Projects */}
          <div className="page-header" style={{ marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>Projects</h2>
              <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>
            </div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowProjectModal(true)}>
              <Plus size={16} /> New Project
            </button>
          </div>

          {projects.length === 0 ? (
            <div className="glass" style={{ padding: 60, textAlign: 'center' }}>
              <Folder size={48} style={{ color: 'var(--text-dim)', margin: '0 auto 16px' }} />
              <p style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>No projects yet</p>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 20 }}>Create your first project to get started</p>
              <button className="btn btn-primary" onClick={() => setShowProjectModal(true)}>
                <Plus size={16} /> Create Project
              </button>
            </div>
          ) : (
            <div className="grid-3">
              {projects.map((p) => (
                <ProjectCard key={p._id} project={p} onClick={() => navigate(`/board/${p._id}`)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Project Modal */}
      {showProjectModal && (
        <div className="modal-overlay" onClick={() => setShowProjectModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Project</h2>
              <button className="btn-ghost btn-icon" onClick={() => setShowProjectModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateProject}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Project Name *</label>
                  <input className="form-input" placeholder="e.g. Website Redesign"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    required autoFocus />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-input" placeholder="What is this project about?"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Color</label>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {COLORS.map((c) => (
                      <button key={c} type="button"
                        onClick={() => setNewProject({ ...newProject, color: c })}
                        style={{
                          width: 30, height: 30, borderRadius: '50%', background: c, border: 'none',
                          cursor: 'pointer', outline: newProject.color === c ? `3px solid ${c}` : 'none',
                          outlineOffset: 2, transform: newProject.color === c ? 'scale(1.2)' : 'scale(1)',
                          transition: 'all 0.15s',
                        }} />
                    ))}
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProjectModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={creating}>
                    {creating ? 'Creating…' : 'Create Project'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 17) return 'afternoon';
  return 'evening';
}
