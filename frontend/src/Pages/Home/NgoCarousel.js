import React, { useState, useEffect } from "react";
import axios from "axios";
import "./NgoCarousel.css";
import NgoCard from "./NgoCard";
import DonationModal from "../../Components/DonationModal";

// We can import one of the existing images to use as a placeholder
import defaultNgoImage from "../../assets/ngo1.jpg";

const filterCategories = [
    "All",
    "Environment",
    "Women Empowerment",
    "Education",
    "Health",
];

const NgoCarousel = () => {
    const [activeFilter, setActiveFilter] = useState("All");
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNgo, setSelectedNgo] = useState(null);

    useEffect(() => {
        const fetchNgos = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3001/api/ngos"
                );
                // We'll take the first 4 NGOs as requested
                setNgos(response.data.result.slice(2, 6));
            } catch (error) {
                console.error("Failed to fetch NGOs:", error);
                // Handle error, maybe show a toast notification
            } finally {
                setLoading(false);
            }
        };

        fetchNgos();
    }, []);

    const filteredNgos =
        activeFilter === "All"
            ? ngos
            : ngos.filter((ngo) =>
                  ngo.category.some((cat) => cat.name === activeFilter)
              );

    const handleDonateClick = (ngo) => {
        setSelectedNgo(ngo);
    };

    const handleCloseModal = () => {
        setSelectedNgo(null);
    };

    if (loading) {
        return (
            <section className="ngo-section">
                <div className="ngo-wrapper">
                    <div
                        className="loading-container"
                        style={{ color: "#333" }}
                    >
                        Loading NGOs...
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="ngo-section">
            <div className="ngo-wrapper">
                <div className="ngo-header">
                    <h2>Threads of Grace: NGOs</h2>
                    <p>
                        Together they weave a tapestry of compassion and quiet
                        strength
                    </p>
                </div>

                <div className="ngo-filters">
                    {filterCategories.map((category) => (
                        <button
                            key={category}
                            className={`filter-btn ${
                                activeFilter === category ? "active" : ""
                            }`}
                            onClick={() => setActiveFilter(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="ngo-cards">
                    {filteredNgos.map((ngo) => (
                        <NgoCard
                            key={ngo._id}
                            ngo={{
                                ...ngo,
                                mission: ngo.description, // Map description to mission
                                image: defaultNgoImage, // Use a placeholder image
                                volunteersNeeded: 50, // Placeholder data
                                donationGoal: 15000, // Placeholder data
                            }}
                            onDonateClick={() => handleDonateClick(ngo)} // Pass handler to card
                        />
                    ))}

                    <div className="explore-all-wrapper">
                        <div className="explore-all-card">
                            <h3 className="explore-heading">
                                Explore All NGOs
                            </h3>
                            <p className="explore-text">
                                There’s a cause waiting for your kindness.
                                Discover the NGOs weaving change.
                            </p>
                            <button className="explore-btn">
                                View All Organizations
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {selectedNgo ? (
                <DonationModal ngo={selectedNgo} onClose={handleCloseModal} />
            ) : null}
        </section>
    );
};

export default NgoCarousel;
