import React, { useState, useEffect, useMemo } from "react";
import "./Marketplace.css";

const Marketplace = () => {
  const [timePeriod, setTimePeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  const [sampleData] = useState({
    needs: [
      { id: 1, item: "School Supplies", category: "Education", postedDate: "2024-01-15", fulfilledDate: "2024-01-18", fulfillmentTime: 3, status: "fulfilled", ngo: "Education First NGO", fulfilledBy: "John Smith" },
      { id: 2, item: "Medical Equipment", category: "Healthcare", postedDate: "2024-01-10", fulfilledDate: "2024-01-12", fulfillmentTime: 2, status: "fulfilled", ngo: "Health Care NGO", fulfilledBy: "Sarah Johnson" },
      { id: 3, item: "Food Packages", category: "Hunger Relief", postedDate: "2024-01-20", fulfilledDate: "2024-01-22", fulfillmentTime: 2, status: "fulfilled", ngo: "Feed the Hungry", fulfilledBy: "Mike Chen" },
      { id: 4, item: "Winter Clothes", category: "Clothing", postedDate: "2024-01-05", fulfilledDate: "2024-01-06", fulfillmentTime: 1, status: "fulfilled", ngo: "Warm Hearts NGO", fulfilledBy: "Sarah Johnson" },
      { id: 5, item: "Books for Library", category: "Education", postedDate: "2024-01-25", fulfilledDate: null, fulfillmentTime: null, status: "pending", ngo: "Community Library", fulfilledBy: null },
      { id: 6, item: "Laptops", category: "Technology", postedDate: "2024-01-22", fulfilledDate: "2024-01-23", fulfillmentTime: 1, status: "fulfilled", ngo: "Tech for All", fulfilledBy: "John Smith" },
      { id: 7, item: "Baby Formula", category: "Healthcare", postedDate: "2024-01-30", fulfilledDate: null, fulfillmentTime: null, status: "pending", ngo: "Mother & Child Care", fulfilledBy: null },
      { id: 8, item: "Sports Equipment", category: "Recreation", postedDate: "2024-01-28", fulfilledDate: null, fulfillmentTime: null, status: "pending", ngo: "Youth Sports Club", fulfilledBy: null },
      { id: 9, item: "Office Supplies", category: "Administrative", postedDate: "2024-01-12", fulfilledDate: "2024-01-15", fulfillmentTime: 3, status: "fulfilled", ngo: "Community Center", fulfilledBy: "Mike Chen" },
      { id: 10, item: "First Aid Kits", category: "Healthcare", postedDate: "2024-01-08", fulfilledDate: "2024-01-09", fulfillmentTime: 1, status: "fulfilled", ngo: "Emergency Response", fulfilledBy: "Sarah Johnson" }
    ]
  });

  const [urgentNeeds] = useState({
    needs: [
      { id: 1, item: "School Supplies", category: "Education", postedDate: "2024-01-15", fulfilledDate: "2024-01-18", fulfillmentTime: 3, status: "fulfilled", ngo: "Education First NGO", fulfilledBy: "John Smith" },
      { id: 2, item: "Medical Equipment", category: "Healthcare", postedDate: "2024-01-10", fulfilledDate: "2024-01-12", fulfillmentTime: 2, status: "fulfilled", ngo: "Health Care NGO", fulfilledBy: "Sarah Johnson" },
      { id: 3, item: "Food Packages", category: "Hunger Relief", postedDate: "2024-01-20", fulfilledDate: "2024-01-22", fulfillmentTime: 2, status: "fulfilled", ngo: "Feed the Hungry", fulfilledBy: "Mike Chen" },
      { id: 4, item: "Winter Clothes", category: "Clothing", postedDate: "2024-01-05", fulfilledDate: "2024-01-06", fulfillmentTime: 1, status: "fulfilled", ngo: "Warm Hearts NGO", fulfilledBy: "Sarah Johnson" },
      { id: 5, item: "Books for Library", category: "Education", postedDate: "2024-01-25", fulfilledDate: null, fulfillmentTime: null, status: "pending", ngo: "Community Library", fulfilledBy: null },
      { id: 6, item: "Laptops", category: "Technology", postedDate: "2024-01-22", fulfilledDate: "2024-01-23", fulfillmentTime: 1, status: "fulfilled", ngo: "Tech for All", fulfilledBy: "John Smith" },
      { id: 7, item: "Baby Formula", category: "Healthcare", postedDate: "2024-01-30", fulfilledDate: null, fulfillmentTime: null, status: "pending", ngo: "Mother & Child Care", fulfilledBy: null },
      { id: 8, item: "Sports Equipment", category: "Recreation", postedDate: "2024-01-28", fulfilledDate: null, fulfillmentTime: null, status: "pending", ngo: "Youth Sports Club", fulfilledBy: null },
      { id: 9, item: "Office Supplies", category: "Administrative", postedDate: "2024-01-12", fulfilledDate: "2024-01-15", fulfillmentTime: 3, status: "fulfilled", ngo: "Community Center", fulfilledBy: "Mike Chen" },
      { id: 10, item: "First Aid Kits", category: "Healthcare", postedDate: "2024-01-08", fulfilledDate: "2024-01-09", fulfillmentTime: 1, status: "fulfilled", ngo: "Emergency Response", fulfilledBy: "Sarah Johnson" }
    ]
  });

  const stats = useMemo(() => {
    const allNeeds = sampleData.needs;
    const fulfilledNeeds = allNeeds.filter(need => need.status === "fulfilled");
    const pendingNeeds = allNeeds.filter(need => need.status === "pending");

    const totalNeeds = allNeeds.length;
    const totalFulfilled = fulfilledNeeds.length;
    const totalPending = pendingNeeds.length;
    const fulfillmentRate = ((totalFulfilled / totalNeeds) * 100).toFixed(1);
    
    const avgTime = fulfilledNeeds.length > 0 
      ? (fulfilledNeeds.reduce((sum, need) => sum + need.fulfillmentTime, 0) / fulfilledNeeds.length).toFixed(1)
      : "0";

    const categoryStats = {};
    fulfilledNeeds.forEach(need => {
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
        totalFulfilled: data.count
      }))
      .sort((a, b) => parseFloat(a.avgTime) - parseFloat(b.avgTime))
      .slice(0, 6);

    const contributorStats = {};
    fulfilledNeeds.forEach(need => {
      if (!contributorStats[need.fulfilledBy]) {
        contributorStats[need.fulfilledBy] = {
          name: need.fulfilledBy,
          count: 0,
          totalTime: 0,
          categories: new Set()
        };
      }
      contributorStats[need.fulfilledBy].count += 1;
      contributorStats[need.fulfilledBy].totalTime += need.fulfillmentTime;
      contributorStats[need.fulfilledBy].categories.add(need.category);
    });

    const topContributors = Object.values(contributorStats)
      .map(contributor => ({
        ...contributor,
        avgTime: (contributor.totalTime / contributor.count).toFixed(1),
        categories: contributor.categories.size
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const urgentNeeds = pendingNeeds
      .map(need => ({
        ...need,
        daysPending: Math.floor((new Date() - new Date(need.postedDate)) / (1000 * 60 * 60 * 24))
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
      urgentNeeds
    };
  }, [sampleData, timePeriod]);

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
          <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}>
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
          <span className="metric-value">{stats.fulfillmentRate}%</span>
        </div>
        <div className="metric-card">
          <h3>Avg Days</h3>
          <span className="metric-value">{stats.avgTime}</span>
        </div>
      </div>

      <div className="insight-section">
        <h2>Fastest Fulfillment by Category</h2>
        <div className="bar-chart-container">
          <div className="chart-header">
            <span>Category</span>
            <span>Avg Days</span>
            <span>Items Done</span>
          </div>
          {stats.quickestCategories.map((item, index) => (
            <div key={index} className="bar-item">
              <div className="bar-info">
                <span className="category-name">{item.category}</span>
                <span className="avg-time">{item.avgTime} days</span>
                <span className="total-count">{item.totalFulfilled} items</span>
              </div>
              <div className="bar-visual">
                <div 
                  className="bar-fill"
                  style={{
                    width: `${Math.max(10, 100 - (parseFloat(item.avgTime) * 20))}%`,
                    backgroundColor: `hsl(${120 - (parseFloat(item.avgTime) * 30)}, 70%, 50%)`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="insight-section">
        <h2>Top Helpers</h2>
        <div className="contributors-grid">
          {stats.topContributors.map((user, index) => (
            <div key={index} className="contributor-card">
              <div className="contributor-rank">#{index + 1}</div>
              <h4>{user.name}</h4>
              <div className="contributor-stats">
                <p><strong>{user.count}</strong> needs helped</p>
                <p><strong>{user.avgTime}</strong> avg days</p>
                <p><strong>{user.categories}</strong> categories</p>
              </div>
              <div className="contribution-bar">
                <div 
                  className="contribution-fill"
                  style={{width: `${(user.count / stats.topContributors[0]?.count * 100) || 0}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="insight-section">
        <h2>Still Waiting for Help</h2>
        <div className="unfulfilled-table">
          <div className="table-header">
            <span>Item</span>
            <span>Category</span>
            <span>NGO</span>
            <span>Days Waiting</span>
            <span>Priority</span>
          </div>
          {stats.urgentNeeds.map((need, index) => (
            <div key={need.id} className="table-row">
              <span className="item-name">{need.item}</span>
              <span className="category-badge">{need.category}</span>
              <span className="ngo-name">{need.ngo}</span>
              <span className="days-pending">{need.daysPending} days</span>
              <span className={`priority ${need.daysPending > 7 ? 'high' : need.daysPending > 3 ? 'medium' : 'low'}`}>
                {need.daysPending > 7 ? 'High' : need.daysPending > 3 ? 'Medium' : 'Low'}
              </span>
            </div>
          ))}
          {stats.urgentNeeds.length === 0 && (
            <div className="no-data">🎉 Everything has been helped!</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
