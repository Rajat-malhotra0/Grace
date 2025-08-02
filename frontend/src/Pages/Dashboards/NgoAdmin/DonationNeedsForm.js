/* filepath: d:\Grace\Grace\frontend\src\Pages\Dashboards\NgoAdmin\DonationNeedsForm.js */
import React, { useState } from "react";
import { Package, Tag, Hash, AlertTriangle, Plus } from "lucide-react";
import "./DonationNeedsForm.css";

const categories = [
  "Food & Groceries",
  "Clothes & Textiles",
  "Medical Supplies",
  "Educational Materials",
  "Electronics",
  "Furniture",
  "Toys & Games",
  "Personal Care",
  "Other",
];

const urgencyLevels = ["Low", "Medium", "High"];

const DonationNeedsForm = () => {
  const [needForms, setNeedForms] = useState([
    {
      itemName: "",
      category: "",
      quantity: "",
      urgency: "",
    },
  ]);

  const handleChange = (index, field, value) => {
    const newForms = [...needForms];
    newForms[index][field] = value;
    setNeedForms(newForms);
  };

  const handleSubmit = (index) => {
    const form = needForms[index];
    if (!form.itemName || !form.category || !form.quantity || !form.urgency) {
      alert("Please fill in all fields");
      return;
    }

    console.log("Posting need to marketplace:", form);
    alert("✅ Need posted to marketplace successfully!");

    // Reset the form after successful submission
    const newForms = [...needForms];
    newForms[index] = {
      itemName: "",
      category: "",
      quantity: "",
      urgency: "",
    };
    setNeedForms(newForms);
  };

  const addNeedColumn = () => {
    setNeedForms([
      ...needForms,
      {
        itemName: "",
        category: "",
        quantity: "",
        urgency: "",
      },
    ]);
  };

  const getUrgencyClass = (urgency) => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "urgency-high";
      case "medium":
        return "urgency-medium";
      case "low":
        return "urgency-low";
      default:
        return "";
    }
  };

  return (
    <div className="donation-needs-form-container">
      <div className="needs-form-header">
        <Package size={32} className="header-icon" />
        <h1 className="needs-form-title">Donation Needs Request</h1>
        <p className="needs-form-subtitle">
          Post your organization's current needs to the marketplace
        </p>
      </div>

      <div className="needs-form-board">
        {needForms.map((form, index) => (
          <div className="need-column" key={index}>
            <div className="need-header">
              <Package size={20} className="column-icon" />
              <h3 className="need-title">Need Request {index + 1}</h3>
            </div>

            <div className="form-group">
              <label className="form-label">Item Name</label>
              <div className="input-with-icon">
                <Tag size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., Rice bags, Winter clothes"
                  value={form.itemName}
                  onChange={(e) =>
                    handleChange(index, "itemName", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <div className="input-with-icon">
                <Package size={16} className="input-icon" />
                <select
                  className="form-select"
                  value={form.category}
                  onChange={(e) =>
                    handleChange(index, "category", e.target.value)
                  }
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Quantity</label>
              <div className="input-with-icon">
                <Hash size={16} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g., 50 kg, 100 pieces"
                  value={form.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Urgency Level</label>
              <div className="urgency-selector">
                {urgencyLevels.map((level) => (
                  <button
                    key={level}
                    type="button"
                    className={`urgency-btn ${
                      form.urgency === level
                        ? `selected ${getUrgencyClass(level)}`
                        : ""
                    }`}
                    onClick={() => handleChange(index, "urgency", level)}
                  >
                    <AlertTriangle size={14} />
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="post-need-btn"
              onClick={() => handleSubmit(index)}
            >
              <Package size={16} />
              Post to Marketplace
            </button>
          </div>
        ))}

        <div className="need-column add-column">
          <div className="add-column-content">
            <Plus size={32} className="add-icon" />
            <h3 className="add-title">Add Another Need</h3>
            <p className="add-subtitle">Request multiple items at once</p>
            <button className="add-btn" onClick={addNeedColumn}>
              <Plus size={20} />
              Add Need Request
            </button>
          </div>
        </div>
      </div>

      <button className="view-marketplace-btn">
        <Package size={20} />
        View Marketplace
      </button>
    </div>
  );
};

export default DonationNeedsForm;
