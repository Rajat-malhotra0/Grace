import React from "react";
import Sidebar from "../../../Components/Sidebar";
import Banner from "../../../Components/Banner";
import "./Achievements.css";

const Achievements = () => {
  const achievements = [
    {
      id: 1,
      title: "First Month Complete",
      description: "Successfully completed your first month with Grace!",
      date: "2024-01-15",
      icon: "🎉",
      type: "milestone",
    },
    {
      id: 2,
      title: "100 Tasks Completed",
      description: "Completed 100 tasks to help children in need.",
      date: "2024-02-20",
      icon: "✅",
      type: "task",
    },
    {
      id: 3,
      title: "Community Impact",
      description: "Your efforts have positively impacted 50+ children.",
      date: "2024-03-10",
      icon: "💝",
      type: "impact",
    },
    {
      id: 4,
      title: "Team Player",
      description: "Collaborated effectively with 10+ volunteers.",
      date: "2024-03-25",
      icon: "🤝",
      type: "collaboration",
    },
  ];

  return (
    <div>
      <Sidebar />
      <div className="ngo-team-dashboard-main-container">
        <Banner />
        <div className="achievements-container">
          <div className="achievements-header">
            <h2>Your Achievements</h2>
            <p>Celebrating your journey of making a difference</p>
          </div>

          <div className="achievements-grid">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`achievement-card ${achievement.type}`}
              >
                <div className="achievement-icon">{achievement.icon}</div>
                <div className="achievement-content">
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                  <span className="achievement-date">{achievement.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
