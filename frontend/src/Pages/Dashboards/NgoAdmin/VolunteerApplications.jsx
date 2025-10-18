// AdminVolunteerApplications.js
import React, { useState } from "react";
import { Search, Filter, Mail, Star, Users, Phone, Award } from "lucide-react";
import "./VolunteerApplications.css";

const mockApplications = [
    {
        name: "Aisha Mehra",
        email: "aisha@example.com",
        contact: "+91-9876543210",
        id: "GRACE1023",
        skills: ["First Aid", "Cooking"],
        interests: ["Community Health", "Nutrition"],
        opportunity: "Community Kitchen Drive",
    },
    {
        name: "Ravi Patel",
        email: "ravi@example.com",
        contact: "+91-9988776655",
        id: "GRACE1044",
        skills: ["Teaching", "Public Speaking"],
        interests: ["Education", "Youth Mentorship"],
        opportunity: "After-School Tutoring",
    },
    {
        name: "Neha Sharma",
        email: "neha@example.com",
        contact: "+91-9123456789",
        id: "GRACE1005",
        skills: ["Organizing", "Team Leadership"],
        interests: ["Women Empowerment", "Event Planning"],
        opportunity: "Women Wellness Camp",
    },
];

const VolunteerApplications = () => {
    const [applications, setApplications] = useState(mockApplications);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterOpportunity, setFilterOpportunity] = useState("All");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleFilter = (e) => {
        setFilterOpportunity(e.target.value);
    };

    const markContacted = (id) => {
        alert(`Marked ${id} as contacted`);
    };

    const shortlist = (id) => {
        alert(`⭐ Shortlisted ${id}`);
    };

    const filteredApplications = applications.filter((app) => {
        const matchesSearch =
            app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            app.skills.some((skill) =>
                skill.toLowerCase().includes(searchTerm.toLowerCase())
            ) ||
            app.interests.some((int) =>
                int.toLowerCase().includes(searchTerm.toLowerCase())
            );

        const matchesOpportunity =
            filterOpportunity === "All" ||
            app.opportunity === filterOpportunity;

        return matchesSearch && matchesOpportunity;
    });

    const allOpportunities = [
        "All",
        ...new Set(applications.map((app) => app.opportunity)),
    ];

    return (
        <div className="volunteer-applications-container">
            <div className="applications-header">
                <Users size={32} className="header-icon" />
                <h1 className="applications-title">Volunteer Applications</h1>
                <p className="applications-subtitle">
                    Review and manage volunteer applications for your
                    organization
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
                            value={filterOpportunity}
                            onChange={handleFilter}
                        >
                            {allOpportunities.map((opp, idx) => (
                                <option key={idx} value={opp}>
                                    {opp}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="applications-section">
                <div className="applications-grid">
                    {filteredApplications.length === 0 ? (
                        <div className="empty-message">
                            <Users size={48} className="empty-icon" />
                            <h3>No Applications Found</h3>
                            <p>
                                No volunteer applications match your current
                                filters.
                            </p>
                        </div>
                    ) : (
                        filteredApplications.map((app, index) => (
                            <div className="application-card" key={index}>
                                <div className="application-header">
                                    <div className="applicant-info">
                                        <h3 className="applicant-name">
                                            {app.name}
                                        </h3>
                                        <span className="grace-id">
                                            {app.id}
                                        </span>
                                    </div>
                                </div>

                                <div className="application-content">
                                    <div className="info-row">
                                        <Mail size={16} className="info-icon" />
                                        <span className="info-label">
                                            Email:
                                        </span>
                                        <span className="info-value">
                                            {app.email}
                                        </span>
                                    </div>

                                    <div className="info-row">
                                        <Phone
                                            size={16}
                                            className="info-icon"
                                        />
                                        <span className="info-label">
                                            Contact:
                                        </span>
                                        <span className="info-value">
                                            {app.contact}
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
                                            {app.opportunity}
                                        </span>
                                    </div>

                                    <div className="skills-section">
                                        <h4 className="section-title">
                                            Skills
                                        </h4>
                                        <div className="tags-container">
                                            {app.skills.map((skill, idx) => (
                                                <span
                                                    key={idx}
                                                    className="skill-tag"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="interests-section">
                                        <h4 className="section-title">
                                            Interests
                                        </h4>
                                        <div className="tags-container">
                                            {app.interests.map(
                                                (interest, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="interest-tag"
                                                    >
                                                        {interest}
                                                    </span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="application-actions">
                                    <button
                                        className="action-btn contact-btn"
                                        onClick={() => markContacted(app.id)}
                                    >
                                        <Mail size={16} />
                                        Mark as Contacted
                                    </button>
                                    <button
                                        className="action-btn shortlist-btn"
                                        onClick={() => shortlist(app.id)}
                                    >
                                        <Star size={16} />
                                        Shortlist
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <button className="view-history-btn">
                <Users size={20} />
                View Application History
            </button>
        </div>
    );
};

export default VolunteerApplications;
