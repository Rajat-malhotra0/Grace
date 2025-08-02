import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Trash2, Archive } from "lucide-react";
import "./AdminReportLog.css";

const mockReports = [
  {
    id: "r1",
    title: "Leaking tap in kitchen",
    description: "Tap has been leaking since yesterday evening.",
    category: "Facilities",
    urgency: "Medium",
    dateOfIncident: "2025-07-23",
    reportedBy: "Anita Sharma",
  },
  {
    id: "r2",
    title: "Shortage of diapers",
    description: "Running low on diapers in the children's room.",
    category: "Supplies",
    urgency: "High",
    dateOfIncident: "2025-07-24",
    reportedBy: "Rahul Verma",
  },
];

const AdminReportLog = () => {
  const [reports, setReports] = useState(mockReports);
  const [resolvedReports, setResolvedReports] = useState([]);
  const navigate = useNavigate();

  const removeReport = (id) => {
    const reportToResolve = reports.find((r) => r.id === id);
    if (reportToResolve) {
      const resolvedReport = {
        ...reportToResolve,
        resolvedOn: new Date().toISOString(),
      };
      setResolvedReports((prev) => [...prev, resolvedReport]);
      setReports((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleViewHistory = () => {
    navigate("/admin/report-history", {
      state: { reportHistory: resolvedReports },
    });
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
    <div className="report-log-container">
      <div className="report-header">
        <ClipboardList size={32} className="header-icon" />
        <h1 className="report-title">Daily Reports Log</h1>
        <p className="report-subtitle">
          Monitor and manage daily incident reports
        </p>
      </div>

      <div className="report-section">
        <div className="report-card">
          <div className="report-header-row">
            <span>Reported By</span>
            <span>Title</span>
            <span>Description</span>
            <span>Category</span>
            <span>Urgency</span>
            <span>Date of Incident</span>
            <span>Action</span>
          </div>

          {reports.map((report) => (
            <div key={report.id} className="report-row">
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
              <span data-label="Date of Incident">{report.dateOfIncident}</span>
              <button
                className="remove-btn"
                onClick={() => removeReport(report.id)}
                title="Mark as resolved"
              >
                <Trash2 size={16} />
                Resolve
              </button>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="empty-message">
              <ClipboardList size={48} className="empty-icon" />
              <h3>No Pending Reports</h3>
              <p>All reports have been resolved for today.</p>
            </div>
          )}
        </div>
      </div>

      <button className="view-history-btn_" onClick={handleViewHistory}>
        <Archive size={20} />
        View Report History
      </button>
    </div>
  );
};

export default AdminReportLog;
