import React from "react";
import DonationNeedsPage from "./DonationNeedsPage";
import ngoImage1 from "../../../assets/ngo1.jpg";
import ngoImage2 from "../../../assets/ngo2.jpg";
import ngoImage3 from "../../../assets/ngo3.jpg";
import ngoImage4 from "../../../assets/ngo4.jpg";
import ngoImage5 from "../../../assets/ngo5.jpg";

const booksStationeryData = [
  {
    id: 1,
    ngoName: "Literacy for All",
    ngoImage: ngoImage1,
    location: "Kochi, Kerala",
    item: "English Textbooks (Class 6-8)",
    category: "Books & Stationery",
    quantity: "150 books",
    urgency: "High",
    datePosted: "2024-01-27",
  },
  {
    id: 2,
    ngoName: "Education First",
    ngoImage: ngoImage2,
    location: "Patna, Bihar",
    item: "Notebooks & Writing Pads",
    category: "Books & Stationery",
    quantity: "300 pieces",
    urgency: "Medium",
    datePosted: "2024-01-25",
  },
  {
    id: 3,
    ngoName: "Knowledge Bridge",
    ngoImage: ngoImage3,
    location: "Indore, Madhya Pradesh",
    item: "Science Lab Manuals (Class 9-10)",
    category: "Books & Stationery",
    quantity: "80 books",
    urgency: "High",
    datePosted: "2024-01-24",
  },
  {
    id: 4,
    ngoName: "Rural Education Trust",
    ngoImage: ngoImage4,
    location: "Jodhpur, Rajasthan",
    item: "Pencils, Pens & Erasers",
    category: "Books & Stationery",
    quantity: "500 pieces",
    urgency: "Low",
    datePosted: "2024-01-22",
  },
  {
    id: 5,
    ngoName: "Children's Learning Center",
    ngoImage: ngoImage5,
    location: "Bhubaneswar, Odisha",
    item: "Story Books (Age 5-10)",
    category: "Books & Stationery",
    quantity: "120 books",
    urgency: "Medium",
    datePosted: "2024-01-21",
  },
  {
    id: 6,
    ngoName: "Skill Development Academy",
    ngoImage: ngoImage1,
    location: "Chandigarh, Punjab",
    item: "Technical Drawing Sets",
    category: "Books & Stationery",
    quantity: "25 sets",
    urgency: "High",
    datePosted: "2024-01-20",
  },
  {
    id: 7,
    ngoName: "Digital Learning Initiative",
    ngoImage: ngoImage2,
    location: "Guwahati, Assam",
    item: "Computer Learning Books",
    category: "Books & Stationery",
    quantity: "60 books",
    urgency: "Medium",
    datePosted: "2024-01-19",
  },
];

const BooksStationeryNeeds = () => {
  return (
    <DonationNeedsPage
      category="Books and Stationery"
      categoryData={booksStationeryData}
    />
  );
};

export default BooksStationeryNeeds;
