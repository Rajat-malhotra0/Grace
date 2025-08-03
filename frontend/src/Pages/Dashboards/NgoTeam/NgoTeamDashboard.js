import React from "react";
import Sidebar from "../../../Components/Sidebar";
import Banner from "../../../Components/Banner";
import TaskSection from "./TaskSection";
import InventoryLog from "./InventoryLog";
import "./NgoTeamDashboard.css";
import ReportIssueForm from "./ReportIssueForm";

const NgoTeamDashboard = () => {
  return (
    <div>
      <Sidebar />
      <div className="ngo-team-dashboard-main-container">
        <Banner />
        <TaskSection />
        <InventoryLog />
        <ReportIssueForm />
      </div>
    </div>
  );
};

export default NgoTeamDashboard;
