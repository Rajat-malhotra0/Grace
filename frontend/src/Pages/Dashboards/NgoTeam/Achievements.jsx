// src/Pages/NgoDashboard/AchievementsSection.jsx
import React from "react";
import "./Achievements.css";
import Sidebar from "../../../Components/Sidebar";
import {
  Heart,
  HandHeart,
  Clock,
  CheckCircle,
  Users,
  GraduationCap,
  Lightbulb,
  Megaphone,
  Star,
  Trophy,
  Target,
} from "lucide-react";
import Leaf1 from "../../../assets/Leaf7.svg";
import Leaf2 from "../../../assets/Leaf2.svg";
import Leaf3 from "../../../assets/Leaf6.svg";
// import Leaf4 from "../../../assets/Leaf4.svg";
import Leaf5 from "../../../assets/Leaf5.svg";
import Flower1 from "../../../assets/flower1.svg";


const badges = [
  {
    id: "kindness",
    title: "Kindness Badge",
    description: "Completed 15 community outreach events",
    progress: 12,
    max: 15,
    icon: Heart,
    category: "Community Impact",
  },
  {
    id: "generosity",
    title: "Generosity Badge",
    description: "Helped raise ₹25,000 in donations",
    progress: 18500,
    max: 25000,
    icon: HandHeart,
    category: "Fundraising",
  },
  {
    id: "dedication",
    title: "Dedication Badge",
    description: "Volunteered 150+ hours this year",
    progress: 142,
    max: 150,
    icon: Clock,
    category: "Time Commitment",
  },
  {
    id: "efficiency",
    title: "Efficiency Badge",
    description: "Completed 100 assigned tasks",
    progress: 100,
    max: 100,
    icon: CheckCircle,
    category: "Task Management",
  },
  {
    id: "leadership",
    title: "Leadership Badge",
    description: "Successfully led 8 team initiatives",
    progress: 6,
    max: 8,
    icon: Users,
    category: "Team Leadership",
  },
  {
    id: "mentor",
    title: "Mentor Badge",
    description: "Guided 20 new volunteers",
    progress: 15,
    max: 20,
    icon: GraduationCap,
    category: "Mentorship",
  },
  {
    id: "innovator",
    title: "Innovator Badge",
    description: "Proposed 5 successful program improvements",
    progress: 3,
    max: 5,
    icon: Lightbulb,
    category: "Innovation",
  },
  {
    id: "advocate",
    title: "Advocate Badge",
    description: "Reached 1000+ people through awareness campaigns",
    progress: 850,
    max: 1000,
    icon: Megaphone,
    category: "Advocacy",
  },
];

const Badge = ({ badge }) => {
  const progressPercent = Math.min((badge.progress / badge.max) * 100, 100);
  const isCompleted = progressPercent === 100;
  const IconComponent = badge.icon;

  return (
    <div className={`badge-card ${isCompleted ? "completed" : "in-progress"}`}>
      
      <div className="badge-header">
        
        <div className="badge-icon">
          <IconComponent size={28} />
        </div>
        <div className="badge-status">
          {isCompleted && (
            <div className="completion-star">
              <Star size={20} fill="currentColor" />
            </div>
          )}
        </div>
      </div>

      <div className="badge-details">
        <h3 className="badge-title">{badge.title}</h3>
        <p className="badge-category">{badge.category}</p>
        <p className="badge-description">{badge.description}</p>

        <div className="progress-container_">
          <div className="progress-bar_">
            <div
              className="progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="progress-info">
            <span className="progress-text">
              {badge.progress.toLocaleString()}/{badge.max.toLocaleString()}
            </span>
            <span className="progress-percent">
              {Math.round(progressPercent)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AchievementStats = ({ badges }) => {
  const completedBadges = badges.filter(
    (badge) => (badge.progress / badge.max) * 100 === 100
  ).length;
  const totalBadges = badges.length;
  const overallProgress = Math.round((completedBadges / totalBadges) * 100);

  return (
    <div className="achievement-stats">
      <div className="stats-card">
        <h3>Badges Earned</h3>
        <div className="stat-number">
          {completedBadges}/{totalBadges}
        </div>
      </div>
      <div className="stats-card">
        <h3>Overall Progress</h3>
        <div className="stat-number">{overallProgress}%</div>
      </div>
      <div className="stats-card">
        <h3>Current Level</h3>
        <div className="stat-number">
          {completedBadges >= 6
            ? "Expert"
            : completedBadges >= 3
            ? "Advanced"
            : "Beginner"}
        </div>
      </div>
    </div>
  );
};

const Achievements = () => {
  const completedBadges = badges.filter(
    (badge) => (badge.progress / badge.max) * 100 === 100
  );
  const inProgressBadges = badges.filter(
    (badge) => (badge.progress / badge.max) * 100 < 100
  );

  return (
    <div>
      <Sidebar />
      <div className="achievements-page">
        <div className="achievements-header">
          <img src={Leaf1} alt="leaf" className="leaf leaf-1_" />
                        <img src={Leaf2} alt="leaf" className="leaf leaf-2_" />
                        <img src={Leaf3} alt="leaf" className="leaf leaf-3_" />
                        {/* <img src={Leaf4} alt="leaf" className="leaf leaf-4" /> */}
                        <img src={Leaf5} alt="leaf" className="leaf leaf-5_" />
                        <img src={Flower1} alt="flower" className="leaf flower-1_" />
                    
          <h1 className="achievements-title">Your Achievements</h1>
          <p className="achievements-subtitle">
            <em>Track your impact and celebrate your dedication to making a
            difference</em>
          </p>
        </div>

        <AchievementStats badges={badges} />

        {completedBadges.length > 0 && (
          <div className="achievements-section">
            <h2 className="section-title">
              <Trophy
                size={24}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Completed Badges
            </h2>
            <div className="badges-grid">
              {completedBadges.map((badge) => (
                <Badge key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        )}

        {inProgressBadges.length > 0 && (
          <div className="achievements-section">
            <h2 className="section-title">
              <Target
                size={24}
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              In Progress
            </h2>
            <div className="badges-grid">
              {inProgressBadges.map((badge) => (
                <Badge key={badge.id} badge={badge} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
