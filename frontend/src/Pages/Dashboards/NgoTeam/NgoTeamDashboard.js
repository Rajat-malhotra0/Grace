// src/Pages/Dashboards/Ngo/NgoDashboard.js
import React from "react";
import "./NgoTeamDashboard.css";

import ProfileHeader from "./ProfileHeader";
// import Overview from "./Overview";
// import Inventory from "./Inventory";
// import Events from "./Events";
// import Tasks from "./Tasks";
// import Volunteers from "./Volunteers";

const NgoDashboard = () => {
    return (
        <div className="ngo-dashboard">
            <ProfileHeader />

            {/* <Overview />

      <div className="ngo-grid">
        <Inventory />
        <Events />
        <Tasks />
        <Volunteers /> */}
            {/* </div> */}
        </div>
    );
};

export default NgoDashboard;
