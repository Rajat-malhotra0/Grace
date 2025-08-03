import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Quiz from "./Pages/Quiz/Quiz";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Profile from "./Pages/Profile/Profile";
import GraceFeed from "./Pages/Feed/Feed";
import MarketplaceInsights from "./Pages/MarketplaceInsights/MarketplaceInsights";
import Marketplace from "./Pages/Marketplace/Marketplace";
import Donation from "./Pages/Donation/Donation";
import Engagement from "./Pages/Engagement/Engagement";
import Volunteer from "./Pages/VolunteerInsights/volunteer";
import ImpactStories from "./Pages/Home/ImpactStories";
import GraceApp from "./Pages/Grace_App/Grace_App";
import NgoTeamDashboard from "./Pages/Dashboards/NgoTeam/NgoTeamDashboard";
import VolunteerDashboard from "./Pages/Dashboards/Volunteer/VolunteerDashboard";
import DonorDashboard from "./Pages/Dashboards/Donor/DonorDashboard"; 
import NgoAdminDashboard from "./Pages/Dashboards/NgoAdmin/NgoAdminDashboard";
import Achievements from "./Pages/Dashboards/NgoTeam/Achievements";
import Settings from "./Pages/Dashboards/NgoTeam/Settings";
import Notifications from "./Pages/Dashboards/NgoTeam/Notifications";
import CategoryNeeds from "./Pages/Marketplace/DonationNeeds/CategoryNeeds";
import AdminInventoryLog from "./Pages/Dashboards/NgoAdmin/AdminInventoryLog";
import AdminReportHistory from "./Pages/Dashboards/NgoAdmin/AdminReportHistory";


function Content() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/feed" element={<GraceFeed />} />
            <Route path="/Quiz" element={<Quiz />} />
            <Route
                path="/marketplaceInsights"
                element={<MarketplaceInsights />}
            />
            <Route path="/marketplace" element={<Marketplace />} />

            <Route
                path="/marketplace/:categoryTitle"
                element={<CategoryNeeds />}
            />

            <Route path="/donation" element={<Donation />} />
            <Route path="/engagement" element={<Engagement />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/volunteer" element={<Volunteer />} />
            <Route path="/impact-stories" element={<ImpactStories />} />
            <Route path="/grace-app" element={<GraceApp />} />
            <Route path="/dashboard/ngo-team" element={<NgoTeamDashboard />} />
            <Route path="/dashboard/volunteer" element={<VolunteerDashboard />} />
            <Route path="/dashboard/donor" element={<DonorDashboard />} />
            <Route path="/dashboard/admin" element={<NgoAdminDashboard />} />
            <Route
                path="/dashboard/ngo-team/achievements"
                element={<Achievements />}
            />
            <Route path="/dashboard/ngo-team/settings" element={<Settings />} />
            <Route
                path="/dashboard/ngo-team/notifications"
                element={<Notifications />}
            />
            <Route path="/admin/inventory-log" element={<AdminInventoryLog />} />
            <Route path="/admin/report-history" element={<AdminReportHistory />} />
        </Routes>
    );
}

export default Content;
