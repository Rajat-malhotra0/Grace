import React from "react";
import { useNavigate } from "react-router-dom";
import "./DonationCategories.css";
import foodNutrition from "../../assets/foodDonate.jpg";
import clothing from "../../assets/clothesDonate.jpg";
import booksStationery from "../../assets/booksDonate.jpg";
import medicalSupplies from "../../assets/medicinesDonate.jpg";
import technology from "../../assets/technologyDonate.jpg";
import furniture from "../../assets/furnitureDonate.jpg";
import toys from "../../assets/toysDonate.jpg";
import hygieneKits from "../../assets/skillToolsDonate.jpg";
import skillTools from "../../assets/othersDonate.jpg";

const donationData = [
  {
    id: 1,
    title: "Food and Nutrition",
    description:
      "Provide essential food items to support individuals and families facing hunger.",
    image: foodNutrition,
    route: "/marketplace/food-nutrition",
  },
  {
    id: 2,
    title: "Clothing and Apparel",
    description:
      "Donate clean, wearable clothes to help communities stay warm and dignified.",
    image: clothing,
    route: "/marketplace/clothing",
  },
  {
    id: 3,
    title: "Books and Stationery",
    description:
      "Support education by donating books, notebooks, and essential school supplies.",
    image: booksStationery,
    route: "/marketplace/books-stationery",
  },
  {
    id: 4,
    title: "Medical and Hygiene Supplies",
    description:
      "Contribute first-aid items, sanitary products, and health essentials to improve well-being.",
    image: medicalSupplies,
    route: "/marketplace/medical-supplies",
  },
  {
    id: 5,
    title: "Technology Donations",
    description:
      "Help bridge the digital divide with devices like phones, laptops, and accessories.",
    image: technology,
    route: "/marketplace/technology",
  },
  {
    id: 6,
    title: "Furniture and Essentials",
    description:
      "Provide basic furniture and household items to improve living conditions.",
    image: furniture,
    route: "/marketplace/furniture",
  },
  {
    id: 7,
    title: "Toys and Recreational Items",
    description:
      "Donate toys and games to support emotional development and joy in children.",
    image: toys,
    route: "/marketplace/toys",
  },
  {
    id: 8,
    title: "Tools for Skill Building",
    description:
      "Empower individuals through donations of tools used in tailoring, carpentry, and other trades.",
    image: hygieneKits,
    route: "/marketplace/skill-tools",
  },
  {
    id: 9,
    title: "Other Useful Items",
    description:
      "Donate additional items like umbrellas, solar lamps, and raincoats as per current NGO needs.",
    image: skillTools,
    route: "/marketplace/other-items",
  },
];

const DonationCategories = () => {
  const navigate = useNavigate();

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="donation-categories-container">
      <div className="donation-header">
        <h2>Donation Categories</h2>
        <p>Choose how you'd like to make a difference in your community</p>
      </div>

      <div className="donation-grid">
        {donationData.map((donation) => {
          return (
            <div
              className="donation-card"
              key={donation.id}
              onClick={() => handleCardClick(donation.route)}
            >
              <div className="donation-image-wrapper">
                <img
                  src={donation.image}
                  alt={donation.title}
                  className="donation-image"
                />
                <div className="donation-image-overlay"></div>
              </div>
              <div className="donation-content">
                <h3>{donation.title}</h3>
                <p>{donation.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DonationCategories;
