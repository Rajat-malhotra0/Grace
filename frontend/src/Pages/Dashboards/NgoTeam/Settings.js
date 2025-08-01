import React, { useState } from "react";
import Sidebar from "../../../Components/Sidebar";
import "./Settings.css";
import {
  Bell,
  Smartphone,
  Clock,
  FileText,
  Palette,
  Globe,
  Lock,
  User,
  Trash2,
  Save,
  Settings as SettingsIcon,
} from "lucide-react";

const Settings = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    taskReminders: true,
    weeklyReports: true,
    theme: "light",
    language: "english",
  });

  const handleToggle = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const handleSelectChange = (setting, value) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: value,
    }));
  };

  return (
    <div>
      <Sidebar />
      <div className="settings-page">
        <div className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-subtitle">
            <em>Customize your Grace experience and manage your preferences</em>
          </p>
        </div>

        <div className="settings-sections">
          <div className="settings-section">
            <div className="section-header">
              <Bell size={24} />
              <h3>Notifications</h3>
            </div>
            <div className="settings-grid">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">
                    <Bell size={20} />
                  </div>
                  <div className="setting-details">
                    <h4>Email Notifications</h4>
                    <p>Receive updates and alerts via email</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle("emailNotifications")}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">
                    <Smartphone size={20} />
                  </div>
                  <div className="setting-details">
                    <h4>Push Notifications</h4>
                    <p>Get instant notifications on your device</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle("pushNotifications")}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">
                    <Clock size={20} />
                  </div>
                  <div className="setting-details">
                    <h4>Task Reminders</h4>
                    <p>Receive reminders for upcoming tasks</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.taskReminders}
                    onChange={() => handleToggle("taskReminders")}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">
                    <FileText size={20} />
                  </div>
                  <div className="setting-details">
                    <h4>Weekly Reports</h4>
                    <p>Get weekly summaries of your activities</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={() => handleToggle("weeklyReports")}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <SettingsIcon size={24} />
              <h3>Preferences</h3>
            </div>
            <div className="settings-grid">
              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">
                    <Palette size={20} />
                  </div>
                  <div className="setting-details">
                    <h4>Theme</h4>
                    <p>Choose your preferred interface theme</p>
                  </div>
                </div>
                <select
                  className="setting-select"
                  value={settings.theme}
                  onChange={(e) => handleSelectChange("theme", e.target.value)}
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>

              <div className="setting-item">
                <div className="setting-info">
                  <div className="setting-icon">
                    <Globe size={20} />
                  </div>
                  <div className="setting-details">
                    <h4>Language</h4>
                    <p>Select your preferred language</p>
                  </div>
                </div>
                <select
                  className="setting-select"
                  value={settings.language}
                  onChange={(e) =>
                    handleSelectChange("language", e.target.value)
                  }
                >
                  <option value="english">English</option>
                  <option value="hindi">Hindi</option>
                  <option value="spanish">Spanish</option>
                </select>
              </div>
            </div>
          </div>

          <div className="settings-section">
            <div className="section-header">
              <User size={24} />
              <h3>Account</h3>
            </div>
            <div className="settings-grid">
              <div className="account-actions">
                <button className="settings-btn secondary">
                  <Lock size={18} />
                  Change Password
                </button>
                <button className="settings-btn secondary">
                  <User size={18} />
                  Update Profile
                </button>
                <button className="settings-btn danger">
                  <Trash2 size={18} />
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-btn primary">
            <Save size={18} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
