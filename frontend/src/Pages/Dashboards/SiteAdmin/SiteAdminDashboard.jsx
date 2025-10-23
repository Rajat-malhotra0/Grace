import React, { useState, useEffect } from "react";
import "./SiteAdminDashboard.css";
import { withApiBase } from "config";

const SiteAdminDashboard = () => {
    //Only to show during the presentation
    const [stats, setStats] = useState({
        ngos: { total: 0, verified: 0, pending: 0 },
        totalUsers: 0,
        usersByRole: { volunteers: 0, donors: 0, ngoMembers: 0, ngos: 0 },
    });
    const [pendingNgos, setPendingNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
        fetchPendingNgos();
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(withApiBase("/api/admin/stats"), {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setStats(data.result);
            }
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    };

    const fetchPendingNgos = async () => {
        try {
            const token = localStorage.getItem("token");
            console.log(
                "Fetching pending NGOs with token:",
                token ? "Present" : "Missing"
            );

            if (!token) {
                setError("No authentication token found. Please login again.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                withApiBase("/api/admin/ngos/pending"),
                {
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                }
            );

            console.log("Response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("Pending NGOs data:", data);
                setPendingNgos(data.result);
                setError(null);
            } else {
                const errorData = await response.json();
                console.error("Failed to fetch pending NGOs:", errorData);
                setError(
                    `Failed to fetch pending NGOs: ${
                        errorData.message || "Unknown error"
                    }`
                );
            }
        } catch (error) {
            console.error("Error fetching pending NGOs:", error);
            setError(`Network error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleNgoVerification = async (ngoId, isApproved) => {
        setActionLoading(ngoId);
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(
                withApiBase(`/api/admin/ngos/${ngoId}/verify`),
                {
                    method: "PATCH",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ isApproved }),
                }
            );

            if (response.ok) {
                // Remove the NGO from pending list
                setPendingNgos((prev) =>
                    prev.filter((ngo) => ngo._id !== ngoId)
                );
                // Refresh stats
                fetchStats();
            } else {
                alert("Error updating NGO status");
            }
        } catch (error) {
            console.error("Error updating NGO status:", error);
            alert("Error updating NGO status");
        } finally {
            setActionLoading(null);
        }
    };
    return (
        <div className="site-admin-dashboard">
            <div className="admin-container">
                <div className="admin-welcome-section">
                    <div className="admin-welcome-card">
                        <div className="admin-welcome-header">
                            <h1 className="admin-welcome-title">Hi Admin!</h1>
                            <p className="admin-welcome-subtitle">
                                Welcome to the Grace Site Administration
                                Dashboard
                            </p>
                        </div>
                        <div className="admin-welcome-content">
                            <p className="admin-welcome-description">
                                From here, you can manage the entire Grace
                                platform, monitor system activities, and ensure
                                everything runs smoothly.
                            </p>
                            <div className="admin-quick-stats">
                                <div className="admin-stat-card">
                                    <div className="stat-icon">🏢</div>
                                    <div className="stat-info">
                                        <span className="stat-number">
                                            {stats.ngos.total}
                                        </span>
                                        <span className="stat-label">
                                            Total NGOs
                                        </span>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="stat-icon">👥</div>
                                    <div className="stat-info">
                                        <span className="stat-number">
                                            {stats.totalUsers}
                                        </span>
                                        <span className="stat-label">
                                            Total Users
                                        </span>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="stat-icon">✅</div>
                                    <div className="stat-info">
                                        <span className="stat-number">
                                            {stats.ngos.verified}
                                        </span>
                                        <span className="stat-label">
                                            Verified NGOs
                                        </span>
                                    </div>
                                </div>
                                <div className="admin-stat-card">
                                    <div className="stat-icon">⏳</div>
                                    <div className="stat-info">
                                        <span className="stat-number">
                                            {stats.ngos.pending}
                                        </span>
                                        <span className="stat-label">
                                            Pending NGOs
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-actions-section">
                    <h2 className="section-title">NGO Verification</h2>
                    {loading ? (
                        <div className="loading-message">
                            Loading pending NGOs...
                        </div>
                    ) : error ? (
                        <div className="error-message">
                            <p>❌ {error}</p>
                        </div>
                    ) : pendingNgos.length === 0 ? (
                        <div className="no-pending-message">
                            <p>🎉 No pending NGO verifications!</p>
                            <p>All NGOs are up to date.</p>
                        </div>
                    ) : (
                        <div className="ngo-verification-grid">
                            {pendingNgos.map((ngo) => (
                                <div
                                    key={ngo._id}
                                    className="ngo-verification-card"
                                >
                                    <div className="ngo-header">
                                        <h3>{ngo.name}</h3>
                                        <span className="registration-id">
                                            ID: {ngo.registerationId || "N/A"}
                                        </span>
                                    </div>

                                    <div className="ngo-details">
                                        <div className="detail-row">
                                            <strong>Admin:</strong>{" "}
                                            {ngo.user?.userName}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Email:</strong>{" "}
                                            {ngo.contact?.email}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Phone:</strong>{" "}
                                            {ngo.contact?.phone || "N/A"}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Categories:</strong>{" "}
                                            {ngo.category
                                                ?.map((cat) => cat.name)
                                                .join(", ")}
                                        </div>
                                        <div className="detail-row">
                                            <strong>Description:</strong>
                                            <p className="description-text">
                                                {ngo.description}
                                            </p>
                                        </div>
                                        <div className="detail-row">
                                            <strong>Registered:</strong>{" "}
                                            {new Date(
                                                ngo.user?.createdAt
                                            ).toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="ngo-actions">
                                        <button
                                            className="approve-btn"
                                            onClick={() =>
                                                handleNgoVerification(
                                                    ngo._id,
                                                    true
                                                )
                                            }
                                            disabled={actionLoading === ngo._id}
                                        >
                                            {actionLoading === ngo._id
                                                ? "Processing..."
                                                : "✅ Approve"}
                                        </button>
                                        <button
                                            className="reject-btn"
                                            onClick={() =>
                                                handleNgoVerification(
                                                    ngo._id,
                                                    false
                                                )
                                            }
                                            disabled={actionLoading === ngo._id}
                                        >
                                            {actionLoading === ngo._id
                                                ? "Processing..."
                                                : "❌ Reject"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="admin-quick-actions">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="admin-actions-grid">
                        <div className="admin-action-card">
                            <div className="action-icon">�</div>
                            <h3>Platform Analytics</h3>
                            <p>
                                View comprehensive platform statistics and
                                insights
                            </p>
                            <button className="action-btn" disabled>
                                Coming Soon
                            </button>
                        </div>
                        <div className="admin-action-card">
                            <div className="action-icon">👥</div>
                            <h3>User Management</h3>
                            <p>
                                Manage users, roles, and permissions across the
                                platform
                            </p>
                            <button className="action-btn" disabled>
                                Coming Soon
                            </button>
                        </div>
                        <div className="admin-action-card">
                            <div className="action-icon">⚙️</div>
                            <h3>System Settings</h3>
                            <p>Configure platform settings and maintenance</p>
                            <button className="action-btn" disabled>
                                Coming Soon
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SiteAdminDashboard;
