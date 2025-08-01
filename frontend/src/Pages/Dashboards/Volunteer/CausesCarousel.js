import React, { useState, useEffect } from "react";
import "./CausesCarousel.css";

const causes = [
  {
    id: 1,
    title: "Environment",
    image: "/assets/causes/env.jpg",
    description: "Protecting forests, wildlife & our planet.",
  },
  {
    id: 2,
    title: "Women Empowerment",
    image: "/assets/causes/women.jpg",
    description: "Providing equal opportunities and safe spaces.",
  },
  {
    id: 3,
    title: "Child Welfare",
    image: "/assets/causes/child.jpg",
    description:
      "Ensuring every child has access to education, care, and love.",
  },
  {
    id: 4,
    title: "Healthcare Access",
    image: "/assets/causes/health.jpg",
    description: "Bringing healthcare to underserved communities.",
  },
  {
    id: 5,
    title: "Animal Rescue",
    image: "/assets/causes/animals.jpg",
    description: "Supporting shelters and rescuing abandoned animals.",
  },
];

const CausesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % causes.length);
    }, 3000); // Auto-scroll every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="causes-carousel-container">
      <h2>Causes You Support</h2>
      <div className="carousel-wrapper">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / causes.length)}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {causes.map((cause) => (
            <div className="cause-card" key={cause.id}>
              <img
                src={cause.image}
                alt={cause.title}
                className="cause-image"
              />
              <div className="cause-content">
                <h3>{cause.title}</h3>
                <p>{cause.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-indicators">
        {causes.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CausesCarousel;
