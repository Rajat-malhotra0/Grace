import React from "react";
import "./Register.css";

function NgoFormFields({
    formData,
    handleChange,
    categories,
    setFormData,
    errors = {},
}) {
    return (
        <>
            <label>Organization Name</label>
            <input
                type="text"
                name="organizationName"
                placeholder="Organization Name"
                onChange={handleChange}
                value={formData.organizationName || ""}
                required
            />
            <div style={{ color: "red" }}> {errors.organizationName}</div>

            <label>Registration Number</label>
            <input
                type="text"
                name="registrationNumber"
                placeholder="NGO Registration Number"
                onChange={handleChange}
                value={formData.registrationNumber || ""}
                required
            />
            <div style={{ color: "red" }}> {errors.registrationNumber}</div>

            <label>Phone Number</label>
            <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                onChange={handleChange}
                value={formData.phoneNumber || ""}
                required
            />
            <div style={{ color: "red" }}> {errors.phoneNumber}</div>

            <label>Website (Optional)</label>
            <input
                type="url"
                name="website"
                placeholder="Organization Website"
                onChange={handleChange}
                value={formData.website || ""}
            />

            <label>Organization Description</label>
            <textarea
                name="description"
                placeholder="Brief description of your organization"
                onChange={handleChange}
                value={formData.description || ""}
                required
            />
            <div style={{ color: "red" }}> {errors.description}</div>

            <label>Focus Areas</label>
            <select
                className="styled-select"
                name="focusAreas"
                onChange={handleChange}
                value=""
                required={
                    !(
                        Array.isArray(formData.focusAreas) &&
                        formData.focusAreas.length > 0
                    )
                }
            >
                <option value="" disabled>
                    {categories.length === 0
                        ? "Loading categories..."
                        : "Select a focus area"}
                </option>
                {categories.map((category) => (
                    <option
                        key={category._id}
                        value={category._id}
                        disabled={
                            Array.isArray(formData.focusAreas) &&
                            formData.focusAreas.includes(category._id)
                        }
                    >
                        {category.name}
                    </option>
                ))}
            </select>
            <div style={{ color: "red" }}> {errors.focusAreas}</div>

            {Array.isArray(formData.focusAreas) &&
            formData.focusAreas.length > 0 ? (
                <div className="selected-categories-list">
                    {formData.focusAreas.map((catId) => {
                        const cat = categories.find((c) => c._id === catId);
                        return (
                            <span
                                className="selected-category-chip"
                                key={catId}
                            >
                                {cat ? cat.name : catId}
                                <button
                                    type="button"
                                    className="remove-category-btn"
                                    onClick={() => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            focusAreas: prev.focusAreas.filter(
                                                (id) => id !== catId
                                            ),
                                        }));
                                    }}
                                    aria-label="Remove"
                                >
                                    ×
                                </button>
                            </span>
                        );
                    })}
                </div>
            ) : null}
        </>
    );
}

export default NgoFormFields;
