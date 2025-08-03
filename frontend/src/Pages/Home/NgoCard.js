import React from "react";
import { useNavigate } from "react-router-dom";
import "./NgoCarousel.css";
import { Heart, Users, Target } from "lucide-react";

const NgoCard = ({ ngo, onDonateClick }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // Navigate to individual NGO page using the NGO's ID or slug
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

  return (
    <div className="ngo-card" onClick={handleCardClick}>
      <div className="ngo-img">
        <img src={ngo.image || ngo.coverImage?.url} alt={ngo.name} />
      </div>
      <div className="ngo-info_">
        <h3>{ngo.name}</h3>
        <p className="mission">{ngo.mission || ngo.description}</p>
        <div className="ngo-stats">
          <span>
            <Users size={18} /> Volunteers Needed: {ngo.volunteersNeeded}
          </span>
          <span>
            <Target size={18} /> Donation Goal: $
            {ngo.donationGoal.toLocaleString()}
          </span>
        </div>
        <div className="ngo-actions">
          <button className="btn donate" onClick={handleDonateClick}>
            <Heart size={16} /> Donate
          </button>
          <button className="btn volunteer" onClick={handleVolunteerClick}>
            <Users size={16} /> Volunteer
          </button>
        </div>
      </div>
    </div>
  );
};

export default NgoCard;
