
// MedicineInventory.js
import React, { useState } from 'react';

const mockMedicineInventory = [
  {
    id: 'm1',
    itemName: 'Paracetamol Tablets',
    category: 'Pain Relief',
    quantity: 100,
    unitType: 'Strips',
    expiryDate: '2026-05-01',
    dateReceived: '2025-07-15',
    storageLocation: 'Medicine Cabinet 1',
    source: 'Medical Supplier A',
    prescribedUse: 'Fever / Pain',
    ageGroup: 'All Ages',
    dosage: '1 tablet every 6 hours',
    condition: 'Sealed',
    loggedBy: 'HS'
  },
  {
    id: 'm2',
    itemName: 'Cough Syrup',
    category: 'Cold & Cough',
    quantity: 20,
    unitType: 'Bottles',
    expiryDate: '2025-11-20',
    dateReceived: '2025-07-12',
    storageLocation: 'Shelf M2',
    source: 'Clinic Donor',
    prescribedUse: 'Cough relief',
    ageGroup: '12+',
    dosage: '10ml twice daily',
    condition: 'New',
    loggedBy: 'RK'
  }
];

const MedicineInventory = ({ onMarkUsed }) => {
  const [inventory, setInventory] = useState(mockMedicineInventory);

  const handleUse = (item) => {
    setInventory(prev => prev.filter(i => i.id !== item.id));
    onMarkUsed(item);
  };

  return (
    <div className="inventory-section">
      <h2 className="section-title">💊 Medicine Inventory</h2>
      <div className="inventory-card">
        <div className="inventory-header-row">
          <span>Used</span>
          <span>Logged By</span>
          <span>Item Name</span>
          <span>Category</span>
          <span>Quantity</span>
          <span>Unit Type</span>
          <span>Expiry Date</span>
          <span>Date Received</span>
          <span>Storage Location</span>
          <span>Donor / Supplier</span>
          <span>Prescribed Use</span>
          <span>Age Group</span>
          <span>Dosage</span>
          <span>Condition</span>
        </div>

        {inventory.map(item => (
          <div key={item.id} className="inventory-row">
            <input type="checkbox" onChange={() => handleUse(item)} />
            <span>{item.loggedBy}</span>
            <span>{item.itemName}</span>
            <span>{item.category}</span>
            <span>{item.quantity}</span>
            <span>{item.unitType}</span>
            <span>{item.expiryDate}</span>
            <span>{item.dateReceived}</span>
            <span>{item.storageLocation}</span>
            <span>{item.source}</span>
            <span>{item.prescribedUse}</span>
            <span>{item.ageGroup}</span>
            <span>{item.dosage}</span>
            <span>{item.condition}</span>
          </div>
        ))}

        {inventory.length === 0 && (
          <p className="empty-message">✅ All medicine inventory has been used.</p>
        )}
      </div>
    </div>
  );
};

export default MedicineInventory;
