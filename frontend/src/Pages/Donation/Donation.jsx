import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { withApiBase } from "config";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import { toast } from "react-toastify";
import "./Donation.css";
import DonationModal from "../../Components/DonationModal"; // Import the modal

const Donations = () => {
    const { isAuthenticated, isAuthLoading } = useContext(AuthContext);
    const navigate = useNavigate();

    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNgo, setSelectedNgo] = useState(null);

    useEffect(() => {
        // This effect handles the initial auth check and page loading state
        if (isAuthLoading) {
            return; // Wait until auth check is complete
        }
        // Page is ready once auth check is done
        setLoading(false);
    }, [isAuthLoading]);

    useEffect(() => {
        // This effect fetches the list of NGOs when the component mounts
        const fetchNgos = async () => {
            try {
                const response = await axios.get(withApiBase("/api/ngos"));
                setNgos(response.data.result);
            } catch (error) {
                console.error("Failed to fetch NGOs:", error);
                toast.error("Could not load the list of NGOs.");
            }
        };

        fetchNgos();
    }, []); // Runs once

    const handleDonateClick = (ngo) => {
        // Check for authentication before opening the modal
        if (!isAuthenticated) {
            toast.info("Please log in to make a donation.");
            navigate("/login");
            return;
        }
        setSelectedNgo(ngo);
    };

    const handleCloseModal = () => {
        setSelectedNgo(null);
    };

    if (isAuthLoading || loading) {
        return <div className="loading-container">Loading...</div>;
    }

    return (
        <div className="donations-page">
            <div className="donations-header">
                <h1>Find a Cause to Support</h1>
                <p>
                    Browse our directory of trusted NGOs and make a direct
                    impact.
                </p>
            </div>

            <div className="ngo-list-container">
                {ngos.length > 0 ? (
                    ngos.map((ngo) => (
                        <div key={ngo._id} className="ngo-list-item">
                            <div className="ngo-list-info">
                                <h3>{ngo.name}</h3>
                                <p>{ngo.description}</p>
                            </div>
                            <div className="ngo-list-action">
                                <button
                                    onClick={() => handleDonateClick(ngo)}
                                    className="donation-button"
                                >
                                    Donate
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No NGOs found.</p>
                )}
            </div>

            {/* Conditionally render the modal when an NGO is selected */}
            {selectedNgo && (
                <DonationModal ngo={selectedNgo} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default Donations;
