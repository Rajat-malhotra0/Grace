import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import { withApiBase } from "config";
import "./NgoRecommendations.css";

function NGORecommendations({ onRestart }) {
    const { token } = useContext(AuthContext);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await fetch(
                    withApiBase("/api/ngosRecommendations"),
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    setRecommendations(data.recommendations || []);
                } else {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.message || "Failed to fetch recommendations"
                    );
                }
            } catch (error) {
                console.error("Error fetching recommendations:", error);
                setError("Failed to load recommendations");
            } finally {
                setLoading(false);
            }
        };

        if (!token) {
            setLoading(false);
            return;
        }

        fetchRecommendations();
    }, [token]);

    if (loading) {
        return (
            <div className="recommendations-page">
                <div className="loading-screen">
                    <h2>Finding Your Perfect Matches...</h2>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recommendations-page">
                <div className="error-screen">
                    <h2>Oops! Something went wrong</h2>
                    <p>{error}</p>
                    <button onClick={onRestart} className="primary-button">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="recommendations-page">
            <div className="recommendations-container">
                <div className="recommendations-header">
                    <h1>Your NGO Matches</h1>
                    <p>
                        Based on your quiz responses, here are the organizations
                        that align with your interests and skills:
                    </p>
                </div>

                {recommendations.length === 0 ? (
                    <div className="no-matches">
                        <h3>No perfect matches found</h3>
                        <p>
                            Don't worry! We're constantly adding new NGOs to our
                            platform. Try taking the quiz again later or explore
                            our general listings.
                        </p>
                        <button onClick={onRestart} className="primary-button">
                            Retake Quiz
                        </button>
                    </div>
                ) : (
                    <div className="recommendations-list">
                        {recommendations.map((ngo) => (
                            <div key={ngo._id} className="ngo-card">
                                <div className="ngo-header">
                                    <div className="ngo-info">
                                        <h3>{ngo.organizationName}</h3>
                                        <p className="ngo-description">
                                            {ngo.description}
                                        </p>
                                        {ngo.isVerified && (
                                            <div className="verification-badge">
                                                Verified Organization
                                            </div>
                                        )}
                                    </div>
                                    <div className="match-badge">
                                        <span>Match</span>
                                    </div>
                                </div>

                                <div className="ngo-details">
                                    <div className="detail-section">
                                        <h4>Focus Areas</h4>
                                        <div className="tags">
                                            {ngo.category.map((cat, idx) => (
                                                <span key={idx} className="tag">
                                                    {cat.name || cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="detail-section">
                                        <h4>Location</h4>
                                        <p>
                                            {ngo.user?.location?.city},{" "}
                                            {ngo.user?.location?.state}
                                        </p>
                                    </div>

                                    {ngo.website && (
                                        <div className="detail-section">
                                            <h4>Website</h4>
                                            <a
                                                href={ngo.website}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {ngo.website}
                                            </a>
                                        </div>
                                    )}
                                </div>

                                <div className="ngo-actions">
                                    <button className="primary-button">
                                        Contact NGO
                                    </button>
                                    <button className="secondary-button">
                                        Learn More
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="recommendations-footer">
                    <button onClick={onRestart} className="secondary-button">
                        Retake Quiz
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NGORecommendations;
