import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import "./DonationModal.css";

const DonationModal = ({ ngo, onClose }) => {
    const { user, isAuthenticated } = useContext(AuthContext);
    const [donationAmount, setDonationAmount] = useState(500);

    const handleDonate = async () => {
        if (!isAuthenticated || !user) {
            toast.error("You must be logged in to donate.");
            return;
        }

        try {
            const orderResponse = await axios.post(
                "http://localhost:3001/api/payments/create-order",
                { amount: donationAmount }
            );
            const order = orderResponse.data;

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: `Donation to ${ngo.name}`,
                description: "A step towards a better world.",
                order_id: order.id,
                handler: async function (response) {
                    try {
                        await axios.post(
                            "http://localhost:3001/api/payments/verify-payment",
                            {
                                ...response,
                                amount: order.amount,
                                user: user._id,
                                ngoId: ngo._id, // Pass the NGO ID for verification
                            }
                        );
                        toast.success("Thank you for your generous donation!");
                        onClose(); // Close modal on success
                    } catch (error) {
                        toast.error("Payment verification failed.");
                    }
                },
                prefill: { name: user.name, email: user.email },
                theme: { color: "#222222" },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error("Donation failed. Please try again.");
        }
    };

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    &times;
                </button>
                <h3>Donate to {ngo.name}</h3>
                <p>Your contribution makes a real difference.</p>
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
                    Donate Securely
                </button>
            </div>
        </div>
    );
};

export default DonationModal;
