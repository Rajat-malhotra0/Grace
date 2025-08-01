import React from "react";
import "./Register.css";

function VolunteerFormFields({ formData, handleChange }) {
    return (
        <>
            <label>How would you like to volunteer with us: </label>
            <label>
                <input
                    type="radio"
                    name="volunteerType"
                    value="individual"
                    onChange={handleChange}
                    checked={formData.volunteerType === "individual"}
                />
                As an individual
            </label>
            <label>
                <input
                    type="radio"
                    name="volunteerType"
                    value="school"
                    onChange={handleChange}
                    checked={formData.volunteerType === "school"}
                />
                As a school partnership
            </label>
            <label>
                <input
                    type="radio"
                    name="volunteerType"
                    value="corporate"
                    onChange={handleChange}
                    checked={formData.volunteerType === "corporate"}
                />
                As a corporate partnership
            </label>
            <label>
                <input
                    type="radio"
                    name="volunteerType"
                    value="intern"
                    onChange={handleChange}
                    checked={formData.volunteerType === "intern"}
                />
                For an internship
            </label>
            <label>
                <input
                    type="radio"
                    name="volunteerType"
                    value="career"
                    onChange={handleChange}
                    checked={formData.volunteerType === "career"}
                />
                As a career
            </label>

            {formData.volunteerType === "school" ? (
                <>
                    <label>School Name</label>
                    <input
                        type="text"
                        name="organizationName"
                        placeholder="Organization Name"
                        onChange={handleChange}
                        value={formData.organizationName || ""}
                        required
                    />

                    <label>School Address</label>
                    <textarea
                        name="organizationAddress"
                        placeholder="Address"
                        onChange={handleChange}
                        value={formData.organizationAddress || ""}
                        required
                    />

                    <label>City</label>
                    <input
                        type="text"
                        name="organizationCity"
                        placeholder="City"
                        onChange={handleChange}
                        value={formData.organizationCity || ""}
                        required
                    />

                    <label>State</label>
                    <input
                        type="text"
                        name="organizationState"
                        placeholder="State"
                        onChange={handleChange}
                        value={formData.organizationState || ""}
                        required
                    />
                </>
            ) : formData.volunteerType === "corporate" ? (
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
                    <label>Company Address</label>
                    <textarea
                        name="organizationAddress"
                        placeholder="Address"
                        onChange={handleChange}
                        value={formData.organizationAddress || ""}
                        required
                    />

                    <label>City</label>
                    <input
                        type="text"
                        name="organizationCity"
                        placeholder="City"
                        onChange={handleChange}
                        value={formData.organizationCity || ""}
                        required
                    />

                    <label>State</label>
                    <input
                        type="text"
                        name="organizationState"
                        placeholder="State"
                        onChange={handleChange}
                        value={formData.organizationState || ""}
                        required
                    />

                    <label>Department/Team Name</label>
                    <input
                        type="text"
                        name="organizationDepartment"
                        placeholder="Department"
                        onChange={handleChange}
                        value={formData.organizationDepartment || ""}
                        required
                    />

                    <label>Your Designation / Role</label>
                    <input
                        type="text"
                        name="organizationPersonRole"
                        placeholder="Role"
                        onChange={handleChange}
                        value={formData.organizationPersonRole || ""}
                        required
                    />

                    <label>About Yourself (Optional)</label>
                    <textarea
                        name="about"
                        placeholder="Tell us about yourself"
                        onChange={handleChange}
                        value={formData.about || ""}
                    />
                </>
            ) : null}
        </>
    );
}

export default VolunteerFormFields;
