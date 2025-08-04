import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import "./InsightsButton.css";

const InsightsButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    // Only show for NGO users
    if (!user?.role?.includes("ngo")) {
        return null;
    }

    const handleMarketplaceInsights = () => {
        navigate("/ngo/marketplace-insights");
        setIsOpen(false);
    };

    const handleVolunteerInsights = () => {
        navigate("/ngo/volunteer-insights");
        setIsOpen(false);
    };

    return (
        <div className="insights-button-container">
            {/* Main Insights Button */}
            <button
                className="insights-toggle"
                onClick={() => setIsOpen(!isOpen)}
                title="View Analytics & Insights"
            ></button>

            {/* Popup Options */}
            {isOpen && (
                <div className="insights-popup">
                    <div className="insights-popup-header">
                        <h4>Analytics & Insights</h4>
                        <button
                            className="close-btn"
                            onClick={() => setIsOpen(false)}
                        >
                            ×
                        </button>
                    </div>
                    <div className="insights-options">
                        <button
                            className="insight-option marketplace"
                            onClick={handleMarketplaceInsights}
                        >
                            <div className="option-icon"></div>
                            <div className="option-content">
                                <h5>Marketplace Insights</h5>
                                <p>Track donation requests & fulfillment</p>
                            </div>
                        </button>
                        <button
                            className="insight-option volunteer"
                            onClick={handleVolunteerInsights}
                        >
                            <div className="option-icon"></div>
                            <div className="option-content">
                                <h5>Volunteer Insights</h5>
                                <p>Monitor volunteer engagement & analytics</p>
                            </div>
                        </button>
                    </div>
                </div>
            )}

            {/* Backdrop */}
            {isOpen && (
                <div
                    className="insights-backdrop"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
};

export default InsightsButton;
