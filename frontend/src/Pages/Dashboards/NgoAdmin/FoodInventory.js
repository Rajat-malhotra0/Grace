// FoodInventory.js
import React, { useState } from 'react';

const mockFoodInventory = [
  {
    id: 'f1',
    itemName: 'Rice Bags',
    category: 'Grain',
    quantity: 50,
    dateReceived: '2025-07-20',
    expiryDate: '2026-01-15',
    source: 'Food Bank A',
    storageLocation: 'Pantry Shelf 2',
    loggedBy: 'AS'
  },
  {
    id: 'f2',
    itemName: 'Milk Cartons',
    category: 'Dairy',
    quantity: 30,
    dateReceived: '2025-07-21',
    expiryDate: '2025-08-10',
    source: 'Dairy Co-op',
    storageLocation: 'Refrigerator Unit',
    loggedBy: 'RJ'
  }
];

const FoodInventory = ({ onMarkUsed }) => {
  const [inventory, setInventory] = useState(mockFoodInventory);

  const handleUse = (item) => {
    setInventory(prev => prev.filter(i => i.id !== item.id));
    onMarkUsed(item);
  };

  return (
    <div className="inventory-section">
      <h2 className="section-title">🍽️ Food Inventory</h2>
      <div className="inventory-card">
        <div className="inventory-header-row">
          <span>Used</span>
          <span>Logged By</span>
          <span>Item Name</span>
          <span>Category</span>
          <span>Quantity</span>
          <span>Date Received</span>
          <span>Expiry Date</span>
          <span>Source / Donor</span>
          <span>Storage Location</span>
        </div>

        {inventory.map(item => (
          <div key={item.id} className="inventory-row">
            <input type="checkbox" onChange={() => handleUse(item)} />
            <span>{item.loggedBy}</span>
            <span>{item.itemName}</span>
            <span>{item.category}</span>
            <span>{item.quantity}</span>
            <span>{item.dateReceived}</span>
            <span>{item.expiryDate}</span>
            <span>{item.source}</span>
            <span>{item.storageLocation}</span>
          </div>
        ))}

        {inventory.length === 0 && (
          <p className="empty-message">✅ All food inventory has been used.</p>
        )}
      </div>
    </div>
  );
};

export default FoodInventory;
