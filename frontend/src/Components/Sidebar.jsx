import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import profileIcon from "../assets/profile-icon.jpg";
import { AuthContext } from "../Context/AuthContext";
import { Menu, X } from "lucide-react";

const Sidebar = () => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);
    const closeSidebar = () => setIsOpen(false);

    return (
        <>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className={`sidebar ${isOpen ? "open" : ""}`}>
                <div className="sidebar-header">
                    <h2 className="app-name">Grace</h2>
                </div>

                <div className="sidebar-section">
                    <Link to="/" onClick={closeSidebar}>Home</Link>
                    <Link to="/#services" onClick={closeSidebar}>Services</Link>
                    <Link to="/about" onClick={closeSidebar}>About</Link>
                    <Link to="/feed" onClick={closeSidebar}>Feed</Link>
                </div>

                <div className="sidebar-section">
                    <Link to="/dashboard/ngo-team/achievements" onClick={closeSidebar}>Achievements</Link>
                    <Link to="/dashboard/ngo-team/settings" onClick={closeSidebar}>Settings</Link>
                    <Link to="/dashboard/ngo-team/notifications" onClick={closeSidebar}>
                        Notifications
                    </Link>
                </div>

                <Link to="/profile" className="sidebar-profile" onClick={closeSidebar}>
                    <img src={profileIcon} alt="Profile" className="profile-pic" />
                    <span className="profile-name">
                        {isAuthenticated && user?.userName
                            ? user.userName
                            : "Guest"}
                    </span>
                </Link>
            </div>
            {isOpen && <div className="sidebar-overlay" onClick={closeSidebar}></div>}
        </>
    );
};

export default Sidebar;
