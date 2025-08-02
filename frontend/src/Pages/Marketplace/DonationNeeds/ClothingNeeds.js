import React from "react";
import DonationNeedsPage from "./DonationNeedsPage";
import ngoImage1 from "../../../assets/ngo1.jpg";
import ngoImage2 from "../../../assets/ngo2.jpg";
import ngoImage3 from "../../../assets/ngo3.jpg";
import ngoImage4 from "../../../assets/ngo4.jpg";
import ngoImage5 from "../../../assets/ngo5.jpg";

const clothingData = [
  {
    id: 1,
    ngoName: "Clothing the Needy",
    ngoImage: ngoImage1,
    location: "Chennai, Tamil Nadu",
    item: "Winter Jackets (Adult Size M-L)",
    category: "Clothing & Apparel",
    quantity: "25 pieces",
    urgency: "High",
    datePosted: "2024-01-26",
  },
  {
    id: 2,
    ngoName: "Warmth for All",
    ngoImage: ngoImage2,
    location: "Kolkata, West Bengal",
    item: "Children's Sweaters (Age 5-12)",
    category: "Clothing & Apparel",
    quantity: "40 pieces",
    urgency: "High",
    datePosted: "2024-01-24",
  },
  {
    id: 3,
    ngoName: "Dignity Foundation",
    ngoImage: ngoImage3,
    location: "Pune, Maharashtra",
    item: "Formal Shirts (Men's L-XL)",
    category: "Clothing & Apparel",
    quantity: "15 pieces",
    urgency: "Medium",
    datePosted: "2024-01-22",
  },
  {
    id: 4,
    ngoName: "Second Chance Clothing",
    ngoImage: ngoImage4,
    location: "Jaipur, Rajasthan",
    item: "Women's Sarees (Cotton)",
    category: "Clothing & Apparel",
    quantity: "30 pieces",
    urgency: "Low",
    datePosted: "2024-01-21",
  },
  {
    id: 5,
    ngoName: "Threads of Hope",
    ngoImage: ngoImage5,
    location: "Ahmedabad, Gujarat",
    item: "School Uniforms (Age 8-14)",
    category: "Clothing & Apparel",
    quantity: "20 sets",
    urgency: "Medium",
    datePosted: "2024-01-19",
  },
  {
    id: 6,
    ngoName: "Comfort Wear Initiative",
    ngoImage: ngoImage1,
    location: "Lucknow, Uttar Pradesh",
    item: "Blankets & Shawls",
    category: "Clothing & Apparel",
    quantity: "35 pieces",
    urgency: "High",
    datePosted: "2024-01-18",
  },
];

const ClothingNeeds = () => {
  return (
    <DonationNeedsPage
      category="Clothing and Apparel"
      categoryData={clothingData}
    />
  );
};

export default ClothingNeeds;
