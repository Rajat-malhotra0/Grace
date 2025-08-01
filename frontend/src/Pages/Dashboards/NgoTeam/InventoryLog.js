import React, { useState } from "react";
import "./InventoryLog.css";
import FoodInventoryForm from "./FoodInventoryForm";
import ClothingInventoryForm from "./ClothingInventoryForm";
import BookInventoryForm from "./BookInventoryForm";
import MedicalInventoryForm from "./MedicalInventoryForm";
import OtherInventoryForm from "./OtherInventoryForm";
import foodImg from "../../../assets/food1.jpg";
import booksImg from "../../../assets/books.jpg";
import clothesImg from "../../../assets/clothes.jpg";
import medicineImg from "../../../assets/medicines.jpg";
import othersImg from "../../../assets/others.jpg";

const inventoryItems = [
  {
    id: "food",
    title: "FOOD SUPPLIES",
    description: "Log donated or distributed meals and groceries.",
    details:
      "Track the stock levels and distribution of food packages, dry rations, and cooked meals.",
    bgColor: "bg-blue",
    image: foodImg,
    buttonText: "Log Food Inventory",
  },
  {
    id: "clothes",
    title: "CLOTHING DONATIONS",
    description: "Monitor warm wear, uniforms, and more.",
    details:
      "Keep a record of clothing items received, sorted, and distributed to beneficiaries.",
    bgColor: "bg-pink",
    image: clothesImg,
    buttonText: "Log Clothing Inventory",
  },
  {
    id: "books",
    title: "BOOKS & EDUCATION",
    description: "Track school supplies and reading materials.",
    details:
      "Maintain a log of notebooks, pens, reading books, and other educational resources.",
    bgColor: "bg-purple",
    image: booksImg,
    buttonText: "Log Education Inventory",
  },
  {
    id: "medicine",
    title: "MEDICAL SUPPLIES",
    description: "Ensure timely record-keeping of essential meds.",
    details:
      "Log inventory of first-aid kits, medicines, sanitary products, and health packages.",
    bgColor: "bg-yellow",
    image: medicineImg,
    buttonText: "Log Medical Inventory",
  },
  {
    id: "others",
    title: "OTHER DONATIONS",
    description: "Little Things, Big Impact",
    details:
      "Whether it’s a toy that brings laughter, a blanket that brings warmth, or a tablet that opens doors — every donation has a role in someone’s story. Log them here with care.",
    bgColor: "bg-emerald",
    image: othersImg,
    buttonText: "Log Toy Inventory",
  },
];

const InventoryLog = () => {
  const [activeTab, setActiveTab] = useState("food");
  const [showForm, setShowForm] = useState(false);

  const activeInventory = inventoryItems.find((item) => item.id === activeTab);

  const handleFormToggle = () => {
    setShowForm((prev) => !prev);
  };

  return (
    <section className="inventory-section">
      <div className="container">
        <div className="inventory-header">
          <h2>INVENTORY LOG</h2>
          <p>
            <em>Keep track of your supplies, one donation at a time.</em>
          </p>
        </div>

        <div className="inventory-tabs">
          {inventoryItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setShowForm(false); 
              }}
              className={`tab-btn ${
                activeTab === item.id ? "active-tab " + item.bgColor : ""
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        {activeInventory && (
          <div className={`inventory-card ${activeInventory.bgColor}`}>
            <div className="inventory-card-content">
              <div className="inventory-image-box">
                <img
                  src={activeInventory.image}
                  alt={activeInventory.title}
                  className="inventory-image"
                />
              </div>

              <div className="inventory-text">
                {showForm ? (
                  <>
                    {activeInventory.id === "food" && <FoodInventoryForm />}
                    {activeInventory.id === "clothes" && <ClothingInventoryForm />}
                    {activeInventory.id === "books" && <BookInventoryForm />}
                    {activeInventory.id === "medicine" && <MedicalInventoryForm />}
                    {activeInventory.id === "others" && <OtherInventoryForm />}
                    
                  </>
                ) : (
                  <>
                    <h3>{activeInventory.title}</h3>
                    <p className="desc">{activeInventory.description}</p>
                    <p className="details">{activeInventory.details}</p>
                    <button
                      className="inventory-btn"
                      onClick={handleFormToggle}
                    >
                      {activeInventory.buttonText}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default InventoryLog;
