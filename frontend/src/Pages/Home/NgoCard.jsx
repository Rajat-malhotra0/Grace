import React from "react";
import { useNavigate } from "react-router-dom";
import "./NgoCarousel.css";
import { Heart, Users, Target, MapPin, Tag } from "lucide-react";
import defaultNgoImage from "../../assets/ngo-placeholder.jpg";

const NgoCard = ({ ngo, onDonateClick }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        // Navigate directly using the database ID
        navigate(`/ngo/${ngo._id}`);
    };

    const handleDonateClick = (e) => {
        e.stopPropagation(); // Prevent card click when donate button is clicked
        if (onDonateClick) {
            onDonateClick(ngo);
        }
    };

    const handleVolunteerClick = (e) => {
        e.stopPropagation(); // Prevent card click when volunteer button is clicked
        // You can add volunteer functionality here later
        console.log(`Volunteer for ${ngo.name}`);
    };

    // Helper to safely get categories
    const getCategories = () => {
        if (!ngo.category) return [];
        return Array.isArray(ngo.category) ? ngo.category : [ngo.category];
    };

    return (
        <div className="ngo-card-v2" onClick={handleCardClick}>
            <div className="ngo-img-v2">
                <img
                    src={
                        ngo.image ||
                        ngo.coverImage?.url ||
                        defaultNgoImage
                    }
                    alt={ngo.name}
                    onError={(e) => {
                        e.target.src = defaultNgoImage;
                    }}
                />
                {ngo.isFeatured && (
                    <div className="ngo-featured-badge">
                        <span>⭐ Featured</span>
                    </div>
                )}
            </div>
            <div className="ngo-details-v2">
                <div className="ngo-header-row">
                    <h3>{ngo.name}</h3>
                    {ngo.city && (
                        <span className="ngo-location">
                            <MapPin size={14} /> {ngo.city}
                        </span>
                    )}
                </div>

                <div className="ngo-tags">
                    {getCategories().slice(0, 3).map((cat, idx) => (
                        <span key={idx} className="ngo-tag">
                            <Tag size={12} /> {cat.name || cat}
                        </span>
                    ))}
                </div>

                <p className="mission">{ngo.mission || ngo.description}</p>
                
                <div className="ngo-stats">
                    <div className="stat-item">
                        <Users size={16} />
                        <span>{ngo.volunteersNeeded || 0} Volunteers Needed</span>
                    </div>
                    <div className="stat-item">
                        <Target size={16} />
                        <span>₹{(ngo.donationGoal || 0).toLocaleString("en-IN")} Goal</span>
                    </div>
                </div>
                
                <div className="ngo-actions">
                    <button 
                        className="btn donate" 
                        onClick={(e) => { e.stopPropagation(); }} 
                        disabled 
                        style={{ opacity: 0.6, cursor: 'not-allowed' }}
                        title="Donations are temporarily unavailable"
                    >
                        <Heart size={16} /> Donate
                    </button>
                    <button
                        className="btn volunteer"
                        onClick={handleVolunteerClick}
                    >
                        <Users size={16} /> Volunteer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NgoCard;
