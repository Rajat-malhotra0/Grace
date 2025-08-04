import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
    BarChart,
    LineChart,
    DonutChart,
} from "../../Components/Charts/ChartJS";
import "./MarketplaceInsights.css";

const MarketplaceInsights = () => {
    const [timePeriod, setTimePeriod] = useState("month");
    const [loading, setLoading] = useState(true);

    const [sampleData] = useState({
        needs: [
            {
                id: 1,
                item: "School Supplies",
                category: "Education",
                postedDate: "2025-07-15",
                fulfilledDate: "2025-07-18",
                fulfillmentTime: 3,
                status: "fulfilled",
                ngo: "Education First NGO",
                fulfilledBy: "John Smith",
            },
            {
                id: 2,
                item: "Medical Equipment",
                category: "Healthcare",
                postedDate: "2025-07-10",
                fulfilledDate: "2025-07-12",
                fulfillmentTime: 2,
                status: "fulfilled",
                ngo: "Health Care NGO",
                fulfilledBy: "Sarah Johnson",
            },
            {
                id: 3,
                item: "Food Packages",
                category: "Hunger Relief",
                postedDate: "2025-07-20",
                fulfilledDate: "2025-07-22",
                fulfillmentTime: 2,
                status: "fulfilled",
                ngo: "Feed the Hungry",
                fulfilledBy: "Mike Chen",
            },
            {
                id: 4,
                item: "Winter Clothes",
                category: "Clothing",
                postedDate: "2025-07-05",
                fulfilledDate: "2025-07-06",
                fulfillmentTime: 1,
                status: "fulfilled",
                ngo: "Warm Hearts NGO",
                fulfilledBy: "Sarah Johnson",
            },
            {
                id: 5,
                item: "Books for Library",
                category: "Education",
                postedDate: "2025-07-25",
                fulfilledDate: null,
                fulfillmentTime: null,
                status: "pending",
                ngo: "Community Library",
                fulfilledBy: null,
            },
            {
                id: 6,
                item: "Laptops",
                category: "Technology",
                postedDate: "2025-07-22",
                fulfilledDate: "2025-07-23",
                fulfillmentTime: 1,
                status: "fulfilled",
                ngo: "Tech for All",
                fulfilledBy: "John Smith",
            },
            {
                id: 7,
                item: "Baby Formula",
                category: "Healthcare",
                postedDate: "2025-07-20",
                fulfilledDate: null,
                fulfillmentTime: null,
                status: "pending",
                ngo: "Mother & Child Care",
                fulfilledBy: null,
            },
            {
                id: 8,
                item: "Sports Equipment",
                category: "Recreation",
                postedDate: "2025-07-15",
                fulfilledDate: null,
                fulfillmentTime: null,
                status: "pending",
                ngo: "Youth Sports Club",
                fulfilledBy: null,
            },
            {
                id: 9,
                item: "Office Supplies",
                category: "Administrative",
                postedDate: "2025-07-12",
                fulfilledDate: "2025-07-15",
                fulfillmentTime: 3,
                status: "fulfilled",
                ngo: "Community Center",
                fulfilledBy: "Mike Chen",
            },
            {
                id: 10,
                item: "First Aid Kits",
                category: "Healthcare",
                postedDate: "2025-07-08",
                fulfilledDate: "2025-07-09",
                fulfillmentTime: 1,
                status: "fulfilled",
                ngo: "Emergency Response",
                fulfilledBy: "Sarah Johnson",
            },
        ],
    });

    const stats = (() => {
        const allNeeds = sampleData.needs;
        const fulfilledNeeds = allNeeds.filter(
            (need) => need.status === "fulfilled"
        );
        const pendingNeeds = allNeeds.filter(
            (need) => need.status === "pending"
        );

        const totalNeeds = allNeeds.length;
        const totalFulfilled = fulfilledNeeds.length;
        const totalPending = pendingNeeds.length;
        const fulfillmentRate = ((totalFulfilled / totalNeeds) * 100).toFixed(
            1
        );

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
                need.fulfillmentTime;
            contributorStats[need.fulfilledBy].categories.add(need.category);
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
            width: "20%",
            center: true,
        },
        {
            name: "Category",
            selector: (row) => row.category,
            sortable: true,
            cell: (row) => (
                <span className="category-badge">{row.category}</span>
            ),
            width: "20%",
            center: true,
        },
        {
            name: "NGO",
            selector: (row) => row.ngo,
            sortable: true,
            width: "20%",
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
            width: "20%",
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
            width: "20%",
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

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <div className="loading">Loading marketplace data...</div>;
    }

    return (
        <div className="marketplace-page">
            <div className="marketplace-header">
                <h1>Marketplace Dashboard</h1>
                <p>Track needs fulfillment and donor impact</p>

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
                    <h3>Total Needs</h3>
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
                    <h3>Avg Days</h3>
                    <span className="metric-value">{stats.avgTime}</span>
                </div>
            </div>

            <div className="insight-section">
                <h2>Fastest Fulfillment by Category</h2>
                <div className="chart-container">
                    <BarChart
                        data={stats.quickestCategories.map((item) => ({
                            name: item.category,
                            count: parseFloat(item.avgTime),
                        }))}
                        title="Average Days to Fulfill"
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
                </div>
            </div>

            <div className="insight-section">
                <h2>Top Helpers</h2>
                <div className="charts-row">
                    <div className="chart-container">
                        <DonutChart
                            data={stats.topContributors
                                .slice(0, 6)
                                .map((user) => ({
                                    name: user.name,
                                    percentage: user.count,
                                }))}
                            title="Contributors by Impact"
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
                    </div>
                    <div className="contributors-summary">
                        {stats.topContributors
                            .slice(0, 4)
                            .map((user, index) => (
                                <div key={index} className="contributor-card">
                                    <div className="contributor-rank">
                                        #{index + 1}
                                    </div>
                                    <h4>{user.name}</h4>
                                    <div className="contributor-stats">
                                        <p>
                                            <strong>{user.count}</strong> needs
                                            helped
                                        </p>
                                        <p>
                                            <strong>{user.avgTime}</strong> avg
                                            days
                                        </p>
                                        <p>
                                            <strong>{user.categories}</strong>{" "}
                                            categories
                                        </p>
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className="insight-section">
                <h2>Fulfillment Trends</h2>
                <div className="chart-container">
                    <LineChart
                        data={[
                            { label: "Week 1", value: 12 },
                            { label: "Week 2", value: 19 },
                            { label: "Week 3", value: 8 },
                            { label: "Week 4", value: 15 },
                            { label: "Week 5", value: 25 },
                        ]}
                        title="Weekly Marketplace Activity - Needs Fulfilled"
                        color="#333333"
                        height={320}
                    />
                </div>
            </div>

            <div className="insight-section">
                <h2>Still Waiting for Help</h2>
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
                                Everything has been helped!
                            </div>
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default MarketplaceInsights;
