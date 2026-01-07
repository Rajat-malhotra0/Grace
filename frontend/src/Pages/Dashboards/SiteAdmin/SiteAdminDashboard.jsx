import React, { useState, useEffect } from "react";
import "./SiteAdminDashboard.css";
import NgoPageEditor from "./NgoPageEditor";
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
    const [allNgos, setAllNgos] = useState([]);
    const [activeTab, setActiveTab] = useState("pending"); // "pending" or "all"
    const [selectedNgo, setSelectedNgo] = useState(null);
    const [showEditor, setShowEditor] = useState(false);

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

    const fetchAllNgos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            // No filter implies fetching all (or we can add specific query param if backend requires)
            // But based on our check, GET /api/ngos?isVerified=false gets pending.
            // GET /api/ngos usually fetches verified. 
            // We want ALL for ADMIN.
            // ngoService.readNgos logic: if no isVerified in filter, it adds isVerified=true.
            // To get ALL, we might need to send allow both.
            // Wait, looking at ngoService.js: updateNgo uses Ngo.findOneAndUpdate.
            
            // Let's assume GET /api/ngos returns verified ones, which is what we want to edit.
            
            const response = await fetch(withApiBase("/api/ngos"), {
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data = await response.json();
                setAllNgos(data.result);
            }
        } catch (error) {
            console.error("Error fetching all NGOs:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleEditPage = (ngo) => {
        setSelectedNgo(ngo);
        setShowEditor(true);
    };

    const handleNgoUpdate = (updatedNgo) => {
        setAllNgos(prev => prev.map(n => n._id === updatedNgo._id ? updatedNgo : n));
        fetchStats();
    };

    useEffect(() => {
        if (activeTab === "all") {
            fetchAllNgos();
        }
    }, [activeTab]);

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
                    <div className="section-header-tabs">
                        <button
                            className={`tab-btn ${
                                activeTab === "pending" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("pending")}
                        >
                            Pending Verifications ({stats.ngos.pending})
                        </button>
                        <button
                            className={`tab-btn ${
                                activeTab === "all" ? "active" : ""
                            }`}
                            onClick={() => setActiveTab("all")}
                        >
                            Manage All NGOs ({stats.ngos.total})
                        </button>
                    </div>

                    {activeTab === "pending" ? (
                        <div className="pending-ngos-view">
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
                                <div className="admin-ngo-grid">
                                    {pendingNgos.map((ngo) => (
                                        <div
                                            key={ngo._id}
                                            className="admin-ngo-card"
                                        >
                                            <div className="admin-ngo-header">
                                                <h3>{ngo.name}</h3>
                                                <span className="admin-registration-id">
                                                    ID:{" "}
                                                    {ngo.registerationId ||
                                                        "N/A"}
                                                </span>
                                            </div>

                                            <div className="admin-ngo-details">
                                                <div className="admin-detail-row">
                                                    <strong>Admin:</strong>{" "}
                                                    {ngo.user?.userName}
                                                </div>
                                                <div className="admin-detail-row">
                                                    <strong>Email:</strong>{" "}
                                                    {ngo.contact?.email}
                                                </div>
                                                <div className="admin-detail-row">
                                                    <strong>Phone:</strong>{" "}
                                                    {ngo.contact?.phone ||
                                                        "N/A"}
                                                </div>
                                                <div className="admin-detail-row">
                                                    <strong>Categories:</strong>{" "}
                                                    {ngo.category
                                                        ?.map((cat) => cat.name)
                                                        .join(", ")}
                                                </div>
                                                <div className="admin-detail-row">
                                                    <strong>Description:</strong>
                                                    <p className="admin-description-text">
                                                        {ngo.description}
                                                    </p>
                                                </div>
                                                <div className="admin-detail-row">
                                                    <strong>Registered:</strong>{" "}
                                                    {new Date(
                                                        ngo.user?.createdAt
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>

                                            <div className="admin-ngo-actions">
                                                <button
                                                    className="approve-btn"
                                                    onClick={() =>
                                                        handleNgoVerification(
                                                            ngo._id,
                                                            true
                                                        )
                                                    }
                                                    disabled={
                                                        actionLoading ===
                                                        ngo._id
                                                    }
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
                                                    disabled={
                                                        actionLoading ===
                                                        ngo._id
                                                    }
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
                    ) : (
                        <div className="all-ngos-view">
                            {loading ? (
                                <div className="loading-message">
                                    Loading all NGOs...
                                </div>
                            ) : (
                                <div className="all-ngos-list">
                                    {allNgos.filter(n => n.isVerified).length === 0 ? (
                                        <p>No verified NGOs found.</p>
                                    ) : (
                                        <div className="admin-ngo-grid">
                                            {allNgos.filter(n => n.isVerified).map((ngo) => (
                                                <div key={ngo._id} className="admin-ngo-card">
                                                    <div className="admin-ngo-header">
                                                        <h3>{ngo.name}</h3>
                                                        <span className={`admin-status-badge ${ngo.isVerified ? 'verified' : 'pending'}`}>
                                                            {ngo.isVerified ? "✅ Verified" : "⏳ Pending"}
                                                        </span>
                                                    </div>
                                                    <div className="admin-ngo-details">
                                                        <p>{ngo.description?.substring(0, 100)}...</p>
                                                    </div>
                                                    <div className="admin-ngo-actions">
                                                        <button 
                                                            className={`admin-feature-btn ${ngo.isFeatured ? 'featured' : ''}`}
                                                            onClick={async (e) => {
                                                                e.stopPropagation();
                                                                try {
                                                                    const token = localStorage.getItem("token");
                                                                    const response = await fetch(
                                                                        withApiBase(`/api/admin/ngos/${ngo._id}/feature`),
                                                                        {
                                                                            method: "PATCH",
                                                                            headers: {
                                                                                Authorization: token,
                                                                                "Content-Type": "application/json",
                                                                            },
                                                                            body: JSON.stringify({ isFeatured: !ngo.isFeatured }),
                                                                        }
                                                                    );
                                                                    if (response.ok) {
                                                                        const updatedNgo = (await response.json()).result;
                                                                        setAllNgos(prev => prev.map(n => n._id === ngo._id ? { ...n, isFeatured: updatedNgo.isFeatured } : n));
                                                                    }
                                                                } catch (err) {
                                                                    console.error("Failed to toggle feature:", err);
                                                                }
                                                            }}
                                                            title={ngo.isFeatured ? "Remove from Featured" : "Mark as Featured"}
                                                        >
                                                            {ngo.isFeatured ? "⭐ Featured" : "☆ Feature"}
                                                        </button>
                                                        <button 
                                                            className="admin-edit-btn"
                                                            onClick={() => handleEditPage(ngo)}
                                                        >
                                                            ✏️ Manage Page
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="admin-quick-actions">
                    <h2 className="section-title">Quick Actions</h2>
                    <div className="admin-actions-grid">
                        <div className="admin-action-card">
                            <div className="action-icon">📊</div>
                            <h3>Platform Analytics</h3>
                            <button className="action-btn" disabled>
                                Coming Soon
                            </button>
                        </div>
                        {/* More actions... */}
                    </div>
                </div>
            </div>

            {showEditor && selectedNgo && (
                <NgoPageEditor 
                    ngo={selectedNgo} 
                    onClose={() => setShowEditor(false)}
                    onUpdate={handleNgoUpdate}
                />
            )}
        </div>
    );
};

export default SiteAdminDashboard;
