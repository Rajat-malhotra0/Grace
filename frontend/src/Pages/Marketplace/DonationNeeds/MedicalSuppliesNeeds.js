import React from "react";
import DonationNeedsPage from "./DonationNeedsPage";
import ngoImage1 from "../../../assets/ngo1.jpg";
import ngoImage2 from "../../../assets/ngo2.jpg";
import ngoImage3 from "../../../assets/ngo3.jpg";
import ngoImage4 from "../../../assets/ngo4.jpg";
import ngoImage5 from "../../../assets/ngo5.jpg";

const medicalSuppliesData = [
  {
    id: 1,
    ngoName: "Health for All Foundation",
    ngoImage: ngoImage1,
    location: "Nagpur, Maharashtra",
    item: "First Aid Kits (Complete)",
    category: "Medical & Hygiene",
    quantity: "30 kits",
    urgency: "High",
    datePosted: "2024-01-28",
  },
  {
    id: 2,
    ngoName: "Rural Health Initiative",
    ngoImage: ngoImage2,
    location: "Ranchi, Jharkhand",
    item: "Antiseptic Solutions & Bandages",
    category: "Medical & Hygiene",
    quantity: "100 bottles + 200 rolls",
    urgency: "High",
    datePosted: "2024-01-26",
  },
  {
    id: 3,
    ngoName: "Community Wellness Center",
    ngoImage: ngoImage3,
    location: "Thiruvananthapuram, Kerala",
    item: "Digital Thermometers",
    category: "Medical & Hygiene",
    quantity: "25 pieces",
    urgency: "Medium",
    datePosted: "2024-01-25",
  },
  {
    id: 4,
    ngoName: "Hygiene Awareness Trust",
    ngoImage: ngoImage4,
    location: "Dehradun, Uttarakhand",
    item: "Hand Sanitizers (500ml)",
    category: "Medical & Hygiene",
    quantity: "150 bottles",
    urgency: "Medium",
    datePosted: "2024-01-23",
  },
  {
    id: 5,
    ngoName: "Women's Health Support",
    ngoImage: ngoImage5,
    location: "Bhopal, Madhya Pradesh",
    item: "Sanitary Pads & Hygiene Kits",
    category: "Medical & Hygiene",
    quantity: "200 packs",
    urgency: "High",
    datePosted: "2024-01-22",
  },
  {
    id: 6,
    ngoName: "Emergency Care Network",
    ngoImage: ngoImage1,
    location: "Coimbatore, Tamil Nadu",
    item: "Blood Pressure Monitors",
    category: "Medical & Hygiene",
    quantity: "12 units",
    urgency: "Low",
    datePosted: "2024-01-21",
  },
  {
    id: 7,
    ngoName: "Clean India Mission",
    ngoImage: ngoImage2,
    location: "Agra, Uttar Pradesh",
    item: "Soap Bars & Hand Wash",
    category: "Medical & Hygiene",
    quantity: "300 pieces",
    urgency: "Medium",
    datePosted: "2024-01-20",
  },
  {
    id: 8,
    ngoName: "Pandemic Response Team",
    ngoImage: ngoImage3,
    location: "Surat, Gujarat",
    item: "Face Masks (N95 & Surgical)",
    category: "Medical & Hygiene",
    quantity: "500 pieces",
    urgency: "High",
    datePosted: "2024-01-19",
  },
];

const MedicalSuppliesNeeds = () => {
  return (
    <DonationNeedsPage
      category="Medical and Hygiene Supplies"
      categoryData={medicalSuppliesData}
    />
  );
};

export default MedicalSuppliesNeeds;
