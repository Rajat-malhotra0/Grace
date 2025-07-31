import React, { useState } from 'react';

const mockClothesInventory = [
  {
    id: 'c1',
    itemName: 'Winter Jackets',
    category: 'Outerwear',
    size: 'L',
    gender: 'Unisex',
    quantity: 20,
    condition: 'New',
    dateReceived: '2025-07-18',
    source: 'NGO Clothing Drive',
    storageLocation: 'Clothes Rack A1',
    loggedBy: 'SM'
  },
  {
    id: 'c2',
    itemName: 'School Uniforms',
    category: 'Uniform',
    size: 'M',
    gender: 'Female',
    quantity: 35,
    condition: 'Good',
    dateReceived: '2025-07-19',
    source: 'Donor X',
    storageLocation: 'Shelf B2',
    loggedBy: 'KT'
  }
];

const ClothesInventory = ({ onMarkUsed }) => {
  const [inventory, setInventory] = useState(mockClothesInventory);

  const handleUse = (item) => {
    setInventory(prev => prev.filter(i => i.id !== item.id));
    onMarkUsed(item);
  };

  return (
    <div className="inventory-section">
      <h2 className="section-title">👕 Clothes Inventory</h2>
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

        {inventory.map(item => (
          <div key={item.id} className="inventory-row">
            <input type="checkbox" onChange={() => handleUse(item)} />
            <span>{item.loggedBy}</span>
            <span>{item.itemName}</span>
            <span>{item.category}</span>
            <span>{item.size}</span>
            <span>{item.gender}</span>
            <span>{item.quantity}</span>
            <span>{item.condition}</span>
            <span>{item.dateReceived}</span>
            <span>{item.source}</span>
            <span>{item.storageLocation}</span>
          </div>
        ))}

        {inventory.length === 0 && (
          <p className="empty-message">✅ All clothes inventory has been used.</p>
        )}
      </div>
    </div>
  );
};

export default ClothesInventory;
