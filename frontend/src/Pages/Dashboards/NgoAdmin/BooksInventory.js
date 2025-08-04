import React, { useState } from "react";
import { BookOpen } from "lucide-react";

const mockBooksInventory = [
  {
    id: "b1",
    itemName: "English Grammar Book",
    type: "Textbook",
    subject: "English",
    ageGroup: "12-14",
    language: "English",
    quantity: 40,
    condition: "New",
    dateReceived: "2025-07-10",
    source: "Library Donation Drive",
    storageLocation: "Bookshelf A2",
    loggedBy: "LP",
  },
  {
    id: "b2",
    itemName: "Animal Stories",
    type: "Storybook",
    subject: "Animals",
    ageGroup: "6-8",
    language: "Hindi",
    quantity: 25,
    condition: "Good",
    dateReceived: "2025-07-15",
    source: "School Library",
    storageLocation: "Shelf B1",
    loggedBy: "NK",
  },
];

const BooksInventory = ({ onMarkUsed }) => {
  const [inventory, setInventory] = useState(mockBooksInventory);

  const handleUse = (item) => {
    setInventory((prev) => prev.filter((i) => i.id !== item.id));
    onMarkUsed(item);
  };

  return (
    <div className="inventory-section">
      <h2 className="section-title">
        <BookOpen
          size={24}
          style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
        />
        Books Inventory
      </h2>
      <div className="inventory-card">
        <div className="inventory-header-row">
          <span>Used</span>
          <span>Logged By</span>
          <span>Item Name</span>
          <span>Type</span>
          <span>Subject</span>
          <span>Age Group</span>
          <span>Language</span>
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
            <span data-label="Type">{item.type}</span>
            <span data-label="Subject">{item.subject}</span>
            <span data-label="Age Group">{item.ageGroup}</span>
            <span data-label="Language">{item.language}</span>
            <span data-label="Quantity">{item.quantity}</span>
            <span data-label="Condition">{item.condition}</span>
            <span data-label="Date Received">{item.dateReceived}</span>
            <span data-label="Source / Donor">{item.source}</span>
            <span data-label="Storage Location">{item.storageLocation}</span>
          </div>
        ))}

        {inventory.length === 0 && (
          <p className="empty-message">All books inventory has been used.</p>
        )}
      </div>
    </div>
  );
};

export default BooksInventory;
