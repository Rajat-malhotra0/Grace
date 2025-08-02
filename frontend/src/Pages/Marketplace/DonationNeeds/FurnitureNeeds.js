import React from "react";
import DonationNeedsPage from "./DonationNeedsPage";
import ngoImage1 from "../../../assets/ngo1.jpg";
import ngoImage2 from "../../../assets/ngo2.jpg";
import ngoImage3 from "../../../assets/ngo3.jpg";
import ngoImage4 from "../../../assets/ngo4.jpg";
import ngoImage5 from "../../../assets/ngo5.jpg";

const furnitureData = [
  {
    id: 1,
    ngoName: "Home for All Foundation",
    ngoImage: ngoImage1,
    location: "Lucknow, Uttar Pradesh",
    item: "Single Beds with Mattresses",
    category: "Furniture & Essentials",
    quantity: "12 sets",
    urgency: "High",
    datePosted: "2024-01-30",
  },
  {
    id: 2,
    ngoName: "Shelter Support Initiative",
    ngoImage: ngoImage2,
    location: "Vadodara, Gujarat",
    item: "Study Tables & Chairs",
    category: "Furniture & Essentials",
    quantity: "20 sets",
    urgency: "Medium",
    datePosted: "2024-01-28",
  },
  {
    id: 3,
    ngoName: "New Beginnings Center",
    ngoImage: ngoImage3,
    location: "Visakhapatnam, Andhra Pradesh",
    item: "Kitchen Utensils & Cookware",
    category: "Furniture & Essentials",
    quantity: "15 sets",
    urgency: "High",
    datePosted: "2024-01-27",
  },
  {
    id: 4,
    ngoName: "Fresh Start Housing",
    ngoImage: ngoImage4,
    location: "Nashik, Maharashtra",
    item: "Ceiling Fans & Table Fans",
    category: "Furniture & Essentials",
    quantity: "25 units",
    urgency: "Medium",
    datePosted: "2024-01-26",
  },
  {
    id: 5,
    ngoName: "Community Living Support",
    ngoImage: ngoImage5,
    location: "Jammu, Jammu & Kashmir",
    item: "Wardrobes & Storage Cabinets",
    category: "Furniture & Essentials",
    quantity: "8 pieces",
    urgency: "Low",
    datePosted: "2024-01-25",
  },
  {
    id: 6,
    ngoName: "Essential Needs Trust",
    ngoImage: ngoImage1,
    location: "Mangalore, Karnataka",
    item: "Dining Table & Chairs",
    category: "Furniture & Essentials",
    quantity: "5 sets",
    urgency: "Low",
    datePosted: "2024-01-24",
  },
  {
    id: 7,
    ngoName: "Comfort Zone Initiative",
    ngoImage: ngoImage2,
    location: "Raipur, Chhattisgarh",
    item: "Water Coolers & Purifiers",
    category: "Furniture & Essentials",
    quantity: "10 units",
    urgency: "High",
    datePosted: "2024-01-23",
  },
  {
    id: 8,
    ngoName: "Basic Amenities Foundation",
    ngoImage: ngoImage3,
    location: "Faridabad, Haryana",
    item: "Refrigerators (Small Size)",
    category: "Furniture & Essentials",
    quantity: "6 units",
    urgency: "Medium",
    datePosted: "2024-01-22",
  },
  {
    id: 9,
    ngoName: "Living Essentials Hub",
    ngoImage: ngoImage4,
    location: "Kanpur, Uttar Pradesh",
    item: "Plastic Chairs & Stools",
    category: "Furniture & Essentials",
    quantity: "40 pieces",
    urgency: "Low",
    datePosted: "2024-01-21",
  },
];

const FurnitureNeeds = () => {
  return (
    <DonationNeedsPage
      category="Furniture and Essentials"
      categoryData={furnitureData}
    />
  );
};

export default FurnitureNeeds;
