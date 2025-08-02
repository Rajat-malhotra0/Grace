import React from "react";
import DonationNeedsPage from "./DonationNeedsPage";
import ngoImage1 from "../../../assets/ngo1.jpg";
import ngoImage2 from "../../../assets/ngo2.jpg";
import ngoImage3 from "../../../assets/ngo3.jpg";
import ngoImage4 from "../../../assets/ngo4.jpg";
import ngoImage5 from "../../../assets/ngo5.jpg";

const toysData = [
  {
    id: 1,
    ngoName: "Children's Joy Foundation",
    ngoImage: ngoImage1,
    location: "Mumbai, Maharashtra",
    item: "Educational Toys (Age 3-6)",
    category: "Toys & Recreation",
    quantity: "50 pieces",
    urgency: "High",
    datePosted: "2024-01-31",
  },
  {
    id: 2,
    ngoName: "Smile for Every Child",
    ngoImage: ngoImage2,
    location: "Delhi, NCR",
    item: "Board Games & Puzzles",
    category: "Toys & Recreation",
    quantity: "30 sets",
    urgency: "Medium",
    datePosted: "2024-01-29",
  },
  {
    id: 3,
    ngoName: "Happy Kids Initiative",
    ngoImage: ngoImage3,
    location: "Kolkata, West Bengal",
    item: "Stuffed Animals & Dolls",
    category: "Toys & Recreation",
    quantity: "80 pieces",
    urgency: "High",
    datePosted: "2024-01-28",
  },
  {
    id: 4,
    ngoName: "Play & Learn Center",
    ngoImage: ngoImage4,
    location: "Chennai, Tamil Nadu",
    item: "Building Blocks & LEGO Sets",
    category: "Toys & Recreation",
    quantity: "25 sets",
    urgency: "Medium",
    datePosted: "2024-01-27",
  },
  {
    id: 5,
    ngoName: "Recreation for All",
    ngoImage: ngoImage5,
    location: "Ahmedabad, Gujarat",
    item: "Sports Equipment (Balls, Bats)",
    category: "Toys & Recreation",
    quantity: "40 pieces",
    urgency: "Low",
    datePosted: "2024-01-26",
  },
  {
    id: 6,
    ngoName: "Creative Kids Hub",
    ngoImage: ngoImage1,
    location: "Srinagar, Jammu & Kashmir",
    item: "Art & Craft Supplies",
    category: "Toys & Recreation",
    quantity: "60 sets",
    urgency: "Medium",
    datePosted: "2024-01-25",
  },
  {
    id: 7,
    ngoName: "Little Angels Care",
    ngoImage: ngoImage2,
    location: "Bhopal, Madhya Pradesh",
    item: "Musical Instruments (Toy)",
    category: "Toys & Recreation",
    quantity: "20 pieces",
    urgency: "Low",
    datePosted: "2024-01-24",
  },
  {
    id: 8,
    ngoName: "Childhood Dreams Trust",
    ngoImage: ngoImage3,
    location: "Goa, Panaji",
    item: "Remote Control Cars & Trucks",
    category: "Toys & Recreation",
    quantity: "15 pieces",
    urgency: "Low",
    datePosted: "2024-01-23",
  },
  {
    id: 9,
    ngoName: "Fun & Learning Society",
    ngoImage: ngoImage4,
    location: "Patna, Bihar",
    item: "Coloring Books & Crayons",
    category: "Toys & Recreation",
    quantity: "100 sets",
    urgency: "High",
    datePosted: "2024-01-22",
  },
  {
    id: 10,
    ngoName: "Playground Equipment Fund",
    ngoImage: ngoImage5,
    location: "Trivandrum, Kerala",
    item: "Outdoor Games (Frisbee, Jump Ropes)",
    category: "Toys & Recreation",
    quantity: "35 pieces",
    urgency: "Medium",
    datePosted: "2024-01-21",
  },
];

const ToysNeeds = () => {
  return (
    <DonationNeedsPage
      category="Toys and Recreational Items"
      categoryData={toysData}
    />
  );
};

export default ToysNeeds;
