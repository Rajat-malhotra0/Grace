import React, { useState } from "react";
import "./ServiceCarousel.css";
import registerNgoImg from "../../assets/registerNgo.jpg";
import graceAppImg from "../../assets/graceApp.png";
import volunteerImg from "../../assets/volunteer.jpg";
import donorsImg from "../../assets/donors.jpg";
import needsMarketImg from "../../assets/needsMarket.jpg";

const services = [
  {
    id: "registerNgo",
    title: "Get Discovered",
    description: "Register Your NGO, Reach More Hearts. ",
    details:
      "Join Grace to share your mission with a wider audience. Once registered, your NGO is featured on our platform — connecting you with aligned donors and passionate volunteers.",
    bgColor: "bg-blue",
    image: registerNgoImg,
    buttonText: "Register Your NGO",
  },
  {
    id: "graceApp",
    title: "The Grace App",
    description: "We Handle the Tasks, You Focus on the Good",
    details:
      "Our intelligent app simplifies NGO operations — from inventory and event planning to volunteer and donor management. You focus on creating change; we’ll take care of the details.",
    bgColor: "bg-pink",
    image: graceAppImg,
    buttonText: "Explore the App",
  },
  {
    id: "volunteer",
    title: "Volunteer Matching",
    description: "Find Where You’re Meant to Help",
    details:
      "We connect individuals with volunteering opportunities that suit their time, skills, and causes they care about — creating impact that feels personal and purposeful.",
    bgColor: "bg-purple",
    image: volunteerImg,
    buttonText: "Take the quiz",
  },
  {
    id: "donors",
    title: "Meaningful Giving",
    description: "Donate with Confidence and Compassion",
    details:
      "Support trusted NGOs doing real work. With clear listings and transparent impact, your generosity flows exactly where it's needed — no noise, just impact.",
    bgColor: "bg-yellow",
    image: donorsImg,
    buttonText: "Explore all NGOs",
  },
  {
    id: "needsMarket",
    title: "The Need Marketplace",
    description: " Give What Matters Most",
    details:
      "NGOs list the specific items they need — from school supplies to equipment — and donors like you step in. Once donated, our volunteers ensure it’s delivered directly to those in need",
    bgColor: "bg-emerald",
    image: needsMarketImg,
    buttonText: "Visit Marketplace",
  },
];

const ServiceCarousel = () => {
  const [activeTab, setActiveTab] = useState("registerNgo");

  const activeService = services.find((s) => s.id === activeTab);
  const Icon = activeService.icon;

  return (
    <section className="service-section">
      <div className="container">
        <div className="section-header">
          <h2>HOW WE HELP</h2>
          <p>
            <em>
              Empowering NGOs, volunteers, and donors to do more good —
              together.
            </em>
          </p>
        </div>

        <div className="service-tabs">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => setActiveTab(service.id)}
              className={`tab-btn ${
                activeTab === service.id ? "active-tab " + service.bgColor : ""
              }`}
            >
              {service.title}
            </button>
          ))}
        </div>

        {activeService && (
          <div className={`service-card ${activeService.bgColor}`}>
            <div className="service-card-content">
              <div className="service-image-box">
                <img
                  src={activeService.image}
                  alt={activeService.title}
                  className="service-image"
                />
              </div>

              <div className="service-text">
                <h3>{activeService.title}</h3>
                <p className="desc">{activeService.description}</p>
                <p className="details">{activeService.details}</p>
                <button className="service-btn">
                  {activeService.buttonText}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceCarousel;
