import React from "react";
import "./VolunteerGoal.css";

const getMessage = (progress) => {
  if (progress === 100) return "🎉 You’ve reached your volunteering goal!";
  if (progress >= 75) return "You're almost at your goal—finish strong!";
  if (progress >= 50) return "Amazing progress. Just a bit more to go!";
  if (progress >= 25) return "Halfway there! Your impact is growing.";
  return "You’ve started strong—keep the spirit alive!";
};

const VolunteerProgressCard = ({ goal, completed, onEdit }) => {
  const progress = Math.min(100, Math.round((completed / goal) * 100));

  return (
    <div className="goal-progress-container">
      <h2>2025 Volunteering Goals</h2>
      <p>
        You have completed <strong>{completed}</strong> of{" "}
        <strong>{goal}</strong> activities this year.
      </p>

      <div className="progress-bar-background">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="progress-text">{progress}%</div>

      <p className="motivational-message">{getMessage(progress)}</p>
      <button className="edit-goal-btn" onClick={onEdit}>
        Edit Goal
      </button>
    </div>
  );
};

export default VolunteerProgressCard;
