// MedicineInventory.js
import React, { useState, useEffect, useContext } from "react";
import { Pill, Edit2, Save, X, Plus } from "lucide-react";
import { AuthContext } from "../../../Context/AuthContext";
import ngoService from "../../../services/ngoService";

const MedicineInventory = ({ onMarkUsed }) => {
  const { ngo } = useContext(AuthContext);
  const [inventory, setInventory] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  
  // New state for adding items
  const [isAdding, setIsAdding] = useState(false);
  const [newItemData, setNewItemData] = useState({
    loggedBy: "",
    itemName: "",
    category: "",
    quantity: "",
    unitType: "",
    expiryDate: "",
    dateReceived: "",
    storageLocation: "",
    source: "",
    prescribedUse: "",
    ageGroup: "",
    dosage: "",
    condition: "",
  });

  useEffect(() => {
    if (ngo && ngo._id) {
      fetchInventory();
    }
  }, [ngo]);

  const fetchInventory = async () => {
    try {
      const ngoData = await ngoService.getNgoById(ngo._id);
      if (ngoData.inventory && ngoData.inventory.medicine) {
        setInventory(ngoData.inventory.medicine);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  const handleUse = async (item) => {
    try {
      const updatedInventory = await ngoService.deleteInventoryItem(ngo._id, "medicine", item._id);
      setInventory(updatedInventory);
      onMarkUsed(item);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditFormData({ ...item });
  };

  const handleCancelClick = () => {
    setEditingId(null);
    setEditFormData({});
  };

  const handleSaveClick = async () => {
    try {
      const updatedInventory = await ngoService.updateInventoryItem(ngo._id, "medicine", editingId, editFormData);
      setInventory(updatedInventory);
      setEditingId(null);
      setEditFormData({});
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handlers for adding new item
  const handleAddClick = () => {
    setIsAdding(true);
    setNewItemData({
        loggedBy: "",
        itemName: "",
        category: "",
        quantity: "",
        unitType: "",
        expiryDate: "",
        dateReceived: "",
        storageLocation: "",
        source: "",
        prescribedUse: "",
        ageGroup: "",
        dosage: "",
        condition: "",
    });
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleSaveNewItem = async () => {
    try {
      const updatedInventory = await ngoService.addInventoryItem(ngo._id, "medicine", newItemData);
      setInventory(updatedInventory);
      setIsAdding(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleNewItemChange = (field, value) => {
    setNewItemData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="inventory-section medicine-inventory">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', borderBottom: '2px solid #eee', paddingBottom: '0.75rem' }}>
        <h2 className="section-title" style={{ margin: 0, border: 'none', padding: 0 }}>
            <Pill
            size={24}
            style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
            />
            Medicine Inventory
        </h2>
        <button 
            onClick={handleAddClick}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#2c3e50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontFamily: 'serif',
                fontSize: '0.9rem'
            }}
        >
            <Plus size={16} />
            Add Item
        </button>
      </div>

      <div className="inventory-card">
        <div className="inventory-header-row">
          <span>Used</span>
          <span>Actions</span>
          <span>Logged By</span>
          <span>Item Name</span>
          <span>Category</span>
          <span>Quantity</span>
          <span>Unit Type</span>
          <span>Expiry Date</span>
          <span>Date Received</span>
          <span>Storage Location</span>
          <span>Source / Donor</span>
          <span>Prescribed Use</span>
          <span>Age Group</span>
          <span>Dosage</span>
          <span>Condition</span>
        </div>

        {/* Add New Item Row */}
        {isAdding && (
            <div className="inventory-row" style={{ backgroundColor: '#f0f9ff' }}>
                <span>-</span>
                <div className="action-buttons">
                    <button onClick={handleSaveNewItem} className="icon-btn save-btn" title="Save">
                        <Save size={16} />
                    </button>
                    <button onClick={handleCancelAdd} className="icon-btn cancel-btn" title="Cancel">
                        <X size={16} />
                    </button>
                </div>
                <input
                  type="text"
                  placeholder="Logged By"
                  value={newItemData.loggedBy}
                  onChange={(e) => handleNewItemChange("loggedBy", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  placeholder="Item Name"
                  value={newItemData.itemName}
                  onChange={(e) => handleNewItemChange("itemName", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newItemData.category}
                  onChange={(e) => handleNewItemChange("category", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={newItemData.quantity}
                  onChange={(e) => handleNewItemChange("quantity", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  placeholder="Unit"
                  value={newItemData.unitType}
                  onChange={(e) => handleNewItemChange("unitType", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="date"
                  value={newItemData.expiryDate}
                  onChange={(e) => handleNewItemChange("expiryDate", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="date"
                  value={newItemData.dateReceived}
                  onChange={(e) => handleNewItemChange("dateReceived", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newItemData.storageLocation}
                  onChange={(e) => handleNewItemChange("storageLocation", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  placeholder="Source"
                  value={newItemData.source}
                  onChange={(e) => handleNewItemChange("source", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  placeholder="Use"
                  value={newItemData.prescribedUse}
                  onChange={(e) => handleNewItemChange("prescribedUse", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  placeholder="Age"
                  value={newItemData.ageGroup}
                  onChange={(e) => handleNewItemChange("ageGroup", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  value={newItemData.dosage}
                  onChange={(e) => handleNewItemChange("dosage", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  placeholder="Condition"
                  value={newItemData.condition}
                  onChange={(e) => handleNewItemChange("condition", e.target.value)}
                  className="edit-input"
                />
            </div>
        )}

        {inventory.map((item) => (
          <div key={item._id} className="inventory-row">
            <input type="checkbox" onChange={() => handleUse(item)} />
            
            <div className="action-buttons">
              {editingId === item._id ? (
                <>
                  <button onClick={handleSaveClick} className="icon-btn save-btn" title="Save">
                    <Save size={16} />
                  </button>
                  <button onClick={handleCancelClick} className="icon-btn cancel-btn" title="Cancel">
                    <X size={16} />
                  </button>
                </>
              ) : (
                <button onClick={() => handleEditClick(item)} className="icon-btn edit-btn" title="Edit">
                  <Edit2 size={16} />
                </button>
              )}
            </div>

            {editingId === item._id ? (
              <>
                <input
                  type="text"
                  value={editFormData.loggedBy}
                  onChange={(e) => handleFormChange("loggedBy", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editFormData.itemName}
                  onChange={(e) => handleFormChange("itemName", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editFormData.category}
                  onChange={(e) => handleFormChange("category", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="number"
                  value={editFormData.quantity}
                  onChange={(e) => handleFormChange("quantity", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editFormData.unitType}
                  onChange={(e) => handleFormChange("unitType", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="date"
                  value={editFormData.expiryDate}
                  onChange={(e) => handleFormChange("expiryDate", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="date"
                  value={editFormData.dateReceived}
                  onChange={(e) => handleFormChange("dateReceived", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editFormData.storageLocation}
                  onChange={(e) => handleFormChange("storageLocation", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editFormData.source}
                  onChange={(e) => handleFormChange("source", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editFormData.prescribedUse}
                  onChange={(e) => handleFormChange("prescribedUse", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editFormData.ageGroup}
                  onChange={(e) => handleFormChange("ageGroup", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editFormData.dosage}
                  onChange={(e) => handleFormChange("dosage", e.target.value)}
                  className="edit-input"
                />
                <input
                  type="text"
                  value={editFormData.condition}
                  onChange={(e) => handleFormChange("condition", e.target.value)}
                  className="edit-input"
                />
              </>
            ) : (
              <>
                <span data-label="Logged By">{item.loggedBy}</span>
                <span data-label="Item Name">{item.itemName}</span>
                <span data-label="Category">{item.category}</span>
                <span data-label="Quantity">{item.quantity}</span>
                <span data-label="Unit Type">{item.unitType}</span>
                <span data-label="Expiry Date">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : ''}</span>
                <span data-label="Date Received">{item.dateReceived ? new Date(item.dateReceived).toLocaleDateString() : ''}</span>
                <span data-label="Storage Location">{item.storageLocation}</span>
                <span data-label="Source / Donor">{item.source}</span>
                <span data-label="Prescribed Use">{item.prescribedUse}</span>
                <span data-label="Age Group">{item.ageGroup}</span>
                <span data-label="Dosage">{item.dosage}</span>
                <span data-label="Condition">{item.condition}</span>
              </>
            )}
          </div>
        ))}

        {inventory.length === 0 && !isAdding && (
          <p className="empty-message">All medicine inventory has been used.</p>
        )}
      </div>
    </div>
  );
};

export default MedicineInventory;
