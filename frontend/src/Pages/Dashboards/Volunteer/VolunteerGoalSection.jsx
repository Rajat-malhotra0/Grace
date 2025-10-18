import React, { useState } from "react";
import VolunteerGoalForm from "./VolunteerGoalForm";
import VolunteerProgressCard from "./VolunteerProgressCard";

const VolunteerGoalSection = () => {
  const [goalData, setGoalData] = useState(null);
  const [completed] = useState(8); // Replace with real activity count later

  const handleGoalSet = ({ goal, notify }) => {
    setGoalData({ goal, notify });
  };

  const handleEdit = () => {
    setGoalData(null); // Reset to show form
  };

  return (
    <div>
      {goalData ? (
        <VolunteerProgressCard
          goal={goalData.goal}
          completed={completed}
          onEdit={handleEdit}
        />
      ) : (
        <VolunteerGoalForm onSubmit={handleGoalSet} />
      )}
    </div>
  );
};

export default VolunteerGoalSection;
