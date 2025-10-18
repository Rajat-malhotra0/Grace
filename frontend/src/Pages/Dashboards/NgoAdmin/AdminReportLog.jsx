import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Trash2, Archive } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthContext";
import "./AdminReportLog.css";

const AdminReportLog = () => {
    const [reports, setReports] = useState([]);
    const [resolvedReports, setResolvedReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { ngo, token } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReports = async () => {
            if (!ngo?._id) {
                setError(
                    "NGO information not available. Please refresh the page."
                );
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(
                    `http://localhost:3001/api/ngo-reports?status=pending&ngo=${ngo._id}`,
                    {
                        headers: {
                            Authorization: token,
                        },
                    }
                );

                const pendingReports = response.data.result || response.data;

                const transformedReports = pendingReports.map((report) => ({
                    id: report._id,
                    title: report.title,
                    description: report.description,
                    category: report.category,
                    urgency: report.urgency,
                    dateOfIncident: new Date(
                        report.dateOfIncident
                    ).toLocaleDateString(),
                    reportedBy: report.reportedBy,
                }));

                setReports(transformedReports);
                setError(null);
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError("Failed to load reports. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [ngo, token]);

    const removeReport = async (id) => {
        try {
            const reportToResolve = reports.find((r) => r.id === id);
            if (!reportToResolve) return;

            await axios.put(
                `http://localhost:3001/api/ngo-reports/${id}/resolve`,
                {},
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            const resolvedReportFormatted = {
                ...reportToResolve,
                resolvedOn: new Date().toISOString(),
            };
            setResolvedReports((prev) => [...prev, resolvedReportFormatted]);

            // Remove from pending reports
            setReports((prev) => prev.filter((r) => r.id !== id));
        } catch (err) {
            console.error("Error resolving report:", err);
            setError("Failed to resolve report. Please try again.");
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

            {error && (
                <div
                    className="error-message"
                    style={{
                        color: "red",
                        padding: "10px",
                        marginBottom: "20px",
                        backgroundColor: "#ffe6e6",
                        borderRadius: "5px",
                        border: "1px solid #ff9999",
                    }}
                >
                    {error}
                </div>
            )}

            {loading ? (
                <div
                    className="loading-container"
                    style={{
                        textAlign: "center",
                        padding: "40px",
                        fontSize: "18px",
                    }}
                >
                    <p>Loading reports...</p>
                </div>
            ) : (
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
                                <span data-label="Reported By">
                                    {report.reportedBy}
                                </span>
                                <span data-label="Title">{report.title}</span>
                                <span data-label="Description">
                                    {report.description}
                                </span>
                                <span data-label="Category">
                                    {report.category}
                                </span>
                                <span
                                    data-label="Urgency"
                                    className={getUrgencyClass(report.urgency)}
                                >
                                    {report.urgency}
                                </span>
                                <span data-label="Date of Incident">
                                    {report.dateOfIncident}
                                </span>
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

                        {reports.length === 0 && !loading && (
                            <div className="empty-message">
                                <ClipboardList
                                    size={48}
                                    className="empty-icon"
                                />
                                <h3>No Pending Reports</h3>
                                <p>All reports have been resolved for today.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <button className="view-history-btn_" onClick={handleViewHistory}>
                <Archive size={20} />
                View Report History
            </button>
        </div>
    );
};

export default AdminReportLog;
