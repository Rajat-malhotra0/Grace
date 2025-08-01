//Route the button that says to show report history to this page
import React from 'react';
import './AdminInventoryDashboard.css';

const AdminReportHistory = ({ reportHistory }) => {
  return (
    <div className="inventory-dashboard">
      <h1 className="dashboard-title">🕓 Report History</h1>

      {reportHistory.length === 0 ? (
        <p className="empty-message">No past reports yet.</p>
      ) : (
        <div className="inventory-card">
          <div className="inventory-header-row">
            <span>Resolved On</span>
            <span>Reported By</span>
            <span>Title</span>
            <span>Description</span>
            <span>Category</span>
            <span>Urgency</span>
            <span>Date of Incident</span>
          </div>

          {reportHistory.map((report) => (
            <div key={report.id} className="inventory-row">
              <span>{new Date(report.resolvedOn).toLocaleDateString()}</span>
              <span>{report.reportedBy}</span>
              <span>{report.title}</span>
              <span>{report.description}</span>
              <span>{report.category}</span>
              <span>{report.urgency}</span>
              <span>{report.dateOfIncident}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReportHistory;
