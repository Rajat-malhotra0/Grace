// AdminInventoryDashboard.js
import React, { useState } from 'react';
import FoodInventory from './FoodInventory';
import ClothesInventory from './ClothesInventory';
import BooksInventory from './BooksInventory';
import MedicineInventory from './MedicineInventory';
import OtherInventory from './OtherInventory';
import './AdminInventoryDashboard.css';

const AdminInventoryDashboard = () => {
  const [usedInventory, setUsedInventory] = useState([]);

  const handleUsedItem = (item, category) => {
    const usedItem = {
      ...item,
      usedOn: new Date().toISOString(),
      category,
    };
    setUsedInventory(prev => [...prev, usedItem]);
    console.log(`Used from ${category}:`, usedItem);
  };

  return (
    <div className="inventory-dashboard">
      <h1 className="dashboard-title">Admin Inventory Dashboard</h1>

      <FoodInventory onMarkUsed={(item) => handleUsedItem(item, 'Food')} />
      <ClothesInventory onMarkUsed={(item) => handleUsedItem(item, 'Clothes')} />
      <BooksInventory onMarkUsed={(item) => handleUsedItem(item, 'Books')} />
      <MedicineInventory onMarkUsed={(item) => handleUsedItem(item, 'Medicine')} />
      <OtherInventory onMarkUsed={(item) => handleUsedItem(item, 'Other')} />

      <button
        className="view-used-btn"
        onClick={() => {
          console.log('Navigating to /admin/inventory-log with:', usedInventory);
          // Later: route to /admin/inventory-log
        }}
      >
        📦 View Used Inventory
      </button>
    </div>
  );
};

export default AdminInventoryDashboard;
