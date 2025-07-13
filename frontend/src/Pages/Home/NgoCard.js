import React from 'react';
import './NgoCarousel.css';
import { Heart, Users, Target } from 'lucide-react';

const NgoCard = ({ ngo }) => {
  return (
    <div className="ngo-card">
      <div className="ngo-img">
        <img src={ngo.image} alt={ngo.name} />
      </div>
      <div className="ngo-info">
        <h3>{ngo.name}</h3>
        <p className="mission">{ngo.mission}</p>
        <div className="ngo-stats">
          <span><Users size={18} /> Volunteers Needed: {ngo.volunteersNeeded}</span>
          <span><Target size={18} /> Donation Goal: ${ngo.donationGoal.toLocaleString()}</span>
        </div>
        <div className="ngo-actions">
          <button className="btn donate"><Heart size={16} /> Donate</button>
          <button className="btn volunteer"><Users size={16} /> Volunteer</button>
        </div>
      </div>
    </div>
  );
};

export default NgoCard;
