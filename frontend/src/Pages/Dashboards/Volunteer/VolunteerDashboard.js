import React from "react";
import "./VolunteerDashboard.css";
import Sidebar from "../../../Components/Sidebar";
import Banner from "../../../Components/Banner";
import VolunteerGoalSection from "./VolunteerGoalSection";
import CausesCarousel from "./CausesCarousel.js";
import SupportedNgos from "./SupportedNgos.js";
import NgoCarousel from "../../Home/NgoCarousel.js";
import SkillsInterests from "./SkillsInterests.js";
import VolunteerAnalytics from "./VolunteerAnalytics.js";
import VolunteerTimeline from "./VolunteerTimeline.js";
import GlobalLeaderboard from "./GlobalLeaderboard.js";
import ImpactStories from "../../Home/ImpactStories.js";
import QuizSection from "../../Home/QuizSection.js";
import FeedbackBox from "./FeedbackBox.js";

const VolunteerDashboard = () => {
  return (
    <div>
      <Sidebar />
      <div className="dashboard-main-container">
        <Banner />
        <SkillsInterests />
        <div className="carousels-row">
          <CausesCarousel />
          <SupportedNgos />
        </div>
        <VolunteerAnalytics />
        <VolunteerTimeline />
        
        <VolunteerGoalSection />
        <NgoCarousel />

        <div className="dashboard-section">
          <QuizSection />
          <ImpactStories />
        </div>
        <GlobalLeaderboard />
        <FeedbackBox />
      </div>
    </div>
  );
};

export default VolunteerDashboard;
