// src/components/ImpactStories.jsx

import React, { useState, useEffect } from "react";
import axios from "axios"; // You need to import axios
import { withApiBase } from "config";
import "./ImpactStories.css";

// --- Asset Imports ---
import Leaf1 from "../../assets/Leaf7.svg";
import Leaf2 from "../../assets/Leaf2.svg";
import Leaf3 from "../../assets/Leaf6.svg";
import Leaf4 from "../../assets/Leaf4.svg";
import Leaf5 from "../../assets/Leaf5.svg";
import Flower1 from "../../assets/flower1.svg";
import Sparkle from "../../assets/sparkle.svg";

function ImpactStories() {
    // State to hold your stories, loading status, and any errors
    const [stories, setStories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect hook to fetch data when the component mounts
    useEffect(() => {
        // Define the async function to fetch data
        const fetchLatestStories = async () => {
            try {
                // Use the correct API endpoint we created
                const response = await axios.get(
                    withApiBase("/api/impact-stories/latest/3")
                );

                // Set the stories from the response data
                const result = response.data.result || response.data || [];
                if (Array.isArray(result)) {
                    setStories(result);
                } else {
                    setStories([]);
                }
            } catch (err) {
                // If an error occurs, save the error message
                setError("Failed to load stories. Please try again later.");
                console.error("Fetch error:", err);
                setStories([]);
            } finally {
                // Always set loading to false after the attempt
                setLoading(false);
            }
        };

        // Call the function
        fetchLatestStories();
    }, []); // The empty array [] ensures this runs only once on mount

    // Conditional rendering for loading state
    if (loading) {
        return (
            <section className="impact-section">
                <p>Loading stories...</p>
            </section>
        );
    }

    // Conditional rendering for error state
    if (error) {
        return (
            <section className="impact-section">
                <p>{error}</p>
            </section>
        );
    }

    return (
        <section className="impact-section">
            <div className="impact-header-wrapper">
                {/* Decorative Leaves */}
                <img src={Leaf1} alt="leaf" className="leaf leaf-1" />
                <img src={Leaf2} alt="leaf" className="leaf leaf-2" />
                <img src={Leaf3} alt="leaf" className="leaf leaf-3" />
                <img src={Leaf4} alt="leaf" className="leaf leaf-4" />
                <img src={Leaf5} alt="leaf" className="leaf leaf-5" />
                <img src={Flower1} alt="flower" className="leaf flower-1" />
                <img src={Sparkle} alt="sparkle" className="leaf sparkle-1" />
                <img src={Sparkle} alt="sparkle" className="leaf sparkle-2" />

                {/* Main Heading */}
                <h2 className="impact-heading-">
                    THE <em>heart </em>OF GRACE
                    <p>
                        <em>
                            Hear how lives have been touched, one act of
                            kindness at a time.
                        </em>
                    </p>
                </h2>
            </div>

            <div className="testimonial-grid">
                {/* Map over the stories fetched from the DB */}
                {stories.map((story) => (
                    <div className="testimonial-card" key={story._id}>
                        <h3 className="testimonial-title">{story.title}</h3>
                        <p className="testimonial-content">“{story.content}”</p>
                        <p className="testimonial-meta">
                            — {story.category} |{" "}
                            {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default ImpactStories;
