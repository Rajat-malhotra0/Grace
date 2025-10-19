import React, { useState, useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import "./EmailVerificationBanner.css";

function EmailVerificationBanner() {
    const { user, isEmailVerified } = useContext(AuthContext);
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState("");
    const [isDismissed, setIsDismissed] = useState(false);

    // Don't show if user is verified or not logged in or banner is dismissed
    if (!user || isEmailVerified || isDismissed) {
        return null;
    }

    const handleResendVerification = async () => {
        setIsResending(true);
        setMessage("");

        try {
            const response = await fetch(
                "http://localhost:3001/api/auth/resend-verification",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: user.email }),
                }
            );

            const data = await response.json();

            if (data.success) {
                setMessage(
                    "✅ Verification email sent! Please check your inbox."
                );
            } else {
                setMessage(
                    "❌ " +
                        (data.message || "Failed to send verification email")
                );
            }
        } catch (error) {
            setMessage(
                "❌ Failed to send verification email. Please try again."
            );
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="email-verification-banner">
            <div className="banner-content">
                <div className="banner-icon">⚠️</div>
                <div className="banner-text">
                    <strong>Email Not Verified</strong>
                    <p>
                        Please verify your email address to access all features.
                        Check your inbox for the verification link.
                    </p>
                    {message && <p className="banner-message">{message}</p>}
                </div>
                <div className="banner-actions">
                    <button
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="btn-resend"
                    >
                        {isResending ? "Sending..." : "Resend Email"}
                    </button>
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="btn-dismiss"
                        title="Dismiss (temporary)"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EmailVerificationBanner;
