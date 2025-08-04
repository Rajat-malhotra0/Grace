import React, { useState } from 'react';
import './NgoAdminTaskBoard.css';

const mockLoginIds = {
  'user123': 'Asha Sharma',
  'grace456': 'Connor Joseph',
  'admin789': 'John Isaac',
  'hope001': 'Nirali Patel'
};

const priorities = ['Low', 'Medium', 'High'];

const NgoAdminTaskBoard = () => {
  const [sections, setSections] = useState([]);

  const addSection = () => {
    setSections(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        employeeId: '',
        employeeName: '',
        tasks: [],
        showSuccess: false
      }
    ]);
  };

  const updateEmployee = (sectionId, loginId) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              employeeId: loginId,
              employeeName: mockLoginIds[loginId]
            }
          : section
      )
    );
  };

  const addTask = (sectionId) => {
    const newTask = {
      id: Date.now().toString(),
      title: '',
      description: '',
      priority: 'Low',
      status: 'Pending'
    };

    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? { ...section, tasks: [...section.tasks, newTask] }
          : section
      )
    );
  };

  const updateTask = (sectionId, taskId, field, value) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map(task =>
                task.id === taskId ? { ...task, [field]: value } : task
              )
            }
          : section
      )
    );
  };

  const removeTask = (sectionId, taskId) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.filter(task => task.id !== taskId)
            }
          : section
      )
    );
  };

  const toggleStatus = (sectionId, taskId) => {
    setSections(prev =>
      prev.map(section =>
        section.id === sectionId
          ? {
              ...section,
              tasks: section.tasks.map(task =>
                task.id === taskId
                  ? {
                      ...task,
                      status: task.status === 'Pending' ? 'Completed' : 'Pending'
                    }
                  : task
              )
            }
          : section
      )
    );
  };

  const assignTasks = (sectionId) => {
    const section = sections.find(sec => sec.id === sectionId);
    if (!section.employeeId || section.tasks.length === 0) {
      alert('Please select employee and add at least one task.');
      return;
    }

    // Simulate backend call
    console.log('Assigning tasks to:', section.employeeId);
    console.log('Tasks:', section.tasks);

    setSections(prev =>
      prev.map(sec =>
        sec.id === sectionId ? { ...sec, showSuccess: true } : sec
      )
    );

    setTimeout(() => {
      setSections(prev =>
        prev.map(sec =>
          sec.id === sectionId ? { ...sec, showSuccess: false } : sec
        )
      );
    }, 2000);
  };

  return (
    <div className="task-board-container">
      <div className="task-board-header">
          <h2>TEAM TASKBOARD</h2>
          <p>
            <em>Manage team responsibilities from one place.</em>
          </p>
        </div>
      <div className="task-section-list">
        
        {sections.map((section) => (
          <div key={section.id} className="task-section">
            {/* Section Header */}
            <div>
              <select
                value={section.employeeId}
                onChange={(e) => updateEmployee(section.id, e.target.value)}
              >
                <option value="">Select employee login ID</option>
                {Object.keys(mockLoginIds).map((id) => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
              {section.employeeName && (
                <div className="employee-name">{section.employeeName}</div>
              )}
            </div>

            {/* Task List */}
            {section.tasks.map((task) => (
              <div key={task.id} className="task-card">
                <input
                  type="text"
                  placeholder="Task title"
                  value={task.title}
                  onChange={(e) => updateTask(section.id, task.id, 'title', e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  value={task.description}
                  onChange={(e) => updateTask(section.id, task.id, 'description', e.target.value)}
                />
                <select
                  value={task.priority}
                  onChange={(e) => updateTask(section.id, task.id, 'priority', e.target.value)}
                >
                  {priorities.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <div className="task-card-footer">
                  <label>
                    <input
                      type="checkbox"
                      checked={task.status === 'Completed'}
                      onChange={() => toggleStatus(section.id, task.id)}
                    />{' '}
                    {task.status}
                  </label>
                  <button onClick={() => removeTask(section.id, task.id)} style={{ color: 'red' }}>✕</button>
                </div>
              </div>
            ))}

            {/* Add Task Button */}
            <button
              onClick={() => addTask(section.id)}
              className="add-task-btn"
            >
              + Add task
            </button>

            {/* Assign Tasks */}
            <button
              onClick={() => assignTasks(section.id)}
              className="assign-tasks-btn"
            >
              Assign Tasks
            </button>

            {/* Success Message */}
            {section.showSuccess && (
              <div className="success-message">Tasks assigned!</div>
            )}
          </div>
        ))}

        {/* Add Section */}
        <div>
          <button onClick={addSection} className="add-section-button">
            + Add section
          </button>
        </div>
      </div>
    </div>
  );
};

export default NgoAdminTaskBoard;
