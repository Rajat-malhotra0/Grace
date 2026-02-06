import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { withApiBase } from "config";
import { Calendar, MapPin, ArrowRight, User } from "lucide-react";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { applyForVolunteer } from "../../services/volunteerApplicationService";
import { toast } from "react-toastify";
import "./CurrentEvents.css";

const CurrentEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
    const [applyingId, setApplyingId] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get(
                    withApiBase("/api/ngos/active-opportunities"),
                );
                if (response.data.success) {
                    setEvents(response.data.result);
                }
            } catch (error) {
                console.error("Error fetching active events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleApply = async (ngoId, opportunityId, title, e) => {
        if (e) e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Please login to volunteer for this event", {
                position: "bottom-center",
                autoClose: 3000,
            });
            return;
        }

        setApplyingId(opportunityId);
        try {
            const response = await applyForVolunteer(
                ngoId,
                opportunityId,
                `Applied for "${title}" from Home Page`,
            );

            if (response.success) {
                toast.success(
                    "Interest registered! The NGO has been notified.",
                    {
                        position: "bottom-center",
                        autoClose: 4000,
                    },
                );
            }
        } catch (error) {
            console.error("handleApply caught error:", error);

            // The service throws the response data object directly, so 'error' might define 'message' directly.
            // We check various paths to find the error message.
            const msg =
                error.message ||
                error.response?.data?.message ||
                (typeof error === "string" ? error : "Failed to apply");

            console.log("Toast message to show:", msg);

            if (msg && msg.toLowerCase().includes("already applied")) {
                toast.info("You have already applied for this event.");
            } else {
                toast.error(msg || "An unexpected error occurred.");
            }
        } finally {
            setApplyingId(null);
        }
    };

    const openModal = (item) => {
        setSelectedEvent(item);
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    };

    const closeModal = () => {
        setSelectedEvent(null);
        document.body.style.overflow = "auto"; // Restore scrolling
    };

    const navigateToNgo = (ngoId) => {
        closeModal();
        navigate(`/ngo/${ngoId}`);
    };

    return (
        <div className="current-events-section">
            <div className="section-container">
                <div className="section-header">
                    <h2 className="section-title">
                        {/* <span className="live-indicator"></span> */}
                        Happening Now
                    </h2>
                    <p className="section-subtitle">
                        Events are live! Join these opportunities and make an
                        immediate impact.
                    </p>
                </div>

                {loading ? (
                    <div className="loading-state">Loading events...</div>
                ) : events.length === 0 ? (
                    <div className="no-events-message">
                        <p>No current events scheduled. Check back soon!</p>
                    </div>
                ) : (
                    <div className="events-grid">
                        {events.map((item, index) => {
                            const { ngoName, opportunity, _id: ngoId } = item;
                            return (
                                <div
                                    className="event-card"
                                    key={`${ngoId}-${opportunity.id}-${index}`}
                                    onClick={() => openModal(item)}
                                >
                                    <div className="event-date-badge">
                                        <span className="date-day">
                                            {new Date(
                                                opportunity.eventDate,
                                            ).getDate()}
                                        </span>
                                        <span className="date-month">
                                            {new Date(
                                                opportunity.eventDate,
                                            ).toLocaleString("default", {
                                                month: "short",
                                            })}
                                        </span>
                                    </div>

                                    <div className="event-content">
                                        <div className="event-ngo">
                                            <User size={14} />
                                            <span>{ngoName}</span>
                                        </div>

                                        <h3 className="event-title">
                                            {opportunity.title}
                                        </h3>

                                        <p className="event-description">
                                            {opportunity.description.length >
                                            100
                                                ? `${opportunity.description.substring(
                                                      0,
                                                      100,
                                                  )}...`
                                                : opportunity.description}
                                        </p>

                                        <div className="event-details">
                                            <div className="detail-item">
                                                <Calendar size={16} />
                                                <span className="event-time">
                                                    {new Date(
                                                        opportunity.eventDate,
                                                    ).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </span>
                                            </div>
                                            <div className="detail-item">
                                                <MapPin size={16} />
                                                <span>
                                                    {opportunity.isOnline
                                                        ? "Online Event"
                                                        : opportunity.location}
                                                </span>
                                            </div>
                                        </div>

                                        <button
                                            className="event-action-btn"
                                            onClick={(e) =>
                                                handleApply(
                                                    ngoId,
                                                    opportunity.id,
                                                    opportunity.title,
                                                    e,
                                                )
                                            }
                                            disabled={
                                                applyingId === opportunity.id
                                            }
                                        >
                                            {applyingId === opportunity.id ? (
                                                "Sending..."
                                            ) : (
                                                <>
                                                    Volunteer Now{" "}
                                                    <ArrowRight size={16} />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Event Details Modal */}
            {selectedEvent && (
                <div className="event-modal-overlay" onClick={closeModal}>
                    <div
                        className="event-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className="modal-close-btn"
                            onClick={closeModal}
                        >
                            &times;
                        </button>

                        <div className="modal-header">
                            <span className="modal-date-badge">
                                {new Date(
                                    selectedEvent.opportunity.eventDate,
                                ).toLocaleDateString(undefined, {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                            <h2 className="modal-title">
                                {selectedEvent.opportunity.title}
                            </h2>
                            <div
                                className="modal-ngo-link"
                                onClick={() => navigateToNgo(selectedEvent._id)}
                            >
                                <User size={16} />
                                <span>
                                    Organized by{" "}
                                    <strong>{selectedEvent.ngoName}</strong>
                                </span>
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="modal-info-grid">
                                <div className="modal-info-item">
                                    <label>Time</label>
                                    <p>
                                        <Calendar size={16} />
                                        {new Date(
                                            selectedEvent.opportunity.eventDate,
                                        ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                                <div className="modal-info-item">
                                    <label>Duration</label>
                                    <p>
                                        {selectedEvent.opportunity.duration ||
                                            "Not specified"}
                                    </p>
                                </div>
                                <div className="modal-info-item">
                                    <label>People Needed</label>
                                    <p>
                                        {selectedEvent.opportunity
                                            .peopleNeeded || "Open"}
                                    </p>
                                </div>
                                <div className="modal-info-item">
                                    <label>Location</label>
                                    <p>
                                        <MapPin size={16} />
                                        {selectedEvent.opportunity.isOnline
                                            ? "Online Event"
                                            : selectedEvent.opportunity
                                                  .location}
                                    </p>
                                </div>
                            </div>

                            <div className="modal-description">
                                <h3>About this Event</h3>
                                <p>{selectedEvent.opportunity.description}</p>
                            </div>

                            {selectedEvent.opportunity.roleResult && (
                                <div className="modal-skills">
                                    <h3>Skills/Roles</h3>
                                    <p>
                                        {selectedEvent.opportunity.roleResult}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="modal-footer">
                            <button
                                className="modal-volunteer-btn"
                                onClick={(e) =>
                                    handleApply(
                                        selectedEvent._id,
                                        selectedEvent.opportunity.id,
                                        selectedEvent.opportunity.title,
                                        e,
                                    )
                                }
                                disabled={
                                    applyingId === selectedEvent.opportunity.id
                                }
                            >
                                {applyingId === selectedEvent.opportunity.id
                                    ? "Processing Application..."
                                    : "Volunteer for this Opportunity"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrentEvents;
