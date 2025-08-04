import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import "./NgoAdminTaskBoard.css";
import { useNavigate } from "react-router-dom";

const priorities = ["Low", "Medium", "High"];

const NgoAdminTaskBoard = () => {
    const { user, ngo, token, isAuthenticated, isAuthLoading } =
        useContext(AuthContext);
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(false);
    const [ngoUsers, setNgoUsers] = useState([]); // Store users associated with NGO
    const [userMap, setUserMap] = useState({}); // Store user ID to name mapping
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthLoading) return;

        if (!isAuthenticated || !user) {
            navigate("/login");
            return;
        }
        if (!user.role?.includes("ngo")) {
            alert("Access denied. You must be logged in as an NGO admin.");
            navigate("/login");
            return;
        }

        if (!ngo?._id) {
            console.log("NGO data not found, attempting to fetch...");
            fetchNgoData();
        } else {
            // NGO data is available, load NGO users and tasks
            loadNgoUsers();
            loadTasks();
        }
    }, [isAuthenticated, isAuthLoading, user, ngo, navigate]);

    const fetchNgoData = async () => {
        try {
            const response = await axios.get(
                "http://localhost:3001/api/auth/profile",
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.data.success && response.data.result.ngo) {
                localStorage.setItem(
                    "ngo",
                    JSON.stringify(response.data.result.ngo)
                );
                window.location.reload();
            } else {
                alert("NGO data not found. Please contact support.");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error fetching NGO data:", error);
            alert("Failed to load NGO data. Please try logging in again.");
            navigate("/login");
        }
    };

    const loadNgoUsers = async () => {
        if (!ngo?._id) return;

        try {
            const response = await axios.get(
                `http://localhost:3001/api/users/ngo/${ngo._id}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.data.success) {
                const users = response.data.result;
                setNgoUsers(users);

                // Create a mapping of user ID to user name
                const mapping = {};
                users.forEach((user) => {
                    mapping[user._id] = user.userName;
                });
                setUserMap(mapping);
            }
        } catch (error) {
            console.error("Error loading NGO users:", error);
            // If no users found, we can still continue with empty array
            setNgoUsers([]);
            setUserMap({});
        }
    };

    const loadTasks = async () => {
        if (!ngo?._id) return;

        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3001/api/tasks/ngo/${ngo._id}`,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.data) {
                const tasks = response.data;
                const groupedSections = groupTasksByEmployee(tasks);
                setSections(groupedSections);
            }
        } catch (error) {
            console.error("Error loading tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupTasksByEmployee = (tasks) => {
        const grouped = tasks.reduce((acc, task) => {
            const employeeId = task.assignedTo || "unassigned";
            if (!acc[employeeId]) {
                acc[employeeId] = {
                    id: employeeId,
                    employeeId: task.assignedTo,
                    employeeName: userMap[task.assignedTo] || "",
                    tasks: [],
                    showSuccess: false,
                };
            }
            acc[employeeId].tasks.push({
                id: task._id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate,
            });
            return acc;
        }, {});

        return Object.values(grouped);
    };

    const addSection = () => {
        setSections((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                employeeId: "",
                employeeName: "",
                tasks: [],
                showSuccess: false,
            },
        ]);
    };

    const updateEmployee = (sectionId, userId) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          employeeId: userId,
                          employeeName: userMap[userId] || "",
                      }
                    : section
            )
        );
    };

    const addTask = (sectionId) => {
        const newTask = {
            id: Date.now().toString(),
            title: "",
            description: "",
            priority: "Low",
            status: "Pending",
        };

        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId
                    ? { ...section, tasks: [...section.tasks, newTask] }
                    : section
            )
        );
    };

    const updateTask = (sectionId, taskId, field, value) => {
        setSections((prev) =>
            prev.map((section) =>
                section.id === sectionId
                    ? {
                          ...section,
                          tasks: section.tasks.map((task) =>
                              task.id === taskId
                                  ? { ...task, [field]: value }
                                  : task
                          ),
                      }
                    : section
            )
        );
    };

    const assignTasks = async (sectionId) => {
        if (!ngo?._id) {
            alert("NGO ID not found. Cannot assign tasks.");
            return;
        }

        const section = sections.find((sec) => sec.id === sectionId);
        if (!section.employeeId || section.tasks.length === 0) {
            alert("Please select employee and add at least one task.");
            return;
        }

        // Validate that NGO has categories
        if (!ngo.category || ngo.category.length === 0) {
            alert(
                "NGO must have at least one category assigned to create tasks."
            );
            return;
        }

        try {
            setLoading(true);
            const createdTasks = [];

            // Process tasks one by one instead of using Promise.all
            for (const task of section.tasks) {
                // Skip if task already exists in backend
                if (task.id && task.id.length === 24) {
                    createdTasks.push(task);
                    continue;
                }

                // Extract category ID properly
                let categoryId = ngo.category[0]._id || ngo.category[0];

                const taskData = {
                    title: task.title,
                    description: task.description,
                    priority: task.priority.toLowerCase(),
                    status:
                        task.status === "Pending"
                            ? "free"
                            : task.status.toLowerCase(),
                    assignedTo: section.employeeId,
                    ngo: ngo._id,
                    createdBy: user._id,
                    category: categoryId,
                };

                console.log("Creating task:", taskData);

                try {
                    const response = await axios.post(
                        "http://localhost:3001/api/tasks",
                        taskData,
                        {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: token,
                            },
                        }
                    );

                    if (response.data && response.data.result) {
                        createdTasks.push(response.data.result);
                        console.log(
                            "Task created successfully:",
                            response.data.result.title
                        );
                    }
                } catch (taskError) {
                    console.error(
                        "Failed to create task:",
                        task.title,
                        taskError
                    );
                    alert(`Failed to create task: ${task.title}`);
                }
            }

            if (createdTasks.length > 0) {
                setSections((prev) =>
                    prev.map((sec) =>
                        sec.id === sectionId
                            ? {
                                  ...sec,
                                  tasks: createdTasks.map((task) => ({
                                      id: task._id || task.id,
                                      title: task.title,
                                      description: task.description,
                                      priority: task.priority,
                                      status: task.status,
                                  })),
                                  showSuccess: true,
                              }
                            : sec
                    )
                );

                // Hide success message after 2 seconds
                setTimeout(() => {
                    setSections((prev) =>
                        prev.map((sec) =>
                            sec.id === sectionId
                                ? { ...sec, showSuccess: false }
                                : sec
                        )
                    );
                }, 2000);

                console.log(
                    `Successfully assigned ${createdTasks.length} tasks`
                );
            } else {
                alert("No tasks were successfully created.");
            }
        } catch (error) {
            console.error("Error in assignTasks:", error);
            alert("Failed to assign tasks. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (sectionId, taskId) => {
        if (!ngo?._id) {
            alert("NGO ID not found. Cannot update task.");
            return;
        }

        const section = sections.find((sec) => sec.id === sectionId);
        const task = section.tasks.find((t) => t.id === taskId);
        const newStatus = task.status === "Pending" ? "done" : "free"; // Map to backend enum values

        try {
            // If task has a MongoDB ID, update in backend
            if (taskId.length === 24) {
                await axios.put(
                    `http://localhost:3001/api/tasks/${taskId}`,
                    { status: newStatus },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    }
                );
            }

            // Update local state
            setSections((prev) =>
                prev.map((section) =>
                    section.id === sectionId
                        ? {
                              ...section,
                              tasks: section.tasks.map((task) =>
                                  task.id === taskId
                                      ? {
                                            ...task,
                                            status:
                                                newStatus === "done"
                                                    ? "Completed"
                                                    : "Pending",
                                        }
                                      : task
                              ),
                          }
                        : section
                )
            );
        } catch (error) {
            console.error("Error updating task status:", error);
            alert("Failed to update task status. Please try again.");
        }
    };

    const removeTask = async (sectionId, taskId) => {
        if (!ngo?._id) {
            alert("NGO ID not found. Cannot remove task.");
            return;
        }

        try {
            // If task has a MongoDB ID, delete from backend
            if (taskId.length === 24) {
                await axios.delete(
                    `http://localhost:3001/api/tasks/${taskId}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );
            }

            // Update local state
            setSections((prev) =>
                prev.map((section) =>
                    section.id === sectionId
                        ? {
                              ...section,
                              tasks: section.tasks.filter(
                                  (task) => task.id !== taskId
                              ),
                          }
                        : section
                )
            );
        } catch (error) {
            console.error("Error removing task:", error);
            alert("Failed to remove task. Please try again.");
        }
    };

    // Show loading while auth is being determined
    if (isAuthLoading) {
        return (
            <div className="task-board-container">
                <div className="loading-message">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return (
            <div className="task-board-container">
                <div className="error-message">
                    <h3>Access Denied</h3>
                    <p>Please log in to access this page.</p>
                </div>
            </div>
        );
    }

    if (!user.role?.includes("ngo")) {
        return (
            <div className="task-board-container">
                <div className="error-message">
                    <h3>Access Denied</h3>
                    <p>
                        You must be logged in as an NGO admin to access this
                        page.
                    </p>
                </div>
            </div>
        );
    }

    if (!ngo?._id) {
        return (
            <div className="task-board-container">
                <div className="loading-message">Loading NGO data...</div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="task-board-container">
                <div className="loading-message">Loading tasks...</div>
            </div>
        );
    }

    return (
        <div className="task-board-container">
            <div className="task-board-header">
                <h2>TEAM TASKBOARD</h2>
                <p>
                    <em>Manage team responsibilities from one place.</em>
                </p>
                <p>
                    NGO: {ngo.name} (ID: {ngo._id})
                </p>
                <p>Associated Users: {ngoUsers.length}</p>
            </div>

            <div className="task-section-list">
                {sections.map((section) => (
                    <div key={section.id} className="task-section">
                        <div>
                            <select
                                value={section.employeeId}
                                onChange={(e) =>
                                    updateEmployee(section.id, e.target.value)
                                }
                            >
                                <option value="">Select employee</option>
                                {ngoUsers.map((user) => (
                                    <option key={user._id} value={user._id}>
                                        {user.userName} ({user.email})
                                    </option>
                                ))}
                            </select>
                            {section.employeeName && (
                                <div className="employee-name">
                                    {section.employeeName}
                                </div>
                            )}
                        </div>

                        {section.tasks.map((task) => (
                            <div key={task.id} className="task-card">
                                <input
                                    type="text"
                                    placeholder="Task title"
                                    value={task.title}
                                    onChange={(e) =>
                                        updateTask(
                                            section.id,
                                            task.id,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                />
                                <textarea
                                    placeholder="Description"
                                    value={task.description}
                                    onChange={(e) =>
                                        updateTask(
                                            section.id,
                                            task.id,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                />
                                <select
                                    value={task.priority}
                                    onChange={(e) =>
                                        updateTask(
                                            section.id,
                                            task.id,
                                            "priority",
                                            e.target.value
                                        )
                                    }
                                >
                                    {priorities.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                                <div className="task-card-footer">
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={
                                                task.status === "Completed" ||
                                                task.status === "done"
                                            }
                                            onChange={() =>
                                                toggleStatus(
                                                    section.id,
                                                    task.id
                                                )
                                            }
                                        />
                                        {task.status === "done"
                                            ? "Completed"
                                            : task.status}
                                    </label>
                                    <button
                                        onClick={() =>
                                            removeTask(section.id, task.id)
                                        }
                                        style={{ color: "red" }}
                                    ></button>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={() => addTask(section.id)}
                            className="add-task-btn"
                        >
                            + Add task
                        </button>

                        <button
                            onClick={() => assignTasks(section.id)}
                            className="assign-tasks-btn"
                            disabled={loading}
                        >
                            {loading ? "Assigning..." : "Assign Tasks"}
                        </button>

                        {section.showSuccess && (
                            <div className="success-message">
                                Tasks assigned!
                            </div>
                        )}
                    </div>
                ))}

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
