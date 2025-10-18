// src/Dashboards/NgoTeam/FoodInventoryForm.js
import React from "react";
import "./FoodInventoryForm.css";

const FoodInventoryForm = () => {
  return (
    <div className="food-form">
      <h3>Log Food Inventory</h3>
      <p className="form-subtext">Track and manage food stock easily.</p>

      <form>
        <input type="text" placeholder="Item Name (e.g. Rice, Milk)" />
        
        <select>
          <option>Category</option>
          <option>Grains</option>
          <option>Fruits</option>
          <option>Vegetables</option>
          <option>Dairy</option>
          <option>Snacks</option>
        </select>

        <input type="number" placeholder="Quantity Available" />

        <select>
          <option>Unit Type</option>
          <option>Kg</option>
          <option>Litres</option>
          <option>Packets</option>
          <option>Pieces</option>
        </select>

        <label>Expiry Date</label>
        <input type="date" />

        <label>Date Received</label>
        <input type="date" />

        <input type="text" placeholder="Source / Donor (or Anonymous)" />

        <input type="text" placeholder="Storage Location (e.g. Pantry A)" />

        <button type="submit">Submit Inventory</button>
      </form>
    </div>
  );
};

export default FoodInventoryForm;
