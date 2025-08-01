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
        Let us know about any problem your NGO is facing.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Report Title (e.g., Volunteer No-Show)"
          value={formData.title}
          onChange={handleChange}
        />

        <select name="category" value={formData.category} onChange={handleChange}>
          <option value="">Select Category</option>
          <option value="Technical Issue">Technical Issue</option>
          <option value="Volunteer Management">Volunteer Management</option>
          <option value="Donor Communication">Donor Communication</option>
          <option value="Inventory Problem">Inventory Problem</option>
          <option value="Event/Logistics">Event/Logistics</option>
          <option value="Internal Operations">Internal Operations</option>
          <option value="Other">Other</option>
        </select>

        <select name="urgency" value={formData.urgency} onChange={handleChange}>
          <option value="">Select Urgency Level</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>

        <textarea
          name="description"
          rows="5"
          placeholder="Describe the issue in detail..."
          value={formData.description}
          onChange={handleChange}
        ></textarea>

        <label>Date of Incident</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
        />

        <input
          type="text"
          name="contactPerson"
          placeholder="Contact Person (optional)"
          value={formData.contactPerson}
          onChange={handleChange}
        />

        <button type="submit">Submit Report</button>
      </form>
    </div>
  );
};

export default ReportIssueForm;
