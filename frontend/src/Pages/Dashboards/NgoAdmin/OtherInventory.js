// OtherInventory.js
import React, { useState } from "react";
import { Package } from "lucide-react";

const mockOtherInventory = [
  {
    id: "o1",
    itemName: "Toys (Mixed)",
    category: "Recreational",
    quantity: 40,
    condition: "Good",
    dateReceived: "2025-07-05",
    source: "Local Toy Drive",
    storageLocation: "Storage Room C",
    loggedBy: "AA",
  },
  {
    id: "o2",
    itemName: "Wheelchairs",
    category: "Medical Aid",
    quantity: 5,
    condition: "Excellent",
    dateReceived: "2025-07-08",
    source: "Hospital Donation",
    storageLocation: "Medical Equipment Area",
    loggedBy: "BV",
  },
];

const OtherInventory = ({ onMarkUsed }) => {
  const [inventory, setInventory] = useState(mockOtherInventory);

  const handleUse = (item) => {
    setInventory((prev) => prev.filter((i) => i.id !== item.id));
    onMarkUsed(item);
  };

  return (
    <div className="inventory-section">
      <h2 className="section-title">
        <Package
          size={24}
          style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
        />
        Other Inventory
      </h2>
      <div className="inventory-card">
        <div className="inventory-header-row">
          <span>Used</span>
          <span>Logged By</span>
          <span>Item Name</span>
          <span>Category</span>
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
            <span data-label="Quantity">{item.quantity}</span>
            <span data-label="Condition">{item.condition}</span>
            <span data-label="Date Received">{item.dateReceived}</span>
            <span data-label="Source / Donor">{item.source}</span>
            <span data-label="Storage Location">{item.storageLocation}</span>
          </div>
        ))}

        {inventory.length === 0 && (
          <p className="empty-message">All other inventory has been used.</p>
        )}
      </div>
    </div>
  );
};

export default OtherInventory;
