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
import OpportunityEmailUpdates from "./OpportunityEmailUpdates";
import DonationNeedsForm from "./DonationNeedsForm";
import ImpactStoryForm from "./ImpactStoryForm";

const NgoAdminDashboard = () => {
    return (
        <div className="ngo-admin-dashboard">
            <Sidebar />
            <div className="dashboard-main-container">
                <Banner />
                
                <div className="dashboard-content">
                    {/* Task Management Section */}
                    <div className="dashboard-section">
                        <h2 className="section-header">Task Management</h2>
                        <div className="section-grid">
                            <div className="grid-item full-width">
                                <NgoAdminTaskBoard />
                            </div>
                            <div className="grid-item full-width">
                                <ExtraTasksBoard />
                            </div>
                        </div>
                    </div>

                    {/* Operations Section */}
                    <div className="dashboard-section">
                        <h2 className="section-header">Operations & Inventory</h2>
                        <div className="section-grid">
                            <div className="grid-item full-width widget-container">
                                <AdminInventoryDashboard />
                            </div>
                            <div className="grid-item full-width widget-container">
                                <AdminReportLog />
                            </div>
                        </div>
                    </div>

                    {/* Volunteer Management Section */}
                    <div className="dashboard-section">
                        <h2 className="section-header">Volunteer Management</h2>
                        <div className="section-grid">
                            <div className="grid-item widget-container">
                                <VolunteerOpportunities />
                            </div>
                            <div className="grid-item widget-container">
                                <VolunteerApplications />
                            </div>
                            <div className="grid-item widget-container">
                                <OpportunityEmailUpdates />
                            </div>
                        </div>
                    </div>

                    {/* Content & Forms Section */}
                    <div className="dashboard-section">
                        <h2 className="section-header">Updates & Stories</h2>
                        <div className="section-grid">
                            <div className="grid-item">
                                <DonationNeedsForm />
                            </div>
                            <div className="grid-item">
                                <ImpactStoryForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NgoAdminDashboard;
