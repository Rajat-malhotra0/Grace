import React, { useState, useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import { withApiBase } from "config";
import "./ReportIssueForm.css";

const ReportIssueForm = () => {
    const { user, ngo, token } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: "",
        category: "",
        urgency: "",
        description: "",
        date: "",
        contactPerson: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState("");

    // Get NGO ID - either from owned NGO or user's associated NGO
    const getNgoId = () => {
        if (user?.role?.includes("ngo") && ngo?._id) {
            return ngo._id; // User owns an NGO
        } else if (user?.ngoId) {
            return user.ngoId; // User is associated with an NGO
        }
        return null;
    };

    // Get NGO name for display
    const getNgoName = () => {
        if (user?.role?.includes("ngo") && ngo?.name) {
            return ngo.name; // User owns an NGO
        } else if (user?.ngoName) {
            return user.ngoName; // User is associated with an NGO
        }
        return null;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !token) {
            setSubmitMessage("Please log in to submit a report.");
            return;
        }

        const ngoId = getNgoId();
        if (!ngoId) {
            setSubmitMessage(
                "NGO information not found. Please ensure you are associated with an NGO or contact support."
            );
            return;
        }

        setIsSubmitting(true);
        setSubmitMessage("");

        try {
            const reportData = {
                title: formData.title,
                description: formData.description,
                category: formData.category,
                urgency: formData.urgency,
                dateOfIncident: formData.date,
                reportedBy:
                    formData.contactPerson || user.userName || user.email,
                ngo: ngoId,
                reportedByUser: user._id,
            };

            console.log("Submitting report data:", reportData);

            const response = await axios.post(
                withApiBase("/api/ngo-reports"),
                reportData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: token,
                    },
                }
            );

            if (response.data.success) {
                setSubmitMessage(
                    "Report submitted successfully! Your report has been sent to the NGO administration."
                );
                // Reset form
                setFormData({
                    title: "",
                    category: "",
                    urgency: "",
                    description: "",
                    date: "",
                    contactPerson: "",
                });
            } else {
                setSubmitMessage("Failed to submit report. Please try again.");
            }
        } catch (error) {
            console.error("Error submitting report:", error);
            let errorMessage = "An error occurred while submitting the report.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (
                error.response?.data?.errors &&
                error.response.data.errors.length > 0
            ) {
                errorMessage = error.response.data.errors[0].msg;
            }

            setSubmitMessage(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="report-form-card">
            <h3>Report an Issue</h3>
            <p className="report-subtext">
                <em>Let us know about any problem your NGO is facing.</em>
            </p>

            {/* NGO Information Display */}
            {(getNgoId() || getNgoName()) && (
                <div className="ngo-info-display">
                    <p>
                        <strong>Reporting for:</strong>{" "}
                        {getNgoName() || `NGO (ID: ${getNgoId()})`}
                    </p>
                </div>
            )}

            {submitMessage && (
                <div
                    className={`submit-message ${
                        submitMessage.includes("success") ? "success" : "error"
                    }`}
                >
                    {submitMessage}
                </div>
            )}

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
                        <option value="Facilities">Facilities</option>
                        <option value="Supplies">Supplies</option>
                        <option value="Personnel">Personnel</option>
                        <option value="Safety">Safety</option>
                        <option value="Technology">Technology</option>
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

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Report"}
                </button>
            </form>
        </div>
    );
};

export default ReportIssueForm;
