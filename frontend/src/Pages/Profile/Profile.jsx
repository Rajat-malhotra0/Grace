import React, { useContext } from "react";
import { AuthContext } from "../../Context/AuthContext";
import "./Profile.css";

function Profile() {
    const { user, ngo, isAuthenticated, logout } = useContext(AuthContext);

    const handleLogout = async () => {
        await logout();
    };

    return !isAuthenticated ? (
        <div className="profile-container">
            <h2>Please log in to view your profile</h2>
        </div>
    ) : (
        <div className="profile-container">
            <div className="profile-header">
                <h1>Your Profile</h1>
            </div>

            <div className="profile-content">
                <div className="profile-section">
                    <h2>Personal Information</h2>
                    <div className="profile-info">
                        <p>
                            <strong>Name:</strong>{" "}
                            {user?.userName || "Not provided"}
                        </p>
                        <p>
                            <strong>Email:</strong>{" "}
                            {user?.email || "Not provided"}
                        </p>
                        <p>
                            <strong>Role:</strong>{" "}
                            {user?.role?.join(", ") || "Not specified"}
                        </p>
                        <p>
                            <strong>Date of Birth:</strong>{" "}
                            {user?.dob
                                ? new Date(user.dob).toLocaleDateString()
                                : "Not provided"}
                        </p>
                        <p>
                            <strong>About:</strong>{" "}
                            {user?.about || "No description provided"}
                        </p>
                        <p>
                            <strong>Member Since:</strong>{" "}
                            {user?.createdAt
                                ? new Date(user.createdAt).toLocaleDateString()
                                : "Unknown"}
                        </p>
                    </div>
                </div>

                {ngo && (
                    <div className="profile-section">
                        <h2>Organization Information</h2>
                        <div className="profile-info">
                            <p>
                                <strong>Organization:</strong>{" "}
                                {ngo.name || "Not provided"}
                            </p>
                            <p>
                                <strong>Registration ID:</strong>{" "}
                                {ngo.registerationId || "Not provided"}
                            </p>
                            <p>
                                <strong>Description:</strong>{" "}
                                {ngo.description || "No description provided"}
                            </p>
                            <p>
                                <strong>Address:</strong>{" "}
                                {ngo.location?.address || "Not provided"}
                            </p>
                            <p>
                                <strong>Phone:</strong>{" "}
                                {ngo.contact?.phone || "Not provided"}
                            </p>
                            <p>
                                <strong>Website:</strong>{" "}
                                {ngo.contact?.website || "Not provided"}
                            </p>
                        </div>
                    </div>
                )}

                <div className="profile-section">
                    <h2>Preferences</h2>
                    <div className="profile-info">
                        <p>
                            <strong>Reminders:</strong>{" "}
                            {user?.remindMe ? "Enabled" : "Disabled"}
                        </p>
                        <p>
                            <strong>Newsletter:</strong>{" "}
                            {user?.newsLetter ? "Subscribed" : "Not subscribed"}
                        </p>
                        <p>
                            <strong>Terms Accepted:</strong>{" "}
                            {user?.termsAccepted ? "Yes" : "No"}
                        </p>
                    </div>
                </div>

                <div className="profile-actions">
                    <button className="edit-profile-btn">Edit Profile</button>
                    <button className="change-password-btn">
                        Change Password
                    </button>
                    <button onClick={handleLogout} className="logout-btn">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Profile;
