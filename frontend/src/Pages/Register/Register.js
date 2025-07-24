/*
Todo: 
Can make the form a lot more more refined, and needs testing
*/

import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/ReactToastify.css";

function Register() {
    const [formData, setFormData] = useState({
        remindMe: false,
        termsAccepted: false,
        newsLetter: false,
    });
    const [categories, setCategories] = useState([]);
    const { register } = useContext(AuthContext);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/categories?type=ngo"
                );
                if (response.status === 200) {
                    setCategories(response.data.result);
                }
            } catch (err) {
                console.log("error fetching categories", err);
            }
        }
        fetchCategories();
    }, []);

    const NgoRegistrationToast = () => (
        <div>
            <p
                style={{
                    margin: 0,
                    lineHeight: "1.6",
                    color: "#2c2c2c",
                    fontFamily: '"Crimson Text", serif',
                    fontSize: "1rem",
                    fontWeight: "400",
                    letterSpacing: "0.3px",
                }}
            >
                Thank you for registering with{" "}
                <strong style={{ fontWeight: "600", color: "#1a1a1a" }}>
                    Grace
                </strong>
                ! We're thrilled to welcome you to this growing network of
                changemakers.
                <br />
                <br />A member of our team will be in touch shortly to verify
                your information and help set up your public profile. In the
                meantime, feel free to explore the platform and start organizing
                your day-to-day tasks with ease.
            </p>
            <div
                style={{
                    marginTop: "18px",
                    borderTop: "1px solid #e1e1e1",
                    paddingTop: "12px",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "#555555",
                        fontFamily: '"Crimson Text", serif',
                        lineHeight: "1.5",
                        letterSpacing: "0.2px",
                    }}
                >
                    Want to share your work with us right away?
                    <br />
                    Email us at:{" "}
                    <a
                        href="mailto:teamgrace@gmail.com"
                        style={{
                            color: "#2c5530",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontFamily: '"Crimson Text", serif',
                            borderBottom: "1px solid #2c5530",
                            transition: "all 0.2s ease",
                        }}
                    >
                        teamgrace@gmail.com
                    </a>
                </p>
            </div>
        </div>
    );

    const VolunteerRegistrationToast = () => (
        <div>
            <p
                style={{
                    margin: 0,
                    lineHeight: "1.6",
                    color: "#2c2c2c",
                    fontFamily: '"Crimson Text", serif',
                    fontSize: "1rem",
                    fontWeight: "400",
                    letterSpacing: "0.3px",
                }}
            >
                Welcome to{" "}
                <strong style={{ fontWeight: "600", color: "#1a1a1a" }}>
                    Grace
                </strong>
                !
                <br />
                <br />
                Your registration is received. We'll contact you soon to help
                set up your profile.
            </p>
            <div
                style={{
                    marginTop: "18px",
                    borderTop: "1px solid #e1e1e1",
                    paddingTop: "12px",
                }}
            >
                <p
                    style={{
                        margin: 0,
                        fontSize: "0.9rem",
                        color: "#555555",
                        fontFamily: '"Crimson Text", serif',
                        lineHeight: "1.5",
                        letterSpacing: "0.2px",
                    }}
                >
                    Questions? Email:{" "}
                    <a
                        href="mailto:teamgrace@gmail.com"
                        style={{
                            color: "#2c5530",
                            textDecoration: "none",
                            fontWeight: "600",
                            fontFamily: '"Crimson Text", serif',
                            borderBottom: "1px solid #2c5530",
                            transition: "all 0.2s ease",
                        }}
                    >
                        teamgrace@gmail.com
                    </a>
                </p>
            </div>
        </div>
    );

    const handleChange = (e) => {
        if (e.target.name === "focusAreas") {
            const selectedValue = e.target.value;
            if (selectedValue && selectedValue !== "") {
                setFormData((prevData) => {
                    const currentAreas = prevData.focusAreas || [];
                    if (!currentAreas.includes(selectedValue)) {
                        return {
                            ...prevData,
                            focusAreas: [...currentAreas, selectedValue],
                        };
                    }
                });
            }
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [e.target.name]:
                    e.target.type === "checkbox"
                        ? e.target.checked
                        : e.target.value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmedPassword) {
            alert("Passwords do not match.");
            return;
        }

        let payload = {
            userName: formData.name,
            email: formData.email,
            password: formData.password,
            dob: formData.dob,
            remindMe: formData.remindMe,
            termsAccepted: formData.termsAccepted,
            newsLetter: formData.newsLetter,
            role: formData.role,
            location: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
                pincode: formData.pincode,
                // coordinates: { latitude: ..., longitude: ... } // add later if needed
            },
        };

        let isNgo = formData.role === "ngo";
        if (isNgo) {
            payload = {
                organizationName: formData.organizationName,
                registrationNumber: formData.registrationNumber,
                description: formData.description,
                category: formData.focusAreas,
                phoneNumber: formData.phoneNumber,
                website: formData.website,
            };
        } else if (formData.role === "volunteer") {
            payload = {
                volunteerType: formData.volunteerType,
                organization: {
                    name: formData.organizationName,
                    address: formData.organizationAddress,
                    city: formData.organizationCity,
                    state: formData.organizationState,
                    department: formData.organizationDepartment,
                    role: formData.organizationPersonRole,
                },
                about: formData.about,
            };
        }

        console.log(payload);

        const result = await register(payload, isNgo);

        if (result && result.success) {
            if (isNgo) {
                toast.success(<NgoRegistrationToast />, {
                    position: "top-right",
                    className: "wide-toast",
                    progressClassName: "my-custom-progress-bar",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            } else {
                toast.success(<VolunteerRegistrationToast />, {
                    position: "top-right",
                    className: "wide-toast",
                    progressClassName: "my-custom-progress-bar",
                    autoClose: 10000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });
            }
        } else {
            alert(result?.message || "Registration failed. Please try again.");
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

                <label>Address</label>
                <textarea
                    name="address"
                    placeholder="Address"
                    onChange={handleChange}
                    value={formData.address || ""}
                    required
                />

                <label>City</label>
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    onChange={handleChange}
                    value={formData.city || ""}
                    required
                />

                <label>State</label>
                <input
                    type="text"
                    name="state"
                    placeholder="State"
                    onChange={handleChange}
                    value={formData.state || ""}
                    required
                />

                <label>Pincode</label>
                <input
                    type="text"
                    name="pincode"
                    placeholder="Pincode"
                    onChange={handleChange}
                    value={formData.pincode || ""}
                    required
                />

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
                                        formData.focusAreas.includes(
                                            category._id
                                        )
                                    }
                                >
                                    {category.name}
                                </option>
                            ))}
                        </select>

                        {Array.isArray(formData.focusAreas) &&
                        formData.focusAreas.length > 0 ? (
                            <div className="selected-categories-list">
                                {formData.focusAreas.map((catId) => {
                                    const cat = categories.find(
                                        (c) => c._id === catId
                                    );
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
                                                        focusAreas:
                                                            prev.focusAreas.filter(
                                                                (id) =>
                                                                    id !== catId
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
                ) : formData.role === "volunteer" ? (
                    <>
                        <label>How would you like to volunteer with us: </label>
                        <label>
                            <input
                                type="radio"
                                name="volunteerType"
                                value="individual"
                                onChange={handleChange}
                                checked={
                                    formData.volunteerType === "individual"
                                }
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
                                value="carrer"
                                onChange={handleChange}
                                checked={formData.volunteerType === "carrer"}
                            />
                            AS a carrer
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
                                    value={
                                        formData.organizationDepartment || ""
                                    }
                                    required
                                />

                                <label>Your Designation / Role</label>
                                <input
                                    type="text"
                                    name="organizationPersonRole"
                                    placeholder="Role"
                                    onChange={handleChange}
                                    value={
                                        formData.organizationPersonRole || ""
                                    }
                                    required
                                />
                            </>
                        ) : (
                            <></>
                        )}

                        <label>About Yourself (Optional)</label>
                        <textarea
                            name="about"
                            placeholder="Tell us about yourself"
                            onChange={handleChange}
                            value={formData.about || ""}
                        />
                    </>
                ) : (
                    //This will be for donor specific
                    <></>
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
                Already have an account? <Link to="/login">Login</Link>
            </span>
            <ToastContainer position="top-right" />
        </div>
    );
}

export default Register;
