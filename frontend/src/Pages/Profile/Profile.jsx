import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../Context/AuthContext";
import axios from "axios";
import { withApiBase } from "config";
import { toast } from "react-toastify";
import "./Profile.css";

function Profile() {
    const { user, ngo, isAuthenticated, logout, login } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        userName: "",
        about: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                userName: user.userName || "",
                about: user.about || "",
            });
        }
    }, [user]);

    const handleLogout = async () => {
        await logout();
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(
                withApiBase("/api/users/profile"),
                formData,
                {
                    headers: {
                        Authorization: token,
                    },
                }
            );

            if (response.data.success) {
                toast.success("Profile updated successfully!");
                setIsEditing(false);
                // Update local user context if possible, or reload. 
                // Since login updates context, we might re-fetch or just manually update if AuthContext exposed a setter.
                // ideally AuthContext should have a reloadUser() function. 
                // For now, let's assume the user object in context won't update immediately unless we trigger it.
                // We'll trust the page reload or separate refetch for now if AuthContext doesn't support direct update.
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="profile-container">
                <h2>Please log in to view your profile</h2>
            </div>
        );
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <h1>My Profile</h1>
            </div>

            <div className="profile-content">
                {/* Accomplishments Section */}
                <div className="profile-section accomplishments-section">
                    <h2>My Accomplishments</h2>
                    <div className="stats-grid">
                        <div className="stat-card">
                            <span className="stat-value">{user?.leaderboardStats?.hours || 0}</span>
                            <span className="stat-label">Volunteer Hours</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{user?.leaderboardStats?.tasksCompleted || 0}</span>
                            <span className="stat-label">Tasks Completed</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{user?.leaderboardStats?.level || "Beginner"}</span>
                            <span className="stat-label">Current Level</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-value">{user?.leaderboardStats?.impactScore || 0}</span>
                            <span className="stat-label">Impact Score</span>
                        </div>
                    </div>
                </div>

                {/* Personal Information */}
                <div className="profile-section">
                    <div className="section-header-row">
                        <h2>Personal Information</h2>
                        {!isEditing && (
                            <button 
                                className="action-btn edit-btn"
                                onClick={() => setIsEditing(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                    
                    <div className="profile-info-grid">
                        <div className="info-group">
                            <label>Name</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="userName"
                                    value={formData.userName}
                                    onChange={handleChange}
                                    className="profile-input"
                                />
                            ) : (
                                <p className="info-text">{user?.userName || "Not provided"}</p>
                            )}
                        </div>

                        <div className="info-group">
                            <label>Email</label>
                            <p className="info-text">{user?.email || "Not provided"}</p>
                        </div>

                        <div className="info-group">
                            <label>Role</label>
                            <p className="info-text capitalized">
                                {user?.role?.join(", ") || "Not specified"}
                            </p>
                        </div>

                        <div className="info-group full-width">
                            <label>Bio / About Me</label>
                            {isEditing ? (
                                <textarea
                                    name="about"
                                    value={formData.about}
                                    onChange={handleChange}
                                    className="profile-textarea"
                                    placeholder="Tell us about yourself, your skills, and what drives you to volunteer..."
                                    rows="4"
                                />
                            ) : (
                                <p className="info-text bio-text">
                                    {user?.about || "No description provided. Click 'Edit Profile' to add your bio and skills!"}
                                </p>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="edit-actions">
                            <button 
                                className="action-btn cancel-btn"
                                onClick={() => setIsEditing(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button 
                                className="action-btn save-btn"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}
                </div>

                {ngo && (
                    <div className="profile-section">
                        <h2>Organization Information</h2>
                        <div className="profile-info-grid">
                            <div className="info-group">
                                <label>Organization</label>
                                <p className="info-text">{ngo.name || "-"}</p>
                            </div>
                            <div className="info-group">
                                <label>Registration ID</label>
                                <p className="info-text">{ngo.registerationId || "-"}</p>
                            </div>
                            <div className="info-group full-width">
                                <label>Description</label>
                                <p className="info-text">{ngo.description || "-"}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="profile-actions-footer">
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
