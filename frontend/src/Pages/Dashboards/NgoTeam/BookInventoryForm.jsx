import React from "react";
import "./FoodInventoryForm.css"; // Reusing existing CSS

const BooksInventoryForm = () => {
  return (
    <div className="food-form">
      <h3>Log Books & Education Inventory</h3>
      <p className="form-subtext">Record and manage learning resources and materials.</p>

      <form>
        <input type="text" placeholder="Item Name / Title (e.g. My First Science Book)" />

        <select>
          <option>Type</option>
          <option>Book</option>
          <option>Workbook</option>
          <option>Puzzle</option>
          <option>Flashcards</option>
          <option>Craft Kit</option>
          <option>Digital Printout</option>
        </select>

        <input type="text" placeholder="Subject / Theme (e.g. Science, Math)" />

        <select>
          <option>Age Group / Reading Level</option>
          <option>3–5 yrs (Pre-K)</option>
          <option>6–8 yrs (Grade 1–2)</option>
          <option>9–12 yrs (Grade 3–5)</option>
          <option>Beginner Reader</option>
          <option>Advanced</option>
        </select>

        <select>
          <option>Language</option>
          <option>English</option>
          <option>Hindi</option>
          <option>Marathi</option>
          <option>Bilingual</option>
        </select>

        <input type="number" placeholder="Quantity Available" />

        <select>
          <option>Condition</option>
          <option>New</option>
          <option>Gently Used</option>
          <option>Well-Worn</option>
          <option>Needs Repair</option>
        </select>

        <label>Date Received</label>
        <input type="date" />

        <input type="text" placeholder="Donor / Source (or Anonymous)" />

        <input type="text" placeholder="Storage Location (e.g. Library Shelf 1)" />

        <button type="submit">Submit Inventory</button>
      </form>
    </div>
  );
};

export default BooksInventoryForm;
