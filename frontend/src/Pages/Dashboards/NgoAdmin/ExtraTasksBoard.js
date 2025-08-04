import React, { useState } from 'react';
import './ExtraTasksBoard.css';

const priorities = ['Low', 'Medium', 'High'];
const statuses = ['Not Picked', 'In Progress', 'Completed'];

const ExtraTasksBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const addTask = () => {
    setTasks(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        priority: 'Low',
        status: 'Not Picked'
      }
    ]);
  };

  const updateTask = (taskId, field, value) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId ? { ...task, [field]: value } : task
      )
    );
  };

  const removeTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const saveTasks = () => {
  if (tasks.length === 0) {
    alert('Please add at least one task.');
    return;
  }

  // Validate each task
  for (let task of tasks) {
    if (
      task.title.trim() === '' ||
      task.description.trim() === '' ||
      !task.priority ||
      !task.status
    ) {
      alert('Please fill out all fields for each task before saving.');
      return;
    }
  }

  console.log('Saving extra tasks:', tasks);

  setShowSuccess(true);
  setTimeout(() => setShowSuccess(false), 2000);
};


  return (
    <div className="extra-board-container">
      <h2 className="extra-board-title">Extra Tasks (Visible to All Team Members)</h2>

      <div className="extra-tasks-column">
        {tasks.map(task => (
          <div key={task.id} className="extra-task-card">
            <input
              type="text"
              placeholder="Task title"
              value={task.title}
              onChange={(e) => updateTask(task.id, 'title', e.target.value)}
            />
            <textarea
              placeholder="Description"
              value={task.description}
              onChange={(e) => updateTask(task.id, 'description', e.target.value)}
            />
            <div className="dropdown-row">
              <select
                value={task.priority}
                onChange={(e) => updateTask(task.id, 'priority', e.target.value)}
              >
                {priorities.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <select
                value={task.status}
                onChange={(e) => updateTask(task.id, 'status', e.target.value)}
              >
                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="task-footer">
              <button className="delete-btn" onClick={() => removeTask(task.id)}>✕ Delete</button>
            </div>
          </div>
        ))}

        <button className="add-task-btn" onClick={addTask}>+ Add Task</button>
        <button className="save-tasks-btn" onClick={saveTasks}>Save Extra Tasks</button>

        {showSuccess && <div className="success-message">✅ Extra tasks saved!</div>}
      </div>
    </div>
  );
};

export default ExtraTasksBoard;
