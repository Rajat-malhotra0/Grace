import React from "react";
import "./ImpactStories.css";

import Leaf1 from "../../assets/Leaf7.svg";
import Leaf2 from "../../assets/Leaf2.svg";
import Leaf3 from "../../assets/Leaf6.svg";
import Leaf4 from "../../assets/Leaf4.svg";
import Leaf5 from "../../assets/Leaf5.svg";
import Flower1 from "../../assets/flower1.svg";
import Sparkle from "../../assets/sparkle.svg";

const stories = [
  {
    title: "Finding Inner Calm",
    ngo: "Mindful Futures",
    date: "March 12, 2025",
    content:
      "I appreciate the consistent reminders to be kind and patient with myself as I learn and practice daily habits that are helping me find a calmer daily space.",
  },
  {
    title: "A Sense of Belonging",
    ngo: "Healing Hands",
    date: "May 3, 2025",
    content:
      "Grace helped me begin the process of stepping back from toxic thinking and being a part of something bigger than my own personal grievances.",
  },
  {
    title: "Rediscovering Purpose",
    ngo: "Hope in Action",
    date: "June 27, 2025",
    content:
      "The strategies in the programs allow me to work on a part of myself that I am struggling with. Grace changed the relationship I have with myself.",
  },
];

function ImpactStories() {
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
              Hear how lives have been touched, one act of kindness at a time.
            </em>
          </p>
        </h2>
      </div>

      <div className="testimonial-grid">
        {stories.map((story, index) => (
          <div className="testimonial-card" key={index}>
            <h3 className="testimonial-title">{story.title}</h3>
            <p className="testimonial-content">“{story.content}”</p>
            <p className="testimonial-meta">
              — {story.ngo} | {story.date}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ImpactStories;
