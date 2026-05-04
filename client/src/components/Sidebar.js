import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FiHome, FiLogOut, FiSettings, FiUsers,
  FiFileText, FiAlertCircle, FiDollarSign, FiTrendingUp,
  FiClipboard, FiFolder, FiGithub
} from 'react-icons/fi';
import { HiOutlineChartBar } from 'react-icons/hi';
import './Sidebar.css';

const Sidebar = ({ user }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = user && (user.role === 'admin' || user.role === 'officer');

  const userMenuItems = [
    { label: 'Dashboard', path: '/dashboard', icon: FiHome },
    { label: 'Schemes', path: '/schemes', icon: FiFileText },
    { label: 'Certificates', path: '/certificates', icon: FiClipboard },
    { label: 'Complaints', path: '/complaints', icon: FiAlertCircle },
    { label: 'Taxes', path: '/taxes', icon: FiDollarSign },
    { label: 'Funds', path: '/funds', icon: FiTrendingUp },
    { label: 'My Applications', path: '/applications', icon: FiFileText },
    { label: 'My Documents', path: '/documents', icon: FiFolder },
  ];

  const adminMenuItems = [
    { label: 'Admin Dashboard', path: '/admin', icon: HiOutlineChartBar },
    { label: 'Manage Schemes', path: '/admin/schemes', icon: FiSettings },
    { label: 'Manage Users', path: '/admin/users', icon: FiUsers },
  ];

  const menuItems = isAdmin ? [...userMenuItems, ...adminMenuItems] : userMenuItems;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      {/* Modern Sidebar */}
      <aside className={`sidebar ${isMinimized ? 'minimized' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <div className="brand-icon">
              <FiGithub size={20} />
            </div>
            {!isMinimized && <h2>Portal</h2>}
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                className={`sidebar-item ${isActive ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
                title={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <span className="sidebar-icon">
                  <IconComponent size={20} />
                </span>
                {!isMinimized && <span className="sidebar-label">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer - User Profile */}
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            {!isMinimized && (
              <div className="user-details">
                <p className="user-name">{user?.name || 'User'}</p>
                <p className="user-role">{user?.role === 'admin' || user?.role === 'officer' ? 'Officer' : 'Citizen'}</p>
              </div>
            )}
          </div>
          <button 
            className="sidebar-logout" 
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout from portal"
          >
            <FiLogOut size={18} />
            {!isMinimized && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
