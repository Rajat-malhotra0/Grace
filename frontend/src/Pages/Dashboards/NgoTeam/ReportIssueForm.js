import React, { useState } from "react";
import "./ReportIssueForm.css";

const ReportIssueForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    urgency: "",
    description: "",
    date: "",
    contactPerson: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Report submitted:", formData);
    // Later: send to backend or store in database
  };

  return (
    <div className="report-form-card">
      <h3>Report an Issue</h3>
      <p className="report-subtext">
        <em>Let us know about any problem your NGO is facing.</em>
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Report Title</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="e.g., Volunteer No-Show"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="Volunteer Management">Volunteer Management</option>
            <option value="Donor Communication">Donor Communication</option>
            <option value="Inventory Problem">Inventory Problem</option>
            <option value="Event/Logistics">Event/Logistics</option>
            <option value="Internal Operations">Internal Operations</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group urgency-select">
          <label htmlFor="urgency">Urgency Level</label>
          <select
            id="urgency"
            name="urgency"
            value={formData.urgency}
            onChange={handleChange}
            required
          >
            <option value="">Select Urgency Level</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            placeholder="Describe the issue in detail..."
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="date">Date of Incident</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="contactPerson">Contact Person</label>
          <input
            type="text"
            id="contactPerson"
            name="contactPerson"
            placeholder="Contact Person (optional)"
            value={formData.contactPerson}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default ReportIssueForm;
