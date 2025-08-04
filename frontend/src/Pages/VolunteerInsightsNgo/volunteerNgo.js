import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
    BarChart,
    LineChart,
    DonutChart,
    PieChart,
} from "../../Components/Charts/ChartJS";
import { AuthContext } from "../../Context/AuthContext";
import "./volunteer.css";

function VolunteerInsights() {
    const { user, ngo, isAuthenticated, isAuthLoading } =
        useContext(AuthContext);
    const navigate = useNavigate();
    const [timePeriod, setTimePeriod] = useState("month");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        totalVolunteers: 0,
        activeVolunteers: 0,
        newVolunteers: 0,
        retentionRate: 0,
        taskCategories: [],
        volunteerTypes: [],
        locationStats: [],
        skillDistribution: [],
        monthlyGrowth: [],
        topPerformers: [],
        availabilityDistribution: [],
    });

    // Get NGO name for filtering data
    const currentNgoName = ngo?.name || "Your NGO";

    // Process the fetched data
    const processVolunteerData = useCallback(
        (volunteers, tasks, categories) => {
            const timeFrames = { week: 7, month: 30, quarter: 90, year: 365 };
            const daysInMs = timeFrames[timePeriod] * 24 * 60 * 60 * 1000;
            const now = Date.now();

            // Filter volunteers to include volunteers, ngoMembers, and donors
            const allVolunteers = volunteers.filter(
                (v) =>
                    v.role &&
                    (v.role.includes("volunteer") ||
                        v.role.includes("ngoMember") ||
                        v.role.includes("donor") ||
                        v.role.includes("ngo")) // Temporarily include 'ngo' for debugging
            );

            // Basic volunteer metrics
            const totalVolunteers = allVolunteers.length;
            const activeVolunteers = allVolunteers.filter((v) => {
                const updatedAt = new Date(v.updatedAt || v.createdAt);
                return (
                    !isNaN(updatedAt.getTime()) &&
                    now - updatedAt.getTime() < daysInMs
                );
            }).length;

            const newVolunteers = allVolunteers.filter((v) => {
                const createdAt = new Date(v.createdAt);
                return (
                    !isNaN(createdAt.getTime()) &&
                    now - createdAt.getTime() < daysInMs
                );
            }).length;

            const retentionRate =
                totalVolunteers > 0
                    ? (
                          ((totalVolunteers - newVolunteers) /
                              (totalVolunteers || 1)) *
                          100
                      ).toFixed(1)
                    : 0;

            // Task category analysis
            const taskCategoryMap = {};
            const categoryNames = {};
            categories.forEach((cat) => {
                if (cat.type === "task") {
                    categoryNames[cat._id] = cat.name;
                }
            });

            tasks.forEach((task) => {
                const categoryName =
                    categoryNames[task.category] || "Uncategorized";
                if (!taskCategoryMap[categoryName]) {
                    taskCategoryMap[categoryName] = {
                        total: 0,
                        completed: 0,
                        volunteers: new Set(),
                    };
                }
                taskCategoryMap[categoryName].total++;
                if (task.status === "done") {
                    taskCategoryMap[categoryName].completed++;
                }
                if (task.assignedTo) {
                    taskCategoryMap[categoryName].volunteers.add(
                        task.assignedTo
                    );
                }
            });

            const taskCategories = Object.entries(taskCategoryMap)
                .map(([name, stats]) => ({
                    category: name,
                    totalTasks: stats.total,
                    completedTasks: stats.completed,
                    completionRate:
                        stats.total > 0
                            ? ((stats.completed / stats.total) * 100).toFixed(1)
                            : 0,
                    activeVolunteers: stats.volunteers.size,
                }))
                .sort((a, b) => b.totalTasks - a.totalTasks);

            // Volunteer types distribution
            const volunteerTypeMap = {};
            allVolunteers.forEach((volunteer) => {
                const type = volunteer.volunteerType || "Not Specified";
                volunteerTypeMap[type] = (volunteerTypeMap[type] || 0) + 1;
            });

            const volunteerTypes = Object.entries(volunteerTypeMap).map(
                ([type, count]) => ({
                    type,
                    count,
                    percentage:
                        totalVolunteers > 0
                            ? ((count / totalVolunteers) * 100).toFixed(1)
                            : 0,
                })
            );

            // Location statistics
            const locationMap = {};
            allVolunteers.forEach((volunteer) => {
                const city = volunteer.location?.city || "Unknown";
                locationMap[city] = (locationMap[city] || 0) + 1;
            });

            const locationStats = Object.entries(locationMap)
                .map(([city, count]) => ({
                    city,
                    count,
                    percentage:
                        totalVolunteers > 0
                            ? ((count / totalVolunteers) * 100).toFixed(1)
                            : 0,
                }))
                .sort((a, b) => b.count - a.count);

            // Top performers (based on leaderboard stats)
            const topPerformers = allVolunteers
                .filter((v) => v.leaderboardStats)
                .sort(
                    (a, b) =>
                        (b.leaderboardStats.tasksCompleted || 0) -
                        (a.leaderboardStats.tasksCompleted || 0)
                )
                .slice(0, 10)
                .map((volunteer, index) => ({
                    rank: index + 1,
                    name: volunteer.userName,
                    hours: volunteer.leaderboardStats.hours || 0,
                    completedTasks:
                        volunteer.leaderboardStats.tasksCompleted || 0,
                    completionRate:
                        ((volunteer.leaderboardStats.tasksCompleted || 0) /
                            (tasks.filter((t) => t.assignedTo === volunteer._id)
                                .length || 1)) *
                        100,
                }));

            // Monthly volunteer growth (last 6 months)
            const monthlyGrowth = [];
            for (let i = 5; i >= 0; i--) {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthStart = new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    1
                );
                const monthEnd = new Date(
                    date.getFullYear(),
                    date.getMonth() + 1,
                    0
                );

                const monthVolunteers = allVolunteers.filter((v) => {
                    const createdAt = new Date(v.createdAt);
                    return createdAt >= monthStart && createdAt <= monthEnd;
                }).length;

                monthlyGrowth.push({
                    month: date.toLocaleString("default", {
                        month: "short",
                        year: "2-digit",
                    }),
                    newVolunteers: monthVolunteers,
                });
            }

            setData({
                totalVolunteers,
                activeVolunteers,
                newVolunteers,
                retentionRate: parseFloat(retentionRate),
                taskCategories,
                volunteerTypes,
                locationStats,
                skillDistribution: [], // Placeholder, requires survey data
                monthlyGrowth,
                topPerformers,
                availabilityDistribution: [], // Placeholder, requires survey data
            });
        },
        [timePeriod]
    );

    // Fetch volunteer data for current NGO
    const fetchVolunteerData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            console.log("Fetching data for NGO:", ngo?._id);

            // Fetch NGO-specific users, tasks, and categories
            const [usersResponse, tasksResponse, categoriesResponse] =
                await Promise.all([
                    axios.get(
                        `http://localhost:3001/api/users/ngo/${ngo?._id}`
                    ),
                    axios.get(
                        `http://localhost:3001/api/tasks/ngo/${ngo?._id}`
                    ),
                    axios.get("http://localhost:3001/api/categories"),
                ]);

            console.log("Users response:", usersResponse.data);
            console.log("Tasks response:", tasksResponse.data);

            const volunteers = usersResponse.data.result || [];
            const tasks = tasksResponse.data.result || [];
            const categories = categoriesResponse.data.result || [];

            processVolunteerData(volunteers, tasks, categories);
        } catch (error) {
            console.error("Error fetching volunteer data:", error);
            setError("Failed to load volunteer data");
            // Set default empty data on error
            setData({
                totalVolunteers: 0,
                activeVolunteers: 0,
                newVolunteers: 0,
                retentionRate: 0,
                taskCategories: [],
                volunteerTypes: [],
                locationStats: [],
                skillDistribution: [],
                monthlyGrowth: [],
                topPerformers: [],
                availabilityDistribution: [],
            });
        } finally {
            setLoading(false);
        }
    }, [ngo, processVolunteerData]);

    // Authentication and data fetching
    useEffect(() => {
        if (isAuthLoading) return;

        if (!isAuthenticated || !user) {
            navigate("/login");
            return;
        }

        console.log("AuthContext user role:", user?.role);
        console.log("AuthContext ngo object:", ngo);

        // Strict NGO role check
        if (!user.role?.includes("ngo") || !ngo) {
            console.log(
                "Redirecting to dashboard due to role or missing NGO data."
            );
            navigate("/dashboard");
            return;
        }

        // Fetch data when NGO is available
        fetchVolunteerData();
    }, [
        isAuthenticated,
        isAuthLoading,
        user,
        ngo,
        navigate,
        fetchVolunteerData,
        timePeriod,
    ]);

    // Location columns for DataTable
    const locationColumns = [
        {
            name: "City",
            selector: (row) => row.city,
            sortable: true,
            width: "40%",
        },
        {
            name: "Volunteers",
            selector: (row) => row.count,
            sortable: true,
            width: "30%",
        },
        {
            name: "Percentage",
            selector: (row) => row.percentage,
            sortable: true,
            width: "30%",
            cell: (row) => `${row.percentage}%`,
        },
    ];

    // Custom styles for DataTable
    const customStyles = {
        header: {
            style: {
                minHeight: "56px",
                backgroundColor: "#f8f9fa",
            },
        },
        headRow: {
            style: {
                borderTopStyle: "solid",
                borderTopWidth: "1px",
                borderTopColor: "#e0e0e0",
                backgroundColor: "#f8f9fa",
            },
        },
        headCells: {
            style: {
                "&:not(:last-of-type)": {
                    borderRightStyle: "solid",
                    borderRightWidth: "1px",
                    borderRightColor: "#e0e0e0",
                },
                fontSize: "14px",
                color: "#333",
            },
        },
    };

    if (loading) {
        return (
            <div className="volunteer-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading volunteer analytics...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error) {
        return (
            <div className="volunteer-page">
                <div className="error-container">
                    <h2>Error Loading Data</h2>
                    <p>{error}</p>
                    <button
                        onClick={fetchVolunteerData}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#2196f3",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="volunteer-page">
            <div className="volunteer-header">
                <h1>Volunteer Analytics Dashboard - {currentNgoName}</h1>
                <p>
                    Comprehensive insights into your volunteer engagement and
                    performance
                </p>

                <div className="time-filter">
                    <label>Time Period:</label>
                    <select
                        value={timePeriod}
                        onChange={(e) => setTimePeriod(e.target.value)}
                    >
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="quarter">This Quarter</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="metrics-overview">
                <div className="metric-card primary">
                    <div className="metric-icon">👥</div>
                    <div className="metric-content">
                        <h3>Total Volunteers</h3>
                        <span className="metric-value">
                            {data.totalVolunteers}
                        </span>
                    </div>
                </div>
                <div className="metric-card success">
                    <div className="metric-icon">⚡</div>
                    <div className="metric-content">
                        <h3>Active Volunteers</h3>
                        <span className="metric-value">
                            {data.activeVolunteers}
                        </span>
                    </div>
                </div>
                <div className="metric-card info">
                    <div className="metric-icon">🆕</div>
                    <div className="metric-content">
                        <h3>New Volunteers</h3>
                        <span className="metric-value">
                            {data.newVolunteers}
                        </span>
                    </div>
                </div>
                <div className="metric-card warning">
                    <div className="metric-icon">🔄</div>
                    <div className="metric-content">
                        <h3>Retention Rate</h3>
                        <span className="metric-value">
                            {data.retentionRate}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="charts-grid">
                {/* Volunteer Growth Line Chart */}
                <div className="chart-section full-width">
                    <LineChart
                        data={data.monthlyGrowth.map((item) => ({
                            label: item.month,
                            value: item.newVolunteers,
                        }))}
                        title="New Volunteer Sign-ups (Last 6 Months)"
                        color="#333333"
                        height={350}
                        curved={true}
                    />
                </div>

                {/* Task Categories Bar Chart */}
                <div className="chart-section">
                    <BarChart
                        data={data.taskCategories.slice(0, 8).map((item) => ({
                            name: item.category,
                            count: item.totalTasks,
                        }))}
                        title="Tasks by Category"
                        color={[
                            "#1a1a1a",
                            "#333333",
                            "#555555",
                            "#777777",
                            "#999999",
                            "#666666",
                            "#444444",
                            "#888888",
                        ]}
                        height={300}
                    />
                </div>

                {/* Volunteer Types Pie Chart */}
                <div className="chart-section">
                    <PieChart
                        data={data.volunteerTypes.map((item) => ({
                            name: item.type,
                            count: item.count,
                        }))}
                        title="Volunteer Types Distribution"
                        colors={[
                            "#1a1a1a",
                            "#333333",
                            "#555555",
                            "#777777",
                            "#999999",
                            "#666666",
                        ]}
                        height={300}
                    />
                </div>

                {/* Top Locations DataTable */}
                <div className="chart-section">
                    <h3 className="chart-title">Top Volunteer Locations</h3>
                    <div className="locations-datatable">
                        <DataTable
                            columns={locationColumns}
                            data={data.locationStats.slice(0, 8)}
                            noDataComponent={
                                <div className="no-data">
                                    No location data available
                                </div>
                            }
                            customStyles={customStyles}
                            defaultSortFieldId={3}
                            defaultSortAsc={false}
                            dense
                            striped
                            highlightOnHover
                            pointerOnHover
                        />
                    </div>
                </div>
            </div>

            {/* Top Performers Table */}
            <div className="table-section">
                <h2>Top Performing Volunteers</h2>
                <div className="performance-table">
                    <div className="table-header">
                        <span>Volunteer</span>
                        <span>Completed Tasks</span>
                        <span>Total Hours</span>
                        <span>Completion Rate</span>
                        <span>Performance</span>
                    </div>
                    {data.topPerformers.slice(0, 10).map((performer, index) => (
                        <div key={index} className="table-row">
                            <span className="volunteer-name">
                                <div className="rank-badge">
                                    #{performer.rank}
                                </div>
                                {performer.name}
                            </span>
                            <span className="task-count">
                                {performer.completedTasks}
                            </span>
                            <span className="hours">{performer.hours}h</span>
                            <span className="completion-rate">
                                {performer.completionRate.toFixed(1)}%
                            </span>
                            <span className="performance-badge">
                                <div
                                    className={`badge ${
                                        performer.completionRate >= 80
                                            ? "excellent"
                                            : performer.completionRate >= 60
                                            ? "good"
                                            : performer.completionRate >= 40
                                            ? "average"
                                            : "needs-improvement"
                                    }`}
                                >
                                    {performer.completionRate >= 80
                                        ? "Excellent"
                                        : performer.completionRate >= 60
                                        ? "Good"
                                        : performer.completionRate >= 40
                                        ? "Average"
                                        : "Needs Improvement"}
                                </div>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Performance */}
            <div className="insights-section">
                <h2>Category Performance Insights</h2>
                <div className="category-cards">
                    {data.taskCategories.slice(0, 6).map((category, index) => (
                        <div key={index} className="category-card">
                            <h4>{category.category}</h4>
                            <div className="category-stats">
                                <div className="stat">
                                    <span className="stat-label">
                                        Total Tasks
                                    </span>
                                    <span className="stat-value">
                                        {category.totalTasks}
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">
                                        Completed
                                    </span>
                                    <span className="stat-value success">
                                        {category.completedTasks}
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">
                                        Success Rate
                                    </span>
                                    <span className="stat-value">
                                        {category.completionRate}%
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">
                                        Active Volunteers
                                    </span>
                                    <span className="stat-value">
                                        {category.activeVolunteers}
                                    </span>
                                </div>
                            </div>
                            <div className="completion-bar">
                                <div
                                    className="completion-fill"
                                    style={{
                                        width: `${category.completionRate}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default VolunteerInsights;
