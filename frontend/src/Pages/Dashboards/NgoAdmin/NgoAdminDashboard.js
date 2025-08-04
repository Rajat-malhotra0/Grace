import React from "react";
import "./NgoAdminDashboard.css";
import Sidebar from "../../../Components/Sidebar";
import Banner from "../../../Components/Banner";
import NgoAdminTaskBoard from "./NgoAdminTaskBoard";
import ExtraTasksBoard from "./ExtraTasksBoard";
import AdminInventoryDashboard from "./AdminInventoryDashboard";
import AdminReportLog from "./AdminReportLog";
import VolunteerOpportunities from "./VolunteerOpportunities";
import VolunteerApplications from "./VolunteerApplications";
import DonationNeedsForm from "./DonationNeedsForm";
import ImpactStoryForm from "./ImpactStoryForm";

const NgoAdminDashboard = () => {
    return (
        <div>
            <Sidebar />
            <div className="dashboard-main-container">
                <Banner />
                <NgoAdminTaskBoard />
                <ExtraTasksBoard />
                <AdminInventoryDashboard />
                <AdminReportLog />
                <VolunteerOpportunities />
                <VolunteerApplications />
                <DonationNeedsForm />
                <ImpactStoryForm />
            </div>
        </div>
    );
};

export default NgoAdminDashboard;
