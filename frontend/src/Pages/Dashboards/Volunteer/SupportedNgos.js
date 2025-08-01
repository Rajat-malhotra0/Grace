import React, { useState, useEffect } from "react";
import { Heart, Leaf, Baby, Stethoscope, Users } from "lucide-react";
import "./SupportedNgos.css";

const ngos = [
  {
    id: 1,
    name: "Green Earth Foundation",
    description:
      "Leading environmental conservation efforts across 15 countries with sustainable solutions.",
    focus: "Environment",
    icon: Leaf,
  },
  {
    id: 2,
    name: "Women's Empowerment Network",
    description:
      "Empowering women through education, skills training, and economic opportunities.",
    focus: "Women's Rights",
    icon: Users,
  },
  {
    id: 3,
    name: "Children First Initiative",
    description:
      "Providing quality education and healthcare to underprivileged children worldwide.",
    focus: "Child Welfare",
    icon: Baby,
  },
  {
    id: 4,
    name: "Rural Health Alliance",
    description:
      "Bringing accessible healthcare services to remote and underserved communities.",
    focus: "Healthcare",
    icon: Stethoscope,
  },
  {
    id: 5,
    name: "Animal Rescue Coalition",
    description:
      "Rescuing, rehabilitating, and rehoming abandoned animals across the region.",
    focus: "Animal Welfare",
    icon: Heart,
  },
];

const SupportedNgos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ngos.length);
    }, 4000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="supported-ngos-container">
      <div className="supported-ngos-header">
        <h2>Partner NGOs</h2>
        <p>
          Trusted organizations making a difference in communities worldwide
        </p>
      </div>

      <div className="supported-ngos-wrapper">
        <div
          className="supported-ngos-track"
          style={{
            transform: `translateX(-${currentIndex * (100 / ngos.length)}%)`,
            transition: "transform 0.6s ease-in-out",
          }}
        >
          {ngos.map((ngo) => {
            const IconComponent = ngo.icon;
            return (
              <div className="ngo-card_" key={ngo.id}>
                <div className="ngo-icon-wrapper_">
                  <IconComponent className="ngo-icon_" size={32} />
                </div>

                <div className="ngo-content_">
                  <h3>{ngo.name}</h3>
                  <p>{ngo.description}</p>
                </div>

                <div className="ngo-focus">
                  <span className="ngo-focus-tag">{ngo.focus}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="supported-ngos-indicators">
        {ngos.map((_, index) => (
          <button
            key={index}
            className={`ngo-indicator ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
            aria-label={`Go to NGO ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SupportedNgos;
