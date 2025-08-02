import React from "react";
import { Package, MapPin, Calendar, Clock, Truck, User } from "lucide-react";
import "./DonationNeedsPage.css";

const DonationNeedsPage = ({ category, categoryData }) => {
  const getUrgencyBadgeClass = (urgency) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "urgency-high";
      case "medium":
        return "urgency-medium";
      case "low":
        return "urgency-low";
      default:
        return "urgency-medium";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="donation-needs-container">
      <div className="donation-needs-header">
        <h1>{category} Needs</h1>
        <p>Current needs from NGOs in your area</p>
      </div>

      <div className="needs-stats">
        <div className="stat-card_">
          <h4>Active Requests</h4>
          <span className="stat-value_">{categoryData.length}</span>
        </div>
        <div className="stat-card_">
          <h4>High Priority</h4>
          <span className="stat-value_">
            {categoryData.filter((item) => item.urgency === "High").length}
          </span>
        </div>
        <div className="stat-card_">
          <h4>This Week</h4>
          <span className="stat-value_">
            {
              categoryData.filter((item) => {
                const postDate = new Date(item.datePosted);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return postDate >= weekAgo;
              }).length
            }
          </span>
        </div>
      </div>

      <div className="needs-table">
        <div className="table-header_">
          <span>NGO</span>
          <span>Item Needed</span>
          <span>Quantity</span>
          <span>Urgency</span>
          <span>Posted</span>
          <span>Actions</span>
        </div>

        {categoryData.map((need) => (
          <div key={need.id} className="table-row_">
            <div className="ngo-cell">
              <img
                src={need.ngoImage}
                alt={need.ngoName}
                className="table-ngo-image"
              />
              <div className="ngo-info">
                <span className="ngo-name">{need.ngoName}</span>
                <span className="ngo-location">
                  <MapPin size={12} />
                  {need.location}
                </span>
              </div>
            </div>

            <div className="item-cell">
              <Package size={14} />
              {need.item}
            </div>

            <div className="quantity-cell">{need.quantity}</div>

            <div className="urgency-cell">
              <span
                className={`urgency-badge ${getUrgencyBadgeClass(
                  need.urgency
                )}`}
              >
                <Clock size={12} />
                {need.urgency}
              </span>
            </div>

            <div className="date-cell">
              <Calendar size={14} />
              {formatDate(need.datePosted)}
            </div>

            <div className="actions-cell">
              <button className="action-btn pickup-btn">
                <Truck size={14} />
                Request Pickup
              </button>
              <button className="action-btn deliver-btn">
                <User size={14} />
                I'll Deliver
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationNeedsPage;
