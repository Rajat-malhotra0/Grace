import React, { useState, useEffect } from "react";
import { withApiBase } from "config";
import { X, Plus, Trash2, Save } from "lucide-react";
import "./NgoPageEditor.css";

const NgoPageEditor = ({ ngo, onClose, onUpdate }) => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (ngo) {
            setFormData({
                name: ngo.name || "",
                quote: ngo.quote || "",
                description: ngo.description || "",
                heroVideo: ngo.heroVideo || "",
                coverImage: {
                    url: ngo.coverImage?.url || "",
                },
                aboutUs: {
                    description: ngo.aboutUs?.description || "",
                    image: ngo.aboutUs?.image || "",
                },
                projects: ngo.projects || [],
                donate: ngo.donate || { options: [] },
            });
        }
    }, [ngo]);

    const handleChange = (e, section = null) => {
        const { name, value } = e.target;
        if (section) {
            setFormData((prev) => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [name]: value,
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleCoverImageChange = (e) => {
        const { value } = e.target;
        setFormData((prev) => ({
            ...prev,
            coverImage: {
                ...prev.coverImage,
                url: value,
            },
        }));
    };

    // Project handlers
    const addProject = () => {
        const newProject = {
            id: Date.now(), // Temporary ID
            title: "",
            description: "",
            image: "",
        };
        setFormData((prev) => ({
            ...prev,
            projects: [...prev.projects, newProject],
        }));
    };

    const updateProject = (index, field, value) => {
        setFormData((prev) => {
            const updatedProjects = [...prev.projects];
            updatedProjects[index] = {
                ...updatedProjects[index],
                [field]: value,
            };
            return { ...prev, projects: updatedProjects };
        });
    };

    const removeProject = (index) => {
        setFormData((prev) => ({
            ...prev,
            projects: prev.projects.filter((_, i) => i !== index),
        }));
    };

    // Donation Option handlers
    const addDonationOption = () => {
        const newOption = {
            id: Date.now(),
            title: "",
            description: "",
            image: "",
            buttonText: "Donate",
        };
        setFormData((prev) => ({
            ...prev,
            donate: {
                ...prev.donate,
                options: [...(prev.donate.options || []), newOption],
            },
        }));
    };

    const updateDonationOption = (index, field, value) => {
        setFormData((prev) => {
            const updatedOptions = [...(prev.donate.options || [])];
            updatedOptions[index] = {
                ...updatedOptions[index],
                [field]: value,
            };
            return {
                ...prev,
                donate: { ...prev.donate, options: updatedOptions },
            };
        });
    };

    const removeDonationOption = (index) => {
        setFormData((prev) => ({
            ...prev,
            donate: {
                ...prev.donate,
                options: prev.donate.options.filter((_, i) => i !== index),
            },
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(withApiBase(`/api/ngos/${ngo._id}`), {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                if (onUpdate) onUpdate(data.result);
                onClose();
            } else {
                setError(data.message || "Failed to update NGO");
            }
        } catch (err) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!formData) return null;

    return (
        <div className="ngo-editor-overlay">
            <div className="ngo-editor-modal">
                <div className="ngo-editor-header">
                    <h2>Edit Page: {ngo.name}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                <div className="ngo-editor-content">
                    {error && (
                        <div className="error-message p-3 bg-red-100 text-red-700 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* General Info */}
                        <section className="editor-section">
                            <h3>General Information</h3>
                            <div className="form-group">
                                <label>NGO Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Hero Quote / Tagline</label>
                                <textarea
                                    name="quote"
                                    value={formData.quote}
                                    onChange={handleChange}
                                    rows="2"
                                />
                            </div>
                            <div className="form-group">
                                <label>Short Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="3"
                                />
                            </div>
                        </section>

                        {/* Media */}
                        <section className="editor-section">
                            <h3>Media</h3>
                            <div className="form-group">
                                <label>Cover Image URL</label>
                                <input
                                    type="text"
                                    value={formData.coverImage.url}
                                    onChange={handleCoverImageChange}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="form-group">
                                <label>Hero Video URL (Optional)</label>
                                <input
                                    type="text"
                                    name="heroVideo"
                                    value={formData.heroVideo}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                                <small>
                                    Overrides cover image if present. Provide a
                                    direct video link.
                                </small>
                            </div>
                        </section>

                        {/* About Us */}
                        <section className="editor-section">
                            <h3>About Us</h3>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    name="description"
                                    value={formData.aboutUs.description}
                                    onChange={(e) => handleChange(e, "aboutUs")}
                                    rows="5"
                                />
                            </div>
                            <div className="form-group">
                                <label>Image URL</label>
                                <input
                                    type="text"
                                    name="image"
                                    value={formData.aboutUs.image}
                                    onChange={(e) => handleChange(e, "aboutUs")}
                                />
                            </div>
                        </section>

                        {/* Projects */}
                        <section className="editor-section">
                            <div className="section-header-row">
                                <h3>Projects</h3>
                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={addProject}
                                >
                                    <Plus size={16} /> Add Project
                                </button>
                            </div>
                            <div className="items-list">
                                {formData.projects.map((project, index) => (
                                    <div key={index} className="item-card">
                                        <div className="item-header">
                                            <span>Project #{index + 1}</span>
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeProject(index)}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="form-group">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                value={project.title}
                                                onChange={(e) =>
                                                    updateProject(
                                                        index,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description</label>
                                            <textarea
                                                value={project.description}
                                                onChange={(e) =>
                                                    updateProject(
                                                        index,
                                                        "description",
                                                        e.target.value
                                                    )
                                                }
                                                rows="3"
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Image URL</label>
                                            <input
                                                type="text"
                                                value={project.image}
                                                onChange={(e) =>
                                                    updateProject(
                                                        index,
                                                        "image",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        {/* Donation Options */}
                        <section className="editor-section">
                            <div className="section-header-row">
                                <h3>Donation Options</h3>
                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={addDonationOption}
                                >
                                    <Plus size={16} /> Add Option
                                </button>
                            </div>
                            <div className="items-list">
                                {formData.donate?.options?.map(
                                    (option, index) => (
                                        <div key={index} className="item-card">
                                            <div className="item-header">
                                                <span>Option #{index + 1}</span>
                                                <button
                                                    type="button"
                                                    className="remove-btn"
                                                    onClick={() =>
                                                        removeDonationOption(index)
                                                    }
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            <div className="form-group">
                                                <label>Title</label>
                                                <input
                                                    type="text"
                                                    value={option.title}
                                                    onChange={(e) =>
                                                        updateDonationOption(
                                                            index,
                                                            "title",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Description</label>
                                                <textarea
                                                    value={option.description}
                                                    onChange={(e) =>
                                                        updateDonationOption(
                                                            index,
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                    rows="2"
                                                />
                                            </div>
                                            <div className="form-group">
                                                <label>Image URL</label>
                                                <input
                                                    type="text"
                                                    value={option.image}
                                                    onChange={(e) =>
                                                        updateDonationOption(
                                                            index,
                                                            "image",
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </section>

                        <div className="editor-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="save-btn"
                                disabled={loading}
                            >
                                <Save size={18} />
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NgoPageEditor;
