import React, { useState } from "react";
import Sidebar from "../../../Components/Sidebar";
import Banner from "../../../Components/Banner";
import "./Notifications.css";
import {
  Bell,
  CheckCircle,
  Clock,
  Users,
  Package,
  FileText,
  AlertCircle,
  Trash2,
  CheckCheck, // Replace MarkAsRead with CheckCheck
} from "lucide-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Task Assigned",
      message:
        "You have been assigned a new task: 'Update child health records'",
      time: "2 hours ago",
      type: "task",
      read: false,
      priority: "high",
    },
    {
      id: 2,
      title: "Volunteer Confirmed",
      message: "Sarah Johnson confirmed attendance for today's reading session",
      time: "4 hours ago",
      type: "volunteer",
      read: false,
      priority: "medium",
    },
    {
      id: 3,
      title: "Inventory Update",
      message: "Food supplies are running low. Please check inventory.",
      time: "1 day ago",
      type: "inventory",
      read: true,
      priority: "high",
    },
    {
      id: 4,
      title: "Weekly Report Due",
      message: "Your weekly impact report is due in 2 days",
      time: "2 days ago",
      type: "report",
      read: true,
      priority: "medium",
    },
    {
      id: 5,
      title: "Achievement Unlocked",
      message: "Congratulations! You've earned the 'Efficiency Badge'",
      time: "3 days ago",
      type: "achievement",
      read: false,
      priority: "low",
    },
    {
      id: 6,
      title: "Upcoming Event",
      message: "Community outreach event scheduled for tomorrow at 10 AM",
      time: "1 week ago",
      type: "event",
      read: true,
      priority: "medium",
    },
  ]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "task":
        return <CheckCircle size={20} />;
      case "volunteer":
        return <Users size={20} />;
      case "inventory":
        return <Package size={20} />;
      case "report":
        return <FileText size={20} />;
      case "achievement":
        return <Bell size={20} />;
      case "event":
        return <Clock size={20} />;
      default:
        return <AlertCircle size={20} />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "priority-medium";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const unreadNotifications = notifications.filter((n) => !n.read);
  const readNotifications = notifications.filter((n) => n.read);

  return (
    <div>
      <Sidebar />
      <div className="notifications-page">
        <div className="notifications-header">
          <h1 className="notifications-title">Notifications</h1>
          <p className="notifications-subtitle">
            <em>
              Stay updated with your tasks, achievements, and important updates
            </em>
          </p>
        </div>

        <div className="notifications-stats">
          <div className="stats-card">
            <h3>Total Notifications</h3>
            <div className="stat-number">{notifications.length}</div>
          </div>
          <div className="stats-card">
            <h3>Unread</h3>
            <div className="stat-number">{unreadCount}</div>
          </div>
          <div className="stats-card">
            <h3>This Week</h3>
            <div className="stat-number">
              {
                notifications.filter(
                  (n) => n.time.includes("hours") || n.time.includes("day")
                ).length
              }
            </div>
          </div>
        </div>

        <div className="notifications-actions">
          <button onClick={markAllAsRead} className="action-btn primary">
            <CheckCheck size={18} />
            Mark All as Read
          </button>
        </div>

        <div className="notifications-sections">
          {unreadNotifications.length > 0 && (
            <div className="notifications-section">
              <h2 className="section-title">
                <Bell
                  size={24}
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Unread ({unreadCount})
              </h2>
              <div className="notifications-list">
                {unreadNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item unread ${getPriorityClass(
                      notification.priority
                    )}`}
                  >
                    <div className="notification-icon">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>{notification.title}</h4>
                        <div className="notification-meta">
                          <span
                            className={`priority-indicator ${getPriorityClass(
                              notification.priority
                            )}`}
                          >
                            {notification.priority}
                          </span>
                          <span className="notification-time">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      <p>{notification.message}</p>
                    </div>
                    <div className="notification-actions">
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="action-btn secondary small"
                        title="Mark as read"
                      >
                        <CheckCircle size={16} />
                      </button>
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="action-btn danger small"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {readNotifications.length > 0 && (
            <div className="notifications-section">
              <h2 className="section-title">
                <CheckCircle
                  size={24}
                  style={{ marginRight: "8px", verticalAlign: "middle" }}
                />
                Read
              </h2>
              <div className="notifications-list">
                {readNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`notification-item read ${getPriorityClass(
                      notification.priority
                    )}`}
                  >
                    <div className="notification-icon">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="notification-content">
                      <div className="notification-header">
                        <h4>{notification.title}</h4>
                        <div className="notification-meta">
                          <span
                            className={`priority-indicator ${getPriorityClass(
                              notification.priority
                            )}`}
                          >
                            {notification.priority}
                          </span>
                          <span className="notification-time">
                            {notification.time}
                          </span>
                        </div>
                      </div>
                      <p>{notification.message}</p>
                    </div>
                    <div className="notification-actions">
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="action-btn danger small"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {notifications.length === 0 && (
          <div className="empty-state">
            <Bell size={48} />
            <h3>No notifications</h3>
            <p>You're all caught up! Check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
