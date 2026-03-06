import React from 'react';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { FiImage, FiUsers, FiSettings, FiVideo } from 'react-icons/fi';

const AdminDashboard = () => {
  const { projects, team, services, videos } = useData();

  const stats = [
    { title: 'Projects', count: projects?.length || 0, icon: <FiImage />, color: '#c8a97e', link: '/admin/projects' },
    { title: 'Team', count: team?.length || 0, icon: <FiUsers />, color: '#2c3e50', link: '/admin/team' },
    { title: 'Services', count: services?.length || 0, icon: <FiSettings />, color: '#e74c3c', link: '/admin/services' },
    { title: 'Videos', count: videos?.length || 0, icon: <FiVideo />, color: '#27ae60', link: '/admin/videos' }
  ];

  return (
    <div className="admin-dashboard">
      <h2>Dashboard</h2>
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <Link to={stat.link} key={i} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-info">
              <h3>{stat.count}</h3>
              <p>{stat.title}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;