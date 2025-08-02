import React, { useState, useEffect } from "react";
import axios from "axios";
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

// Default avatar mapping
const avatarMap = [
    avatar,
    avatar1,
    avatar2,
    avatar3,
    avatar4,
    avatar5,
    avatar6,
    avatar7,
    avatar8,
    avatar9,
];

const GlobalLeaderboard = () => {
    const [selectedCategory, setSelectedCategory] = useState("hours");
    const [timeFilter, setTimeFilter] = useState("all");
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    // Fetch leaderboard data from backend
    const fetchLeaderboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get("/api/users/leaderboard", {
                params: {
                    limit: 50,
                },
            });

            if (response.data.success) {
                // Map backend data to frontend format and add avatars
                const mappedData = response.data.result.map((user, index) => ({
                    id: user.id,
                    rank: user.rank,
                    name: user.name,
                    location: user.location,
                    totalHours: user.hours,
                    activitiesCompleted: user.activities,
                    impactScore: user.impact,
                    streak: user.streak,
                    joinDate: user.joined,
                    level: user.level,
                    avatar: avatarMap[index % avatarMap.length], // Cycle through available avatars
                    topCause: "Community Support", // Default value since backend doesn't provide this
                }));

                setLeaderboardData(mappedData);
            } else {
                setError("Failed to fetch leaderboard data");
            }
        } catch (err) {
            console.error("Error fetching leaderboard:", err);
            setError("Failed to load leaderboard");
            // Fallback to empty array to prevent crashes
            setLeaderboardData([]);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchLeaderboardData();
    }, []);

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

    // Calculate stats from actual data
    const getStats = () => {
        if (leaderboardData.length === 0) {
            return {
                totalVolunteers: 0,
                totalHours: 0,
                globalImpact: 0,
            };
        }

        const totalVolunteers = leaderboardData.length;
        const totalHours = leaderboardData.reduce(
            (sum, user) => sum + user.totalHours,
            0
        );
        const avgImpact =
            leaderboardData.reduce((sum, user) => sum + user.impactScore, 0) /
            totalVolunteers;

        return {
            totalVolunteers,
            totalHours,
            globalImpact: avgImpact.toFixed(1),
        };
    };

    const stats = getStats();

    if (loading) {
        return (
            <div className="global-leaderboard-container">
                <div className="leaderboard-header">
                    <h2>Global Volunteer Leaderboard</h2>
                    <p>Loading leaderboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="global-leaderboard-container">
                <div className="leaderboard-header">
                    <h2>Global Volunteer Leaderboard</h2>
                    <p style={{ color: "#e74c3c" }}>Error: {error}</p>
                    <button
                        onClick={fetchLeaderboardData}
                        style={{
                            padding: "0.5rem 1rem",
                            background: "#2e2e2e",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            marginTop: "1rem",
                        }}
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

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
                                    selectedCategory === category.id
                                        ? "active"
                                        : ""
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
                            className={`time-btn ${
                                timeFilter === filter.id ? "active" : ""
                            }`}
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
                    <span className="stat-value">
                        {stats.totalVolunteers.toLocaleString()}
                    </span>
                </div>
                <div className="stat-card">
                    <h4>Total Hours</h4>
                    <span className="stat-value">
                        {stats.totalHours.toLocaleString()}
                    </span>
                </div>
                <div className="stat-card">
                    <h4>Global Impact</h4>
                    <span className="stat-value">{stats.globalImpact}</span>
                </div>
            </div>

            {leaderboardData.length > 0 && (
                <>
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
                                            <div className="podium-rank">
                                                {getRankIcon(position)}
                                            </div>
                                            <div className="podium-avatar">
                                                <img
                                                    src={volunteer.avatar}
                                                    alt={volunteer.name}
                                                />
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
                                                    <span>
                                                        {volunteer.totalHours}h
                                                    </span>
                                                    <span>
                                                        {
                                                            volunteer.activitiesCompleted
                                                        }{" "}
                                                        activities
                                                    </span>
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
                                    <div className="rank-cell">
                                        {getRankIcon(index + 4)}
                                    </div>
                                    <div className="volunteer-cell">
                                        <img
                                            src={volunteer.avatar}
                                            alt={volunteer.name}
                                            className="table-avatar"
                                        />
                                        <div className="volunteer-info">
                                            <span className="volunteer-name">
                                                {volunteer.name}
                                            </span>
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
                </>
            )}

            {leaderboardData.length === 0 && !loading && (
                <div
                    style={{
                        textAlign: "center",
                        padding: "2rem",
                        color: "#666",
                    }}
                >
                    <p>
                        No volunteers found. Complete some tasks to appear on
                        the leaderboard!
                    </p>
                </div>
            )}
        </div>
    );
};

export default GlobalLeaderboard;
