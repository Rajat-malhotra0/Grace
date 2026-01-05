import React, { useState, useContext } from "react";
import {
    Package,
    Tag,
    Hash,
    AlertTriangle,
    Plus,
    MapPin,
    Calendar,
} from "lucide-react";
import axios from "axios";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Context/AuthContext";
import "./DonationNeedsForm.css";

const categories = [
    "Food & Nutrition",
    "Clothing & Apparel",
    "Books & Stationery",
    "Medical & Hygiene Supplies",
    "Technology",
    "Furniture & Essentials",
    "Toys & Recreation",
    "Skill Tools",
    "Other Items",
];

const urgencyLevels = ["Low", "Medium", "High"];

const DonationNeedsForm = () => {
    const { ngo } = useContext(AuthContext);

    const [needForms, setNeedForms] = useState([
        {
            itemName: "",
            description: "",
            category: "",
            quantity: "",
            urgency: "",
            location: "",
            neededTill: "",
        },
    ]);

    const [submitting, setSubmitting] = useState({});

    const handleChange = (index, field, value) => {
        const newForms = [...needForms];
        newForms[index][field] = value;
        setNeedForms(newForms);
    };

    const handleSubmit = async (index) => {
        const form = needForms[index];
        if (
            !form.itemName ||
            !form.description ||
            !form.category ||
            !form.quantity ||
            !form.urgency ||
            !form.location ||
            !form.neededTill
        ) {
            alert("Please fill in all fields");
            return;
        }

        if (!ngo || !ngo._id) {
            alert("NGO information not found. Please login again.");
            return;
        }

        const ngoId = ngo._id;

        setSubmitting((prev) => ({ ...prev, [index]: true }));

        try {
            const marketplaceData = {
                name: form.itemName,
                description: form.description,
                quantity: parseInt(form.quantity),
                category: form.category,
                neededBy: ngoId,
                urgency: form.urgency,
                location: form.location,
                neededTill: new Date(form.neededTill).toISOString(),
            };

            const response = await axios.post(
                `${API_URL}/marketplace`,
                marketplaceData
            );

            if (response.status === 201) {
                alert("Need posted to marketplace successfully!");

                const newForms = [...needForms];
                newForms[index] = {
                    itemName: "",
                    description: "",
                    category: "",
                    quantity: "",
                    urgency: "",
                    location: "",
                    neededTill: "",
                };
                setNeedForms(newForms);
            }
        } catch (error) {
            console.error("Error posting to marketplace:", error);
            alert("Error posting to marketplace. Please try again.");
        } finally {
            setSubmitting((prev) => ({ ...prev, [index]: false }));
        }
    };

    const addNeedColumn = () => {
        setNeedForms([
            ...needForms,
            {
                itemName: "",
                description: "",
                category: "",
                quantity: "",
                urgency: "",
                location: "",
                neededTill: "",
            },
        ]);
    };

    const getUrgencyClass = (urgency) => {
        switch (urgency.toLowerCase()) {
            case "high":
                return "urgency-high";
            case "medium":
                return "urgency-medium";
            case "low":
                return "urgency-low";
            default:
                return "";
        }
    };

    // Get tomorrow's date as minimum for neededTill
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    };

    return (
        <div className="donation-needs-form-container">
            <div className="needs-form-header">
                <Package size={32} className="header-icon" />
                <h1 className="needs-form-title">Donation Needs Request</h1>
                <p className="needs-form-subtitle">
                    Post your organization's current needs to the marketplace
                </p>
            </div>

            <div className="needs-form-board">
                {needForms.map((form, index) => (
                    <div className="need-column" key={index}>
                        <div className="need-header">
                            <Package size={20} className="column-icon" />
                            <h3 className="need-title">
                                Need Request {index + 1}
                            </h3>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Item Name</label>
                            <div className="input-with-icon">
                                <Tag size={16} className="input-icon" />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Rice bags, Winter clothes"
                                    value={form.itemName}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "itemName",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Description</label>
                            <div className="input-with-icon">
                                <Tag size={16} className="input-icon" />
                                <textarea
                                    className="form-input"
                                    placeholder="Describe the item and its purpose"
                                    value={form.description}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "description",
                                            e.target.value
                                        )
                                    }
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Category</label>
                            <div className="input-with-icon">
                                <Package size={16} className="input-icon" />
                                <select
                                    className="form-select"
                                    value={form.category}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "category",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Quantity</label>
                            <div className="input-with-icon">
                                <Hash size={16} className="input-icon" />
                                <input
                                    type="number"
                                    className="form-input"
                                    placeholder="e.g., 50"
                                    value={form.quantity}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "quantity",
                                            e.target.value
                                        )
                                    }
                                    min="1"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Location</label>
                            <div className="input-with-icon">
                                <MapPin size={16} className="input-icon" />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g., Mumbai, Maharashtra"
                                    value={form.location}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "location",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Needed Till</label>
                            <div className="input-with-icon">
                                <Calendar size={16} className="input-icon" />
                                <input
                                    type="date"
                                    className="form-input"
                                    value={form.neededTill}
                                    onChange={(e) =>
                                        handleChange(
                                            index,
                                            "neededTill",
                                            e.target.value
                                        )
                                    }
                                    min={getTomorrowDate()}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Urgency Level</label>
                            <div className="urgency-selector">
                                {urgencyLevels.map((level) => (
                                    <button
                                        key={level}
                                        type="button"
                                        className={`urgency-btn ${
                                            form.urgency === level
                                                ? `selected ${getUrgencyClass(
                                                      level
                                                  )}`
                                                : ""
                                        }`}
                                        onClick={() =>
                                            handleChange(
                                                index,
                                                "urgency",
                                                level
                                            )
                                        }
                                    >
                                        <AlertTriangle size={14} />
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            className="post-need-btn"
                            onClick={() => handleSubmit(index)}
                            disabled={submitting[index]}
                        >
                            <Package size={16} />
                            {submitting[index]
                                ? "Posting..."
                                : "Post to Marketplace"}
                        </button>
                    </div>
                ))}

                <div className="need-column add-column">
                    <div className="add-column-content">
                        <Plus size={32} className="add-icon" />
                        <h3 className="add-title">Add Another Need</h3>
                        <p className="add-subtitle">
                            Request multiple items at once
                        </p>
                        <button className="add-btn" onClick={addNeedColumn}>
                            <Plus size={20} />
                            Add Need Request
                        </button>
                    </div>
                </div>
            </div>

            <button className="view-marketplace-btn">
                <Package size={20} />
                View Marketplace
            </button>
        </div>
    );
};

export default DonationNeedsForm;
