import React, { useState } from "react";
import { Target, Bell, BellOff } from "lucide-react";
import "./VolunteerGoal.css";

const VolunteerGoalForm = ({ onSubmit }) => {
  const [goal, setGoal] = useState("");
  const [notify, setNotify] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ goal: parseInt(goal), notify });
  };

  return (
    <div className="goal-form-container">
      <div className="goal-header">
        <Target className="goal-icon" size={24} />
        <h2>Edit your 2025 Volunteering Goal</h2>
      </div>
      <p>How many volunteering activities do you want to do in 2025?</p>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
          min="1"
          placeholder="Enter your goal"
        />
        <label className="notification-label">
          {notify ? <Bell size={16} /> : <BellOff size={16} />}
          <input
            type="checkbox"
            checked={notify}
            onChange={() => setNotify(!notify)}
          />
          Keep me motivated with progress updates
        </label>
        <button type="submit">
          <Target size={16} />
          Set Volunteering Goal
        </button>
      </form>
    </div>
  );
};

export default VolunteerGoalForm;
