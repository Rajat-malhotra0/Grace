import React, { useState } from 'react';
import './AdminInventoryDashboard.css';

const mockReports = [
  {
    id: 'r1',
    title: 'Leaking tap in kitchen',
    description: 'Tap has been leaking since yesterday evening.',
    category: 'Facilities',
    urgency: 'Medium',
    dateOfIncident: '2025-07-23',
    reportedBy: 'Anita Sharma'
  },
  {
    id: 'r2',
    title: 'Shortage of diapers',
    description: 'Running low on diapers in the children’s room.',
    category: 'Supplies',
    urgency: 'High',
    dateOfIncident: '2025-07-24',
    reportedBy: 'Rahul Verma'
  }
];

const AdminReportLog = () => {
  const [reports, setReports] = useState(mockReports);

  const removeReport = (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="inventory-dashboard">
      <h1 className="dashboard-title">📋 Daily Reports Log</h1>

      <div className="inventory-card">
        <div className="inventory-header-row">
          <span>Reported By</span>
          <span>Title</span>
          <span>Description</span>
          <span>Category</span>
          <span>Urgency</span>
          <span>Date of Incident</span>
          <span>Action</span>
        </div>

        {reports.map((report) => (
          <div key={report.id} className="inventory-row">
            <span>{report.reportedBy}</span>
            <span>{report.title}</span>
            <span>{report.description}</span>
            <span>{report.category}</span>
            <span>{report.urgency}</span>
            <span>{report.dateOfIncident}</span>
            <button onClick={() => removeReport(report.id)}>🗑️ Remove</button>
          </div>
        ))}

        {reports.length === 0 && (
          <p className="empty-message">✅ No pending reports left for today.</p>
        )}
      </div>

      <button className="view-used-btn" onClick={() => alert('Navigate to report history page')}>
        🕓 View Report History
      </button>
    </div>
  );
};

export default AdminReportLog;

/*
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminInventoryDashboard.css';

const mockReports = [
  {
    id: 'r1',
    title: 'Leaking tap in kitchen',
    description: 'Tap has been leaking since yesterday evening.',
    category: 'Facilities',
    urgency: 'Medium',
    dateOfIncident: '2025-07-23',
    reportedBy: 'Anita Sharma'
  },
  {
    id: 'r2',
    title: 'Shortage of diapers',
    description: 'Running low on diapers in the children’s room.',
    category: 'Supplies',
    urgency: 'High',
    dateOfIncident: '2025-07-24',
    reportedBy: 'Rahul Verma'
  }
];

const AdminReportLog = ({ setReportHistory }) => {
  const [reports, setReports] = useState(mockReports);
  const navigate = useNavigate();

  const removeReport = (report) => {
    const resolvedReport = {
      ...report,
      resolvedOn: new Date().toISOString()
    };
    setReportHistory(prev => [...prev, resolvedReport]);
    setReports(prev => prev.filter(r => r.id !== report.id));
  };

  return (
    <div className="inventory-dashboard">
      <h1 className="dashboard-title">📋 Daily Reports Log</h1>

      <div className="inventory-card">
        <div className="inventory-header-row">
          <span>Reported By</span>
          <span>Title</span>
          <span>Description</span>
          <span>Category</span>
          <span>Urgency</span>
          <span>Date of Incident</span>
          <span>Action</span>
        </div>

        {reports.map((report) => (
          <div key={report.id} className="inventory-row">
            <span>{report.reportedBy}</span>
            <span>{report.title}</span>
            <span>{report.description}</span>
            <span>{report.category}</span>
            <span>{report.urgency}</span>
            <span>{report.dateOfIncident}</span>
            <button onClick={() => removeReport(report)}>🗑️ Remove</button>
          </div>
        ))}

        {reports.length === 0 && (
          <p className="empty-message">✅ No pending reports left for today.</p>
        )}
      </div>

      <button className="view-used-btn" onClick={() => navigate('/admin/report-history')}>
        🕓 View Report History
      </button>
    </div>
  );
};

export default AdminReportLog;
//used to send the reports to report history
*/