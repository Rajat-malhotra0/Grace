// AdminVolunteerOpportunities.js
import React, { useState } from "react";
import { Plus, Users, Clock, FileText } from "lucide-react";
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
    const [opportunityForms, setOpportunityForms] = useState([
        {
            title: "",
            description: "",
            peopleNeeded: "",
            duration: "",
            tags: [],
        },
    ]);

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

    const handleSubmit = (index) => {
        const form = opportunityForms[index];
        if (
            !form.title ||
            !form.description ||
            !form.peopleNeeded ||
            !form.duration
        )
            return;
        console.log("Saving opportunity to DB:", form);
        alert("Opportunity Assigned!");
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
                                    handleChange(index, "title", e.target.value)
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
                                        onClick={() => toggleTag(index, tag)}
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

            <button className="view-history-btn-">
                <FileText size={20} />
                View Opportunity History
            </button>
        </div>
    );
};

export default VolunteerOpportunities;
