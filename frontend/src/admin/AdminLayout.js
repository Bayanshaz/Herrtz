import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiHome, FiImage, FiUsers, FiSettings, FiVideo, FiMail, FiLogOut } from 'react-icons/fi';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/projects', icon: <FiImage />, label: 'Projects' },
    { path: '/admin/team', icon: <FiUsers />, label: 'Team' },
    { path: '/admin/services', icon: <FiSettings />, label: 'Services' },
    { path: '/admin/videos', icon: <FiVideo />, label: 'Videos' },
    { path: '/admin/messages', icon: <FiMail />, label: 'Messages' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src="/logo.jpg" alt="Harrtz Concepts" />
          <h3>{user?.name || 'Admin'}</h3>
          <p>Administrator</p>
        </div>
        <nav>
          {navItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.icon} <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <button onClick={handleLogout} className="logout-btn">
          <FiLogOut /> Logout
        </button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;