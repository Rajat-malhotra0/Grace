// src/Pages/Dashboards/Ngo/ProfileHeader.js
import React from "react";
import "./ProfileHeader.css";
import profileIcon from "../../../assets/profile-icon.png"; // You can replace this with your actual image later

const ProfileHeader = () => {
  return (
    <div className="profile-header">
      <img src={profileIcon} alt="Profile" className="profile-image" />
      <h2 className="profile-name">Aditi Singh</h2>
      <p className="ngo-name">LilyPad Care Foundation</p>
      <p className="ngo-location">New Delhi, India</p>
      <div className="profile-actions">
        <button className="edit-btn">Edit Profile</button>
        <button className="share-btn">Share Profile</button>
      </div>
    </div>
  );
};

export default ProfileHeader;
