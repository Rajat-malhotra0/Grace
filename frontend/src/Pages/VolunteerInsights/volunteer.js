import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import {
    BarChart,
    LineChart,
    DonutChart,
    PieChart,
} from "../../Components/Charts/ChartJS";
import "./volunteer.css";

function Volunteer() {
    const [data, setData] = useState({
        totalVolunteers: 0,
        activeVolunteers: 0,
        newVolunteers: 0,
        retentionRate: 0,
        taskCategories: [],
        volunteerTypes: [],
        locationStats: [],
        commitmentLevels: [],
        skillDistribution: [],
        monthlyGrowth: [],
        taskCompletion: [],
        engagementMetrics: {},
        topPerformers: [],
        categoryEngagement: [],
        availabilityDistribution: [],
    });

    const [timePeriod, setTimePeriod] = useState("month");
    const [loading, setLoading] = useState(true);

    // DataTable columns configuration for locations
    const locationColumns = [
        {
            name: "Rank",
            selector: (row, index) => `#${index + 1}`,
            sortable: false,
            width: "80px",
            center: true,
        },
        {
            name: "City",
            selector: (row) => row.city,
            sortable: true,
            center: true,
        },
        {
            name: "Volunteers",
            selector: (row) => row.count,
            sortable: true,
            center: true,
            sortFunction: (rowA, rowB) => {
                const a = rowA.count;
                const b = rowB.count;
                if (a > b) return 1;
                if (b > a) return -1;
                return 0;
            },
        },
        {
            name: "Percentage",
            selector: (row) => `${row.percentage}%`,
            sortable: true,
            center: true,
            sortFunction: (rowA, rowB) => {
                const a = parseFloat(rowA.percentage);
                const b = parseFloat(rowB.percentage);
                if (a > b) return 1;
                if (b > a) return -1;
                return 0;
            },
        },
    ];

    // Custom styles for the DataTable
    const customStyles = {
        header: {
            style: {
                minHeight: "56px",
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
                fontWeight: "600",
                color: "#555",
            },
        },
        cells: {
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

    useEffect(() => {
        const processData = (volunteers, tasks, surveys, categories) => {
            const timeFrames = { week: 7, month: 30, quarter: 90, year: 365 };
            const days = timeFrames[timePeriod] * 24 * 60 * 60 * 1000;
            const now = Date.now();

            // Basic volunteer metrics
            const totalVolunteers = volunteers.length;
            const activeVolunteers = volunteers.filter((v) => {
                const updatedAt = new Date(v.updatedAt || v.createdAt);
                return (
                    !isNaN(updatedAt.getTime()) &&
                    now - updatedAt.getTime() < days
                );
            }).length;

            const newVolunteers = volunteers.filter((v) => {
                const createdAt = new Date(v.createdAt);
                return (
                    !isNaN(createdAt.getTime()) &&
                    now - createdAt.getTime() < days
                );
            }).length;

            // Task category analysis
            const taskCategoryMap = {};
            const categoryNames = {};
            categories.forEach((cat) => {
                if (cat.type === "task") {
                    categoryNames[cat._id] = cat.name;
                }
            });

            tasks.forEach((task) => {
                const catName = categoryNames[task.category] || "Uncategorized";
                if (!taskCategoryMap[catName]) {
                    taskCategoryMap[catName] = {
                        total: 0,
                        completed: 0,
                        inProgress: 0,
                        volunteers: new Set(),
                    };
                }
                taskCategoryMap[catName].total++;
                if (task.status === "done")
                    taskCategoryMap[catName].completed++;
                if (task.status === "in-progress")
                    taskCategoryMap[catName].inProgress++;
                if (task.assignedTo)
                    taskCategoryMap[catName].volunteers.add(task.assignedTo);
            });

            const taskCategories = Object.entries(taskCategoryMap)
                .map(([name, stats]) => ({
                    category: name,
                    totalTasks: stats.total,
                    completedTasks: stats.completed,
                    inProgressTasks: stats.inProgress,
                    completionRate:
                        stats.total > 0
                            ? ((stats.completed / stats.total) * 100).toFixed(1)
                            : 0,
                    activeVolunteers: stats.volunteers.size,
                }))
                .sort((a, b) => b.totalTasks - a.totalTasks);

            // Volunteer types distribution
            const volunteerTypeMap = {};
            volunteers.forEach((volunteer) => {
                const type = volunteer.volunteerType || "Not Specified";
                volunteerTypeMap[type] = (volunteerTypeMap[type] || 0) + 1;
            });

            const volunteerTypes = Object.entries(volunteerTypeMap).map(
                ([type, count]) => ({
                    type,
                    count,
                    percentage: ((count / totalVolunteers) * 100).toFixed(1),
                })
            );

            // Location analysis
            const locationMap = {};
            volunteers.forEach((volunteer) => {
                const city = volunteer.location?.city || "Unknown";
                locationMap[city] = (locationMap[city] || 0) + 1;
            });

            const locationStats = Object.entries(locationMap)
                .map(([city, count]) => ({
                    city,
                    count,
                    percentage: ((count / totalVolunteers) * 100).toFixed(1),
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

            // Skills distribution
            const skillsMap = {};
            surveys.forEach((survey) => {
                (survey.skills || []).forEach((skill) => {
                    skillsMap[skill] = (skillsMap[skill] || 0) + 1;
                });
            });

            const skillDistribution = Object.entries(skillsMap)
                .map(([skill, count]) => ({ skill, count }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 15);

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

                const monthVolunteers = volunteers.filter((v) => {
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

            // Top performers
            const volunteerTaskMap = {};
            tasks.forEach((task) => {
                if (task.assignedTo) {
                    if (!volunteerTaskMap[task.assignedTo]) {
                        volunteerTaskMap[task.assignedTo] = {
                            completed: 0,
                            total: 0,
                            hours: 0,
                        };
                    }
                    volunteerTaskMap[task.assignedTo].total++;
                    if (task.status === "done") {
                        volunteerTaskMap[task.assignedTo].completed++;
                    }
                    volunteerTaskMap[task.assignedTo].hours +=
                        (task.actualMinutes || 0) / 60;
                }
            });

            const topPerformers = Object.entries(volunteerTaskMap)
                .map(([userId, stats]) => {
                    const volunteer = volunteers.find((v) => v._id === userId);
                    return volunteer
                        ? {
                              name: volunteer.userName,
                              completedTasks: stats.completed,
                              totalTasks: stats.total,
                              hours: Math.round(stats.hours * 10) / 10,
                              completionRate:
                                  stats.total > 0
                                      ? (
                                            (stats.completed / stats.total) *
                                            100
                                        ).toFixed(1)
                                      : 0,
                          }
                        : null;
                })
                .filter(Boolean)
                .sort((a, b) => b.completedTasks - a.completedTasks)
                .slice(0, 10);

            // Availability distribution
            const availabilityMap = {
                "0-5 hours": 0,
                "6-10 hours": 0,
                "11-20 hours": 0,
                "21-30 hours": 0,
                "30+ hours": 0,
            };

            surveys.forEach((survey) => {
                const hours = survey.availabilityHours || 0;
                if (hours <= 5) availabilityMap["0-5 hours"]++;
                else if (hours <= 10) availabilityMap["6-10 hours"]++;
                else if (hours <= 20) availabilityMap["11-20 hours"]++;
                else if (hours <= 30) availabilityMap["21-30 hours"]++;
                else availabilityMap["30+ hours"]++;
            });

            const availabilityDistribution = Object.entries(
                availabilityMap
            ).map(([range, count]) => ({
                range,
                count,
                percentage:
                    surveys.length > 0
                        ? ((count / surveys.length) * 100).toFixed(1)
                        : 0,
            }));

            const retentionRate =
                totalVolunteers > 0
                    ? (
                          (topPerformers.filter(
                              (p) => parseInt(p.completionRate) > 50
                          ).length /
                              totalVolunteers) *
                          100
                      ).toFixed(1)
                    : 0;

            return {
                totalVolunteers,
                activeVolunteers,
                newVolunteers,
                retentionRate,
                taskCategories,
                volunteerTypes,
                locationStats,
                skillDistribution,
                monthlyGrowth,
                topPerformers,
                availabilityDistribution,
            };
        };

        const loadData = async () => {
            setLoading(true);
            try {
                const [volunteersRes, tasksRes, surveysRes, categoriesRes] =
                    await Promise.all([
                        axios.get("/api/users?role=volunteer"),
                        axios.get("/api/tasks"),
                        axios.get("/api/skill-surveys"),
                        axios.get("/api/categories"),
                    ]);

                const processed = processData(
                    volunteersRes.data.result || [],
                    tasksRes.data.result || [],
                    surveysRes.data.result || [],
                    categoriesRes.data.result || []
                );
                setData(processed);
            } catch (error) {
                console.error("Error loading data:", error);
            }
            setLoading(false);
        };

        loadData();
    }, [timePeriod]);

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

    return (
        <div className="volunteer-page">
            <div className="volunteer-header">
                <h1>Volunteer Analytics Dashboard</h1>
                <p>
                    Comprehensive insights into volunteer engagement, origins,
                    and matching effectiveness
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

            {/* Overview Metrics */}
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
                        title="Volunteer Growth Trend (Last 6 Months)"
                        color="#10b981"
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
                            "#3b82f6",
                            "#ef4444",
                            "#f59e0b",
                            "#10b981",
                            "#8b5cf6",
                            "#f97316",
                            "#06b6d4",
                            "#84cc16",
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
                            "#3b82f6",
                            "#ef4444",
                            "#f59e0b",
                            "#10b981",
                            "#8b5cf6",
                            "#f97316",
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
                            defaultSortFieldId={3} // Default sort by Volunteers column
                            defaultSortAsc={false} // Sort in descending order (highest first)
                            dense
                            striped
                            highlightOnHover
                            pointerOnHover
                        />
                    </div>
                </div>

                {/* Availability Distribution Donut Chart */}
                <div className="chart-section">
                    <DonutChart
                        data={data.availabilityDistribution.map((item) => ({
                            name: item.range,
                            count: item.count,
                            percentage: item.percentage, // Pass the pre-calculated percentage
                        }))}
                        title="Weekly Availability Distribution"
                        colors={[
                            "#fbbf24",
                            "#f59e0b",
                            "#d97706",
                            "#b45309",
                            "#92400e",
                        ]}
                        height={300}
                    />
                </div>

                {/* Skills Distribution Bar Chart */}
                <div className="chart-section full-width">
                    <BarChart
                        data={data.skillDistribution
                            .slice(0, 10)
                            .map((item) => ({
                                name: item.skill,
                                count: item.count,
                            }))}
                        title="Most Common Skills"
                        color="#8b5cf6"
                        height={350}
                    />
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
                                <div className="rank-badge">#{index + 1}</div>
                                {performer.name}
                            </span>
                            <span className="task-count">
                                {performer.completedTasks}
                            </span>
                            <span className="hours">{performer.hours}h</span>
                            <span className="completion-rate">
                                {performer.completionRate}%
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

export default Volunteer;
