import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Login.css";
import { AuthContext } from "../../Context/AuthContext";
import { withApiBase } from "config";

import { Eye, EyeOff } from "lucide-react";

function Login() {
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [showResendButton, setShowResendButton] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
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
            setShowResendButton(false); // Reset resend button
            const result = await login(formData.email, formData.password);
            if (result.success) {
                toast.success("Logged in successfully");

                // Redirect based on user role
                if (result.user?.role?.includes("ngo")) {
                    // Get ngoId from result or user object
                    const ngoId = result.ngo?._id || result.user?.ngoId;
                    if (ngoId) {
                        navigate(`/ngo/${ngoId}`);
                    } else {
                        toast.error(
                            "NGO data not found. Please contact support."
                        );
                        navigate("/");
                    }
                } else if (result.user?.role?.includes("admin")) {
                    navigate("/dashboard/site-admin");
                } else {
                    navigate("/");
                }
            } else {
                // AuthContext already showed the error toast.
                // Just check if we need to show the resend button.
                if (
                    result.message &&
                    result.message.toLowerCase().includes("verify your email")
                ) {
                    setShowResendButton(true); // Show resend button
                }
            }
        } catch (err) {
            console.error("Unexpected login error:", err);
             // Verify email check in catch block just in case
             const errorMessage = err.response?.data?.message || err.message || "Unknown error";
            if (errorMessage.toLowerCase().includes("verify your email")) {
                setShowResendButton(true);
            }
        }
    };

    const handleResendVerification = async () => {
        if (!formData.email) {
            toast.error("Please enter your email address");
            return;
        }

        setIsResending(true);
        try {
            const response = await fetch(
                withApiBase("/api/auth/resend-verification"),
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: formData.email }),
                }
            );

            const data = await response.json();

            if (data.success) {
                toast.success(
                    "Verification email sent! Please check your inbox."
                );
                setShowResendButton(false);
            } else {
                toast.error(
                    data.message || "Failed to send verification email"
                );
            }
        } catch (error) {
            toast.error("Failed to send verification email. Please try again.");
        } finally {
            setIsResending(false);
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
                        <div style={{ position: "relative" }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                onChange={handleChange}
                                value={formData.password || ""}
                                style={{ width: "100%", paddingRight: "40px" }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "50%",
                                    transform: "translateY(-50%)",
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    padding: "0",
                                    marginTop: "0",
                                    width: "auto",
                                    color: "#555",
                                }}
                            >
                                {showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                        <div style={{ color: "red" }}>{errors.password}</div>
                    </div>
                    <button type="submit">Log In</button>
                    {showResendButton && (
                        <div className="resend-verification-section">
                            <p className="verification-message">
                                📧 Haven't received the verification email?
                            </p>
                            <button
                                type="button"
                                onClick={handleResendVerification}
                                disabled={isResending}
                                className="btn-resend-verification"
                            >
                                {isResending
                                    ? "Sending..."
                                    : "Resend Verification Email"}
                            </button>
                        </div>
                    )}
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
