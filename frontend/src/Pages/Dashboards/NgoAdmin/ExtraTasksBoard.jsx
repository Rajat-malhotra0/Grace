import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import { withApiBase } from "config";
import "./ExtraTasksBoard.css";

const priorities = ["Low", "Medium", "High"];
const statuses = ["Not Picked", "In Progress", "Completed"];

const ExtraTasksBoard = () => {
    const { user, ngo, token } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [pendingTasks, setPendingTasks] = useState([]); // Tasks not saved to DB yet
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    // Load existing extra tasks when component mounts
    useEffect(() => {
        const loadExtraTasks = async () => {
            if (!ngo?._id) return;

            try {
                setLoading(true);
                const response = await axios.get(
                    withApiBase(`/api/tasks/ngo/${ngo._id}`),
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.data.result) {
                    // Filter for extra tasks (tasks without assignedTo)
                    const extraTasks = response.data.result.filter(
                        (task) => !task.assignedTo
                    );

                    // Convert backend format to frontend format
                    const formattedTasks = extraTasks.map((task) => ({
                        id: task._id,
                        title: task.title,
                        description: task.description,
                        priority:
                            task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1),
                        status: mapBackendStatusToFrontend(task.status),
                        isLocal: false, // These are saved tasks
                    }));

                    setTasks(formattedTasks);
                }
            } catch (error) {
                console.error("Error loading extra tasks:", error);
            } finally {
                setLoading(false);
            }
        };

        if (ngo?._id) {
            loadExtraTasks();
        }
    }, [ngo, token]);

    // Map backend status to frontend status
    const mapBackendStatusToFrontend = (backendStatus) => {
        const statusMap = {
            free: "Not Picked",
            "in-progress": "In Progress",
            done: "Completed",
        };
        return statusMap[backendStatus] || "Not Picked";
    };

    // Map frontend status to backend status
    const mapFrontendStatusToBackend = (frontendStatus) => {
        const statusMap = {
            "Not Picked": "free",
            "In Progress": "in-progress",
            Completed: "done",
        };
        return statusMap[frontendStatus] || "free";
    };

    const addTask = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!ngo?._id) {
            alert("NGO ID not found. Cannot create task.");
            return;
        }

        // Create a new task locally (not saved to DB yet)
        const newTask = {
            id: `temp-${Date.now()}`, // Temporary ID for local tasks
            title: "New Extra Task",
            description: "Task description",
            priority: "Medium",
            status: "Not Picked",
            isLocal: true, // Flag to identify unsaved tasks
        };

        setTasks((prev) => [...prev, newTask]);
    };

    const saveTasks = async () => {
        if (!ngo?.category || ngo.category.length === 0) {
            alert(
                "NGO must have at least one category assigned to create tasks."
            );
            return;
        }

        const localTasks = tasks.filter((task) => task.isLocal);

        if (localTasks.length === 0) {
            alert("No new tasks to save.");
            return;
        }

        try {
            setSaving(true);

            // Get category ID
            let categoryId = ngo.category[0]._id || ngo.category[0];

            const savePromises = localTasks.map(async (task) => {
                const taskData = {
                    title: task.title,
                    description: task.description,
                    priority: task.priority.toLowerCase(),
                    status: mapFrontendStatusToBackend(task.status),
                    ngo: ngo._id,
                    createdBy: user._id,
                    category: categoryId,
                };

                const response = await axios.post(
                    withApiBase("/api/tasks"),
                    taskData,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                return {
                    tempId: task.id,
                    savedTask: response.data.result,
                };
            });

            const savedResults = await Promise.all(savePromises);

            // Update tasks with real IDs and remove isLocal flag
            setTasks((prev) =>
                prev.map((task) => {
                    if (task.isLocal) {
                        const savedResult = savedResults.find(
                            (result) => result.tempId === task.id
                        );
                        if (savedResult) {
                            return {
                                id: savedResult.savedTask._id,
                                title: savedResult.savedTask.title,
                                description: savedResult.savedTask.description,
                                priority:
                                    savedResult.savedTask.priority
                                        .charAt(0)
                                        .toUpperCase() +
                                    savedResult.savedTask.priority.slice(1),
                                status: mapBackendStatusToFrontend(
                                    savedResult.savedTask.status
                                ),
                                isLocal: false,
                            };
                        }
                    }
                    return task;
                })
            );

            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            console.log("All tasks saved successfully");
        } catch (error) {
            console.error("Error saving tasks:", error);
            alert("Failed to save some tasks. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const updateTask = async (taskId, field, value) => {
        // Update local state immediately for better UX
        setTasks((prev) =>
            prev.map((task) =>
                task.id === taskId ? { ...task, [field]: value } : task
            )
        );

        // Only update in backend if the task is already saved (not local)
        const task = tasks.find((t) => t.id === taskId);
        if (!task || task.isLocal) return; // Skip backend update for local tasks

        // Update in backend for saved tasks
        try {
            const updatedTask = { ...task, [field]: value };

            const taskData = {
                title: updatedTask.title,
                description: updatedTask.description,
                priority: updatedTask.priority.toLowerCase(),
                status: mapFrontendStatusToBackend(updatedTask.status),
            };

            await axios.put(withApiBase(`/api/tasks/${taskId}`), taskData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Task updated successfully");
        } catch (error) {
            console.error("Error updating task:", error);
            // Reload tasks to sync with backend if update fails
        }
    };

    const removeTask = async (taskId) => {
        const task = tasks.find((t) => t.id === taskId);

        // If it's a local task, just remove from state
        if (task?.isLocal) {
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
            return;
        }

        // If it's a saved task, delete from backend
        try {
            setLoading(true);

            await axios.delete(withApiBase(`/api/tasks/${taskId}`), {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Remove from local state
            setTasks((prev) => prev.filter((task) => task.id !== taskId));
            console.log("Task deleted successfully");
        } catch (error) {
            console.error("Error deleting task:", error);
            alert("Failed to delete task. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Show loading state
    if (!ngo?._id) {
        return (
            <div className="extra-board-container">
                <div className="loading-message">Loading NGO data...</div>
            </div>
        );
    }

    return (
        <div className="extra-board-container">
            <h2 className="extra-board-title">
                Extra Tasks (Available for All Team Members)
            </h2>
            <p className="ngo-info">NGO: {ngo.name}</p>
            <p className="tasks-count">Extra Tasks: {tasks.length}</p>

            {loading && <div className="loading-message">Loading...</div>}

            <div className="extra-tasks-column">
                {tasks.map((task) => (
                    <div key={task.id} className="extra-task-card">
                        <input
                            type="text"
                            placeholder="Task title"
                            value={task.title}
                            onChange={(e) =>
                                updateTask(task.id, "title", e.target.value)
                            }
                            disabled={loading}
                        />
                        <textarea
                            placeholder="Description"
                            value={task.description}
                            onChange={(e) =>
                                updateTask(
                                    task.id,
                                    "description",
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />
                        <div className="dropdown-row">
                            <select
                                value={task.priority}
                                onChange={(e) =>
                                    updateTask(
                                        task.id,
                                        "priority",
                                        e.target.value
                                    )
                                }
                                disabled={loading}
                            >
                                {priorities.map((p) => (
                                    <option key={p} value={p}>
                                        {p}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={task.status}
                                onChange={(e) =>
                                    updateTask(
                                        task.id,
                                        "status",
                                        e.target.value
                                    )
                                }
                                disabled={loading}
                            >
                                {statuses.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="task-footer">
                            <span className="task-id">
                                ID: {task.id.slice(-6)}
                                {task.isLocal && (
                                    <span className="unsaved-indicator">
                                        {" "}
                                        (Unsaved)
                                    </span>
                                )}
                            </span>
                            <button
                                className="delete-btn"
                                onClick={() => removeTask(task.id)}
                                disabled={loading}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                <div className="button-row">
                    <button
                        className="add-task-btn"
                        onClick={addTask}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "+ Add Extra Task"}
                    </button>

                    <button
                        className="save-tasks-btn"
                        onClick={saveTasks}
                        disabled={
                            saving ||
                            tasks.filter((t) => t.isLocal).length === 0
                        }
                    >
                        {saving
                            ? "Saving..."
                            : `Save Tasks (${
                                  tasks.filter((t) => t.isLocal).length
                              })`}
                    </button>
                </div>

                {showSuccess && (
                    <div className="success-message">Task updated!</div>
                )}
            </div>
        </div>
    );
};

export default ExtraTasksBoard;
