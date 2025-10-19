import React, { useState, useEffect, useContext } from "react";
import {
    Send,
    Mail,
    Users,
    AlertCircle,
    CheckCircle,
    X,
    Loader,
} from "lucide-react";
import { AuthContext } from "../../../Context/AuthContext";
import {
    getOpportunityVolunteers,
    sendOpportunityUpdate,
} from "../../../services/volunteerApplicationService";
import "./OpportunityEmailUpdates.css";

const OpportunityEmailUpdates = () => {
    const { ngo } = useContext(AuthContext);
    const [selectedOpportunity, setSelectedOpportunity] = useState(null);
    const [volunteers, setVolunteers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [updateMessage, setUpdateMessage] = useState("");
    const [successCount, setSuccessCount] = useState(0);
    const [failedCount, setFailedCount] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState("");
    const [opportunities, setOpportunities] = useState([]);

    // Load opportunities from NGO data
    useEffect(() => {
        if (ngo && ngo.volunteer && ngo.volunteer.opportunities) {
            setOpportunities(ngo.volunteer.opportunities);
        }
    }, [ngo]);

    // Fetch volunteers when opportunity is selected
    useEffect(() => {
        if (selectedOpportunity !== null && ngo?._id) {
            fetchVolunteers();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedOpportunity]);

    const fetchVolunteers = async () => {
        if (selectedOpportunity === null || !ngo?._id) return;

        setLoading(true);
        setError("");
        try {
            const response = await getOpportunityVolunteers(
                ngo._id,
                selectedOpportunity
            );
            setVolunteers(response || []);
        } catch (err) {
            setError(err.message || "Failed to fetch volunteers");
        } finally {
            setLoading(false);
        }
    };

    const handleSendUpdates = async () => {
        if (!selectedOpportunity || !updateMessage.trim()) {
            setError("Please select an opportunity and enter a message");
            return;
        }

        if (volunteers.length === 0) {
            setError("No accepted volunteers found for this opportunity");
            return;
        }

        if (updateMessage.trim().length < 10) {
            setError("Message must be at least 10 characters long");
            return;
        }

        if (updateMessage.trim().length > 1000) {
            setError("Message must not exceed 1000 characters");
            return;
        }

        setSending(true);
        setError("");
        setSuccessCount(0);
        setFailedCount(0);

        let successful = 0;
        let failed = 0;

        // Send email to each volunteer
        for (const volunteer of volunteers) {
            try {
                await sendOpportunityUpdate(
                    volunteer._id,
                    updateMessage.trim()
                );
                successful++;
                setSuccessCount(successful);
            } catch (err) {
                console.error(
                    `Failed to send update to ${volunteer.user?.userName}:`,
                    err
                );
                failed++;
                setFailedCount(failed);
            }
        }

        setSending(false);
        if (successful > 0) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                setUpdateMessage("");
                setSelectedOpportunity(null);
                setVolunteers([]);
            }, 5000);
        }
    };

    const selectedOpp = opportunities.find(
        (opp) => opp.id === selectedOpportunity
    );

    return (
        <div className="opportunity-email-updates-container">
            <div className="updates-header">
                <div className="header-icon-wrapper">
                    <Mail className="header-icon" size={32} />
                </div>
                <div className="header-content">
                    <h1 className="updates-title">Send Opportunity Updates</h1>
                    <p className="updates-subtitle">
                        Notify volunteers about important updates via email
                    </p>
                </div>
            </div>

            {/* Success Message */}
            {showSuccess && (
                <div className="message-box success-message">
                    <CheckCircle className="message-icon" size={20} />
                    <div className="message-content">
                        <p className="message-title">
                            Updates sent successfully!
                        </p>
                        <p className="message-text">
                            {successCount} email(s) sent successfully
                            {failedCount > 0 && `, ${failedCount} failed`}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="message-close"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="message-box error-message">
                    <AlertCircle className="message-icon" size={20} />
                    <div className="message-content">
                        <p className="message-title">Error</p>
                        <p className="message-text">{error}</p>
                    </div>
                    <button
                        onClick={() => setError("")}
                        className="message-close"
                    >
                        <X size={18} />
                    </button>
                </div>
            )}

            <div className="updates-content">
                {/* Opportunity Selection */}
                <div className="form-group">
                    <label className="form-label">Select Opportunity</label>
                    <select
                        value={selectedOpportunity || ""}
                        onChange={(e) =>
                            setSelectedOpportunity(
                                e.target.value ? Number(e.target.value) : null
                            )
                        }
                        className="form-select"
                        disabled={sending}
                    >
                        <option value="">Choose an opportunity...</option>
                        {opportunities.map((opp) => (
                            <option key={opp.id} value={opp.id}>
                                {opp.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Volunteer Count */}
                {selectedOpportunity !== null &&
                    !loading &&
                    volunteers.length > 0 && (
                        <div className="info-box">
                            <Users className="info-icon" size={20} />
                            <div className="info-content">
                                <p className="info-text">
                                    <strong>
                                        {volunteers.length} Accepted Volunteer
                                        {volunteers.length !== 1 ? "s" : ""}
                                    </strong>
                                </p>
                                <p className="info-subtext">
                                    {selectedOpp?.title}
                                </p>
                            </div>
                        </div>
                    )}

                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <Loader className="loading-icon" size={32} />
                        <p className="loading-text">Loading volunteers...</p>
                    </div>
                )}

                {/* Email Form */}
                {selectedOpportunity !== null &&
                    !loading &&
                    volunteers.length > 0 && (
                        <div className="email-form">
                            {/* Message Textarea */}
                            <div className="form-group">
                                <label className="form-label">
                                    Update Message
                                    <span className="required">*</span>
                                </label>
                                <textarea
                                    value={updateMessage}
                                    onChange={(e) =>
                                        setUpdateMessage(e.target.value)
                                    }
                                    placeholder="Write your update message here... (e.g., Schedule changes, important announcements, reminders)"
                                    rows={8}
                                    className="form-textarea"
                                    disabled={sending}
                                />
                                <div className="character-count">
                                    <span
                                        className={
                                            updateMessage.length > 1000
                                                ? "count-exceeded"
                                                : ""
                                        }
                                    >
                                        {updateMessage.length} / 1000 characters
                                    </span>
                                    {updateMessage.length < 10 && (
                                        <span className="count-warning">
                                            Minimum 10 characters required
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Preview Section */}
                            {updateMessage.trim() && (
                                <div className="preview-section">
                                    <p className="preview-label">PREVIEW</p>
                                    <div className="preview-box">
                                        <p className="preview-opportunity">
                                            {selectedOpp?.title}
                                        </p>
                                        <p className="preview-message">
                                            {updateMessage}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Volunteer List */}
                            <div className="volunteers-list">
                                <p className="volunteers-label">
                                    Recipients ({volunteers.length})
                                </p>
                                <div className="volunteers-grid">
                                    {volunteers.slice(0, 6).map((vol) => (
                                        <div
                                            key={vol._id}
                                            className="volunteer-chip"
                                        >
                                            <Mail size={14} />
                                            <span>
                                                {vol.user?.userName ||
                                                    "Unknown"}
                                            </span>
                                        </div>
                                    ))}
                                    {volunteers.length > 6 && (
                                        <div className="volunteer-chip more">
                                            +{volunteers.length - 6} more
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Send Button */}
                            <button
                                onClick={handleSendUpdates}
                                disabled={
                                    sending ||
                                    !updateMessage.trim() ||
                                    updateMessage.length < 10 ||
                                    updateMessage.length > 1000
                                }
                                className="send-btn"
                            >
                                {sending ? (
                                    <>
                                        <Loader
                                            className="btn-icon spinning"
                                            size={20}
                                        />
                                        <span>
                                            Sending... ({successCount}/
                                            {volunteers.length})
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Send className="btn-icon" size={20} />
                                        <span>Send Updates</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                {/* No Volunteers Message */}
                {selectedOpportunity !== null &&
                    !loading &&
                    volunteers.length === 0 && (
                        <div className="empty-state">
                            <Users className="empty-icon" size={48} />
                            <p className="empty-title">
                                No accepted volunteers yet
                            </p>
                            <p className="empty-text">
                                Volunteers need to be accepted before you can
                                send updates to them
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default OpportunityEmailUpdates;
