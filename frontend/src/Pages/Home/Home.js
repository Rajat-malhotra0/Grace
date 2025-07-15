import React from "react";
import HeroSection from "./HeroSection";
import NgoCarousel from "./NgoCarousel";
import QuizSection from "./QuizSection";
import ServiceCarousel from './ServiceCarousel';

function Home() {
  return (
    <div className="page-content">
      <HeroSection />
      <NgoCarousel />
      <QuizSection />
      <ServiceCarousel />
    </div>
  );
}

export default Home;
