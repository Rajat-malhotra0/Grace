import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import axios from "axios";

function Register() {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]:
                e.target.type === "checkbox"
                    ? e.target.checked
                    : e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Determine URL based on user role
        const apiUrl =
            formData.role === "ngo"
                ? "http://localhost:3001/api/ngos"
                : formData.role === "donor"
                ? "http://localhost:3001/api/donors"
                : formData.role === "volunteer"
                ? "http://localhost:3001/api/volunteers"
                : "http://localhost:3001/api/users";

        // Create payload based on user role
        const payload =
            formData.role === "ngo"
                ? {
                      userName: formData.name,
                      email: formData.email,
                      password: formData.password,
                      role: [formData.role],
                      organizationName: formData.organizationName,
                      registrationNumber: formData.registrationNumber,
                      address: formData.address,
                      contactPerson: formData.contactPerson,
                      phoneNumber: formData.phoneNumber,
                      website: formData.website,
                      description: formData.description,
                      focusAreas: formData.focusAreas
                          ? [formData.focusAreas]
                          : [],
                      isActive: true,
                      dob: formData.dob,
                      remindMe: formData.remindMe || false,
                      termsAccepted: formData.termsAccepted || false,
                      newsLetter: formData.newsLetter || false,
                      verificationStatus: "pending",
                  }
                : {
                      userName: formData.name,
                      email: formData.email,
                      password: formData.password,
                      role: formData.role ? [formData.role] : [],
                      about: formData.about || "",
                      score: 0,
                      isActive: true,
                      dob: formData.dob,
                      remindMe: formData.remindMe || false,
                      termsAccepted: formData.termsAccepted || false,
                      newsLetter: formData.newsLetter || false,
                  };

        try {
            const response = await axios.post(apiUrl, payload);

            if (response.status === 201) {
                alert("Registration successful!");
                console.log(response.data);
            }
        } catch (err) {
            console.log(err);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <div className="register-page-container">
            <p>
                Hi there! we are so happy, you found us.
                <br />
                You're just a few steps away from joining our community of
                changemakers
            </p>
            <span>Create an account</span>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email || ""}
                    required
                />
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    value={formData.name || ""}
                    required
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password || ""}
                    required
                />
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmedPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    value={formData.confirmedPassword || ""}
                    required
                />

                <div className="user-type-selection">
                    <p>I am a:</p>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="ngo"
                            onChange={handleChange}
                            checked={formData.role === "ngo"}
                        />
                        NGO
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="donor"
                            onChange={handleChange}
                            checked={formData.role === "donor"}
                        />
                        Donor
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="volunteer"
                            onChange={handleChange}
                            checked={formData.role === "volunteer"}
                        />
                        Volunteer
                    </label>
                </div>

                {/* NGO-specific fields */}
                {formData.role === "ngo" ? (
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

                        <label>Registration Number</label>
                        <input
                            type="text"
                            name="registrationNumber"
                            placeholder="NGO Registration Number"
                            onChange={handleChange}
                            value={formData.registrationNumber || ""}
                            required
                        />

                        <label>Address</label>
                        <textarea
                            name="address"
                            placeholder="Organization Address"
                            onChange={handleChange}
                            value={formData.address || ""}
                            required
                        />

                        <label>Contact Person</label>
                        <input
                            type="text"
                            name="contactPerson"
                            placeholder="Contact Person Name"
                            onChange={handleChange}
                            value={formData.contactPerson || ""}
                            required
                        />

                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            onChange={handleChange}
                            value={formData.phoneNumber || ""}
                            required
                        />

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

                        <label>Focus Areas</label>
                        <select
                            name="focusAreas"
                            onChange={handleChange}
                            value={formData.focusAreas || ""}
                            required
                        >
                            <option value="">Select Focus Area</option>
                            <option value="education">Education</option>
                            <option value="healthcare">Healthcare</option>
                            <option value="environment">Environment</option>
                            <option value="poverty">Poverty Alleviation</option>
                            <option value="women-empowerment">
                                Women Empowerment
                            </option>
                            <option value="child-welfare">Child Welfare</option>
                            <option value="disaster-relief">
                                Disaster Relief
                            </option>
                            <option value="other">Other</option>
                        </select>
                    </>
                ) : (
                    // Fields for donor/volunteer
                    <>
                        <label>About Yourself (Optional)</label>
                        <textarea
                            name="about"
                            placeholder="Tell us about yourself"
                            onChange={handleChange}
                            value={formData.about || ""}
                        />
                    </>
                )}

                <label>
                    Date of birth:
                    <input
                        type="date"
                        name="dob"
                        onChange={handleChange}
                        value={formData.dob || ""}
                        required
                    />
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="remindMe"
                        onChange={handleChange}
                        checked={formData.remindMe || false}
                    />
                    Give me reminders
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="termsAccepted"
                        onChange={handleChange}
                        checked={formData.termsAccepted || false}
                        required
                    />
                    I accept the Terms and Conditions
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="newsLetter"
                        onChange={handleChange}
                        checked={formData.newsLetter || false}
                    />
                    Subscribe to newsletter
                </label>

                <button type="submit">Register</button>
            </form>

            <span>
                Already have an account: <Link to="/login">login</Link>
            </span>
        </div>
    );
}

export default Register;