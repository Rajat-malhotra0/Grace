import React from "react";
import "./FoodInventoryForm.css"; // Reusing shared styles

const MedicalInventoryForm = () => {
  return (
    <div className="food-form">
      <h3>Log Medical Supplies</h3>
      <p className="form-subtext">Track essential health-related donations efficiently.</p>

      <form>
        <input type="text" placeholder="Item Name (e.g. Paracetamol Syrup, Bandages)" />

        <select>
          <option>Category</option>
          <option>Medicines</option>
          <option>First Aid</option>
          <option>Hygiene</option>
          <option>PPE</option>
          <option>Equipment</option>
        </select>

        <input type="number" placeholder="Quantity Available" />

        <select>
          <option>Unit Type</option>
          <option>Tablets</option>
          <option>Bottles</option>
          <option>Boxes</option>
          <option>Tubes</option>
          <option>Packs</option>
        </select>

        <label>Expiry Date</label>
        <input type="date" />

        <label>Date Received</label>
        <input type="date" />

        <input type="text" placeholder="Storage Location (e.g. Cabinet A, Clinic Shelf 2)" />

        <input type="text" placeholder="Donor / Supplier (or Anonymous)" />

        <input type="text" placeholder="Prescribed Use (optional)" />

        <select>
          <option>Age Group Suitability (optional)</option>
          <option>Children</option>
          <option>Adults</option>
          <option>All Ages</option>
        </select>

        <input type="text" placeholder="Dosage Instructions (optional)" />

        <select>
          <option>Condition / Packaging Status</option>
          <option>Sealed</option>
          <option>Opened</option>
          <option>Damaged</option>
        </select>

        <button type="submit">Submit Inventory</button>
      </form>
    </div>
  );
};

export default MedicalInventoryForm;
