import React, { useState, useEffect, useContext } from "react";
import "./TaskSection.css";
import { ChevronRight } from "lucide-react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import Flower1 from "../../../assets/flower2.svg";

const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3,
};

const TaskSection = () => {
    const { user, ngo, token, isAuthLoading } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [extraTasks, setExtraTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completingTaskId, setCompletingTaskId] = useState(null);
    const [showExtraTasks, setShowExtraTasks] = useState(true);
    const [loading, setLoading] = useState(true);

    console.log("TaskSection - Auth context:", {
        user: user
            ? {
                  id: user._id,
                  email: user.email,
                  role: user.role,
                  ngoId: user.ngoId,
              }
            : null,
        ngo: ngo ? { id: ngo._id, name: ngo.name } : null,
        isAuthLoading,
    });

    useEffect(() => {
        const loadTasks = async () => {
            try {
                setLoading(true);

                if (!user || !token) {
                    console.log("User or token not available yet");
                    setTasks([]);
                    setExtraTasks([]);
                    setTotalTasks(0);
                    setLoading(false);
                    return;
                }

                // Get NGO ID based on user role - inline logic
                let userNgoId = null;
                if (user?.role?.includes("ngo") && ngo?._id) {
                    userNgoId = ngo._id; // User owns an NGO
                } else if (user?.ngoId) {
                    userNgoId = user.ngoId; // User is associated with an NGO
                }

                console.log("Using NGO ID:", userNgoId);

                if (!userNgoId) {
                    console.log(
                        "No NGO ID found - user might not be associated with any NGO"
                    );
                    setTasks([]);
                    setExtraTasks([]);
                    setTotalTasks(0);
                    setLoading(false);
                    return;
                }

                console.log("Fetching user tasks for user ID:", user._id);
                const userTasksResponse = await axios.get(
                    `http://localhost:3001/api/tasks/user/${user._id}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                console.log("User tasks response:", userTasksResponse.data);
                let userTasks = [];
                if (userTasksResponse.data.success) {
                    userTasks = userTasksResponse.data.result || [];
                    const activeTasks = userTasks.filter(
                        (task) =>
                            task.status !== "done" &&
                            task.status !== "cancelled"
                    );
                    setTasks(activeTasks);
                    setTotalTasks(activeTasks.length);
                    console.log("Active tasks set:", activeTasks.length);

                    if (!userNgoId && userTasks.length > 0) {
                        userNgoId = userTasks[0].ngo;
                        console.log(
                            "NGO ID extracted from user tasks:",
                            userNgoId
                        );
                    }
                }

                if (!userNgoId) {
                    console.log(
                        "No NGO ID found anywhere, trying to fetch user's NGO relationship..."
                    );
                    try {
                        const userNgoResponse = await axios.get(
                            `http://localhost:3001/api/users/${user._id}`,
                            {
                                headers: {
                                    Authorization: token,
                                },
                            }
                        );

                        if (userNgoResponse.data && userNgoResponse.data.ngo) {
                            userNgoId = userNgoResponse.data.ngo;
                            console.log(
                                "NGO ID from user endpoint:",
                                userNgoId
                            );
                        }
                    } catch (error) {
                        console.log(
                            "Could not fetch user-ngo relationship:",
                            error
                        );
                    }
                }

                if (userNgoId) {
                    console.log("Fetching NGO tasks for NGO ID:", userNgoId);
                    const ngoTasksResponse = await axios.get(
                        `http://localhost:3001/api/tasks/ngo/${userNgoId}`,
                        {
                            headers: {
                                Authorization: token,
                            },
                        }
                    );

                    console.log("NGO tasks response:", ngoTasksResponse.data);
                    const ngoTasks = Array.isArray(ngoTasksResponse.data)
                        ? ngoTasksResponse.data
                        : ngoTasksResponse.data.result || [];

                    console.log("All NGO tasks:", ngoTasks);

                    const unassignedTasks = ngoTasks.filter((task) => {
                        const isUnassigned = !task.assignedTo;
                        const isFree = task.status === "free";
                        console.log(
                            `Task ${
                                task._id
                            }: assigned=${!!task.assignedTo}, status=${
                                task.status
                            }, isUnassigned=${isUnassigned}, isFree=${isFree}`
                        );
                        return isUnassigned && isFree;
                    });

                    console.log("Filtered unassigned tasks:", unassignedTasks);
                    setExtraTasks(unassignedTasks.slice(0, 6)); // Limit to 6 extra tasks
                    console.log("Extra tasks set:", unassignedTasks.length);
                } else {
                    console.log("No NGO available, skipping extra tasks");
                    setExtraTasks([]);
                }
            } catch (error) {
                console.error("Error loading tasks:", error);
                // Keep arrays empty if there's an error
                setTasks([]);
                setExtraTasks([]);
                setTotalTasks(0);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [user, ngo, token]);

    const handleToggle = async (taskId) => {
        setCompletingTaskId(taskId);

        try {
            // Update task status to 'done' in backend
            await axios.put(
                `http://localhost:3001/api/tasks/${taskId}`,
                {
                    status: "done",
                    completedAt: new Date(),
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            setTimeout(() => {
                const updated = tasks.filter((task) => task._id !== taskId);
                setTasks(updated);
                setCompletingTaskId(null);
            }, 400);
        } catch (error) {
            console.error("Error completing task:", error);
            setCompletingTaskId(null);
        }
    };

    const handleAddExtraTask = async (task) => {
        try {
            // Assign the task to current user
            const response = await axios.put(
                `http://localhost:3001/api/tasks/${task._id}`,
                {
                    assignedTo: user._id,
                    status: "in-progress",
                },
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.status === 200) {
                // Add to current tasks
                setTasks((prev) => [
                    ...prev,
                    { ...task, assignedTo: user._id, status: "in-progress" },
                ]);
                setTotalTasks((prev) => prev + 1);

                // Remove from extra tasks
                setExtraTasks(extraTasks.filter((t) => t._id !== task._id));
            }
        } catch (error) {
            console.error("Error adding extra task:", error);
        }
    };

    const completedCount = totalTasks - tasks.length;
    const progress = (completedCount / totalTasks) * 100;

    const sortedTasks = [...tasks].sort((a, b) => {
        return (
            priorityOrder[a.priority.toLowerCase()] -
            priorityOrder[b.priority.toLowerCase()]
        );
    });

    if (loading || isAuthLoading) {
        return (
            <section className="ngo-section">
                <div className="ngo-wrapper">
                    <p>Loading tasks...</p>
                </div>
            </section>
        );
    }

    // If user or token is not available after auth loading is complete, show a message
    if (!user || !token) {
        return (
            <section className="ngo-section">
                <div className="ngo-wrapper">
                    <p>
                        Unable to load tasks. Please make sure you're logged in.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="ngo-section">
            <div className="ngo-wrapper">
                <img src={Flower1} alt="flower" className="task flower-2" />

                <div className="progress-bar-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                <div className="task-list">
                    {tasks.length === 0 ? (
                        <>
                            <p>All tasks completed!</p>

                            {showExtraTasks && extraTasks.length > 0 && (
                                <>
                                    <div className="ngo-header">
                                        <p>
                                            You can take on more if you're up
                                            for it.
                                        </p>
                                    </div>

                                    {extraTasks.map((task) => (
                                        <div
                                            className="task-item"
                                            key={task._id}
                                        >
                                            <div className="task-info">
                                                <h1>{task.title}</h1>
                                                <p>{task.description}</p>
                                            </div>
                                            <button
                                                className="task-button"
                                                onClick={() =>
                                                    handleAddExtraTask(task)
                                                }
                                            >
                                                Add
                                            </button>
                                        </div>
                                    ))}

                                    <div className="task-footer">
                                        <button
                                            className="task-button"
                                            onClick={() =>
                                                setShowExtraTasks(false)
                                            }
                                        >
                                            No, I'm done for the day
                                            <ChevronRight className="task-icon" />
                                        </button>
                                    </div>
                                </>
                            )}

                            {showExtraTasks && extraTasks.length === 0 && (
                                <p>
                                    Great job! No additional tasks available
                                    right now.
                                </p>
                            )}
                        </>
                    ) : (
                        sortedTasks.map((task) => (
                            <div
                                className={`task-item ${
                                    completingTaskId === task._id
                                        ? "fade-out"
                                        : ""
                                }`}
                                key={task._id}
                            >
                                <label className="custom-checkbox">
                                    <input
                                        type="checkbox"
                                        onChange={() => handleToggle(task._id)}
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
