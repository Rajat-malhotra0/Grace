import React, { useState } from "react";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Star,
  Clock,
  Users,
  Target,
  TrendingUp,
  Calendar,
} from "lucide-react";
import "./GlobalLeaderboard.css";
import avatar from "../../../assets/avatar.jpg"; 
import avatar1 from "../../../assets/avatar1.jpg";
import avatar2 from "../../../assets/avatar2.jpg";
import avatar3 from "../../../assets/avatar3.jpg";
import avatar4 from "../../../assets/avatar4.jpg";
import avatar5 from "../../../assets/avatar5.jpg";
import avatar6 from "../../../assets/avatar6.jpg";
import avatar7 from "../../../assets/avatar7.jpg";
import avatar8 from "../../../assets/avatar8.jpg";
import avatar9 from "../../../assets/avatar9.jpg";

const leaderboardData = [
  {
    id: 1,
    rank: 1,
    name: "Rajat Malhotra",
    location: "New Delhi, India",
    totalHours: 342,
    activitiesCompleted: 87,
    impactScore: 9.8,
    streak: 45,
    joinDate: "2023-01-15",
    topCause: "Education",
    level: "Champion",
    avatar: avatar,
      
  },
  {
    id: 2,
    rank: 2,
    name: "Aditi Singh",
    location: "New Delhi, India",
    totalHours: 298,
    activitiesCompleted: 76,
    impactScore: 9.5,
    streak: 38,
    joinDate: "2023-02-20",
    topCause: "Environment",
    level: "Expert",
    avatar: avatar1,
  },
  {
    id: 3,
    rank: 3,
    name: "Aman Singh Chauhan",
    location: "New Delhi, India",
    totalHours: 276,
    activitiesCompleted: 69,
    impactScore: 9.3,
    streak: 32,
    joinDate: "2023-03-10",
    topCause: "Healthcare",
    level: "Expert",
    avatar: avatar2,
  },
  {
    id: 4,
    rank: 4,
    name: "Aaruniy Akhil",
    location: "New Delhi, India",
    totalHours: 251,
    activitiesCompleted: 63,
    impactScore: 9.1,
    streak: 28,
    joinDate: "2023-01-30",
    topCause: "Community Support",
    level: "Advanced",
    avatar: avatar3,
  },
  {
    id: 5,
    rank: 5,
    name: "Priya Patel",
    location: "New Delhi, India",
    totalHours: 234,
    activitiesCompleted: 58,
    impactScore: 8.9,
    streak: 25,
    joinDate: "2023-04-05",
    topCause: "Women's Rights",
    level: "Advanced",
    avatar: avatar4,
  },
  {
    id: 6,
    rank: 6,
    name: "Rachit Pal",
    location: "New Delhi, India",
    totalHours: 218,
    activitiesCompleted: 54,
    impactScore: 8.7,
    streak: 22,
    joinDate: "2023-02-15",
    topCause: "Elder Care",
    level: "Advanced",
    avatar: avatar5,
  },
  {
    id: 7,
    rank: 7,
    name: "Saanvi Kapoor",
    location: "New Delhi, India",
    totalHours: 203,
    activitiesCompleted: 51,
    impactScore: 8.5,
    streak: 19,
    joinDate: "2023-05-12",
    topCause: "Animal Welfare",
    level: "Intermediate",
    avatar: avatar6,
  },
  {
    id: 8,
    rank: 8,
    name: "Ahmed Hassan",
    location: "New Delhi, India",
    totalHours: 189,
    activitiesCompleted: 47,
    impactScore: 8.3,
    streak: 16,
    joinDate: "2023-06-01",
    topCause: "Education",
    level: "Intermediate",
    avatar: avatar7,
  },
  {
    id: 9,
    rank: 9,
    name: "Nisha Verma",
    location: "New Delhi, India",
    totalHours: 175,
    activitiesCompleted: 44,
    impactScore: 8.1,
    streak: 14,
    joinDate: "2023-03-25",
    topCause: "Environment",
    level: "Intermediate",
    avatar: avatar8,
  },
  {
    id: 10,
    rank: 10,
    name: "Satyartha Sahu",
    location: "New Delhi, India",
    totalHours: 162,
    activitiesCompleted: 41,
    impactScore: 7.9,
    streak: 12,
    joinDate: "2023-07-08",
    topCause: "Healthcare",
    level: "Intermediate",
    avatar: avatar9,
  },
];

const GlobalLeaderboard = () => {
  const [selectedCategory, setSelectedCategory] = useState("hours");
  const [timeFilter, setTimeFilter] = useState("all");

  const categories = [
    { id: "hours", label: "Total Hours", icon: Clock },
    { id: "activities", label: "Activities", icon: Target },
    { id: "impact", label: "Impact Score", icon: Star },
    { id: "streak", label: "Streak Days", icon: TrendingUp },
  ];

  const timeFilters = [
    { id: "all", label: "All Time" },
    { id: "year", label: "This Year" },
    { id: "month", label: "This Month" },
    { id: "week", label: "This Week" },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="rank-icon gold" size={24} />;
      case 2:
        return <Medal className="rank-icon silver" size={24} />;
      case 3:
        return <Award className="rank-icon bronze" size={24} />;
      default:
        return <span className="rank-number">{rank}</span>;
    }
  };

  const getLevelBadgeClass = (level) => {
    switch (level) {
      case "Champion":
        return "level-champion";
      case "Expert":
        return "level-expert";
      case "Advanced":
        return "level-advanced";
      case "Intermediate":
        return "level-intermediate";
      default:
        return "level-beginner";
    }
  };

  const getSortedData = () => {
    return [...leaderboardData].sort((a, b) => {
      switch (selectedCategory) {
        case "hours":
          return b.totalHours - a.totalHours;
        case "activities":
          return b.activitiesCompleted - a.activitiesCompleted;
        case "impact":
          return b.impactScore - a.impactScore;
        case "streak":
          return b.streak - a.streak;
        default:
          return a.rank - b.rank;
      }
    });
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="global-leaderboard-container">
      <div className="leaderboard-header">
        <h2>Global Volunteer Leaderboard</h2>
        <p>Celebrating our most dedicated volunteers </p>
      </div>

      <div className="leaderboard-controls">
        <div className="category-filters">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <IconComponent size={16} />
                {category.label}
              </button>
            );
          })}
        </div>

        <div className="time-filters">
          {timeFilters.map((filter) => (
            <button
              key={filter.id}
              className={`time-btn ${timeFilter === filter.id ? "active" : ""}`}
              onClick={() => setTimeFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      <div className="leaderboard-stats">
        <div className="stat-card">
          <h4>Total Volunteers</h4>
          <span className="stat-value">2,847</span>
        </div>
        <div className="stat-card">
          <h4>Total Hours</h4>
          <span className="stat-value">45,293</span>
        </div>
        <div className="stat-card">
          <h4>Global Impact</h4>
          <span className="stat-value">98.7%</span>
        </div>
      </div>

      <div className="podium-section">
        <div className="podium">
          {getSortedData()
            .slice(0, 3)
            .map((volunteer, index) => {
              const position = index + 1;
              return (
                <div
                  key={volunteer.id}
                  className={`podium-spot spot-${position}`}
                >
                  <div className="podium-rank">{getRankIcon(position)}</div>
                  <div className="podium-avatar">
                    <img src={volunteer.avatar} alt={volunteer.name} />
                  </div>
                  <div className="podium-info">
                    <h4>{volunteer.name}</h4>
                    <span className="podium-location">
                      {volunteer.location}
                    </span>
                    <div
                      className={`level-badge ${getLevelBadgeClass(
                        volunteer.level
                      )}`}
                    >
                      {volunteer.level}
                    </div>
                    <div className="podium-stats">
                      <span>{volunteer.totalHours}h</span>
                      <span>{volunteer.activitiesCompleted} activities</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      <div className="leaderboard-table">
        <div className="table-header">
          <span>Rank</span>
          <span>Volunteer</span>
          <span>Hours</span>
          <span>Activities</span>
          <span>Impact</span>
          <span>Streak</span>
          <span>Joined</span>
        </div>

        {getSortedData()
          .slice(3)
          .map((volunteer, index) => (
            <div key={volunteer.id} className="table-row">
              <div className="rank-cell">{getRankIcon(index + 4)}</div>
              <div className="volunteer-cell">
                <img
                  src={volunteer.avatar}
                  alt={volunteer.name}
                  className="table-avatar"
                />
                <div className="volunteer-info">
                  <span className="volunteer-name">{volunteer.name}</span>
                  <span className="volunteer-location">
                    {volunteer.location}
                  </span>
                  <div
                    className={`level-badge small ${getLevelBadgeClass(
                      volunteer.level
                    )}`}
                  >
                    {volunteer.level}
                  </div>
                </div>
              </div>
              <div className="hours-cell">
                <Clock size={14} />
                {volunteer.totalHours}h
              </div>
              <div className="activities-cell">
                <Target size={14} />
                {volunteer.activitiesCompleted}
              </div>
              <div className="impact-cell">
                <Star size={14} />
                {volunteer.impactScore}
              </div>
              <div className="streak-cell">
                <TrendingUp size={14} />
                {volunteer.streak} days
              </div>
              <div className="joined-cell">
                <Calendar size={14} />
                {formatJoinDate(volunteer.joinDate)}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default GlobalLeaderboard;
