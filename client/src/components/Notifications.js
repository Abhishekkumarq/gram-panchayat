import React, { useState, useEffect, useRef } from 'react';
import { FiBell, FiX, FiCheck, FiCheckSquare } from 'react-icons/fi';
import { notifications as notificationAPI } from '../api';
import './Notifications.css';

const Notifications = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const dropdownRef = useRef(null);

  // Fetch notifications
  const fetchNotifications = async (pageNum = 1) => {
    try {
      setLoading(true);
      const response = await notificationAPI.getMy(pageNum, 10, false);
      setNotifications(response.data.notifications);
      setUnreadCount(response.data.unreadCount);
      setPage(pageNum);
      setTotalPages(response.data.pagination.pages);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (user) {
      fetchNotifications(1);
    }
  }, [user]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mark as read
  const handleMarkAsRead = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationAPI.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, isRead: true, readAt: new Date() } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true, readAt: new Date() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  // Delete notification
  const handleDelete = async (notificationId, e) => {
    e.stopPropagation();
    try {
      await notificationAPI.delete(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setUnreadCount(prev => {
        const notif = notifications.find(n => n._id === notificationId);
        return notif && !notif.isRead ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Get notification type badge color
  const getTypeColor = (type) => {
    const colors = {
      certificate: '#3B82F6',
      tax: '#8B5CF6',
      complaint: '#EF4444',
      scheme: '#10B981',
      fund: '#F59E0B',
      alert: '#DC2626',
      general: '#6B7280'
    };
    return colors[type] || colors.general;
  };

  // Get notification type icon
  const getTypeIcon = (type) => {
    const icons = {
      certificate: '📜',
      tax: '💰',
      complaint: '📝',
      scheme: '🎯',
      fund: '📊',
      alert: '⚠️',
      general: 'ℹ️'
    };
    return icons[type] || '📬';
  };

  // Format time
  const formatTime = (date) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diff = Math.floor((now - notifDate) / 1000);

    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
    
    return notifDate.toLocaleDateString();
  };

  return (
    <div className="notifications-wrapper" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        className={`notification-bell-icon ${showDropdown ? 'active' : ''}`}
        onClick={() => setShowDropdown(!showDropdown)}
        title="Notifications"
      >
        <FiBell size={24} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="notification-dropdown">
          {/* Header */}
          <div className="notification-dropdown-header">
            <h3>Notifications</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={handleMarkAllAsRead}
                title="Mark all as read"
              >
                <FiCheckSquare size={18} />
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="notification-list">
            {loading ? (
              <div className="notification-loading">
                <p>Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="notification-empty">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification._id}
                  className={`notification-item ${!notification.isRead ? 'unread' : ''}`}
                  style={{
                    borderLeftColor: getTypeColor(notification.type)
                  }}
                >
                  <div className="notification-item-icon">
                    {getTypeIcon(notification.type)}
                  </div>

                  <div className="notification-item-content">
                    <div className="notification-item-header">
                      <h4>{notification.title}</h4>
                      {!notification.isRead && <span className="unread-dot"></span>}
                    </div>
                    <p className="notification-item-message">{notification.message}</p>
                    <span className="notification-item-time">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>

                  <div className="notification-item-actions">
                    {!notification.isRead && (
                      <button
                        className="notification-action-btn read-btn"
                        onClick={(e) => handleMarkAsRead(notification._id, e)}
                        title="Mark as read"
                      >
                        <FiCheck size={16} />
                      </button>
                    )}
                    <button
                      className="notification-action-btn delete-btn"
                      onClick={(e) => handleDelete(notification._id, e)}
                      title="Delete"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="notification-dropdown-footer">
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => fetchNotifications(page - 1)}
                  disabled={page === 1}
                  className="pagination-btn"
                >
                  ← Newer
                </button>
                <span className="pagination-info">{page} / {totalPages}</span>
                <button
                  onClick={() => fetchNotifications(page + 1)}
                  disabled={page === totalPages}
                  className="pagination-btn"
                >
                  Older →
                </button>
              </div>
            )}
            <a href="/notifications" className="view-all-link">
              View All Notifications
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

