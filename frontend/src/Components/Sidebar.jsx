import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import profileIcon from "../assets/profile-icon.jpg";
import { AuthContext } from "../Context/AuthContext";

const Sidebar = () => {
    const { user, isAuthenticated } = useContext(AuthContext);

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2 className="app-name">Grace</h2>
            </div>

            <div className="sidebar-section">
                <Link to="/">Home</Link>
                <Link to="/#services">Services</Link>
                <Link to="/about">About</Link>
                <Link to="/feed">Feed</Link>
            </div>

            <div className="sidebar-section">
                <Link to="/dashboard/ngo-team/achievements">Achievements</Link>
                <Link to="/dashboard/ngo-team/settings">Settings</Link>
                <Link to="/dashboard/ngo-team/notifications">
                    Notifications
                </Link>
            </div>

            <Link to="/profile" className="sidebar-profile">
                <img src={profileIcon} alt="Profile" className="profile-pic" />
                <span className="profile-name">
                    {isAuthenticated && user?.userName
                        ? user.userName
                        : "Guest"}
                </span>
            </Link>
        </div>
    );
};

export default Sidebar;
