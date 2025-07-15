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

        const payload = {
            userName: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.type ? [formData.type] : [],
            about: "",
            score: 0,
            isActive: true,
            dob: formData.dob,
            remindMe: formData.remindMe || false,
            termsAccepted: formData.termsAccepted || false,
            newsLetter: formData.newsLetter || false,
        };

        try {
            const response = await axios.post(
                "http://localhost:3001/api/users",
                payload
            );

            if (response.status === 201) {
                alert("saved");
                console.log(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="register-page-container">
            <p>
                Hi there! we are so happy, you found us.
                <br></br>
                You're just a few steps away from joining our community of
                changemakers
            </p>
            <span>Create an account</span>
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    onChange={handleChange}
                    value={formData.email}
                ></input>
                <label>Name</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    onChange={handleChange}
                    value={formData.name}
                ></input>
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    value={formData.password}
                ></input>
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmedPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    value={formData.confirmedPassword}
                ></input>

                <label>
                    <input
                        type="radio"
                        name="type"
                        value="ngo"
                        onChange={handleChange}
                        checked={formData.type === "ngo"}
                    />
                    NGO
                </label>
                <label>
                    <input
                        type="radio"
                        name="type"
                        value="donor"
                        onChange={handleChange}
                        checked={formData.type === "donor"}
                    />
                    donor
                </label>
                <label>
                    <input
                        type="radio"
                        name="type"
                        value="volunteer"
                        onChange={handleChange}
                        checked={formData.type === "volunteer"}
                    />
                    volunteer
                </label>

                <label>
                    Date of birth:
                    <input
                        type="date"
                        name="dob"
                        onChange={handleChange}
                        value={formData.dob || ""}
                    />
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="remindMe"
                        onChange={handleChange}
                        checked={formData.remindMe}
                    />
                    Give me reminders
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="termsAccepted"
                        onChange={handleChange}
                        checked={formData.termsAccepted || false}
                    />
                    Terms and conditions
                </label>

                <label>
                    <input
                        type="checkbox"
                        name="newsLetter"
                        onChange={handleChange}
                        checked={formData.newsLetter}
                    />
                    Newsletter
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
