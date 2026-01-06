import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { withApiBase } from "config";
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
    "Children",
];

const NgoCarousel = () => {
    const navigate = useNavigate();
    const [activeFilter, setActiveFilter] = useState("All");
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedNgo, setSelectedNgo] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);

    const getImageUrl = (ngo) => {
        return ngo.coverImage?.url || defaultNgoImage;
    };

    useEffect(() => {
        const fetchNgos = async () => {
            try {
                const response = await axios.get(withApiBase("/api/ngos"));

                console.log("Fetched NGOs:", response.data.result);
                console.log("First NGO structure:", response.data.result[0]);
                setNgos(response.data.result.slice(0, 6));
            } catch (error) {
                console.error("Failed to fetch NGOs:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchNgos();
    }, []);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            const filteredSuggestions = ngos.filter((ngo) =>
                ngo.name.toLowerCase().startsWith(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (ngoName) => {
        setSearchTerm(ngoName);
        setSuggestions([]);
    };

    const filteredNgos = ngos.filter((ngo) => {
        const categoryMatch =
            activeFilter === "All" ||
            (ngo.category &&
                ngo.category.some((cat) => cat && cat.name === activeFilter));
        const searchMatch = ngo.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        return categoryMatch && searchMatch;
    });
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

                <div className="search-container">
                    <div className="search-bar-wrapper">
                        <input
                            type="text"
                            placeholder="Search for an NGO..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                            autoComplete="off"
                        />
                        {/* Add the SVG icon */}
                        <svg
                            className="search-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                        </svg>
                    </div>

                    {suggestions.length > 0 && (
                        <ul className="suggestions-list">
                            {suggestions.map((suggestion) => (
                                <li
                                    key={suggestion._id}
                                    onClick={() =>
                                        handleSuggestionClick(suggestion.name)
                                    }
                                >
                                    {suggestion.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="ngo-cards">
                    {filteredNgos.map((ngo) => (
                        <NgoCard
                            key={ngo._id}
                            ngo={{
                                ...ngo,
                                mission: ngo.mission || ngo.description, // Use mission field or description
                                image: getImageUrl(ngo), // Use database image or fallback
                                volunteersNeeded: ngo.volunteersNeeded || 50, // Use database value or default
                                donationGoal: ngo.donationGoal || 15000, // Use database value or default
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
                                There's a cause waiting for your kindness.
                                Discover the NGOs weaving change.
                            </p>
                            <button
                                className="explore-btn"
                                onClick={() => navigate("/all-ngos")}
                            >
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
