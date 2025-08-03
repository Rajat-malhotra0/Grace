import React from "react";
import "./SkillsInterests.css";
import communication from "../../../assets/communication.jpg";
import childcare from "../../../assets/childcare.jpg";
import environment from "../../../assets/environment.jpg";
import healthcare from "../../../assets/healthcare.jpg";
import mentalHealth from "../../../assets/mental-health.jpg";
import creativeArts from "../../../assets/creative-arts.jpg";
import techSupport from "../../../assets/tech-support.jpg";
import eventCoordination from "../../../assets/event-coordination.jpg";

const skillsData = [
  {
    id: 1,
    title: "Communication & Outreach",
    description:
      "For volunteers who are good at speaking, listening, community engagement, or spreading awareness.",
    image: communication, // Remove the curly braces
  },
  {
    id: 2,
    title: "Childcare & Mentoring",
    description:
      "Interest or experience in working with children, tutoring, or providing emotional support.",
    image: childcare,
  },
  {
    id: 3,
    title: "Environmental Conservation",
    description:
      "Passion for tree-planting, waste cleanups, recycling drives, or sustainability campaigns.",
    image: environment,
  },
  {
    id: 4,
    title: "First Aid & Healthcare Support",
    description:
      "Basic first aid knowledge, health camp volunteering, or assistance during medical drives.",
    image: healthcare,
  },
  {
    id: 5,
    title: "Mental Health & Counseling",
    description:
      "Interest in supporting emotional well-being, active listening, or peer support roles.",
    image: mentalHealth,
  },
  {
    id: 6,
    title: "Creative Arts & Design",
    description:
      "Skills in painting, designing posters, photography, or leading creative workshops.",
    image: creativeArts,
  },
  {
    id: 7,
    title: "Digital & Tech Support",
    description:
      "Experience in content writing, data entry, web updates, or helping with tech logistics.",
    image: techSupport,
  },
  {
    id: 8,
    title: "Event Coordination & Logistics",
    description:
      "Strong organizational skills to manage volunteer drives, donation events, or campaigns.",
    image: eventCoordination,
  },
];

const SkillsInterests = () => {
  return (
    <div className="skills-interests-container">
      <div className="skills-header">
        <h2>Skills & Interests</h2>
        <p>
          Discover your strengths and find the perfect volunteering
          opportunities
        </p>
      </div>

      <div className="skills-grid">
        {skillsData.map((skill) => {
          return (
            <div className="skill-card" key={skill.id}>
              <div className="skill-image-wrapper">
                <img
                  src={skill.image}
                  alt={skill.title}
                  className="skill-image"
                />
                <div className="skill-image-overlay"></div>
              </div>
              <div className="skill-content">
                <h3>{skill.title}</h3>
                <p>{skill.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SkillsInterests;
