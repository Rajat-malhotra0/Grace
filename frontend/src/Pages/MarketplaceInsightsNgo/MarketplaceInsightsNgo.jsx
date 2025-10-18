import React, { useState, useEffect, useContext, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import axios from "axios";
import {
    BarChart,
    LineChart,
    DonutChart,
} from "../../Components/Charts/ChartJS";
import { AuthContext } from "../../Context/AuthContext";
import Header from "../../Components/Header";
import "./MarketplaceInsightsNgo.css";

const MarketplaceInsights = () => {
    const { user, ngo, isAuthenticated, isAuthLoading } =
        useContext(AuthContext);
    const navigate = useNavigate();
    const [timePeriod, setTimePeriod] = useState("month");
    const [loading, setLoading] = useState(true);
    const [marketplaceData, setMarketplaceData] = useState([]);
    const [error, setError] = useState(null);

    // Get NGO name for filtering data - ensure we have valid NGO data
    const currentNgoName = ngo?.name || "Unknown NGO";

    // Fetch marketplace data for current NGO
    const fetchMarketplaceData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            // Fetch all marketplace items
            const response = await axios.get(
                "http://localhost:3001/api/marketplace"
            );

            // Filter items that belong to current NGO
            const ngoItems = response.data.filter(
                (item) =>
                    item.neededBy?.name === currentNgoName ||
                    item.neededBy?._id === ngo?._id
            );

            // Transform data to match the expected format
            const transformedData = ngoItems.map((item) => ({
                id: item._id,
                item: item.name,
                category: item.category,
                postedDate: item.datePosted,
                fulfilledDate: item.fulfilledDate || null,
                fulfillmentTime: item.fulfilledDate
                    ? Math.floor(
                          (new Date(item.fulfilledDate) -
                              new Date(item.datePosted)) /
                              (1000 * 60 * 60 * 24)
                      )
                    : null,
                status:
                    item.status ||
                    (item.fulfilledDate ? "fulfilled" : "pending"),
                ngo: currentNgoName,
                fulfilledBy:
                    item.donatedBy?.userName || item.donatedBy?.name || null, // Use donatedBy instead of fulfilledBy
                urgency: item.urgency || "medium",
                quantity: item.quantity || 1,
                description: item.description || "",
            }));

            setMarketplaceData(transformedData);
        } catch (error) {
            console.error("Error fetching marketplace data:", error);
            setError("Failed to load marketplace data");
            // Fallback to empty array if API fails
            setMarketplaceData([]);
        } finally {
            setLoading(false);
        }
    }, [currentNgoName, ngo]);

    // Check authentication and role authorization
    useEffect(() => {
        if (isAuthLoading) return;

        if (!isAuthenticated || !user) {
            navigate("/login");
            return;
        }

        // Strict NGO role check - only allow users with "ngo" role AND ngo data
        if (!user.role?.includes("ngo") || !ngo) {
            navigate("/dashboard");
            return;
        }

        // Fetch marketplace data when NGO is available
        fetchMarketplaceData();
    }, [
        isAuthenticated,
        isAuthLoading,
        user,
        ngo,
        navigate,
        fetchMarketplaceData,
    ]);

    // Filter data to show only current NGO's needs
    const ngoData = {
        needs: marketplaceData, // Use real marketplace data instead of sample data
    };

    const stats = (() => {
        const allNeeds = ngoData.needs;
        const fulfilledNeeds = allNeeds.filter(
            (need) => need.status === "fulfilled"
        );
        const pendingNeeds = allNeeds.filter(
            (need) => need.status === "pending"
        );
        const totalNeeds = allNeeds.length;
        const totalFulfilled = fulfilledNeeds.length;
        const totalPending = pendingNeeds.length;
        const fulfillmentRate =
            totalNeeds > 0
                ? ((totalFulfilled / totalNeeds) * 100).toFixed(1)
                : "0";

        const avgTime =
            fulfilledNeeds.length > 0
                ? (
                      fulfilledNeeds.reduce(
                          (sum, need) => sum + need.fulfillmentTime,
                          0
                      ) / fulfilledNeeds.length
                  ).toFixed(1)
                : "0";

        const categoryStats = {};
        fulfilledNeeds.forEach((need) => {
            if (!categoryStats[need.category]) {
                categoryStats[need.category] = { totalTime: 0, count: 0 };
            }
            categoryStats[need.category].totalTime += need.fulfillmentTime;
            categoryStats[need.category].count += 1;
        });

        const quickestCategories = Object.entries(categoryStats)
            .map(([category, data]) => ({
                category,
                avgTime: (data.totalTime / data.count).toFixed(1),
                totalFulfilled: data.count,
            }))
            .sort((a, b) => parseFloat(a.avgTime) - parseFloat(b.avgTime))
            .slice(0, 6);

        const contributorStats = {};
        fulfilledNeeds.forEach((need) => {
            // Only process if we have a valid contributor name
            if (need.fulfilledBy && need.fulfilledBy.trim() !== "") {
                if (!contributorStats[need.fulfilledBy]) {
                    contributorStats[need.fulfilledBy] = {
                        name: need.fulfilledBy,
                        count: 0,
                        totalTime: 0,
                        categories: new Set(),
                    };
                }
                contributorStats[need.fulfilledBy].count += 1;
                contributorStats[need.fulfilledBy].totalTime +=
                    need.fulfillmentTime || 0;
                contributorStats[need.fulfilledBy].categories.add(
                    need.category
                );
            }
        });

        const topContributors = Object.values(contributorStats)
            .map((contributor) => ({
                ...contributor,
                avgTime: (contributor.totalTime / contributor.count).toFixed(1),
                categories: contributor.categories.size,
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 8);

        const urgentNeeds = pendingNeeds
            .map((need) => ({
                ...need,
                daysPending: Math.floor(
                    (new Date() - new Date(need.postedDate)) /
                        (1000 * 60 * 60 * 24)
                ),
            }))
            .sort((a, b) => b.daysPending - a.daysPending);

        return {
            totalNeeds,
            totalFulfilled,
            totalPending,
            fulfillmentRate,
            avgTime,
            quickestCategories,
            topContributors,
            urgentNeeds,
        };
    })();

    const unfulfilledColumns = [
        {
            name: "Item",
            selector: (row) => row.item,
            sortable: true,
            width: "25%",
            center: true,
        },
        {
            name: "Category",
            selector: (row) => row.category,
            sortable: true,
            cell: (row) => (
                <span className="category-badge">{row.category}</span>
            ),
            width: "25%",
            center: true,
        },
        {
            name: "Days Waiting",
            selector: (row) => row.daysPending,
            sortable: true,
            cell: (row) => (
                <span
                    className={`days-pending ${
                        row.daysPending > 7 ? "urgent" : ""
                    }`}
                >
                    {row.daysPending} days
                </span>
            ),
            width: "25%",
            center: true,
        },
        {
            name: "Priority",
            selector: (row) =>
                row.daysPending > 7
                    ? "High"
                    : row.daysPending > 3
                    ? "Medium"
                    : "Low",
            sortable: true,
            cell: (row) => {
                const priority =
                    row.daysPending > 7
                        ? "High"
                        : row.daysPending > 3
                        ? "Medium"
                        : "Low";
                const priorityClass = priority.toLowerCase();
                return (
                    <span className={`priority ${priorityClass}`}>
                        {priority}
                    </span>
                );
            },
            width: "25%",
            center: true,
        },
    ];

    // Custom styles for DataTable
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
                borderTopColor: "#ddd",
                backgroundColor: "#f8f9fa",
                fontWeight: "bold",
            },
        },
        headCells: {
            style: {
                "&:not(:last-of-type)": {
                    borderRightStyle: "solid",
                    borderRightWidth: "1px",
                    borderRightColor: "#ddd",
                },
                fontSize: "14px",
                fontWeight: "600",
            },
        },
        cells: {
            style: {
                "&:not(:last-of-type)": {
                    borderRightStyle: "solid",
                    borderRightWidth: "1px",
                    borderRightColor: "#f0f0f0",
                },
                fontSize: "13px",
                padding: "12px 8px",
            },
        },
    };

    if (isAuthLoading || loading) {
        return (
            <div className="loading-container">
                <div className="loading">Loading your marketplace data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error">
                    <h2>Error Loading Data</h2>
                    <p>{error}</p>
                    <button
                        onClick={fetchMarketplaceData}
                        className="retry-btn"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !user) {
        return null;
    }

    if (!user.role?.includes("ngo") || !ngo) {
        return (
            <div className="access-denied">
                <h2>Access Denied</h2>
                <p>
                    This page is only available for NGO users with valid NGO
                    data.
                </p>
            </div>
        );
    }

    return (
        <div className="marketplace-page">
            <Header />
            <div className="marketplace-header">
                <h1>{currentNgoName} - Marketplace Insights</h1>
                <p>
                    Track your organization's donation requests and community
                    support
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

            <div className="metrics-overview">
                <div className="metric-card">
                    <h3>Total Requests</h3>
                    <span className="metric-value">{stats.totalNeeds}</span>
                </div>
                <div className="metric-card">
                    <h3>Fulfilled</h3>
                    <span className="metric-value">{stats.totalFulfilled}</span>
                </div>
                <div className="metric-card">
                    <h3>Pending</h3>
                    <span className="metric-value">{stats.totalPending}</span>
                </div>
                <div className="metric-card">
                    <h3>Success Rate</h3>
                    <span className="metric-value">
                        {stats.fulfillmentRate}%
                    </span>
                </div>
                <div className="metric-card">
                    <h3>Avg Response Time</h3>
                    <span className="metric-value">{stats.avgTime} days</span>
                </div>
            </div>

            <div className="insight-section">
                <h2>Fastest Fulfilled Categories</h2>
                <div className="chart-container">
                    {stats.quickestCategories.length > 0 ? (
                        <BarChart
                            data={stats.quickestCategories.map((item) => ({
                                name: item.category,
                                count: parseFloat(item.avgTime),
                            }))}
                            title="Days to Fulfillment by Category"
                            color={[
                                "#1a1a1a",
                                "#333333",
                                "#4d4d4d",
                                "#666666",
                                "#808080",
                                "#999999",
                            ]}
                            height={320}
                        />
                    ) : (
                        <div className="no-data-chart">
                            <h3>No Fulfillment Data Yet</h3>
                            <p>
                                When your requests are fulfilled, category
                                performance will be shown here.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="insight-section">
                <h2>Top Supporters</h2>
                <div className="charts-row">
                    <div className="chart-container">
                        {stats.topContributors.length > 0 ? (
                            <DonutChart
                                data={stats.topContributors
                                    .slice(0, 6)
                                    .map((user) => ({
                                        name: user.name,
                                        percentage: user.count,
                                    }))}
                                title="Supporters by Contribution"
                                colors={[
                                    "#1a1a1a",
                                    "#333333",
                                    "#4d4d4d",
                                    "#666666",
                                    "#808080",
                                    "#999999",
                                ]}
                                height={320}
                            />
                        ) : (
                            <div className="no-data-chart">
                                <h3>No Supporters Yet</h3>
                                <p>
                                    No fulfilled requests with donor information
                                    available.
                                </p>
                            </div>
                        )}
                    </div>
                    <div className="contributors-summary">
                        {stats.topContributors.length > 0 ? (
                            stats.topContributors
                                .slice(0, 4)
                                .map((user, index) => (
                                    <div
                                        key={index}
                                        className="contributor-card"
                                    >
                                        <div className="contributor-rank">
                                            #{index + 1}
                                        </div>
                                        <h4>{user.name}</h4>
                                        <div className="contributor-stats">
                                            <p>
                                                <strong>{user.count}</strong>{" "}
                                                items helped
                                            </p>
                                            <p>
                                                <strong>{user.avgTime}</strong>{" "}
                                                avg days
                                            </p>
                                            <p>
                                                <strong>
                                                    {user.categories}
                                                </strong>{" "}
                                                categories
                                            </p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <div className="no-contributors">
                                <p>
                                    No contributors data available yet. When
                                    users fulfill your requests, their
                                    information will appear here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="insight-section">
                <h2>Request Trends</h2>
                <div className="chart-container">
                    <LineChart
                        data={[
                            { label: "Week 1", value: 3 },
                            { label: "Week 2", value: 1 },
                            { label: "Week 3", value: 2 },
                            { label: "Week 4", value: 0 },
                            { label: "Week 5", value: 1 },
                        ]}
                        title="Weekly Fulfillment Activity"
                        color="#1a1a1a"
                        height={320}
                    />
                </div>
            </div>

            <div className="insight-section">
                <h2>Pending Requests</h2>
                <div className="datatable-container">
                    <DataTable
                        columns={unfulfilledColumns}
                        data={stats.urgentNeeds}
                        pagination
                        paginationPerPage={8}
                        paginationRowsPerPageOptions={[5, 8, 10, 15]}
                        highlightOnHover
                        striped
                        customStyles={customStyles}
                        noDataComponent={
                            <div className="no-data">
                                Great! All requests have been fulfilled!
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default MarketplaceInsights;
