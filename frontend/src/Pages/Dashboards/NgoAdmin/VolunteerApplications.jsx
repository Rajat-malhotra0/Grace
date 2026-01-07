// AdminVolunteerApplications.js
import React, { useState, useEffect, useContext } from "react";
import {
    Search,
    Filter,
    Mail,
    Users,
    Award,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
} from "lucide-react";
import { AuthContext } from "../../../Context/AuthContext";
import {
    getNgoApplications,
    updateApplicationStatus,
} from "../../../services/volunteerApplicationService";
import "./VolunteerApplications.css";

const VolunteerApplications = () => {
    const { ngo } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState("All");
    const [processingId, setProcessingId] = useState(null);
    const [showHistory, setShowHistory] = useState(false);

    // Debug: Log NGO data
    useEffect(() => {
        console.log("=== NGO Data Debug ===");
        console.log("NGO from context:", ngo);
        console.log(
            "User from localStorage:",
            JSON.parse(localStorage.getItem("user") || "{}")
        );
        console.log("Token exists:", !!localStorage.getItem("token"));
        console.log("=====================");
    }, [ngo]);

    const loadApplications = async () => {
        if (!ngo || !ngo._id) {
            setError(
                "NGO information not found. Please logout and login again to refresh your session."
            );
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            console.log("Loading applications for NGO:", {
                ngoId: ngo._id,
                ngoName: ngo.name,
                ngoUser: ngo.user,
                hasToken: !!localStorage.getItem("token"),
            });

            const response = await getNgoApplications(ngo._id);

            console.log("Applications response:", response);

            if (response.success) {
                setApplications(response.result || []);
            } else {
                // If unauthorized, provide helpful message
                if (response.message?.includes("Unauthorized")) {
                    setError(
                        "Access denied. Please logout and login again to refresh your NGO session. " +
                            "If the problem persists, ensure you are logged in with the correct NGO admin account."
                    );
                } else {
                    setError(response.message || "Failed to load applications");
                }
            }
        } catch (err) {
            console.error("Error loading applications:", err);
            console.error("Error details:", {
                message: err.message,
                response: err.response?.data,
                ngoId: ngo._id,
            });

            // Provide helpful error message
            if (
                err.message?.includes("403") ||
                err.message?.includes("Unauthorized")
            ) {
                setError(
                    "Authorization failed. This usually means:\n\n" +
                        "1. Your session needs to be refreshed - Please logout and login again\n" +
                        "2. You're not logged in as the NGO owner\n" +
                        "3. Your authentication token has expired\n\n" +
                        "Please try logging out and logging back in."
                );
            } else {
                setError(
                    err.message || "Failed to load volunteer applications"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ngo]);

    const handleAccept = async (applicationId) => {
        if (
            !window.confirm(
                "Are you sure you want to accept this application? The volunteer will become a member of your NGO."
            )
        ) {
            return;
        }

        try {
            setProcessingId(applicationId);
            const response = await updateApplicationStatus(
                applicationId,
                "accepted"
            );

            if (response.success) {
                // Update the local state
                setApplications((prev) =>
                    prev.map((app) =>
                        app._id === applicationId
                            ? {
                                  ...app,
                                  status: "accepted",
                                  reviewedAt: new Date(),
                              }
                            : app
                    )
                );
                alert(
                    "✓ Application accepted successfully! The volunteer has been notified via email."
                );
            } else {
                alert("Failed to accept application: " + response.message);
            }
        } catch (err) {
            console.error("Error accepting application:", err);
            alert("Error: " + (err.message || "Failed to accept application"));
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (applicationId) => {
        if (
            !window.confirm("Are you sure you want to reject this application?")
        ) {
            return;
        }

        try {
            setProcessingId(applicationId);
            const response = await updateApplicationStatus(
                applicationId,
                "rejected"
            );

            if (response.success) {
                // Update the local state
                setApplications((prev) =>
                    prev.map((app) =>
                        app._id === applicationId
                            ? {
                                  ...app,
                                  status: "rejected",
                                  reviewedAt: new Date(),
                              }
                            : app
                    )
                );
                alert(
                    "Application rejected. The applicant has been notified via email."
                );
            } else {
                alert("Failed to reject application: " + response.message);
            }
        } catch (err) {
            console.error("Error rejecting application:", err);
            alert("Error: " + (err.message || "Failed to reject application"));
        } finally {
            setProcessingId(null);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilterStatus(e.target.value);
    };

    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            app.user?.userName
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            app.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.opportunityTitle
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "All" || app.status === filterStatus;

        // If not showing history, hide accepted and rejected applications
        const matchesHistoryView = showHistory
            ? true // Show all when in history mode
            : app.status === "pending"; // Only show pending when not in history mode

        return matchesSearch && matchesStatus && matchesHistoryView;
    });

    // Count pending, accepted, and rejected applications
    const pendingCount = applications.filter(
        (app) => app.status === "pending"
    ).length;
    const acceptedCount = applications.filter(
        (app) => app.status === "accepted"
    ).length;
    const rejectedCount = applications.filter(
        (app) => app.status === "rejected"
    ).length;

    const getStatusBadge = (status) => {
        switch (status) {
            case "pending":
                return (
                    <span className="status-badge status-pending">
                        <Clock size={14} />
                        Pending
                    </span>
                );
            case "accepted":
                return (
                    <span className="status-badge status-accepted">
                        <CheckCircle size={14} />
                        Accepted
                    </span>
                );
            case "rejected":
                return (
                    <span className="status-badge status-rejected">
                        <XCircle size={14} />
                        Rejected
                    </span>
                );
            default:
                return null;
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="volunteer-applications-container">
                <div className="loading-state">
                    <Clock size={48} className="loading-icon" />
                    <h3>Loading Applications...</h3>
                    <p>Please wait while we fetch the volunteer applications</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="volunteer-applications-container">
                <div className="error-state">
                    <AlertCircle size={48} className="error-icon" />
                    <h3>Error Loading Applications</h3>
                    <p>{error}</p>
                    <button className="retry-btn" onClick={loadApplications}>
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="volunteer-applications-container">
            <div className="applications-header">
                <Users size={32} className="header-icon" />
                <h1 className="applications-title">
                    {showHistory
                        ? "Application History"
                        : "Volunteer Applications"}
                </h1>
                <p className="applications-subtitle">
                    {showHistory
                        ? "View all processed volunteer applications"
                        : "Review and manage pending volunteer applications"}
                </p>
            </div>

            <div className="applications-filters">
                <div className="filter-group">
                    <div className="input-with-icon">
                        <Search size={16} className="input-icon" />
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="Search by name, skill, or interest"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>
                </div>

                <div className="filter-group">
                    <div className="input-with-icon">
                        <Filter size={16} className="input-icon" />
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={handleFilterChange}
                        >
                            <option value="All">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="applications-section">
                <div className="applications-grid">
                    {filteredApplications.length === 0 ? (
                        <div className="empty-message">
                            <p>
                                {applications.length === 0
                                    ? "No volunteer applications have been received yet."
                                    : showHistory
                                    ? "No applications match your current filters."
                                    : pendingCount === 0
                                    ? "No pending applications at this time. Great work reviewing all applications!"
                                    : "No applications match your search criteria."}
                            </p>
                        </div>
                    ) : (
                        filteredApplications.map((app) => (
                            <div
                                className={`application-card ${
                                    app.status === "accepted"
                                        ? "accepted-card"
                                        : ""
                                }`}
                                key={app._id}
                            >
                                <div className="application-header">
                                    <div className="applicant-info">
                                        <h3 className="applicant-name">
                                            {app.user?.userName ||
                                                "Unknown User"}
                                        </h3>
                                        {getStatusBadge(app.status)}
                                    </div>
                                </div>

                                <div className="application-content">
                                    <div className="info-row">
                                        <Mail size={16} className="info-icon" />
                                        <span className="info-label">
                                            Email:
                                        </span>
                                        <span className="info-value">
                                            {app.user?.email || "N/A"}
                                        </span>
                                    </div>

                                    <div className="info-row">
                                        <Award
                                            size={16}
                                            className="info-icon"
                                        />
                                        <span className="info-label">
                                            Opportunity:
                                        </span>
                                        <span className="info-value">
                                            {app.opportunityTitle}
                                        </span>
                                    </div>

                                    <div className="info-row">
                                        <Clock
                                            size={16}
                                            className="info-icon"
                                        />
                                        <span className="info-label">
                                            Applied On:
                                        </span>
                                        <span className="info-value">
                                            {formatDate(app.appliedAt)}
                                        </span>
                                    </div>

                                    {app.message && (
                                        <div className="message-section">
                                            <h4 className="section-title">
                                                Applicant Message
                                            </h4>
                                            <p className="message-text">
                                                {app.message}
                                            </p>
                                        </div>
                                    )}

                                    {app.user?.about && (
                                        <div className="bio-section">
                                            <h4 className="section-title">About the Applicant</h4>
                                            <p className="bio-text">{app.user.about}</p>
                                        </div>
                                    )}

                                    {app.user?.leaderboardStats && (
                                        <div className="stats-section">
                                            <h4 className="section-title">Volunteer Impact</h4>
                                            <div className="mini-stats-grid">
                                                <div className="mini-stat">
                                                    <span className="mini-stat-value">{app.user.leaderboardStats.hours || 0}</span>
                                                    <span className="mini-stat-label">Hours</span>
                                                </div>
                                                <div className="mini-stat">
                                                    <span className="mini-stat-value">{app.user.leaderboardStats.tasksCompleted || 0}</span>
                                                    <span className="mini-stat-label">Tasks</span>
                                                </div>
                                                <div className="mini-stat">
                                                    <span className="mini-stat-value">{app.user.leaderboardStats.impactScore || 0}</span>
                                                    <span className="mini-stat-label">Impact</span>
                                                </div>
                                                 <div className="mini-stat">
                                                    <span className="mini-stat-value">{app.user.leaderboardStats.level || "Beginner"}</span>
                                                    <span className="mini-stat-label">Level</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {app.user?.location && (
                                        <div className="location-section">
                                            <h4 className="section-title">
                                                Location
                                            </h4>
                                            <p className="location-text">
                                                {app.user.location.city &&
                                                app.user.location.state
                                                    ? `${app.user.location.city}, ${app.user.location.state}`
                                                    : app.user.location.city ||
                                                      app.user.location.state ||
                                                      "Not provided"}
                                            </p>
                                        </div>
                                    )}

                                    {app.reviewedAt && (
                                        <div className="info-row">
                                            <CheckCircle
                                                size={16}
                                                className="info-icon"
                                            />
                                            <span className="info-label">
                                                Reviewed On:
                                            </span>
                                            <span className="info-value">
                                                {formatDate(app.reviewedAt)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="application-actions">
                                    {/* Pending State: Show Accept and Reject */}
                                    {app.status === "pending" && (
                                        <>
                                            <button
                                                className="action-btn accept-btn"
                                                onClick={() =>
                                                    handleAccept(app._id)
                                                }
                                                disabled={
                                                    processingId === app._id
                                                }
                                            >
                                                <CheckCircle size={16} />
                                                {processingId === app._id
                                                    ? "Processing..."
                                                    : "Accept"}
                                            </button>
                                            <button
                                                className="action-btn reject-btn"
                                                onClick={() =>
                                                    handleReject(app._id)
                                                }
                                                disabled={
                                                    processingId === app._id
                                                }
                                            >
                                                <XCircle size={16} />
                                                {processingId === app._id
                                                    ? "Processing..."
                                                    : "Reject"}
                                            </button>
                                        </>
                                    )}

                                    {/* Accepted State: Show Outcome Message + Option to Reject */}
                                    {app.status === "accepted" && (
                                        <div className="status-actions-container">
                                            <p className="accepted-message">
                                                ✓ Volunteer Accepted
                                            </p>
                                            <button
                                                className="action-btn reject-btn small-btn"
                                                onClick={() => handleReject(app._id)}
                                                disabled={processingId === app._id}
                                                title="Revoke acceptance"
                                            >
                                                <XCircle size={14} />
                                                Revoke & Reject
                                            </button>
                                        </div>
                                    )}

                                    {/* Rejected State: Show Outcome Message */}
                                    {app.status === "rejected" && (
                                        <p className="rejected-message">
                                            ✗ Application Rejected
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <button
                className="view-history-btn"
                onClick={() => setShowHistory(!showHistory)}
            >
                {showHistory ? (
                    <>
                        <Clock size={20} />
                        View Pending Applications
                    </>
                ) : (
                    <>
                        <Users size={20} />
                        View Application History ({acceptedCount} Accepted,{" "}
                        {rejectedCount} Rejected)
                    </>
                )}
            </button>
        </div>
    );
};

export default VolunteerApplications;
