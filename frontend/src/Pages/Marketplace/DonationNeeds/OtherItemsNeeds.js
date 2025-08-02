import React from "react";
import DonationNeedsPage from "./DonationNeedsPage";
import ngoImage1 from "../../../assets/ngo1.jpg";
import ngoImage2 from "../../../assets/ngo2.jpg";
import ngoImage3 from "../../../assets/ngo3.jpg";
import ngoImage4 from "../../../assets/ngo4.jpg";
import ngoImage5 from "../../../assets/ngo5.jpg";

const otherItemsData = [
  {
    id: 1,
    ngoName: "Weather Relief Foundation",
    ngoImage: ngoImage1,
    location: "Cherrapunji, Meghalaya",
    item: "Umbrellas & Raincoats",
    category: "Other Items",
    quantity: "100 pieces",
    urgency: "High",
    datePosted: "2024-02-02",
  },
  {
    id: 2,
    ngoName: "Rural Illumination Project",
    ngoImage: ngoImage2,
    location: "Sundarbans, West Bengal",
    item: "Solar Lamps & Lanterns",
    category: "Other Items",
    quantity: "75 units",
    urgency: "High",
    datePosted: "2024-02-01",
  },
  {
    id: 3,
    ngoName: "Emergency Preparedness Trust",
    ngoImage: ngoImage3,
    location: "Kutch, Gujarat",
    item: "Emergency Radios & Flashlights",
    category: "Other Items",
    quantity: "30 pieces",
    urgency: "Medium",
    datePosted: "2024-01-31",
  },
  {
    id: 4,
    ngoName: "Clean Water Initiative",
    ngoImage: ngoImage4,
    location: "Rajkot, Gujarat",
    item: "Water Storage Containers",
    category: "Other Items",
    quantity: "40 containers",
    urgency: "High",
    datePosted: "2024-01-30",
  },
  {
    id: 5,
    ngoName: "Sustainable Living Hub",
    ngoImage: ngoImage5,
    location: "Shimla, Himachal Pradesh",
    item: "Reusable Shopping Bags",
    category: "Other Items",
    quantity: "200 bags",
    urgency: "Low",
    datePosted: "2024-01-29",
  },
  {
    id: 6,
    ngoName: "Mobility Support Center",
    ngoImage: ngoImage1,
    location: "Pune, Maharashtra",
    item: "Walking Sticks & Mobility Aids",
    category: "Other Items",
    quantity: "25 pieces",
    urgency: "Medium",
    datePosted: "2024-01-28",
  },
  {
    id: 7,
    ngoName: "Community Safety Network",
    ngoImage: ngoImage2,
    location: "Guwahati, Assam",
    item: "First Aid Emergency Kits",
    category: "Other Items",
    quantity: "50 kits",
    urgency: "High",
    datePosted: "2024-01-27",
  },
  {
    id: 8,
    ngoName: "Eco-Friendly Solutions",
    ngoImage: ngoImage3,
    location: "Pondicherry, Tamil Nadu",
    item: "Bamboo Utensils & Plates",
    category: "Other Items",
    quantity: "150 sets",
    urgency: "Low",
    datePosted: "2024-01-26",
  },
  {
    id: 9,
    ngoName: "Transport Assistance Fund",
    ngoImage: ngoImage4,
    location: "Dehradun, Uttarakhand",
    item: "Bicycle Repair Kits",
    category: "Other Items",
    quantity: "20 kits",
    urgency: "Medium",
    datePosted: "2024-01-25",
  },
  {
    id: 10,
    ngoName: "Seasonal Support Initiative",
    ngoImage: ngoImage5,
    location: "Manali, Himachal Pradesh",
    item: "Thermos Flasks & Hot Water Bags",
    category: "Other Items",
    quantity: "60 pieces",
    urgency: "High",
    datePosted: "2024-01-24",
  },
  {
    id: 11,
    ngoName: "Community Garden Project",
    ngoImage: ngoImage1,
    location: "Ooty, Tamil Nadu",
    item: "Gardening Tools & Seeds",
    category: "Other Items",
    quantity: "35 sets",
    urgency: "Medium",
    datePosted: "2024-01-23",
  },
];

const OtherItemsNeeds = () => {
  return (
    <DonationNeedsPage
      category="Other Useful Items"
      categoryData={otherItemsData}
    />
  );
};

export default OtherItemsNeeds;
