// this is the log of all used inventory still have to route it tho

import React from 'react';
import './AdminInventoryDashboard.css'; // reuse existing styles

const AdminInventoryLog = ({ usedInventory }) => {
  const grouped = usedInventory.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const categoryTitles = {
    Food: '🍽️ Food Inventory',
    Clothes: '👕 Clothes Inventory',
    Books: '📚 Books Inventory',
    Medicine: '💊 Medicine Inventory',
    Other: '📦 Other Donations'
  };

  return (
    <div className="inventory-dashboard">
      <h1 className="dashboard-title">Used Inventory Log</h1>

      {Object.entries(grouped).map(([category, items]) => (
        <div
          key={category}
          className={`inventory-section ${category === 'Other' ? 'other-inventory' : ''}`}
        >
          <h2 className="section-title">{categoryTitles[category] || category}</h2>
          <div className="inventory-card">
            <div className="inventory-header-row">
              <span>Used On</span>
              <span>Logged By</span>
              <span>Item Name</span>
              <span>Category</span>
              <span>Quantity</span>
              <span>Source</span>
              <span>Storage Location</span>
            </div>
            {items.map((item) => (
              <div key={item.id} className="inventory-row">
                <span>{new Date(item.usedOn).toLocaleDateString()}</span>
                <span>{item.loggedBy}</span>
                <span>{item.itemName}</span>
                <span>{item.category}</span>
                <span>{item.quantity}</span>
                <span>{item.source || item.donor || '-'}</span>
                <span>{item.storageLocation}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {usedInventory.length === 0 && (
        <p className="empty-message">No inventory items have been marked as used yet.</p>
      )}
    </div>
  );
};

export default AdminInventoryLog;
