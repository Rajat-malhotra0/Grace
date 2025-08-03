import React from "react";
import { Trophy, Target, TrendingUp, Star, Zap, Edit3 } from "lucide-react";
import "./VolunteerGoal.css";

const getMessage = (progress) => {
  if (progress === 100)
    return { text: "You've reached your volunteering goal!", icon: Trophy };
  if (progress >= 75)
    return { text: "You're almost at your goal—finish strong!", icon: Target };
  if (progress >= 50)
    return {
      text: "Amazing progress. Just a bit more to go!",
      icon: TrendingUp,
    };
  if (progress >= 25)
    return { text: "Halfway there! Your impact is growing.", icon: Star };
  return { text: "You've started strong—keep the spirit alive!", icon: Zap };
};

const VolunteerProgressCard = ({ goal, completed, onEdit }) => {
  const progress = Math.min(100, Math.round((completed / goal) * 100));
  const message = getMessage(progress);
  const MessageIcon = message.icon;

  return (
    <div className="goal-progress-container">
      <div className="goal-header">
        <Target className="goal-icon" size={24} />
        <h2>2025 Volunteering Goals</h2>
      </div>
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

      <div className="motivational-message">
        <MessageIcon className="message-icon" size={20} />
        <span>{message.text}</span>
      </div>

      <button className="edit-goal-btn" onClick={onEdit}>
        <Edit3 size={16} />
        Edit Goal
      </button>
    </div>
  );
};

export default VolunteerProgressCard;
