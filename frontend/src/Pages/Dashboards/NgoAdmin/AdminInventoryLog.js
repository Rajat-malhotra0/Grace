// this is the log of all used inventory still have to route it tho

import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, Package, User } from "lucide-react";
import "./AdminInventoryLog.css";

const AdminInventoryLog = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const usedInventory = location.state?.usedInventory || [];

  const handleGoBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case "food":
        return "🍽️";
      case "clothes":
        return "👕";
      case "books":
        return "📚";
      case "medicine":
        return "💊";
      default:
        return "📦";
    }
  };

  return (
    <div className="inventory-log-container">
      <div className="log-header">
        <button className="back-btn" onClick={handleGoBack}>
          <ArrowLeft size={20} />
          Back to Inventory
        </button>
        <h1 className="log-title">Used Inventory Log</h1>
        <p className="log-subtitle">Track and manage used inventory items</p>
      </div>

      <div className="log-stats">
        <div className="stat-card">
          <Package size={24} />
          <div>
            <h3>Total Used Items</h3>
            <p>{usedInventory.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={24} />
          <div>
            <h3>Last Updated</h3>
            <p>
              {usedInventory.length > 0
                ? formatDate(usedInventory[usedInventory.length - 1].usedOn)
                : "No items used"}
            </p>
          </div>
        </div>
      </div>

      <div className="log-content">
        {usedInventory.length === 0 ? (
          <div className="empty-log">
            <Package size={48} />
            <h3>No Used Inventory</h3>
            <p>Items marked as used will appear here</p>
          </div>
        ) : (
          <div className="log-table">
            <div className="log-table-header">
              <span>Category</span>
              <span>Item Name</span>
              <span>Quantity</span>
              <span>Used On</span>
              <span>Logged By</span>
              <span>Source</span>
            </div>
            {usedInventory.map((item, index) => (
              <div key={`${item.id}-${index}`} className="log-table-row">
                <span className="category-cell">
                  <span className="category-icon">
                    {getCategoryIcon(item.category)}
                  </span>
                  {item.category}
                </span>
                <span>{item.itemName}</span>
                <span>{item.quantity}</span>
                <span>{formatDate(item.usedOn)}</span>
                <span>{item.loggedBy}</span>
                <span>{item.source}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminInventoryLog;
