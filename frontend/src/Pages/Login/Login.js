import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
    const [formData, setFormData] = useState({});

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            email: formData.email,
            password: formData.password,
        };

        try {
            const response = await axios.post(
                "http://localhost:3001/api/users/login",
                payload
            );

            if (response.status === 200) {
                alert("logged In");
                console.log(response.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h1>Welcome Back!</h1>
                    <p>It's good to see you again.</p>
                </div>

                <form className="login-form" onSubmit={handleSubmit}>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                        value={formData.email || ""}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        value={formData.password || ""}
                    />
                    <button type="submit">Log In</button>
                </form>

                <div className="register-link">
                    <span>
                        Need an account? <Link to="/register">Register</Link>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Login;
