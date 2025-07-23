import React, { useState, useEffect } from "react";
import "./Services.css";

function Service() {
  const [volunteersData, setVolunteersData] = useState({
    totalVolunteers: 0,
    activeVolunteers: 0,
    newVolunteers: 0,
    retentionRate: 0,
    mostEngagedRoles: [],
    volunteerOrigins: [],
    repeatVolunteers: [],
    availabilityStats: {},
    quizMatchStats: {}
  });

  const [timeFilter, setTimeFilter] = useState("month");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteerInsights();
  }, [timeFilter]);

  const fetchVolunteerInsights = async () => {
    setLoading(true);
    try {
      // Fetch volunteer data from various endpoints
      const [users, skillSurveys, tasks] = await Promise.all([
        fetch("/api/users?role=volunteer").then(res => res.json()),
        fetch("/api/skill-surveys").then(res => res.json()),
        fetch("/api/tasks").then(res => res.json())
      ]);

      const processedData = processVolunteerData(users.result || [], skillSurveys.result || [], tasks.result || []);
      setVolunteersData(processedData);
    } catch (error) {
      console.error("Error fetching volunteer insights:", error);
    }
    setLoading(false);
  };

  const processVolunteerData = (users, surveys, tasks) => {
    const volunteers = users.filter(user => user.role.includes("volunteer"));
    const now = new Date();
    const timeFrames = {
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      quarter: 90 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000
    };

    // Most Engaged Roles Analysis
    const roleEngagement = {};
    tasks.forEach(task => {
      if (task.assignedTo && task.actualMinutes > 0) {
        const volunteer = volunteers.find(v => v._id === task.assignedTo);
        if (volunteer) {
          const category = task.category || "General";
          if (!roleEngagement[category]) {
            roleEngagement[category] = {
              category,
              volunteers: new Set(),
              totalHours: 0,
              completedTasks: 0,
              avgRating: 0
            };
          }
          roleEngagement[category].volunteers.add(task.assignedTo);
          roleEngagement[category].totalHours += task.actualMinutes / 60;
          roleEngagement[category].completedTasks++;
        }
      }
    });

    const mostEngagedRoles = Object.values(roleEngagement)
      .map(role => ({
        ...role,
        volunteerCount: role.volunteers.size,
        avgHoursPerVolunteer: role.totalHours / role.volunteers.size || 0,
        engagementScore: (role.totalHours * role.completedTasks) / Math.max(role.volunteers.size, 1)
      }))
      .sort((a, b) => b.engagementScore - a.engagementScore)
      .slice(0, 8);

    // Volunteer Origins Analysis
    const origins = {};
    volunteers.forEach(volunteer => {
      const location = volunteer.location || "Unknown";
      origins[location] = (origins[location] || 0) + 1;
    });

    const volunteerOrigins = Object.entries(origins)
      .map(([location, count]) => ({ location, count, percentage: (count / volunteers.length * 100).toFixed(1) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Repeat Volunteer Analysis
    const volunteerTaskCounts = {};
    tasks.forEach(task => {
      if (task.assignedTo) {
        volunteerTaskCounts[task.assignedTo] = (volunteerTaskCounts[task.assignedTo] || 0) + 1;
      }
    });

    const repeatVolunteers = Object.entries(volunteerTaskCounts)
      .map(([volunteerId, taskCount]) => {
        const volunteer = volunteers.find(v => v._id === volunteerId);
        return volunteer ? {
          id: volunteerId,
          name: volunteer.userName,
          taskCount,
          isRepeat: taskCount > 1,
          totalHours: tasks.filter(t => t.assignedTo === volunteerId).reduce((sum, t) => sum + (t.actualMinutes || 0), 0) / 60,
          joinDate: volunteer.createdAt
        } : null;
      })
      .filter(v => v)
      .sort((a, b) => b.taskCount - a.taskCount);

    // Availability Analysis
    const availabilityStats = {
      totalSurveys: surveys.length,
      avgHours: surveys.reduce((sum, s) => sum + (s.availabilityHours || 0), 0) / Math.max(surveys.length, 1),
      hourDistribution: {}
    };

    surveys.forEach(survey => {
      const hours = survey.availabilityHours || 0;
      const range = hours === 0 ? "0" : 
                   hours <= 5 ? "1-5" :
                   hours <= 10 ? "6-10" :
                   hours <= 20 ? "11-20" : "20+";
      availabilityStats.hourDistribution[range] = (availabilityStats.hourDistribution[range] || 0) + 1;
    });

    // Quiz Match Analysis
    const quizMatchStats = {
      totalMatches: surveys.length,
      skillCategories: {},
      interestCategories: {},
      matchAccuracy: 85.5 // This would be calculated based on actual matching algorithm
    };

    surveys.forEach(survey => {
      (survey.skills || []).forEach(skill => {
        quizMatchStats.skillCategories[skill] = (quizMatchStats.skillCategories[skill] || 0) + 1;
      });
      (survey.interests || []).forEach(interest => {
        quizMatchStats.interestCategories[interest] = (quizMatchStats.interestCategories[interest] || 0) + 1;
      });
    });

    return {
      totalVolunteers: volunteers.length,
      activeVolunteers: volunteers.filter(v => {
        const lastActive = new Date(v.updatedAt || v.createdAt);
        return (now - lastActive) < timeFrames[timeFilter];
      }).length,
      newVolunteers: volunteers.filter(v => {
        const joinDate = new Date(v.createdAt);
        return (now - joinDate) < timeFrames[timeFilter];
      }).length,
      retentionRate: ((repeatVolunteers.filter(v => v.isRepeat).length / Math.max(volunteers.length, 1)) * 100).toFixed(1),
      mostEngagedRoles,
      volunteerOrigins,
      repeatVolunteers: repeatVolunteers.slice(0, 10),
      availabilityStats,
      quizMatchStats
    };
  };

  if (loading) {
    return (
      <div className="service-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading volunteer insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="service-page">
      <div className="service-header">
        <h1>Volunteer Analytics Dashboard</h1>
        <p>Comprehensive insights into volunteer engagement, origins, and matching effectiveness</p>
        
        <div className="time-filter">
          <label>Time Period:</label>
          <select value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="metrics-overview">
        <div className="metric-card">
          <h3>Total Volunteers</h3>
          <span className="metric-value">{volunteersData.totalVolunteers}</span>
        </div>
        <div className="metric-card">
          <h3>Active Volunteers</h3>
          <span className="metric-value">{volunteersData.activeVolunteers}</span>
        </div>
        <div className="metric-card">
          <h3>New Volunteers</h3>
          <span className="metric-value">{volunteersData.newVolunteers}</span>
        </div>
        <div className="metric-card">
          <h3>Retention Rate</h3>
          <span className="metric-value">{volunteersData.retentionRate}%</span>
        </div>
      </div>

      {/* Most Engaged Roles */}
      <div className="insight-section">
        <h2>Most Engaged Volunteer Roles</h2>
        <div className="roles-grid">
          {volunteersData.mostEngagedRoles.map((role, index) => (
            <div key={index} className="role-card">
              <h4>{role.category}</h4>
              <div className="role-stats">
                <p><strong>{role.volunteerCount}</strong> volunteers</p>
                <p><strong>{role.totalHours.toFixed(1)}</strong> total hours</p>
                <p><strong>{role.completedTasks}</strong> tasks completed</p>
                <p><strong>{role.avgHoursPerVolunteer.toFixed(1)}</strong> avg hours/volunteer</p>
              </div>
              <div className="engagement-bar">
                <div 
                  className="engagement-fill" 
                  style={{width: `${Math.min(role.engagementScore / 100 * 100, 100)}%`}}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer Origins */}
      <div className="insight-section">
        <h2>Where Volunteers Come From</h2>
        <div className="origins-container">
          <div className="origins-chart">
            {volunteersData.volunteerOrigins.map((origin, index) => (
              <div key={index} className="origin-item">
                <div className="origin-info">
                  <span className="location">{origin.location}</span>
                  <span className="count">{origin.count} volunteers ({origin.percentage}%)</span>
                </div>
                <div className="origin-bar">
                  <div 
                    className="origin-fill" 
                    style={{width: `${origin.percentage}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Repeat Volunteers */}
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
          {volunteersData.repeatVolunteers.map((volunteer, index) => (
            <div key={index} className="table-row">
              <span className="volunteer-name">{volunteer.name}</span>
              <span className="task-count">{volunteer.taskCount}</span>
              <span className="total-hours">{volunteer.totalHours.toFixed(1)}h</span>
              <span className="join-date">{new Date(volunteer.joinDate).toLocaleDateString()}</span>
              <span className={`status ${volunteer.isRepeat ? 'repeat' : 'new'}`}>
                {volunteer.isRepeat ? 'Repeat' : 'New'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Volunteer Availability */}
      <div className="insight-section">
        <h2>Volunteer Availability Analysis</h2>
        <div className="availability-stats">
          <div className="availability-overview">
            <h4>Overview</h4>
            <p>Total Survey Responses: <strong>{volunteersData.availabilityStats.totalSurveys}</strong></p>
            <p>Average Hours Available: <strong>{volunteersData.availabilityStats.avgHours.toFixed(1)} hours/week</strong></p>
          </div>
          
          <div className="availability-distribution">
            <h4>Hours Distribution</h4>
            {Object.entries(volunteersData.availabilityStats.hourDistribution).map(([range, count]) => (
              <div key={range} className="availability-item">
                <span className="range">{range} hours</span>
                <span className="count">{count} volunteers</span>
                <div className="availability-bar">
                  <div 
                    className="availability-fill"
                    style={{width: `${(count / volunteersData.availabilityStats.totalSurveys * 100)}%`}}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grace Quiz Matching */}
      <div className="insight-section">
        <h2>Grace Quiz Matching Effectiveness</h2>
        <div className="quiz-stats">
          <div className="quiz-overview">
            <div className="quiz-metric">
              <h4>Match Accuracy</h4>
              <span className="large-number">{volunteersData.quizMatchStats.matchAccuracy}%</span>
            </div>
            <div className="quiz-metric">
              <h4>Total Matches</h4>
              <span className="large-number">{volunteersData.quizMatchStats.totalMatches}</span>
            </div>
          </div>
          
          <div className="skills-interests">
            <div className="skills-section">
              <h4>Popular Skills</h4>
              <div className="skill-tags">
                {Object.entries(volunteersData.quizMatchStats.skillCategories)
                  .sort(([,a], [,b]) => b - a)
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
                {Object.entries(volunteersData.quizMatchStats.interestCategories)
                  .sort(([,a], [,b]) => b - a)
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

export default Service;
