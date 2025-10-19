// AdminVolunteerOpportunities.js
import React, { useState, useEffect, useContext } from "react";
import { Plus, Users, Clock, FileText, Trash2 } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthContext";
import "./VolunteerOpportunities.css";

const predefinedTags = [
    "Student Friendly",
    "Women Empowerment",
    "Weekend Only",
    "Good for Beginners",
    "Medical Help",
    "Teaching",
    "On-Site",
    "Remote",
];

const VolunteerOpportunities = () => {
    const { ngo } = useContext(AuthContext);
    const [opportunityForms, setOpportunityForms] = useState([
        {
            title: "",
            description: "",
            peopleNeeded: "",
            duration: "",
            tags: [],
        },
    ]);
    const [existingOpportunities, setExistingOpportunities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (ngo?._id) {
            fetchOpportunities();
        } else {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ngo]);

    const fetchOpportunities = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:3001/api/ngos/${ngo._id}/volunteer-opportunities`
            );
            if (response.data.success) {
                setExistingOpportunities(response.data.result || []);
            }
        } catch (error) {
            console.error("Error fetching opportunities:", error);
            alert("Failed to load existing opportunities");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (index, field, value) => {
        const newForms = [...opportunityForms];
        newForms[index][field] = value;
        setOpportunityForms(newForms);
    };

    const toggleTag = (index, tag) => {
        const newForms = [...opportunityForms];
        const tags = newForms[index].tags;
        newForms[index].tags = tags.includes(tag)
            ? tags.filter((t) => t !== tag)
            : [...tags, tag];
        setOpportunityForms(newForms);
    };

    const handleSubmit = async (index) => {
        const form = opportunityForms[index];
        if (
            !form.title ||
            !form.description ||
            !form.peopleNeeded ||
            !form.duration
        ) {
            alert("Please fill all required fields!");
            return;
        }

        if (!ngo?._id) {
            alert("NGO information not found. Please login again.");
            return;
        }

        try {
            const response = await axios.post(
                `http://localhost:3001/api/ngos/${ngo._id}/volunteer-opportunities`,
                {
                    title: form.title,
                    description: form.description,
                    peopleNeeded: form.peopleNeeded,
                    duration: form.duration,
                    tags: form.tags,
                }
            );

            if (response.data.success) {
                alert("Opportunity Assigned Successfully!");
                // Reset the form
                const newForms = [...opportunityForms];
                newForms[index] = {
                    title: "",
                    description: "",
                    peopleNeeded: "",
                    duration: "",
                    tags: [],
                };
                setOpportunityForms(newForms);
                // Refresh the opportunities list
                fetchOpportunities();
            }
        } catch (error) {
            console.error("Error creating opportunity:", error);
            alert(
                error.response?.data?.message ||
                    "Failed to create opportunity. Please try again."
            );
        }
    };

    const addOpportunityColumn = () => {
        setOpportunityForms([
            ...opportunityForms,
            {
                title: "",
                description: "",
                peopleNeeded: "",
                duration: "",
                tags: [],
            },
        ]);
    };

    const handleDelete = async (opportunityId) => {
        if (
            !window.confirm(
                "Are you sure you want to delete this opportunity? This action cannot be undone."
            )
        ) {
            return;
        }

        try {
            const response = await axios.delete(
                `http://localhost:3001/api/ngos/${ngo._id}/volunteer-opportunities/${opportunityId}`
            );

            if (response.data.success) {
                alert("Opportunity deleted successfully!");
                // Refresh the opportunities list
                fetchOpportunities();
            }
        } catch (error) {
            console.error("Error deleting opportunity:", error);
            alert(
                error.response?.data?.message ||
                    "Failed to delete opportunity. Please try again."
            );
        }
    };

    if (loading) {
        return (
            <div className="volunteer-opportunities-container">
                <div className="opportunities-header">
                    <h1 className="opportunities-title">Loading...</h1>
                </div>
            </div>
        );
    }

    if (!ngo) {
        return (
            <div className="volunteer-opportunities-container">
                <div className="opportunities-header">
                    <h1 className="opportunities-title">
                        NGO information not found
                    </h1>
                    <p className="opportunities-subtitle">
                        Please login as an NGO to manage volunteer opportunities
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="volunteer-opportunities-container">
            <div className="opportunities-header">
                <Users size={32} className="header-icon" />
                <h1 className="opportunities-title">Volunteer Opportunities</h1>
                <p className="opportunities-subtitle">
                    Create and manage volunteer opportunities for your
                    organization
                </p>
            </div>

            {/* Existing Opportunities */}
            {existingOpportunities.length > 0 && (
                <div className="existing-opportunities-section">
                    <h2 className="section-title">Current Opportunities</h2>
                    <div className="volunteer-board">
                        {existingOpportunities.map((opportunity) => (
                            <div
                                className="volunteer-column"
                                key={opportunity.id}
                            >
                                <div className="opportunity-header">
                                    <FileText
                                        size={20}
                                        className="column-icon"
                                    />
                                    <h3 className="opportunity-title">
                                        {opportunity.title}
                                    </h3>
                                </div>

                                <div className="form-group">
                                    <p className="opportunity-display-text">
                                        {opportunity.description}
                                    </p>
                                </div>

                                <div className="form-group">
                                    <div className="input-with-icon">
                                        <Users
                                            size={16}
                                            className="input-icon"
                                        />
                                        <p className="opportunity-display-value">
                                            {opportunity.peopleNeeded} People
                                            Needed
                                        </p>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <div className="input-with-icon">
                                        <Clock
                                            size={16}
                                            className="input-icon"
                                        />
                                        <p className="opportunity-display-value">
                                            {opportunity.duration}
                                        </p>
                                    </div>
                                </div>

                                {opportunity.tags &&
                                    opportunity.tags.length > 0 && (
                                        <div className="form-group">
                                            <label className="form-label">
                                                Tags
                                            </label>
                                            <div className="tag-selector">
                                                {opportunity.tags.map(
                                                    (tag, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="tag selected"
                                                        >
                                                            {tag}
                                                        </span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(opportunity.id)}
                                    title="Delete this opportunity"
                                >
                                    <Trash2 size={16} />
                                    Delete Opportunity
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Opportunity Forms */}
            <div className="new-opportunities-section">
                <h2 className="section-title">Create New Opportunities</h2>
                <div className="volunteer-board">
                    {opportunityForms.map((form, index) => (
                        <div className="volunteer-column" key={index}>
                            <div className="opportunity-header">
                                <FileText size={20} className="column-icon" />
                                <h3 className="opportunity-title">
                                    Opportunity {index + 1}
                                </h3>
                            </div>

                            <div className="form-group">
                                <input
                                    name="title"
                                    placeholder="Opportunity Title"
                                    value={form.title}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "title",
                                            e.target.value
                                        )
                                    }
                                    className="form-input"
                                />
                            </div>

                            <div className="form-group">
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    value={form.description}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    className="form-textarea"
                                />
                            </div>

                            <div className="form-group">
                                <div className="input-with-icon">
                                    <Users size={16} className="input-icon" />
                                    <input
                                        name="peopleNeeded"
                                        placeholder="People Needed"
                                        type="number"
                                        value={form.peopleNeeded}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "peopleNeeded",
                                                e.target.value
                                            )
                                        }
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="input-with-icon">
                                    <Clock size={16} className="input-icon" />
                                    <input
                                        name="duration"
                                        placeholder="Duration (e.g. 2 weeks)"
                                        value={form.duration}
                                        onChange={(e) =>
                                            handleChange(
                                                index,
                                                "duration",
                                                e.target.value
                                            )
                                        }
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Tags</label>
                                <div className="tag-selector">
                                    {predefinedTags.map((tag) => (
                                        <button
                                            key={tag}
                                            type="button"
                                            className={
                                                form.tags.includes(tag)
                                                    ? "tag selected"
                                                    : "tag"
                                            }
                                            onClick={() =>
                                                toggleTag(index, tag)
                                            }
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="assign-btn"
                                onClick={() => handleSubmit(index)}
                            >
                                Assign Opportunity
                            </button>
                        </div>
                    ))}

                    <div className="volunteer-column add-column">
                        <div className="add-column-content">
                            <Plus size={32} className="add-icon" />
                            <h3 className="add-title">Add New Opportunity</h3>
                            <p className="add-subtitle">
                                Create another volunteer opportunity
                            </p>
                            <button
                                className="add-btn"
                                onClick={addOpportunityColumn}
                            >
                                <Plus size={20} />
                                Add Opportunity
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerOpportunities;
