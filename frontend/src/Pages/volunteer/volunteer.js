import React, { useState, useEffect } from "react";
import "./Volunteer.css";

function Volunteer() {
  const [data, setData] = useState({
    totalVolunteers: 0,
    activeVolunteers: 0,
    newVolunteers: 0,
    retentionRate: 0,
    topRoles: [],
    locations: [],
    topVolunteers: [],
    availability: {},
    matching: {}
  });

  const [timePeriod, setTimePeriod] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [timePeriod]);

  const loadData = async () => {
    setLoading(true);
    try {
      const users = await fetch("api/users?role=volunteer").then(res => res.json());
      const tasks = await fetch("api/tasks").then(res => res.json());
      const surveys = await fetch("api/skill-surveys").then(res => res.json());
      const processed = processData(users.result || [], surveys.result || [], tasks.result || []);
      setData(processed);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setLoading(false);
  };

  const processData = (users, surveys, tasks) => {
    const volunteers = users.filter(user => user.role?.includes("volunteer"));
    const timeFrames = {
      week: 7, month: 30, quarter: 90, year: 365
    };
    const days = timeFrames[timePeriod] * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const totalVolunteers = volunteers.length;

    const activeVolunteers = volunteers.filter(v => {
      const updatedAtDate = new Date(v.updatedAt || v.createdAt);
      const diff = isNaN(updatedAtDate.getTime()) ? Infinity : (now - updatedAtDate.getTime());
      return diff < days;
    }).length;

    const newVolunteers = volunteers.filter(v => {
      const createdAtDate = new Date(v.createdAt);
      const diff = isNaN(createdAtDate.getTime()) ? Infinity : (now - createdAtDate.getTime());
      return diff < days;
    }).length;

    const roleStats = {};
    tasks.forEach(task => {
      if (task.assignedTo && task.actualMinutes > 0) {
        const category = task.category || "General";
        if (!roleStats[category]) {
          roleStats[category] = { volunteers: new Set(), hours: 0, tasks: 0 };
        }
        roleStats[category].volunteers.add(task.assignedTo);
        roleStats[category].hours += task.actualMinutes / 60;
        roleStats[category].tasks++;
      }
    });

    const maxTotalHours = Math.max(...Object.values(roleStats).map(r => r.hours), 1); // avoid division by zero

    const topRoles = Object.entries(roleStats)
      .map(([category, stats]) => {
        const avgHours = stats.hours / stats.volunteers.size || 0;
        const engagementScore = (stats.hours / maxTotalHours) * 100; // engagement as % of max hours
        return {
          category,
          volunteerCount: stats.volunteers.size,
          totalHours: stats.hours,
          completedTasks: stats.tasks,
          avgHours,
          engagementScore
        };
      })
      .sort((a, b) => b.totalHours - a.totalHours)
      .slice(0, 6);

    const locationCounts = {};
    volunteers.forEach(v => {
      const loc = v.location || "Unknown";
      locationCounts[loc] = (locationCounts[loc] || 0) + 1;
    });

    const locations = Object.entries(locationCounts)
      .map(([location, count]) => ({
        location,
        count,
        percentage: totalVolunteers > 0 ? ((count / totalVolunteers) * 100).toFixed(1) : "0.0"
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const volunteerTasks = {};
    tasks.forEach(task => {
      if (task.assignedTo) {
        volunteerTasks[task.assignedTo] = (volunteerTasks[task.assignedTo] || 0) + 1;
      }
    });

    const topVolunteers = Object.entries(volunteerTasks)
      .map(([id, taskCount]) => {
        const volunteer = volunteers.find(v => v._id === id);
        const hours = tasks
          .filter(t => t.assignedTo === id)
          .reduce((sum, t) => sum + (t.actualMinutes || 0), 0) / 60;

        return volunteer ? {
          name: volunteer.userName || "Unknown",
          taskCount,
          hours,
          joinDate: volunteer.createdAt,
          isRepeat: taskCount > 1
        } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.taskCount - a.taskCount)
      .slice(0, 8);

    const avgHours = surveys.length > 0
      ? surveys.reduce((sum, s) => sum + (s.availabilityHours || 0), 0) / surveys.length
      : 0;

    const hourRanges = {};
    surveys.forEach(s => {
      const hours = s.availabilityHours || 0;
      const range = hours === 0 ? "0" :
        hours <= 5 ? "1-5" :
          hours <= 10 ? "6-10" :
            hours <= 20 ? "11-20" : "20+";
      hourRanges[range] = (hourRanges[range] || 0) + 1;
    });

    const skills = {};
    const interests = {};
    surveys.forEach(s => {
      (s.skills || []).forEach(skill => skills[skill] = (skills[skill] || 0) + 1);
      (s.interests || []).forEach(interest => interests[interest] = (interests[interest] || 0) + 1);
    });

    const retentionRate = totalVolunteers > 0
      ? ((topVolunteers.filter(v => v.isRepeat).length / totalVolunteers) * 100).toFixed(1)
      : 0;

    return {
      totalVolunteers,
      activeVolunteers,
      newVolunteers,
      retentionRate,
      topRoles,
      locations,
      topVolunteers,
      availability: {
        totalSurveys: surveys.length,
        avgHours,
        hourRanges
      },
      matching: {
        accuracy: 85.5,
        totalMatches: surveys.length,
        skills,
        interests
      }
    };
  };

  if (loading) {
    return (
      <div className="volunteer-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading volunteer data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="volunteer-page">
      <div className="volunteer-header">
        <h1>Volunteer Analytics Dashboard</h1>
        <p>Comprehensive insights into volunteer engagement, origins, and matching effectiveness</p>

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
          <h3>Total Volunteers</h3>
          <span className="metric-value">{data.totalVolunteers}</span>
        </div>
        <div className="metric-card">
          <h3>Active Volunteers</h3>
          <span className="metric-value">{data.activeVolunteers}</span>
        </div>
        <div className="metric-card">
          <h3>New Volunteers</h3>
          <span className="metric-value">{data.newVolunteers}</span>
        </div>
        <div className="metric-card">
          <h3>Retention Rate</h3>
          <span className="metric-value">{data.retentionRate}%</span>
        </div>
      </div>

      <div className="insight-section">
        <h2>Most Engaged Volunteer Roles</h2>
        <div className="roles-grid">
          {data.topRoles.map((role, index) => (
            <div key={index} className="role-card">
              <h4>{role.category}</h4>
              <div className="role-stats">
                <p><strong>{role.volunteerCount}</strong> volunteers</p>
                <p><strong>{(role.totalHours ?? 0).toFixed(1)}</strong> total hours</p>
                <p><strong>{role.completedTasks}</strong> tasks completed</p>
                <p><strong>{(role.avgHours ?? 0).toFixed(1)}</strong> avg hours/volunteer</p>
              </div>
              <div className="engagement-bar">
                <div
                  className="engagement-fill"
                  style={{ width: `${Math.min(role.engagementScore ?? 0, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="insight-section">
        <h2>Where Volunteers Come From</h2>
        <div className="origins-container">
          <div className="origins-chart">
            {data.locations.map((origin, index) => (
              <div key={index} className="origin-item">
                <div className="origin-info">
                  <span className="location">{origin.location}</span>
                  <span className="count">{origin.count} volunteers ({origin.percentage}%)</span>
                </div>
                <div className="origin-bar">
                  <div
                    className="origin-fill"
                    style={{ width: `${origin.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="insight-section">
        <h2>Top Repeat Volunteers</h2>
        <div className="repeat-volunteers-table">
          <div className="table-header">
            <span>Volunteer</span>
            <span>Tasks Completed</span>
            <span>Total Hours</span>
            <span>Join Date</span>
            <span>Status</span>
          </div>
          {data.topVolunteers.map((volunteer, index) => (
            <div key={index} className="table-row">
              <span className="volunteer-name">{volunteer.name}</span>
              <span className="task-count">{volunteer.taskCount}</span>
              <span className="total-hours">{(volunteer.hours ?? 0).toFixed(1)}h</span>
              <span className="join-date">{new Date(volunteer.joinDate).toLocaleDateString()}</span>
              <span className={`status ${volunteer.isRepeat ? 'repeat' : 'new'}`}>
                {volunteer.isRepeat ? 'Repeat' : 'New'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="insight-section">
        <h2>Volunteer Availability Analysis</h2>
        <div className="availability-stats">
          <div className="availability-overview">
            <h4>Overview</h4>
            <p>Total Survey Responses: <strong>{data.availability.totalSurveys}</strong></p>
            <p>Average Hours Available: <strong>{(data.availability.avgHours ?? 0).toFixed(1)} hours/week</strong></p>
          </div>

          <div className="availability-distribution">
            <h4>Hours Distribution</h4>
            {Object.entries(data.availability.hourRanges || {}).map(([range, count]) => (
              <div key={range} className="availability-item">
                <span className="range">{range} hours</span>
                <span className="count">{count} volunteers</span>
                <div className="availability-bar">
                  <div
                    className="availability-fill"
                    style={{ width: `${(count / (data.availability.totalSurveys || 1) * 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="insight-section">
        <h2>Grace Quiz Matching Effectiveness</h2>
        <div className="quiz-stats">
          <div className="quiz-overview">
            <div className="quiz-metric">
              <h4>Match Accuracy</h4>
              <span className="large-number">{data.matching.accuracy}%</span>
            </div>
            <div className="quiz-metric">
              <h4>Total Matches</h4>
              <span className="large-number">{data.matching.totalMatches}</span>
            </div>
          </div>

          <div className="skills-interests">
            <div className="skills-section">
              <h4>Popular Skills</h4>
              <div className="skill-tags">
                {Object.entries(data.matching.skills || {})
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([skill, count]) => (
                    <span key={skill} className="skill-tag">
                      {skill} ({count})
                    </span>
                  ))}
              </div>
            </div>

            <div className="interests-section">
              <h4>Common Interests</h4>
              <div className="interest-tags">
                {Object.entries(data.matching.interests || {})
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 8)
                  .map(([interest, count]) => (
                    <span key={interest} className="interest-tag">
                      {interest} ({count})
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Volunteer;
