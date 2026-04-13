import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import Chatbot from './Chatbot';

export default function Layout({ children }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { to: '/', icon: '🏠', label: 'Inicio' },
    { to: '/perfil', icon: '👤', label: 'Mi Perfil' },
  ];

  // Admin/superadmin extras
  if (['admin', 'superadmin'].includes(user?.rol)) {
    menuItems.push({ to: '/admin', icon: '⚙️', label: 'Administrar' });
  }

  return (
    <div className="app-layout">
      {/* Mobile toggle */}
      <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        ☰
      </button>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-icon">🍃</span>
          <span className="logo-text">Kinddo<span className="logo-accent">.</span></span>
        </div>

        <nav className="sidebar-menu">
          {menuItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="avatar avatar-sm" style={{ background: 'var(--primary-light)' }}>
              {user?.nombre?.charAt(0) || '?'}
            </div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.nombre}</div>
              <div className="sidebar-user-role">{user?.rol}</div>
            </div>
          </div>
          <button className="sidebar-link" onClick={handleLogout} style={{ color: 'var(--danger)', marginTop: 8 }}>
            <span className="link-icon">🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', zIndex: 40 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="main-content">
        {children}
      </main>
      <Chatbot />
    </div>
  );
}
