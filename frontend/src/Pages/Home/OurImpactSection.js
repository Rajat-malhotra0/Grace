import React from "react";
import "./OurImpactSection.css";
import vid1 from "../../assets/NgoOnboarded.mp4";
import vid2 from "../../assets/CausesRepresented.mp4";
import vid3 from "../../assets/PeopleReached.mp4";
import vid4 from "../../assets/VolunteersMobilized.mp4";

function OurImpactSection() {
    const impactData = [
        {
            id: 1,
            video: vid1,
            stat: "215+",
            title: "NGOs Onboarded",
            description:
                "We proudly support these changemakers by giving them the tools, visibility, and community they need to thrive — so they can focus on what they do best: making a difference.",
        },
        {
            id: 2,
            video: vid2,
            stat: "42",
            title: "Causes Represented",
            description:
                "From environmental conservation to education, from women’s empowerment to child welfare — the causes we stand behind are as diverse as the people we serve. Grace brings them together under one roof.",
        },
        {
            id: 3,
            video: vid3,
            stat: "1.2M+",
            title: "People Reached",
            description:
                "Behind every number is a name. Behind every name, a story. Grace exists to connect compassionate action with real lives — and every life touched reminds us why this work matters",
        },
        {
            id: 4,
            video: vid4,
            stat: "9,000+",
            title: "Volunteers Mobilized",
            description:
                "Volunteers are the heartbeat of Grace. Every hand extended, every hour given, and every journey made in service of another brings people togther to build something stronger.",
        },
    ];

    return (
        <section className="impact-section">
            <div className="impact-container">
                <h2 className="impact-heading">
                    OUR <em>footprint of</em> CHANGE
                </h2>
                <div className="impact-grid">
                    {impactData.map((item) => (
                        <div key={item.id} className="impact-card">
                            <div className="impact-image">
                                <video
                                    src={item.video}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                ></video>
                            </div>
                            <div className="impact-stat-number">
                                {item.stat}
                            </div>
                            <h3 className="impact-title">{item.title}</h3>
                            <p className="impact-description">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default OurImpactSection;
