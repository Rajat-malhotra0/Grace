import React, { useState, useEffect } from "react";
import { Heart, Leaf, Users, Baby, Stethoscope } from "lucide-react";
import "./CausesCarousel.css";

const causes = [
  {
    id: 1,
    title: "Environment",
    icon: Leaf,
    description:
      "Protecting forests, wildlife & our planet for future generations.",
  },
  {
    id: 2,
    title: "Women Empowerment",
    icon: Users,
    description: "Providing equal opportunities and safe spaces for women.",
  },
  {
    id: 3,
    title: "Child Welfare",
    icon: Baby,
    description:
      "Ensuring every child has access to education, care, and love.",
  },
  {
    id: 4,
    title: "Healthcare Access",
    icon: Stethoscope,
    description: "Bringing healthcare to underserved communities worldwide.",
  },
  {
    id: 5,
    title: "Animal Rescue",
    icon: Heart,
    description: "Supporting shelters and rescuing abandoned animals in need.",
  },
];

const CausesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % causes.length);
    }, 3000); // Auto-scroll every 4 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="causes-carousel-container">
      <div className="causes-header">
        <h2>Causes You Support</h2>
        <p>Making an impact across communities and causes</p>
      </div>

      <div className="carousel-wrapper">
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / causes.length)}%)`,
            transition: "transform 0.6s ease-in-out",
          }}
        >
          {causes.map((cause) => {
            const IconComponent = cause.icon;
            return (
              <div className="cause-card" key={cause.id}>
                <div className="cause-icon-wrapper">
                  <IconComponent className="cause-icon" size={32} />
                </div>
                <div className="cause-content">
                  <h3>{cause.title}</h3>
                  <p>{cause.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="carousel-indicators">
        {causes.map((_, index) => (
          <button
            key={index}
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default CausesCarousel;
