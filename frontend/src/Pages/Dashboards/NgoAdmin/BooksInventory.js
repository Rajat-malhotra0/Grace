import React, { useState } from 'react';

const mockBooksInventory = [
  {
    id: 'b1',
    itemName: 'English Grammar Book',
    type: 'Textbook',
    subject: 'English',
    ageGroup: '12-14',
    language: 'English',
    quantity: 40,
    condition: 'New',
    dateReceived: '2025-07-10',
    source: 'Library Donation Drive',
    storageLocation: 'Bookshelf A2',
    loggedBy: 'LP'
  },
  {
    id: 'b2',
    itemName: 'Animal Stories',
    type: 'Storybook',
    subject: 'Animals',
    ageGroup: '6-8',
    language: 'Hindi',
    quantity: 25,
    condition: 'Good',
    dateReceived: '2025-07-15',
    source: 'School Library',
    storageLocation: 'Shelf B1',
    loggedBy: 'NK'
  }
];

const BooksInventory = ({ onMarkUsed }) => {
  const [inventory, setInventory] = useState(mockBooksInventory);

  const handleUse = (item) => {
    setInventory(prev => prev.filter(i => i.id !== item.id));
    onMarkUsed(item);
  };

  return (
    <div className="inventory-section">
      <h2 className="section-title">📚 Books Inventory</h2>
      <div className="inventory-card">
        <div className="inventory-header-row">
          <span>Used</span>
          <span>Logged By</span>
          <span>Item Title</span>
          <span>Type</span>
          <span>Subject / Theme</span>
          <span>Age Group</span>
          <span>Language</span>
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
            <span>{item.type}</span>
            <span>{item.subject}</span>
            <span>{item.ageGroup}</span>
            <span>{item.language}</span>
            <span>{item.quantity}</span>
            <span>{item.condition}</span>
            <span>{item.dateReceived}</span>
            <span>{item.source}</span>
            <span>{item.storageLocation}</span>
          </div>
        ))}

        {inventory.length === 0 && (
          <p className="empty-message">✅ All books inventory has been used.</p>
        )}
      </div>
    </div>
  );
};

export default BooksInventory;
