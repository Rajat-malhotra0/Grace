import React from "react";
import HeroSection from "./HeroSection";
import NgoCarousel from "./NgoCarousel";
import QuizSection from "./QuizSection";
import ServiceCarousel from "./ServiceCarousel";
import ImpactStories from "./ImpactStories";
import OurImpactSection from "./OurImpactSection";
import FaqSection from "./FaqSection";
import ContactSection from "./ContactSection";

import CurrentEvents from "./CurrentEvents";

function Home() {
    return (
        <div className="page-content">
            <HeroSection />
            <CurrentEvents />
            <NgoCarousel />
            <QuizSection />
            <ServiceCarousel />
            <ImpactStories />
            <OurImpactSection />
            <FaqSection />
            <ContactSection />
        </div>
    );
}

export default Home;
