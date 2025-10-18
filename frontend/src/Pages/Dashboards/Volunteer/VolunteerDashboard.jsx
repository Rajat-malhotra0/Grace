import React from "react";
import "./VolunteerDashboard.css";
import Sidebar from "../../../Components/Sidebar.jsx";
import Banner from "../../../Components/Banner.jsx";
import VolunteerGoalSection from "./VolunteerGoalSection.jsx";
import CausesCarousel from "./CausesCarousel.jsx";
import SupportedNgos from "./SupportedNgos.jsx";
import NgoCarousel from "../../Home/NgoCarousel.jsx";
import SkillsInterests from "./SkillsInterests.jsx";
import VolunteerAnalytics from "./VolunteerAnalytics.jsx";
import VolunteerTimeline from "./VolunteerTimeline.jsx";
import GlobalLeaderboard from "./GlobalLeaderboard.jsx";
import ImpactStories from "../../Home/ImpactStories.jsx";
import QuizSection from "../../Home/QuizSection.jsx";
import FeedbackBox from "./FeedbackBox.jsx";

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
