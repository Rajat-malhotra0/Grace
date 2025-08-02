import React from "react";
import DonationNeedsPage from "./DonationNeedsPage";
import ngoImage1 from "../../../assets/ngo1.jpg";
import ngoImage2 from "../../../assets/ngo2.jpg";
import ngoImage3 from "../../../assets/ngo3.jpg";
import ngoImage4 from "../../../assets/ngo4.jpg";

const foodNutritionData = [
  {
    id: 1,
    ngoName: "Hope Foundation",
    ngoImage: ngoImage1,
    location: "Mumbai, Maharashtra",
    item: "Rice (25kg bags)",
    category: "Food & Nutrition",
    quantity: "50 bags",
    urgency: "High",
    datePosted: "2024-01-25",
  },
  {
    id: 2,
    ngoName: "Care India",
    ngoImage: ngoImage2,
    location: "Delhi, NCR",
    item: "Cooking Oil (1L bottles)",
    category: "Food & Nutrition",
    quantity: "100 bottles",
    urgency: "Medium",
    datePosted: "2024-01-23",
  },
  {
    id: 3,
    ngoName: "Smile Foundation",
    ngoImage: ngoImage3,
    location: "Bangalore, Karnataka",
    item: "Dal/Lentils (10kg bags)",
    category: "Food & Nutrition",
    quantity: "30 bags",
    urgency: "High",
    datePosted: "2024-01-20",
  },
  {
    id: 4,
    ngoName: "Akshaya Patra",
    ngoImage: ngoImage4,
    location: "Hyderabad, Telangana",
    item: "Wheat Flour (25kg bags)",
    category: "Food & Nutrition",
    quantity: "40 bags",
    urgency: "Low",
    datePosted: "2024-01-18",
  },
];

const FoodNutritionNeeds = () => {
  return (
    <DonationNeedsPage
      category="Food and Nutrition"
      categoryData={foodNutritionData}
    />
  );
};

export default FoodNutritionNeeds;
