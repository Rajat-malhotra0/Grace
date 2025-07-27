import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import "./Donation.css";

const Donations = () => {
    const { user, isAuthenticated, isAuthLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [donationAmount, setDonationAmount] = useState(500);

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        if (!isAuthenticated) {
            toast.info("Please log in to make a donation.");
            navigate("/login");
        }
        setLoading(false);
    }, [isAuthenticated, navigate, isAuthLoading]);

   
    const handleDonate = async () => {
        if (!isAuthenticated || !user) {
            toast.error("You must be logged in to donate.");
            navigate("/login");
            return;
        }

        try {
            const orderResponse = await axios.post(
                "http://localhost:3001/api/payments/create-order",
                {
                    amount: donationAmount,
                }
            );
            const order = orderResponse.data;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Grace",
                description: "Donation to a good cause",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        const verificationResponse = await axios.post(
                            "http://localhost:3001/api/payments/verify-payment",
                            {
                                ...response,
                                amount: order.amount,
                                user: user._id,
                            }
                        );
                        toast.success(verificationResponse.data.message);
                    } catch (error) {
                        toast.error(
                            "Payment verification failed. Please contact support."
                        );
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email,
                },
                theme: {
                    color: "#222222",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Donation failed:", error);
            toast.error("Donation failed. Please try again.");
        }
    };

    if (isAuthLoading || loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="donations-page">
            <div className="donations-header">
                <h1>Make a Difference</h1>
                <p>
                    Your contribution fuels our mission and creates lasting
                    change.
                </p>
            </div>

            <div className="donations-content-grid">
                <div className="donation-form-card">
                    <h3>Give with Heart</h3>
                    <p>
                        Every donation, big or small, helps us continue our
                        work.
                    </p>
                    <div className="donation-input-group">
                        <span className="currency-symbol">₹</span>
                        <input
                            type="number"
                            value={donationAmount}
                            onChange={(e) => setDonationAmount(e.target.value)}
                            placeholder="500"
                            className="donation-input"
                        />
                    </div>
                    <button onClick={handleDonate} className="donation-button">
                        Donate Now
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Donations;
