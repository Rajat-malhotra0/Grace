import React from "react";
import DonationNeedsPage from "./DonationNeedsPage";
import ngoImage1 from "../../../assets/ngo1.jpg";
import ngoImage2 from "../../../assets/ngo2.jpg";
import ngoImage3 from "../../../assets/ngo3.jpg";
import ngoImage4 from "../../../assets/ngo4.jpg";
import ngoImage5 from "../../../assets/ngo5.jpg";

const skillToolsData = [
  {
    id: 1,
    ngoName: "Skill Development Academy",
    ngoImage: ngoImage1,
    location: "Jodhpur, Rajasthan",
    item: "Sewing Machines (Manual & Electric)",
    category: "Skill Tools",
    quantity: "12 units",
    urgency: "High",
    datePosted: "2024-02-01",
  },
  {
    id: 2,
    ngoName: "Craftsmen Training Center",
    ngoImage: ngoImage2,
    location: "Ludhiana, Punjab",
    item: "Carpentry Tool Sets",
    category: "Skill Tools",
    quantity: "8 sets",
    urgency: "High",
    datePosted: "2024-01-30",
  },
  {
    id: 3,
    ngoName: "Women Empowerment Hub",
    ngoImage: ngoImage3,
    location: "Ernakulam, Kerala",
    item: "Embroidery Hoops & Threads",
    category: "Skill Tools",
    quantity: "50 sets",
    urgency: "Medium",
    datePosted: "2024-01-29",
  },
  {
    id: 4,
    ngoName: "Rural Artisan Support",
    ngoImage: ngoImage4,
    location: "Bikaner, Rajasthan",
    item: "Pottery Wheels & Clay Tools",
    category: "Skill Tools",
    quantity: "6 sets",
    urgency: "Medium",
    datePosted: "2024-01-28",
  },
  {
    id: 5,
    ngoName: "Youth Skill Initiative",
    ngoImage: ngoImage5,
    location: "Kanpur, Uttar Pradesh",
    item: "Electrical Tool Kits",
    category: "Skill Tools",
    quantity: "15 kits",
    urgency: "Low",
    datePosted: "2024-01-27",
  },
  {
    id: 6,
    ngoName: "Traditional Crafts Revival",
    ngoImage: ngoImage1,
    location: "Mysore, Karnataka",
    item: "Weaving Looms (Handloom)",
    category: "Skill Tools",
    quantity: "4 units",
    urgency: "High",
    datePosted: "2024-01-26",
  },
  {
    id: 7,
    ngoName: "Community Workshop Center",
    ngoImage: ngoImage2,
    location: "Indore, Madhya Pradesh",
    item: "Plumbing Tool Sets",
    category: "Skill Tools",
    quantity: "10 sets",
    urgency: "Medium",
    datePosted: "2024-01-25",
  },
  {
    id: 8,
    ngoName: "Livelihood Enhancement Trust",
    ngoImage: ngoImage3,
    location: "Tiruppur, Tamil Nadu",
    item: "Knitting Machines & Needles",
    category: "Skill Tools",
    quantity: "18 units",
    urgency: "High",
    datePosted: "2024-01-24",
  },
  {
    id: 9,
    ngoName: "Self-Employment Foundation",
    ngoImage: ngoImage4,
    location: "Gurgaon, Haryana",
    item: "Beauty Parlor Equipment",
    category: "Skill Tools",
    quantity: "7 sets",
    urgency: "Medium",
    datePosted: "2024-01-23",
  },
  {
    id: 10,
    ngoName: "Artisan Empowerment Society",
    ngoImage: ngoImage5,
    location: "Udaipur, Rajasthan",
    item: "Jewelry Making Tools",
    category: "Skill Tools",
    quantity: "25 sets",
    urgency: "Low",
    datePosted: "2024-01-22",
  },
];

const SkillToolsNeeds = () => {
  return (
    <DonationNeedsPage
      category="Tools for Skill Building"
      categoryData={skillToolsData}
    />
  );
};

export default SkillToolsNeeds;
