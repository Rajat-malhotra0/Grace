import React, { useState } from "react";
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
      <h2>Edit your 2025 Volunteering Goal</h2>
      <p>How many volunteering activities do you want to do in 2025?</p>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          required
          min="1"
        />
        <label>
          <input
            type="checkbox"
            checked={notify}
            onChange={() => setNotify(!notify)}
          />
          Keep me motivated with progress updates
        </label>
        <button type="submit">Set Volunteering Goal</button>
      </form>
    </div>
  );
};

export default VolunteerGoalForm;
