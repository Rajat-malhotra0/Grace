//Route the button that says to show report history to this page
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, History, Calendar } from "lucide-react";
import "./AdminReportHistory.css";

const AdminReportHistory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const reportHistory = location.state?.reportHistory || [];

  const handleGoBack = () => {
    navigate(-1);
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "urgency-high";
      case "medium":
        return "urgency-medium";
      case "low":
        return "urgency-low";
      default:
        return "urgency-medium";
    }
  };

  return (
    <div className="report-history-container">
      <div className="history-header">
        <button className="back-btn" onClick={handleGoBack}>
          <ArrowLeft size={20} />
          Back to Reports
        </button>
        <History size={32} className="header-icon" />
        <h1 className="history-title">Report History</h1>
        <p className="history-subtitle">View all resolved incident reports</p>
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <Calendar size={24} />
          <div>
            <h3>Total Resolved</h3>
            <p>{reportHistory.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <History size={24} />
          <div>
            <h3>Last Resolved</h3>
            <p>
              {reportHistory.length > 0
                ? new Date(
                    reportHistory[reportHistory.length - 1].resolvedOn
                  ).toLocaleDateString()
                : "No reports"}
            </p>
          </div>
        </div>
      </div>

      <div className="history-section">
        <div className="history-card">
          {reportHistory.length === 0 ? (
            <div className="empty-message">
              <History size={48} className="empty-icon" />
              <h3>No Past Reports</h3>
              <p>Resolved reports will appear here.</p>
            </div>
          ) : (
            <>
              <div className="history-header-row">
                <span>Resolved On</span>
                <span>Reported By</span>
                <span>Title</span>
                <span>Description</span>
                <span>Category</span>
                <span>Urgency</span>
                <span>Date of Incident</span>
              </div>

              {reportHistory.map((report) => (
                <div key={report.id} className="history-row">
                  <span data-label="Resolved On">
                    {new Date(report.resolvedOn).toLocaleDateString()}
                  </span>
                  <span data-label="Reported By">{report.reportedBy}</span>
                  <span data-label="Title">{report.title}</span>
                  <span data-label="Description">{report.description}</span>
                  <span data-label="Category">{report.category}</span>
                  <span
                    data-label="Urgency"
                    className={getUrgencyClass(report.urgency)}
                  >
                    {report.urgency}
                  </span>
                  <span data-label="Date of Incident">
                    {report.dateOfIncident}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminReportHistory;
