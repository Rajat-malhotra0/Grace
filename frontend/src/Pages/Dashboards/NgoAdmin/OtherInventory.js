// OtherInventory.js
import React, { useState } from 'react';

const mockOtherInventory = [
  {
    id: 'o1',
    itemName: 'Toys (Mixed)',
    category: 'Recreational',
    quantity: 40,
    condition: 'Good',
    dateReceived: '2025-07-05',
    source: 'Local Toy Drive',
    storageLocation: 'Storage Room C',
    loggedBy: 'AA'
  },
  {
    id: 'o2',
    itemName: 'Wheelchairs',
    category: 'Medical Aid',
    quantity: 5,
    condition: 'Excellent',
    dateReceived: '2025-07-08',
    source: 'Hospital Donation',
    storageLocation: 'Medical Equipment Area',
    loggedBy: 'BV'
  }
];

const OtherInventory = ({ onMarkUsed }) => {
  const [inventory, setInventory] = useState(mockOtherInventory);

  const handleUse = (item) => {
    setInventory(prev => prev.filter(i => i.id !== item.id));
    onMarkUsed(item);
  };

  return (
    <div className="inventory-section other-inventory">
      <h2 className="section-title">📦 Other Donations</h2>
      <div className="inventory-card">
        <div className="inventory-header-row">
          <span>Used</span>
          <span>Logged By</span>
          <span>Item Name</span>
          <span>Category</span>
          <span>Quantity</span>
          <span>Condition</span>
          <span>Date Received</span>
          <span>Donor / Source</span>
          <span>Storage Location</span>
        </div>

        {inventory.map(item => (
          <div key={item.id} className="inventory-row">
            <input type="checkbox" onChange={() => handleUse(item)} />
            <span>{item.loggedBy}</span>
            <span>{item.itemName}</span>
            <span>{item.category}</span>
            <span>{item.quantity}</span>
            <span>{item.condition}</span>
            <span>{item.dateReceived}</span>
            <span>{item.source}</span>
            <span>{item.storageLocation}</span>
          </div>
        ))}

        {inventory.length === 0 && (
          <p className="empty-message">✅ All other inventory has been used.</p>
        )}
      </div>
    </div>
  );
};

export default OtherInventory;
