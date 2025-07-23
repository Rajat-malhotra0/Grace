/*
Todo: 
Can make the form a lot more more refined, and needs testing

Important: I have not tested this code yet, test it as soon as possible and after that remove this comment

*/

import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
import axios from "axios";
import { AuthContext } from "../../Context/AuthContext";

function Register() {
    const [formData, setFormData] = useState({});
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

        // Password confirmation check
        if (formData.password !== formData.confirmedPassword) {
            alert("Passwords do not match.");
            return;
        }

        let payload;
        let isNgo = formData.role === "ngo";
        if (isNgo) {
            payload = {
                userName: formData.name,
                email: formData.email,
                password: formData.password,
                organizationName: formData.organizationName,
                registrationNumber: formData.registrationNumber,
                description: formData.description,
                category: formData.focusAreas,
                address: formData.address,
                phoneNumber: formData.phoneNumber,
                website: formData.website,
                dob: formData.dob,
                remindMe: !!formData.remindMe,
                termsAccepted: formData.termsAccepted ? "true" : "false",
                newsLetter: !!formData.newsLetter,
            };
        } else {
            payload = {
                userName: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
                dob: formData.dob,
                about: formData.about,
                remindMe: !!formData.remindMe,
                termsAccepted: formData.termsAccepted ? "true" : "false",
                newsLetter: !!formData.newsLetter,
            };
        }

        const result = await register(payload, isNgo);

        if (result && result.success) {
            alert("Registration successful!");
            // Optionally redirect or clear form
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
                changemakers.
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
                        <div className="focus-areas-group">
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <label key={category._id}>
                                        <input
                                            type="radio"
                                            name="focusAreas"
                                            value={category._id}
                                            onChange={handleChange}
                                            checked={
                                                formData.focusAreas ===
                                                category._id
                                            }
                                            required
                                        />
                                        {category.name}
                                    </label>
                                ))
                            ) : (
                                <div>Loading categories...</div>
                            )}
                        </div>
                    </>
                ) : (
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
                Already have an account? <Link to="/login">Login</Link>
            </span>
        </div>
    );
}

export default Register;
