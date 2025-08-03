import React, { useState } from "react";
import "./TaskSection.css";
import { ChevronRight } from "lucide-react";
// import Task1 from "../../assets/task2.svg";
// import Task2 from "../../assets/task3.svg";
// import Task3 from "../../assets/task4.svg";
// import Task4 from "../../assets/task5.svg";
// // import Task5 from "../../assets/task6.svg";
// // import Task6 from "../../assets/task7.svg";
// import Task7 from "../../assets/task8.svg";
import Flower1 from "../../../assets/flower2.svg";


const initialTasks = [
  {
    id: 1,
    title:
      "Call and confirm attendance with today’s scheduled tutoring volunteers",
    description:
      "Reach out to the volunteers scheduled today and confirm their availability. A quick check-in helps us stay prepared for the kids.",
    priority: "High",
  },
  {
    id: 2,
    title: "Prepare storybooks and learning kits for evening reading circle",
    description:
      "Select age-appropriate books and activity kits to make today’s reading hour fun and engaging for the children.",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Update child health records with recent check-up details",
    description:
      "Add notes from recent medical visits to each child’s profile. Keeping this up-to-date ensures timely care.",
    priority: "High",
  },
  {
    id: 4,
    title: "Greet new children joining the program and offer orientation",
    description:
      "Make our newest little ones feel safe and welcome. Walk them through the space and introduce them to our team.",
    priority: "Low",
  },
  {
    id: 5,
    title: "Check if any child requires emotional or counseling support today",
    description:
      "Observe gently or ask caregivers. Early care makes a world of difference in how children heal and grow.",
    priority: "High",
  },
  {
    id: 6,
    title:
      "Photograph and document today’s activities for monthly impact report",
    description:
      "Capture the small but powerful moments of learning, play, or care. These stories become the heartbeat of our updates.",
    priority: "High",
  },
  {
    id: 7,
    title: "Respond to donor questions about last month’s child sponsorship",
    description:
      "Follow up with warmth and transparency. Our supporters love hearing how their generosity has helped.",
    priority: "Medium",
  },
  {
    id: 8,
    title: "Coordinate with kitchen staff to confirm today’s meal and snacks",
    description:
      "Ensure that the meals planned are child-safe, balanced, and ready in time. Happy tummies, happy hearts!",
    priority: "Medium",
  },
  {
    id: 9,
    title: "Schedule home visit follow-ups for vulnerable children this week",
    description:
      "Check in with families needing extra support. A visit can mean comfort, connection, and better understanding of their needs.",
    priority: "Medium",
  },
  {
    id: 10,
    title:
      "Review and reorder essential supplies like diapers, soap, and books",
    description:
      "Take stock of what’s running low and place orders. These basics keep our environment safe, clean, and nurturing.",
    priority: "High",
  },
];

const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

const extraTaskPool = [
  {
    id: 1,
    title:
      "Call and confirm attendance with today’s scheduled tutoring volunteers",
    description:
      "Reach out to the volunteers scheduled today and confirm their availability. A quick check-in helps us stay prepared for the kids.",
    priority: "High",
  },
  {
    id: 2,
    title: "Prepare storybooks and learning kits for evening reading circle",
    description:
      "Select age-appropriate books and activity kits to make today’s reading hour fun and engaging for the children.",
    priority: "Medium",
  },
  {
    id: 3,
    title: "Update child health records with recent check-up details",
    description:
      "Add notes from recent medical visits to each child’s profile. Keeping this up-to-date ensures timely care.",
    priority: "High",
  },
  {
    id: 4,
    title: "Greet new children joining the program and offer orientation",
    description:
      "Make our newest little ones feel safe and welcome. Walk them through the space and introduce them to our team.",
    priority: "Low",
  },
  {
    id: 5,
    title: "Check if any child requires emotional or counseling support today",
    description:
      "Observe gently or ask caregivers. Early care makes a world of difference in how children heal and grow.",
    priority: "High",
  },
  {
    id: 6,
    title:
      "Photograph and document today’s activities for monthly impact report",
    description:
      "Capture the small but powerful moments of learning, play, or care. These stories become the heartbeat of our updates.",
    priority: "High",
  },
];

const TaskSection = () => {
  const [tasks, setTasks] = useState(initialTasks);
  const [extraTasks, setExtraTasks] = useState(extraTaskPool);
  const [totalTasks, setTotalTasks] = useState(initialTasks.length);
  const [completingTaskId, setCompletingTaskId] = useState(null);
  const [showExtraTasks, setShowExtraTasks] = useState(true);

  const handleToggle = (id) => {
    setCompletingTaskId(id);

    setTimeout(() => {
      const updated = tasks.filter((task) => task.id !== id);
      setTasks(updated);
      setCompletingTaskId(null);
    }, 400);
  };

  const handleAddExtraTask = (task) => {
    setTasks((prev) => [...prev, task]);
    setTotalTasks((prev) => prev + 1);
    setExtraTasks(extraTasks.filter((t) => t.id !== task.id));
  };

  const completedCount = totalTasks - tasks.length;
  const progress = (completedCount / totalTasks) * 100;

  const sortedTasks = [...tasks].sort((a, b) => {
    return (
      priorityOrder[a.priority.toLowerCase()] -
      priorityOrder[b.priority.toLowerCase()]
    );
  });
  return (
    <section className="ngo-section">
      <div className="ngo-wrapper">
        <img src={Flower1} alt="flower" className="task flower-2" />
        
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>

        <div className="task-list">
          {tasks.length === 0 ? (
            <>
              <p>All tasks completed!</p>

              {showExtraTasks && (
                <>
                  <div className="ngo-header">
                    <p>You can take on more if you're up for it.</p>
                  </div>

                  {extraTasks.map((task) => (
                    <div className="task-item" key={task.id}>
                      <div className="task-info">
                        <h1>{task.title}</h1>
                        <p>{task.description}</p>
                      </div>
                      <button
                        className="task-button"
                        onClick={() => handleAddExtraTask(task)}
                      >
                        Add
                      </button>
                    </div>
                  ))}

                  <div className="task-footer">
                    <button
                      className="task-button"
                      onClick={() => setShowExtraTasks(false)}
                    >
                      No, I'm done for the day
                      <ChevronRight className="task-icon" />
                    </button>
                  </div>
                </>
              )}
            </>
          ) : (
            sortedTasks.map((task) => (
              <div
                className={`task-item ${
                  completingTaskId === task.id ? "fade-out" : ""
                }`}
                key={task.id}
              >
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    onChange={() => handleToggle(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>

                <div className="task-info">
                  <h1>{task.title}</h1>
                  <p>{task.description}</p>
                </div>

                <div
                  className={`priority-dot ${task.priority.toLowerCase()}`}
                  title={`${task.priority} Priority`}
                ></div>
              </div>
            ))
          )}
        </div>

        {tasks.length !== 0 && (
          <div className="task-footer">
            <button className="task-button">
              View History
              <ChevronRight className="task-icon" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default TaskSection;
