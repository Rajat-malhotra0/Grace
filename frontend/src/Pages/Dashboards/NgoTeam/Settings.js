import React, { useState } from "react";
import Sidebar from "../../../Components/Sidebar";
import Banner from "../../../Components/Banner";
import "./Settings.css";

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
      <div className="ngo-team-dashboard-main-container">
        <Banner />
        <div className="settings-container">
          <div className="settings-header">
            <h2>Settings</h2>
            <p>Customize your Grace experience</p>
          </div>

          <div className="settings-sections">
            <div className="settings-section">
              <h3>Notifications</h3>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={() => handleToggle("emailNotifications")}
                  />
                  Email Notifications
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.pushNotifications}
                    onChange={() => handleToggle("pushNotifications")}
                  />
                  Push Notifications
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.taskReminders}
                    onChange={() => handleToggle("taskReminders")}
                  />
                  Task Reminders
                </label>
              </div>
              <div className="setting-item">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.weeklyReports}
                    onChange={() => handleToggle("weeklyReports")}
                  />
                  Weekly Reports
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3>Preferences</h3>
              <div className="setting-item">
                <label>
                  Theme:
                  <select
                    value={settings.theme}
                    onChange={(e) =>
                      handleSelectChange("theme", e.target.value)
                    }
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </label>
              </div>
              <div className="setting-item">
                <label>
                  Language:
                  <select
                    value={settings.language}
                    onChange={(e) =>
                      handleSelectChange("language", e.target.value)
                    }
                  >
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="spanish">Spanish</option>
                  </select>
                </label>
              </div>
            </div>

            <div className="settings-section">
              <h3>Account</h3>
              <button className="settings-btn secondary">
                Change Password
              </button>
              <button className="settings-btn secondary">Update Profile</button>
              <button className="settings-btn danger">Delete Account</button>
            </div>
          </div>

          <div className="settings-footer">
            <button className="settings-btn primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
