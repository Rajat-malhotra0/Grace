import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { withApiBase } from "config";
import Toast from "../NgoPage/Toast";
import DonationModal from "../../Components/DonationModal";
import { AuthContext } from "../../Context/AuthContext";
import {
    applyForVolunteer,
    checkApplicationStatus,
} from "../../services/volunteerApplicationService";
import "./NgoPage.css";

const NgoPage = () => {
    const { ngoId } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated } = useContext(AuthContext);
    const [ngo, setNgo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedNgo, setSelectedNgo] = useState(null);
    const [error, setError] = useState(null);
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [applicationStatuses, setApplicationStatuses] = useState({});
    const [applyingForOpportunity, setApplyingForOpportunity] = useState(null);

    useEffect(() => {
        const loadNgoData = async () => {
            try {
                setLoading(true);

                // Fetch NGO data from the backend API
                const response = await axios.get(
                    withApiBase(`/api/ngos/${ngoId}`)
                );

                if (response.data.success) {
                    console.log(
                        "NGO Page - Loaded NGO data:",
                        response.data.result
                    );
                    setNgo(response.data.result);
                } else {
                    throw new Error("NGO not found");
                }
            } catch (err) {
                console.error("Error fetching NGO:", err);
                setError(err.response?.data?.message || "NGO not found");
            } finally {
                setLoading(false);
            }
        };

        if (ngoId) {
            loadNgoData();
        }
    }, [ngoId]);

    // Check application statuses for all opportunities
    useEffect(() => {
        const checkStatuses = async () => {
            if (!isAuthenticated || !ngo?.volunteer?.opportunities) {
                return;
            }

            const statuses = {};
            for (const opportunity of ngo.volunteer.opportunities) {
                try {
                    const response = await checkApplicationStatus(
                        ngoId,
                        opportunity.id
                    );
                    if (response.success && response.hasApplied) {
                        statuses[opportunity.id] = response.application;
                    }
                } catch (error) {
                    console.error(
                        `Error checking status for opportunity ${opportunity.id}:`,
                        error
                    );
                }
            }
            setApplicationStatuses(statuses);
        };

        checkStatuses();
    }, [isAuthenticated, ngo, ngoId]);

    const handleNavClick = (section) => {
        const sectionElement = document.getElementById(section);
        if (sectionElement) {
            sectionElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    };

    const handleVolunteerClick = async (opportunity) => {
        // Check if user is authenticated
        if (!isAuthenticated) {
            setToastMessage(
                "Please login or register to apply for volunteer opportunities."
            );
            setToastType("error");
            setShowToast(true);

            // Redirect to login after a short delay
            setTimeout(() => {
                navigate("/login", {
                    state: { from: `/ngo/${ngoId}`, returnTo: "volunteer" },
                });
            }, 2000);
            return;
        }

        // Check if already applied
        const existingApplication = applicationStatuses[opportunity.id];
        if (existingApplication) {
            let statusMessage = "";
            if (existingApplication.status === "pending") {
                statusMessage =
                    "You have already applied for this opportunity. Your application is currently under review.";
            } else if (existingApplication.status === "accepted") {
                statusMessage =
                    "Your application for this opportunity has been accepted! You're now a member of this NGO.";
            } else if (existingApplication.status === "rejected") {
                statusMessage =
                    "Unfortunately, your previous application for this opportunity was not accepted.";
            }

            setToastMessage(statusMessage);
            setToastType("info");
            setShowToast(true);
            return;
        }

        // Apply for the volunteer opportunity
        try {
            setApplyingForOpportunity(opportunity.id);

            console.log("Submitting application for:", {
                ngoId,
                opportunityId: opportunity.id,
                isAuthenticated,
                hasToken: !!localStorage.getItem("token"),
            });

            const response = await applyForVolunteer(
                ngoId,
                opportunity.id,
                "" // You can add a message input if needed
            );

            if (response.success) {
                setToastMessage(
                    response.message ||
                        "Thank you for stepping forward! We've received your interest in volunteering, and the NGO has been notified. They'll be reaching out to you soon via email. If you have any questions in the meantime, feel free to write to us at teamgrace@gmail.org — we're here for you. The journey you've begun matters, and we're so glad you're part of it."
                );
                setToastType("success");
                setShowToast(true);

                // Update application status
                setApplicationStatuses((prev) => ({
                    ...prev,
                    [opportunity.id]: response.result,
                }));
            }
        } catch (error) {
            console.error("Error applying for volunteer:", error);
            console.error("Full error object:", JSON.stringify(error, null, 2));
            setToastMessage(
                error.message ||
                    "Failed to submit your application. Please try again later."
            );
            setToastType("error");
            setShowToast(true);
        } finally {
            setApplyingForOpportunity(null);
        }
    };

    const handleCloseToast = () => {
        setShowToast(false);
    };

    const handleDonateClick = (actionType = "donate") => {
        if (actionType === "marketplace") {
            navigate("/marketplace");
        } else {
            // Open donation modal
            setSelectedNgo(ngo);
        }
    };

    const handleCloseModal = () => {
        setSelectedNgo(null);
    };

    if (loading) {
        return (
            <div className="ngo-page-loading">
                <h2>Loading NGO details...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="ngo-page-error">
                <h2>Error: {error}</h2>
                <p>The NGO you're looking for could not be found.</p>
            </div>
        );
    }

    if (!ngo) {
        return (
            <div className="ngo-page-error">
                <h2>NGO not found</h2>
            </div>
        );
    }

    return (
        <div className="ngo-page">
            {/* Toast Notification */}
            <Toast
                message={toastMessage}
                isVisible={showToast}
                onClose={handleCloseToast}
                duration={10000}
                type={toastType}
            />

            {/* Hero Section */}
            <section className="ngo-hero">
                {ngo.heroVideo ? (
                    <video
                        className="hero-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                    >
                        <source src={ngo.heroVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <div
                        className="hero-image"
                        style={{
                            backgroundImage: `url(${ngo.coverImage?.url})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            width: "100%",
                            height: "100vh",
                        }}
                    ></div>
                )}

                {/* Video Overlay Content */}
                <div className="hero-overlay">
                    {/* Top Left - NGO Name */}
                    <div className="hero-ngo-name">
                        <h1>{ngo.name}</h1>
                    </div>

                    {/* Top Right - Navigation Links */}
                    <div className="hero-nav">
                        <button
                            className="hero-nav-link"
                            onClick={() => navigate("/")}
                        >
                            Home
                        </button>
                        <button
                            className="hero-nav-link"
                            onClick={() => handleNavClick("about-us")}
                        >
                            About Us
                        </button>
                        <button
                            className="hero-nav-link"
                            onClick={() =>
                                handleNavClick("volunteer-opportunities")
                            }
                        >
                            Volunteer
                        </button>
                    </div>

                    {/* Bottom Left - Quote */}
                    <div className="hero-quote">
                        <blockquote>
                            "
                            {ngo.quote ||
                                ngo.description?.substring(0, 100) + "..." ||
                                "Making a difference in the world."}
                            "
                        </blockquote>
                    </div>
                </div>
            </section>

            {/* Our Projects Section */}
            <section className="our-projects">
                <div className="projects-container">
                    <div className="projects-header">
                        <h2>Our Projects</h2>
                        <p className="projects-subheader">
                            Through each project, we stitch compassion into the
                            world—one soul, one seed, one sunrise at a time.
                        </p>
                    </div>

                    <div className="projects-grid">
                        {ngo.projects && ngo.projects.length > 0 ? (
                            ngo.projects.map((project) => (
                                <div key={project.id} className="project-card">
                                    <div className="project-image">
                                        <img
                                            src={project.image}
                                            alt={project.title}
                                        />
                                    </div>
                                    <div className="project-content">
                                        <h3 className="project-title">
                                            {project.title}
                                        </h3>
                                        <p className="project-description">
                                            {project.description}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-projects">
                                <p>No projects available at the moment.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section id="about-us" className="about-us">
                <div className="about-container">
                    <div className="about-image">
                        <img
                            src={ngo.aboutUs?.image || ngo.coverImage?.url}
                            alt={`${ngo.name} About Us`}
                        />
                    </div>
                    <div className="about-content">
                        <div className="about-text">
                            <span className="about-label">ABOUT US</span>
                            <h2 className="about-title">About Us</h2>
                            <p className="about-subtitle">
                                In the hush between doing, Let us linger here —
                                and find each other in the stillness.
                            </p>
                            <p className="about-description">
                                {ngo.aboutUs?.description || ngo.description}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Volunteer Opportunities Section */}
            <section
                id="volunteer-opportunities"
                className="volunteer-opportunities1"
            >
                <div className="volunteer-container1">
                    <div className="volunteer-header1">
                        <h2>Your Time Can Create Change</h2>
                        <p className="volunteer-subheader1">
                            {ngo.volunteer?.subheader ||
                                "Join us in making a difference in the community."}
                        </p>
                    </div>

                    <div className="volunteer-grid">
                        {ngo.volunteer?.opportunities &&
                        ngo.volunteer.opportunities.length > 0 ? (
                            ngo.volunteer.opportunities.map((opportunity) => {
                                const applicationStatus =
                                    applicationStatuses[opportunity.id];
                                const isApplying =
                                    applyingForOpportunity === opportunity.id;
                                const hasApplied = !!applicationStatus;
                                const isPending =
                                    applicationStatus?.status === "pending";
                                const isAccepted =
                                    applicationStatus?.status === "accepted";
                                const isRejected =
                                    applicationStatus?.status === "rejected";

                                return (
                                    <div
                                        key={opportunity.id}
                                        className="volunteer-card"
                                    >
                                        <div className="volunteer-content">
                                            <h3 className="volunteer-title">
                                                {opportunity.title}
                                            </h3>
                                            <p className="volunteer-description">
                                                {opportunity.description}
                                            </p>
                                            <div className="volunteer-details">
                                                <div className="volunteer-detail">
                                                    <span className="detail-label">
                                                        People Needed:
                                                    </span>
                                                    <span className="detail-value">
                                                        {
                                                            opportunity.peopleNeeded
                                                        }
                                                    </span>
                                                </div>
                                                <div className="volunteer-detail">
                                                    <span className="detail-label">
                                                        Duration:
                                                    </span>
                                                    <span className="detail-value">
                                                        {opportunity.duration}
                                                    </span>
                                                </div>
                                            </div>
                                            {opportunity.tags &&
                                                opportunity.tags.length > 0 && (
                                                    <div className="volunteer-tags">
                                                        {opportunity.tags.map(
                                                            (tag, idx) => (
                                                                <span
                                                                    key={idx}
                                                                    className="volunteer-tag"
                                                                >
                                                                    {tag}
                                                                </span>
                                                            )
                                                        )}
                                                    </div>
                                                )}

                                            {/* Application Status Badge */}
                                            {hasApplied && (
                                                <div
                                                    className={`application-status ${
                                                        isPending
                                                            ? "pending"
                                                            : isAccepted
                                                            ? "accepted"
                                                            : "rejected"
                                                    }`}
                                                >
                                                    {isPending && (
                                                        <span>
                                                            ⏳ Application
                                                            Pending
                                                        </span>
                                                    )}
                                                    {isAccepted && (
                                                        <span>
                                                            ✓ Application
                                                            Accepted
                                                        </span>
                                                    )}
                                                    {isRejected && (
                                                        <span>
                                                            ✗ Application Not
                                                            Accepted
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                className="volunteer-button"
                                                onClick={() =>
                                                    handleVolunteerClick(
                                                        opportunity
                                                    )
                                                }
                                                disabled={
                                                    isApplying ||
                                                    (hasApplied && !isRejected)
                                                }
                                            >
                                                {isApplying
                                                    ? "Applying..."
                                                    : hasApplied
                                                    ? isPending
                                                        ? "Already Applied"
                                                        : isAccepted
                                                        ? "Accepted"
                                                        : "Apply Again"
                                                    : "Volunteer"}
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="no-volunteers">
                                <p>
                                    No volunteer opportunities available at the
                                    moment.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Donate Section */}
            <section id="donate-section" className="donate-section">
                <div className="donate-container">
                    <div className="donate-header">
                        <h2>Give — Because They're Counting on Us</h2>
                        <p className="donate-subheader">
                            What you give today becomes part of a quieter,
                            kinder story unfolding where it's needed most.
                        </p>
                    </div>

                    <div className="donate-grid">
                        {ngo.donate?.options &&
                        ngo.donate.options.length > 0 ? (
                            ngo.donate.options.map((option, index) => (
                                <div key={option.id} className="donate-card">
                                    <div className="donate-image">
                                        <img
                                            src={option.image}
                                            alt={option.title}
                                        />
                                    </div>
                                    <div className="donate-content">
                                        <h3 className="donate-title">
                                            {option.title}
                                        </h3>
                                        <p className="donate-description">
                                            {option.description}
                                        </p>
                                        <div className="donate-actions">
                                            {index === 0 ? (
                                                <button
                                                    className="donate-button primary"
                                                    onClick={() =>
                                                        handleDonateClick(
                                                            "marketplace"
                                                        )
                                                    }
                                                >
                                                    Browse Marketplace
                                                </button>
                                            ) : (
                                                <button
                                                    className="donate-button secondary"
                                                    disabled
                                                    style={{ opacity: 0.6, cursor: 'not-allowed' }}
                                                    title="Donations are temporarily unavailable"
                                                >
                                                    Donate Now
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-donations">
                                <p>
                                    No donation options available at the moment.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Donation Modal */}
            {selectedNgo && (
                <DonationModal ngo={selectedNgo} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default NgoPage;
