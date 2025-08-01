import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Heart,
  Leaf,
  Baby,
  Stethoscope,
} from "lucide-react";
import "./VolunteerTimeline.css";
import { ChevronRight } from "lucide-react";

// Import images from your assets folder
import communityGarden from "../../../assets/environment1.jpg";
import childrenReading from "../../../assets/childcare1.jpg";
import bloodDonation from "../../../assets/healthcare1.jpg";
import foodDistribution from "../../../assets/community-support.jpg";
import environmentWorkshop from "../../../assets/environment2.jpg";
import seniorCare from "../../../assets/elder-care.jpg";

const timelineData = [
  {
    id: 1,
    date: "2024-01-15",
    title: "Community Garden Setup",
    organization: "Green Earth Foundation",
    location: "Central Park Community Center",
    duration: "4 hours",
    participants: 25,
    description:
      "Helped set up a community garden for local families to grow their own vegetables.",
    cause: "Environment",
    icon: Leaf,
    type: "Event",
    image: communityGarden,
  },
  {
    id: 2,
    date: "2024-01-22",
    title: "Children's Reading Program",
    organization: "Children First Initiative",
    location: "Downtown Library",
    duration: "3 hours",
    participants: 15,
    description:
      "Read stories and helped children with homework during after-school program.",
    cause: "Education",
    icon: Baby,
    type: "Regular Activity",
    image: childrenReading,
  },
  {
    id: 3,
    date: "2024-02-05",
    title: "Blood Donation Drive",
    organization: "Rural Health Alliance",
    location: "City Hospital",
    duration: "6 hours",
    participants: 50,
    description:
      "Organized and assisted in blood donation drive that collected 100+ units.",
    cause: "Healthcare",
    icon: Stethoscope,
    type: "Campaign",
    image: bloodDonation,
  },
  {
    id: 4,
    date: "2024-02-14",
    title: "Valentine's Day Food Distribution",
    organization: "Women's Empowerment Network",
    location: "Shelter District",
    duration: "5 hours",
    participants: 30,
    description:
      "Distributed meals and care packages to homeless families on Valentine's Day.",
    cause: "Community Support",
    icon: Heart,
    type: "Special Event",
    image: foodDistribution,
  },
  {
    id: 5,
    date: "2024-02-28",
    title: "Environmental Awareness Workshop",
    organization: "Green Earth Foundation",
    location: "University Campus",
    duration: "2 hours",
    participants: 80,
    description:
      "Conducted workshop on sustainable living practices for college students.",
    cause: "Environment",
    icon: Leaf,
    type: "Workshop",
    image: environmentWorkshop,
  },
  {
    id: 6,
    date: "2024-03-10",
    title: "Senior Care Visit",
    organization: "Community Helpers",
    location: "Sunset Nursing Home",
    duration: "3 hours",
    participants: 12,
    description:
      "Spent time with elderly residents, playing games and sharing stories.",
    cause: "Elder Care",
    icon: Users,
    type: "Regular Activity",
    image: seniorCare,
  },
];

const VolunteerTimeline = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const activityTypes = [
    "All",
    "Event",
    "Regular Activity",
    "Campaign",
    "Workshop",
    "Special Event",
  ];

  const filteredData =
    selectedFilter === "All"
      ? timelineData
      : timelineData.filter((item) => item.type === selectedFilter);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="volunteer-timeline-container">
      <div className="timeline-header">
        <h2>Your Volunteering Journey</h2>
        <p>A timeline of all your contributions and activities</p>
      </div>

      <div className="timeline-filters">
        {activityTypes.map((type) => (
          <button
            key={type}
            className={`filter-btn ${selectedFilter === type ? "active" : ""}`}
            onClick={() => setSelectedFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="timeline-wrapper">
        <div className="timeline-line"></div>

        {filteredData.map((activity, index) => {
          const IconComponent = activity.icon;
          const isEven = index % 2 === 0;

          return (
            <div
              key={activity.id}
              className={`timeline-item ${isEven ? "left" : "right"}`}
            >
              <div className="timeline-dot">
                <IconComponent size={20} />
              </div>

              <div className="timeline-content">
                {/* Card */}
                <div className="timeline-card">
                  <div className="timeline-card-header">
                    <div className="activity-type-badge">{activity.type}</div>
                    <div className="activity-date">
                      {formatDate(activity.date)}
                    </div>
                  </div>

                  <div className="timeline-card-content">
                    <h3>{activity.title}</h3>
                    <div className="activity-organization">
                      {activity.organization}
                    </div>
                    <p>{activity.description}</p>

                    <div className="activity-details">
                      <div className="detail-item">
                        <MapPin size={16} />
                        <span>{activity.location}</span>
                      </div>
                      <div className="detail-item">
                        <Clock size={16} />
                        <span>{activity.duration}</span>
                      </div>
                      <div className="detail-item">
                        <Users size={16} />
                        <span>{activity.participants} participants</span>
                      </div>
                    </div>

                    <div className="activity-cause">
                      <span className="cause-tag">{activity.cause}</span>
                    </div>
                  </div>
                </div>

                {/* Image */}
                <div className="timeline-image">
                  <img src={activity.image} alt={activity.title} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="no-activities">
          <p>No activities found for the selected filter.</p>
        </div>
      )}
      <div className="task-footer">
            <button className="task-button">
              View History
              <ChevronRight className="task-icon" />
            </button>
          </div>
    </div>
  );
};

export default VolunteerTimeline;
