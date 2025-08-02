import React from "react";
import DonationNeedsPage from "./DonationNeedsPage";
import ngoImage1 from "../../../assets/ngo1.jpg";
import ngoImage2 from "../../../assets/ngo2.jpg";
import ngoImage3 from "../../../assets/ngo3.jpg";
import ngoImage4 from "../../../assets/ngo4.jpg";
import ngoImage5 from "../../../assets/ngo5.jpg";

const technologyData = [
  {
    id: 1,
    ngoName: "Digital Learning Hub",
    ngoImage: ngoImage1,
    location: "Pune, Maharashtra",
    item: "Laptops (Working Condition)",
    category: "Technology",
    quantity: "15 units",
    urgency: "High",
    datePosted: "2024-01-29",
  },
  {
    id: 2,
    ngoName: "Tech for Education",
    ngoImage: ngoImage2,
    location: "Bangalore, Karnataka",
    item: "Tablets for Online Learning",
    category: "Technology",
    quantity: "25 units",
    urgency: "High",
    datePosted: "2024-01-27",
  },
  {
    id: 3,
    ngoName: "Rural Connectivity Project",
    ngoImage: ngoImage3,
    location: "Shimla, Himachal Pradesh",
    item: "WiFi Routers & Modems",
    category: "Technology",
    quantity: "8 units",
    urgency: "Medium",
    datePosted: "2024-01-26",
  },
  {
    id: 4,
    ngoName: "Senior Digital Literacy",
    ngoImage: ngoImage4,
    location: "Mysore, Karnataka",
    item: "Smartphones (Android)",
    category: "Technology",
    quantity: "20 units",
    urgency: "Low",
    datePosted: "2024-01-24",
  },
  {
    id: 5,
    ngoName: "Code for Good Foundation",
    ngoImage: ngoImage5,
    location: "Hyderabad, Telangana",
    item: "Desktop Computers (Complete Setup)",
    category: "Technology",
    quantity: "10 sets",
    urgency: "Medium",
    datePosted: "2024-01-23",
  },
  {
    id: 6,
    ngoName: "Women in Tech Initiative",
    ngoImage: ngoImage1,
    location: "Kochi, Kerala",
    item: "Webcams & Headphones",
    category: "Technology",
    quantity: "30 pieces",
    urgency: "Medium",
    datePosted: "2024-01-22",
  },
  {
    id: 7,
    ngoName: "E-Learning Support Center",
    ngoImage: ngoImage2,
    location: "Jaipur, Rajasthan",
    item: "Projectors & Speakers",
    category: "Technology",
    quantity: "5 sets",
    urgency: "High",
    datePosted: "2024-01-21",
  },
  {
    id: 8,
    ngoName: "Digital Divide Bridge",
    ngoImage: ngoImage3,
    location: "Guwahati, Assam",
    item: "Charging Cables & Power Banks",
    category: "Technology",
    quantity: "50 pieces",
    urgency: "Low",
    datePosted: "2024-01-20",
  },
  {
    id: 9,
    ngoName: "Innovation Lab for Kids",
    ngoImage: ngoImage4,
    location: "Chandigarh, Punjab",
    item: "Old Keyboards & Computer Mice",
    category: "Technology",
    quantity: "40 pieces",
    urgency: "Low",
    datePosted: "2024-01-18",
  },
];

const TechnologyNeeds = () => {
  return (
    <DonationNeedsPage
      category="Technology Donations"
      categoryData={technologyData}
    />
  );
};

export default TechnologyNeeds;
