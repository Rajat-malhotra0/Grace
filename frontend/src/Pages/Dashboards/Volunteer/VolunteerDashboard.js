import React from "react";
import "./VolunteerDashboard.css";
import Sidebar from "../../../Components/Sidebar";
import Banner from "../../../Components/Banner";
import VolunteerGoalSection from "./VolunteerGoalSection";
import CausesCarousel from "./CausesCarousel.js";

const VolunteerDashboard = () => {
  return (
    <div>
      <Sidebar />
      <div className="dashboard-main-container">
        <Banner />
        <VolunteerGoalSection />
        <CausesCarousel />
        {/* Add other sections as needed */}
      </div>
    </div>
  );
};

export default VolunteerDashboard;