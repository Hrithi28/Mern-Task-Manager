import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import {
  LayoutDashboard, LogOut, Zap, FolderKanban,
  Plus, Settings, ChevronRight
} from 'lucide-react';

export default function Sidebar({ activePage, activeProjectId }) {
  const { user, logout } = useAuth();
  const { projects } = useTasks();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <Zap size={16} color="#fff" />
        </div>
        <span className="sidebar-logo-text">TaskFlow</span>
      </div>

      {/* Nav */}
      <div className="sidebar-section">
        <div className="sidebar-section-label">Menu</div>
        <button
          className={`sidebar-nav-item ${activePage === 'dashboard' ? 'active' : ''}`}
          onClick={() => navigate('/dashboard')}
        >
          <LayoutDashboard size={17} />
          Dashboard
        </button>
      </div>

      {/* Projects */}
      <div className="sidebar-section" style={{ paddingBottom: 4 }}>
        <div className="sidebar-section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Projects</span>
          <button
            className="btn-ghost btn-icon"
            style={{ padding: '2px 4px', marginRight: -4 }}
            onClick={() => navigate('/dashboard')}
            title="New project"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="sidebar-projects">
        {projects.length === 0 && (
          <p style={{ fontSize: 12, color: 'var(--text-dim)', padding: '6px 12px' }}>No projects yet</p>
        )}
        {projects.map((p) => (
          <button
            key={p._id}
            className={`sidebar-project-item ${activeProjectId === p._id ? 'active' : ''}`}
            onClick={() => navigate(`/board/${p._id}`)}
          >
            <span className="project-dot" style={{ background: p.color }} />
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {p.name}
            </span>
            <ChevronRight size={13} style={{ opacity: 0.4, flexShrink: 0 }} />
          </button>
        ))}
      </div>

      {/* User */}
      <div className="sidebar-bottom">
        <div className="sidebar-user" onClick={logout} title="Logout">
          <div className="avatar avatar-sm">{initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">Click to logout</div>
          </div>
          <LogOut size={15} style={{ color: 'var(--text-dim)', flexShrink: 0 }} />
        </div>
      </div>
    </aside>
  );
}
