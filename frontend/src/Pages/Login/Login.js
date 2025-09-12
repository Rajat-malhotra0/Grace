
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";
import { AuthContext } from "../../Context/AuthContext";

function Login() {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value,
        }));
    };
    const validate = () => {
        const errors = {};
        const { email = "", password = "" } = formData;
        if (!email.trim()) {
            errors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            errors.email = "Email is invalid";
        }
        if (!password.trim()) {
            errors.password = "Password is required";
        } else if (password.length < 8) {
            errors.password = "Password must be 8 characters long";
        }
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const result = await login(formData.email, formData.password);
            if (result.success) {
                toast.success("Logged in successfully");
                navigate("/");
            } else {
                toast.error(result.message || "Login failed");
            }
        } catch (err) {
            toast.error("Login failed: " + (err.response?.data?.message || err.message || "Unknown error"));
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
                    <div className="input-group">
                        <label> Email</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            onChange={handleChange}
                            value={formData.email || ""}
                        />
                        <div style={{ color: "red" }}>{errors.email}</div>
                    </div>
                    <div className="input-group">
                        <label> Password </label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            onChange={handleChange}
                            value={formData.password || ""}
                        />
                        <div style={{ color: "red" }}>{errors.password}</div>
                    </div>
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
