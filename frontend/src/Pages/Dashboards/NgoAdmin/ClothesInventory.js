import React, { useState } from "react";
import { Shirt } from "lucide-react";

const mockClothesInventory = [
  {
    id: "c1",
    itemName: "Winter Jackets",
    category: "Outerwear",
    size: "L",
    gender: "Unisex",
    quantity: 20,
    condition: "New",
    dateReceived: "2025-07-18",
    source: "NGO Clothing Drive",
    storageLocation: "Clothes Rack A1",
    loggedBy: "SM",
  },
  {
    id: "c2",
    itemName: "School Uniforms",
    category: "Uniform",
    size: "M",
    gender: "Female",
    quantity: 35,
    condition: "Good",
    dateReceived: "2025-07-19",
    source: "Donor X",
    storageLocation: "Shelf B2",
    loggedBy: "KT",
  },
];

const ClothesInventory = ({ onMarkUsed }) => {
  const [inventory, setInventory] = useState(mockClothesInventory);

  const handleUse = (item) => {
    setInventory((prev) => prev.filter((i) => i.id !== item.id));
    onMarkUsed(item);
  };

  return (
    <div className="inventory-section">
      <h2 className="section-title">
        <Shirt
          size={24}
          style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
        />
        Clothes Inventory
      </h2>
      <div className="inventory-card">
        <div className="inventory-header-row">
          <span>Used</span>
          <span>Logged By</span>
          <span>Item Name</span>
          <span>Category</span>
          <span>Size</span>
          <span>Gender</span>
          <span>Quantity</span>
          <span>Condition</span>
          <span>Date Received</span>
          <span>Source / Donor</span>
          <span>Storage Location</span>
        </div>

        {inventory.map((item) => (
          <div key={item.id} className="inventory-row">
            <input type="checkbox" onChange={() => handleUse(item)} />
            <span data-label="Logged By">{item.loggedBy}</span>
            <span data-label="Item Name">{item.itemName}</span>
            <span data-label="Category">{item.category}</span>
            <span data-label="Size">{item.size}</span>
            <span data-label="Gender">{item.gender}</span>
            <span data-label="Quantity">{item.quantity}</span>
            <span data-label="Condition">{item.condition}</span>
            <span data-label="Date Received">{item.dateReceived}</span>
            <span data-label="Source / Donor">{item.source}</span>
            <span data-label="Storage Location">{item.storageLocation}</span>
          </div>
        ))}

        {inventory.length === 0 && (
          <p className="empty-message">All clothes inventory has been used.</p>
        )}
      </div>
    </div>
  );
};

export default ClothesInventory;
