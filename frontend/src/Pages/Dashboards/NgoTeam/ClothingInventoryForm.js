import React from "react";
import "./FoodInventoryForm.css"; // Reusing the same style

const ClothingInventoryForm = () => {
  return (
    <div className="food-form">
      <h3>Log Clothing Inventory</h3>
      <p className="form-subtext">Track and manage clothing donations.</p>

      <form>
        <input type="text" placeholder="Item Name (e.g. Winter Jacket)" />

        <select>
          <option>Category</option>
          <option>Tops</option>
          <option>Bottoms</option>
          <option>Footwear</option>
          <option>Outerwear</option>
          <option>Uniforms</option>
          <option>Accessories</option>
        </select>

        <select>
          <option>Size</option>
          <option>XS</option>
          <option>S</option>
          <option>M</option>
          <option>L</option>
          <option>XL</option>
          <option>3–4 yrs</option>
          <option>5–6 yrs</option>
          <option>7–8 yrs</option>
        </select>

        <select>
          <option>Gender</option>
          <option>Male</option>
          <option>Female</option>
          <option>Unisex</option>
          <option>Any</option>
        </select>

        <input type="number" placeholder="Quantity Available" />

        <select>
          <option>Condition</option>
          <option>New</option>
          <option>Gently Used</option>
          <option>Fair</option>
          <option>Needs Repair</option>
        </select>

        <label>Date Received</label>
        <input type="date" />

        <input type="text" placeholder="Source / Donor (or Anonymous)" />

        <input type="text" placeholder="Storage Location (e.g. Box 12, Room B)" />

        <button type="submit">Submit Inventory</button>
      </form>
    </div>
  );
};

export default ClothingInventoryForm;
