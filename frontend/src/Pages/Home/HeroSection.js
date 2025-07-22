import React, { useState } from "react";
import "./HeroSection.css";
import Particles from "../../Components/Particles/Particles";
import handsVideo from "../../assets/hands_video.mp4";

function HeroSection() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section
      className="hero-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        className={`hero-video ${isHovered ? "fade-out" : "fade-in"}`}
      >
        <source src={handsVideo} type="video/mp4" />
      </video>

      {/* Black Background */}
      <div
        className={`particles-wrapper ${isHovered ? "fade-in" : "fade-out"}`}
      >
        <Particles
          particleColors={["#ffffff", "#ffffff"]}
          particleCount={200}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={false}
          disableRotation={false}
        />
      </div>

      {/* Dark Overlay */}
      <div className={`dark-overlay ${isHovered ? "fade-out" : "fade-in"}`} />

      {/* Default Welcome Content */}
      <div className={`hero-content ${isHovered ? "fade-out" : "fade-in"}`}>
        <h1 className="hero-headline">
          HI! WELCOME <em>to</em> GRACE,
          <br />
          WE HOPE <em>you</em> STAY A WHILE
        </h1>
        <p className="hero-subtext">Built to uplift those who uplift others</p>
      </div>

      {/* Hovered Message Content */}
      <div className={`hover-overlay ${isHovered ? "fade-in" : "fade-out"}`}>
        <div className="hover-text">
          <h1 className="hero-headline-hover">
            GENTLE SOULS <br />
            <em>for a</em> <br />
            HEAVY WORLD
          </h1>
          <h2 className="hero-subheading">GRACE</h2>
          <p className="hero-hover-subtext">
            Connecting compassionate hearts to transform communities
          </p>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
