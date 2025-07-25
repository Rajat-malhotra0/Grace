import React, { useState } from "react";
import "./NgoCarousel.css";
import NgoCard from "./NgoCard";
import ngoData from "./MockNgoData";

const filterCategories = [
  "All",
  "Environment",
  "Women Empowerment",
  "Children",
  "More Filters",
];

const NgoCarousel = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredNgos =
    activeFilter === "All" || activeFilter === "More Filters"
      ? ngoData
      : ngoData.filter((ngo) => ngo.category === activeFilter);

  return (
    <section className="ngo-section">
      <div className="ngo-wrapper">
        <div className="ngo-header">
          <h2>Threads of Grace: NGOs</h2>
          <p>Together they weave a tapestry of compassion and quiet strength</p>
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
            <NgoCard key={ngo.id} ngo={ngo} />
          ))}

          <div className="explore-all-wrapper">
            <div className="explore-all-card">
              <h3 className="explore-heading">Explore All NGOs</h3>
              <p className="explore-text">
                There’s a cause waiting for your kindness. Discover the NGOs weaving change.
              </p>
              <button className="explore-btn">View All Organizations</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NgoCarousel;
