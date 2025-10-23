import React, { useState, useEffect, useContext } from "react";
import "./TaskSection.css";
import { ChevronRight } from "lucide-react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import { withApiBase } from "config";
import Flower1 from "../../../assets/flower2.svg";

const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3,
};

const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const TaskSection = () => {
    const { user, ngo, token, isAuthLoading } = useContext(AuthContext);
    const [allTasks, setAllTasks] = useState([]);
    const [extraTasks, setExtraTasks] = useState([]);
    const [completedDailyTasks, setCompletedDailyTasks] = useState([]);
    const [totalTasks, setTotalTasks] = useState(0);
    const [completingTaskId, setCompletingTaskId] = useState(null);
    const [showExtraTasks, setShowExtraTasks] = useState(true);
    const [loading, setLoading] = useState(true);
    const [today, setToday] = useState(daysOfWeek[new Date().getDay()]);

    // Extract primitive values to prevent object reference issues
    const userId = user?._id;
    const userRole = user?.role;
    const userNgoId = user?.ngoId;
    const ngoId = ngo?._id;

    useEffect(() => {
        const loadDailyTaskCompletions = async () => {
            if (!userId || !token) return;

            try {
                const response = await axios.get(
                    withApiBase(`/api/tasks/daily-completions/${userId}`),
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                if (response.data.success) {
                    setCompletedDailyTasks(response.data.result || []);
                }
            } catch (error) {
                console.error("Error loading daily task completions:", error);
                setCompletedDailyTasks([]);
            }
        };

        loadDailyTaskCompletions();
    }, [userId, token]); // Use only primitive values to prevent object reference issues

    // Check day immediately on component mount/page reload
    useEffect(() => {
        const checkDayOnLoad = () => {
            const currentDay = daysOfWeek[new Date().getDay()];
            if (currentDay !== today) {
                console.log(
                    `Day changed from ${today} to ${currentDay} on page load`
                );
                setToday(currentDay);
                setCompletedDailyTasks([]); // Reset completed daily tasks for new day

                // Load fresh daily task completions for the current day
                if (userId && token) {
                    const loadDailyTaskCompletions = async () => {
                        try {
                            const response = await axios.get(
                                withApiBase(
                                    `/api/tasks/daily-completions/${userId}`
                                ),
                                {
                                    headers: {
                                        Authorization: token,
                                    },
                                }
                            );

                            if (response.data.success) {
                                setCompletedDailyTasks(
                                    response.data.result || []
                                );
                            }
                        } catch (error) {
                            console.error(
                                "Error loading daily task completions on page load:",
                                error
                            );
                            setCompletedDailyTasks([]);
                        }
                    };
                    loadDailyTaskCompletions();
                }
            }
        };

        // Check day immediately when component mounts or dependencies change
        checkDayOnLoad();
    }, [today, userId, token]); // Run when user/token change (page load, login, etc.) or when today changes

    useEffect(() => {
        const checkDayChange = () => {
            const newToday = daysOfWeek[new Date().getDay()];
            if (newToday !== today) {
                console.log(
                    `Day changed from ${today} to ${newToday} during runtime`
                );
                setToday(newToday);
                setCompletedDailyTasks([]); // Reset completed daily tasks when the day changes

                // Load fresh daily task completions for the new day
                if (userId && token) {
                    const loadDailyTaskCompletions = async () => {
                        try {
                            const response = await axios.get(
                                withApiBase(
                                    `/api/tasks/daily-completions/${userId}`
                                ),
                                {
                                    headers: {
                                        Authorization: token,
                                    },
                                }
                            );

                            if (response.data.success) {
                                setCompletedDailyTasks(
                                    response.data.result || []
                                );
                            }
                        } catch (error) {
                            console.error(
                                "Error loading daily task completions:",
                                error
                            );
                            setCompletedDailyTasks([]);
                        }
                    };
                    loadDailyTaskCompletions();
                }
            }
        };

        // Check immediately and then every minute for better user experience
        checkDayChange();
        const interval = setInterval(checkDayChange, 60000); // 1 minute

        return () => clearInterval(interval);
    }, [today, userId, token]);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                setLoading(true);

                if (!userId || !token) {
                    setAllTasks([]);
                    setExtraTasks([]);
                    setTotalTasks(0);
                    setLoading(false);
                    return;
                }

                let activeNgoId = null;
                if (userRole?.includes("ngo") && ngoId) {
                    activeNgoId = ngoId;
                } else if (userNgoId) {
                    activeNgoId = userNgoId;
                }

                if (!activeNgoId) {
                    setAllTasks([]);
                    setExtraTasks([]);
                    setTotalTasks(0);
                    setLoading(false);
                    return;
                }

                const userTasksResponse = await axios.get(
                    withApiBase(`/api/tasks/user/${userId}`),
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                if (userTasksResponse.data.success) {
                    const userTasks = userTasksResponse.data.result || [];
                    setAllTasks(userTasks);
                    setTotalTasks(userTasks.length);
                }

                if (activeNgoId) {
                    const ngoTasksResponse = await axios.get(
                        withApiBase(`/api/tasks/ngo/${activeNgoId}`),
                        {
                            headers: {
                                Authorization: token,
                            },
                        }
                    );

                    const ngoTasks = Array.isArray(ngoTasksResponse.data.result)
                        ? ngoTasksResponse.data.result
                        : [];

                    const unassignedTasks = ngoTasks.filter((task) => {
                        return !task.assignedTo && task.status === "free";
                    });

                    setExtraTasks(unassignedTasks.slice(0, 6));
                }
            } catch (error) {
                console.error("Error loading tasks:", error);
                setAllTasks([]);
                setExtraTasks([]);
                setTotalTasks(0);
            } finally {
                setLoading(false);
            }
        };

        loadTasks();
    }, [userId, userRole, userNgoId, ngoId, token]); // Use only primitive values to prevent object reference issues

    const handleToggle = async (taskId, isDaily) => {
        setCompletingTaskId(taskId);

        try {
            if (isDaily) {
                // For daily tasks, use the new daily completion endpoint
                await axios.post(
                    withApiBase(`/api/tasks/${taskId}/complete-daily`),
                    {
                        userId: user._id,
                    },
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                setTimeout(() => {
                    setCompletedDailyTasks((prev) => [...prev, taskId]);
                    setCompletingTaskId(null);
                }, 400);
            } else {
                // For regular tasks, update the task status
                await axios.put(
                    withApiBase(`/api/tasks/${taskId}`),
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
                    const updated = allTasks.filter(
                        (task) => task._id !== taskId
                    );
                    setAllTasks(updated);
                    setCompletingTaskId(null);
                }, 400);
            }
        } catch (error) {
            console.error("Error completing task:", error);
            if (error.response?.status === 409) {
                // Task already completed today
                setCompletedDailyTasks((prev) => [...prev, taskId]);
            }
            setCompletingTaskId(null);
        }
    };

    const handleAddExtraTask = async (task) => {
        try {
            const response = await axios.put(
                withApiBase(`/api/tasks/${task._id}`),
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
                setAllTasks((prev) => [
                    ...prev,
                    { ...task, assignedTo: user._id, status: "in-progress" },
                ]);
                setTotalTasks((prev) => prev + 1);
                setExtraTasks(extraTasks.filter((t) => t._id !== task._id));
            }
        } catch (error) {
            console.error("Error adding extra task:", error);
        }
    };

    const activeTasks = allTasks.filter(
        (task) => task.status !== "done" && task.status !== "cancelled"
    );

    const dailyTasks = activeTasks.filter(
        (task) =>
            task.isDaily &&
            task.dayOfWeek.includes(today) &&
            !completedDailyTasks.includes(task._id) // Hide completed daily tasks for today
    );
    const regularTasks = activeTasks.filter(
        (task) => !task.isDaily || !task.dayOfWeek.includes(today)
    );

    // Calculate completed count including both regular completed tasks and daily tasks completed today
    const regularCompletedCount = totalTasks - activeTasks.length;
    const dailyCompletedCount = completedDailyTasks.length;
    const totalCompletedCount = regularCompletedCount + dailyCompletedCount;

    // Calculate total tasks for today (regular tasks + daily tasks for today)
    const dailyTasksForToday = allTasks.filter(
        (task) => task.isDaily && task.dayOfWeek.includes(today)
    ).length;
    const totalTasksForToday =
        totalTasks -
        allTasks.filter((task) => task.isDaily).length +
        dailyTasksForToday;

    const progress =
        totalTasksForToday > 0
            ? (totalCompletedCount / totalTasksForToday) * 100
            : 0;

    const sortedTasks = [...regularTasks].sort((a, b) => {
        return (
            priorityOrder[a.priority.toLowerCase()] -
            priorityOrder[b.priority.toLowerCase()]
        );
    });

    const sortedDailyTasks = [...dailyTasks].sort((a, b) => {
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
                    {dailyTasks.length > 0 && <h2>Today's Tasks</h2>}
                    {sortedDailyTasks.map((task) => (
                        <div
                            className={`task-item ${
                                completingTaskId === task._id ? "fade-out" : ""
                            } ${
                                completedDailyTasks.includes(task._id)
                                    ? "completed"
                                    : ""
                            }`}
                            key={task._id}
                        >
                            <label className="custom-checkbox">
                                <input
                                    type="checkbox"
                                    checked={completedDailyTasks.includes(
                                        task._id
                                    )}
                                    onChange={() =>
                                        handleToggle(task._id, true)
                                    }
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
                    ))}

                    {regularTasks.length > 0 && dailyTasks.length > 0 && <hr />}

                    {regularTasks.length === 0 && dailyTasks.length === 0 ? (
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
                                        onChange={() =>
                                            handleToggle(task._id, false)
                                        }
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

                {allTasks.length !== 0 && (
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
