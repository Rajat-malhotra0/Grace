import React, { useState } from "react";
import Sidebar from "../../../Components/Sidebar";
import Banner from "../../../Components/Banner";
import "./Notifications.css";

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
    },
    {
      id: 2,
      title: "Volunteer Confirmed",
      message: "Sarah Johnson confirmed attendance for today's reading session",
      time: "4 hours ago",
      type: "volunteer",
      read: false,
    },
    {
      id: 3,
      title: "Inventory Update",
      message: "Food supplies are running low. Please check inventory.",
      time: "1 day ago",
      type: "inventory",
      read: true,
    },
    {
      id: 4,
      title: "Weekly Report Due",
      message: "Your weekly impact report is due in 2 days",
      time: "2 days ago",
      type: "report",
      read: true,
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

  const getTypeIcon = (type) => {
    switch (type) {
      case "task":
        return "📋";
      case "volunteer":
        return "👥";
      case "inventory":
        return "📦";
      case "report":
        return "📊";
      default:
        return "🔔";
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      <Sidebar />
      <div className="ngo-team-dashboard-main-container">
        <Banner />
        <div className="notifications-container">
          <div className="notifications-header">
            <h2>Notifications</h2>
            <div className="notifications-actions">
              <span className="unread-count">{unreadCount} unread</span>
              <button onClick={markAllAsRead} className="mark-all-btn">
                Mark all as read
              </button>
            </div>
          </div>

          <div className="notifications-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  notification.read ? "read" : "unread"
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getTypeIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h4>{notification.title}</h4>
                  <p>{notification.message}</p>
                  <span className="notification-time">{notification.time}</span>
                </div>
                {!notification.read && <div className="unread-indicator"></div>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;
