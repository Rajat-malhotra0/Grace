import React, { useState, useEffect } from "react";
import axios from "axios";
import { withApiBase } from "config";
import { Search } from "lucide-react";
import NgoCard from "../Home/NgoCard";
import DonationModal from "../../Components/DonationModal";
import "./AllNgos.css";

const filterCategories = [
    "All",
    "Environment",
    "Women Empowerment",
    "Education",
    "Health",
    "Children",
];

const AllNgos = () => {
    const [ngos, setNgos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeFilter, setActiveFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedNgo, setSelectedNgo] = useState(null);

    useEffect(() => {
        const fetchNgos = async () => {
            try {
                setLoading(true);
                const response = await axios.get(withApiBase("/api/ngos"));
                if (response.data.success) {
                    setNgos(response.data.result);
                } else {
                    setError("Failed to load organizations");
                }
            } catch (err) {
                console.error("Error fetching NGOs:", err);
                setError("Something went wrong while loading organizations");
            } finally {
                setLoading(false);
            }
        };

        fetchNgos();
    }, []);

    const getImageUrl = (ngo) => {
        return ngo.coverImage?.url || "/default-ngo-image.jpg";
    };

    const filteredNgos = ngos.filter((ngo) => {
        // Filter by category
        const categoryMatch =
            activeFilter === "All" ||
            (ngo.category &&
                ngo.category.some((cat) => cat && cat.name === activeFilter));

        // Filter by search term
        const searchMatch =
            ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ngo.mission &&
                ngo.mission.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (ngo.description &&
                ngo.description.toLowerCase().includes(searchTerm.toLowerCase()));

        return categoryMatch && searchMatch;
    });

    const handleDonateClick = (ngo) => {
        setSelectedNgo(ngo);
    };

    const handleCloseModal = () => {
        setSelectedNgo(null);
    };

    return (
        <div className="all-ngos-page">
            <div className="all-ngos-container">
                <header className="all-ngos-header">
                    <h1>Our Partner Organizations</h1>
                    <p>
                        Discover the incredible NGOs working tirelessly to bring
                        hope and change to communities around the world.
                    </p>
                </header>

                <div className="filters-section">
                    <div className="search-wrapper">
                        <input
                            type="text"
                            placeholder="Search organizations, causes, or locations..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="search-icon" size={20} />
                    </div>

                    <div className="category-filters">
                        {filterCategories.map((category) => (
                            <button
                                key={category}
                                className={`category-btn ${
                                    activeFilter === category ? "active" : ""
                                }`}
                                onClick={() => setActiveFilter(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="ngos-content">
                    {loading ? (
                        <div className="loading-state">
                            Loading organizations...
                        </div>
                    ) : error ? (
                        <div className="error-state">{error}</div>
                    ) : filteredNgos.length > 0 ? (
                        <div className="ngos-grid">
                            {filteredNgos.map((ngo) => (
                                <NgoCard
                                    key={ngo._id}
                                    ngo={{
                                        ...ngo,
                                        image: getImageUrl(ngo),
                                        mission: ngo.mission || ngo.description,
                                        volunteersNeeded:
                                            ngo.volunteersNeeded ||
                                            Math.floor(Math.random() * 50) + 10,
                                        donationGoal:
                                            ngo.donationGoal || 50000,
                                    }}
                                    onDonateClick={() => handleDonateClick(ngo)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            No organizations found matching your criteria.
                        </div>
                    )}
                </div>
            </div>

            {selectedNgo && (
                <DonationModal ngo={selectedNgo} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default AllNgos;
