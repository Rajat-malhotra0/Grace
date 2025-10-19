import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./VerifySuccess.css";

function VerifySuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const status = searchParams.get("status");
    const alreadyVerified = status === "already";

    useEffect(() => {
        // Optional: Auto-redirect to login after 5 seconds
        const timer = setTimeout(() => {
            navigate("/login");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="verify-success-container">
            <div className="verify-success-card">
                <h1 className="verify-title">
                    {alreadyVerified ? "Already Verified!" : "Email Verified!"}
                </h1>

                <p className="verify-message">
                    {alreadyVerified
                        ? "Your email address is already verified. You can log in to your account."
                        : "Congratulations! Your email has been successfully verified. You can now access all features of Grace."}
                </p>

                <div className="verify-actions">
                    <button
                        className="btn-primary"
                        onClick={() => navigate("/login")}
                    >
                        Go to Login
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={() => navigate("/")}
                    >
                        Go to Home
                    </button>
                </div>

                <p className="verify-redirect-note">
                    Redirecting to login in 5 seconds...
                </p>
            </div>
        </div>
    );
}

export default VerifySuccess;
