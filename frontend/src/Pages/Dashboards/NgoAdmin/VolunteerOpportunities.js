// AdminVolunteerOpportunities.js
import React, { useState } from "react";
import "./VolunteerOpportunities.css";

const predefinedTags = [
  "Student Friendly",
  "Women Empowerment",
  "Weekend Only",
  "Good for Beginners",
  "Medical Help",
  "Teaching",
  "On-Site",
  "Remote",
];

const VolunteerOpportunities = () => {
  const [opportunityForms, setOpportunityForms] = useState([
    {
      title: "",
      description: "",
      peopleNeeded: "",
      duration: "",
      tags: [],
    },
  ]);

  const handleChange = (index, field, value) => {
    const newForms = [...opportunityForms];
    newForms[index][field] = value;
    setOpportunityForms(newForms);
  };

  const toggleTag = (index, tag) => {
    const newForms = [...opportunityForms];
    const tags = newForms[index].tags;
    newForms[index].tags = tags.includes(tag)
      ? tags.filter((t) => t !== tag)
      : [...tags, tag];
    setOpportunityForms(newForms);
  };

  const handleSubmit = (index) => {
    const form = opportunityForms[index];
    if (
      !form.title ||
      !form.description ||
      !form.peopleNeeded ||
      !form.duration
    )
      return;
    console.log("Saving opportunity to DB:", form);
    alert("✅ Opportunity Assigned!");
  };

  const addOpportunityColumn = () => {
    setOpportunityForms([
      ...opportunityForms,
      {
        title: "",
        description: "",
        peopleNeeded: "",
        duration: "",
        tags: [],
      },
    ]);
  };

  return (
    <div className="volunteer-section-wrapper">
    <div className="volunteer-board">
      {opportunityForms.map((form, index) => (
        <div className="volunteer-column" key={index}>
          <div className="opportunity-title">Opportunity {index + 1}</div>

          <input
            name="title"
            placeholder="Opportunity Title"
            value={form.title}
            onChange={(e) => handleChange(index, "title", e.target.value)}
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={(e) => handleChange(index, "description", e.target.value)}
          ></textarea>

          <input
            name="peopleNeeded"
            placeholder="People Needed"
            type="number"
            value={form.peopleNeeded}
            onChange={(e) =>
              handleChange(index, "peopleNeeded", e.target.value)
            }
          />

          <input
            name="duration"
            placeholder="Duration (e.g. 2 weeks)"
            value={form.duration}
            onChange={(e) => handleChange(index, "duration", e.target.value)}
          />

          <div className="tag-selector">
            {predefinedTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={form.tags.includes(tag) ? "tag selected" : "tag"}
                onClick={() => toggleTag(index, tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <button className="assign-btn" onClick={() => handleSubmit(index)}>
            Assign Opportunity
          </button>
        </div>
      ))}

      <div className="volunteer-column add-column">
        <button className="assign-btn" onClick={addOpportunityColumn}>
          Add Another Opportunity
        </button>
      </div>
    </div>
       <button className="view-history-btn">
          📜 View Opportunity History
        </button>
    </div>
  );
};

export default VolunteerOpportunities;
