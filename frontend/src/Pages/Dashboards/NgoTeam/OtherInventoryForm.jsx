import React from "react";
import "./FoodInventoryForm.css"; // Reuse shared styling

const OtherInventoryForm = () => {
  return (
    <div className="food-form">
      <h3>Log Other Donations</h3>
      <p className="form-subtext">Capture miscellaneous donated items with ease.</p>

      <form>
        <input
          type="text"
          placeholder="Item Name (e.g. Toy Car Set, Tablet, Blanket)"
        />

        <select>
          <option>Category</option>
          <option>Toys & Play Materials</option>
          <option>Stationery & School Supplies</option>
          <option>Tech Equipment</option>
          <option>Furniture & Fixtures</option>
          <option>Cleaning & Sanitation Supplies</option>
          <option>Personal Care Kits</option>
          <option>Bedding & Comfort Items</option>
          <option>Art & Craft Materials</option>
          <option>Festival / Celebration Supplies</option>
          <option>Other</option>
        </select>

        <input type="number" placeholder="Quantity" />

        <select>
          <option>Condition</option>
          <option>New</option>
          <option>Gently Used</option>
          <option>Fair</option>
          <option>Needs Repair</option>
        </select>

        <label>Date Received</label>
        <input type="date" />

        <input
          type="text"
          placeholder="Donor / Source (or Anonymous)"
        />

        <input
          type="text"
          placeholder="Storage Location (e.g. Toy Room Shelf B, Box 3)"
        />

        <button type="submit">Submit Inventory</button>
      </form>
    </div>
  );
};

export default OtherInventoryForm;
