import React, { useState, useContext } from "react";
import { Package, MapPin, Calendar, Clock, Truck, User } from "lucide-react";
import axios from "axios";
import "./DonationNeedsPage.css";
import { AuthContext } from "../../../Context/AuthContext";
import ngoPlaceholder from "../../../assets/ngo-placeholder.jpg";

const DonationNeedsPage = ({ category, categoryData }) => {
    const [fulfillmentStatus, setFulfillmentStatus] = useState({});
    const { user } = useContext(AuthContext);
    const getUrgencyBadgeClass = (urgency) => {
        switch (urgency?.toLowerCase()) {
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
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleFulfillNeed = async (itemId) => {
        try {
            const donorId = user.id;

            const response = await axios.post(
                `http://localhost:3001/api/marketplace/${itemId}/fulfill`,
                { donorId },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                setFulfillmentStatus((prev) => ({
                    ...prev,
                    [itemId]: "fulfilled",
                }));
                alert(
                    "Thank you for fulfilling this need! The NGO has been notified."
                );
            }
        } catch (error) {
            console.error("Error fulfilling need:", error);

            if (
                error.response &&
                error.response.data &&
                error.response.data.error
            ) {
                alert(`Error: ${error.response.data.error}`);
            } else {
                alert("Failed to fulfill need. Please try again.");
            }
        }
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
                        {
                            categoryData.filter(
                                (item) => item.urgency === "High"
                            ).length
                        }
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
                                src={need.ngoImage || ngoPlaceholder}
                                alt={need.ngo}
                                className="table-ngo-image"
                                onError={(e) => {
                                    e.target.src = ngoPlaceholder;
                                }}
                            />
                            <div className="ngo-info">
                                <span className="ngo-name">{need.ngo}</span>
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
                            {fulfillmentStatus[need.id] === "fulfilled" ? (
                                <button
                                    className="action-btn fulfilled-btn"
                                    disabled
                                >
                                    Fulfilled
                                </button>
                            ) : (
                                <>
                                    <button
                                        className="action-btn pickup-btn"
                                        onClick={() =>
                                            handleFulfillNeed(need.id)
                                        }
                                    >
                                        <Truck size={14} />I Can Help
                                    </button>
                                    <button className="action-btn deliver-btn">
                                        <User size={14} />
                                        Contact NGO
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {categoryData.length === 0 && (
                <div className="no-needs">
                    <h3>No needs found</h3>
                    <p>
                        There are currently no {category.toLowerCase()} needs
                        available.
                    </p>
                </div>
            )}
        </div>
    );
};

export default DonationNeedsPage;
