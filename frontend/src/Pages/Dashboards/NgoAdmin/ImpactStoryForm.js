// AdminImpactStoryForm.js
import React, { useState } from "react";
import { BookOpen, FileText, Sparkles, Send } from "lucide-react";
import "./ImpactStoryForm.css";
import storyImg from "../../../assets/Strory.jpg";

const ImpactStoryForm = () => {
  const [story, setStory] = useState({
    title: "",
    description: "",
    additionalData: "",
  });

  const handleChange = (e) => {
    setStory({ ...story, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    if (!story.title || !story.description) {
      alert("Please fill in the title and description");
      return;
    }
    alert("📖 Story generated successfully!");
  };

  const handlePost = () => {
    if (!story.title || !story.description) {
      alert("Please fill in the title and description");
      return;
    }
    console.log("Posting story to DB:", story);
    alert("✅ Story posted successfully!");

    // Reset form after successful post
    setStory({
      title: "",
      description: "",
      additionalData: "",
    });
  };

  return (
    <div className="impact-story-form-container">
      <div className="impact-story-header">
        <BookOpen size={32} className="header-icon" />
        <h1 className="impact-story-title">Impact Story Creator</h1>
        <p className="impact-story-subtitle">
          Create compelling stories to showcase your organization's impact
        </p>
      </div>

      <div className="impact-story-content">
        <div className="impact-story-card">
          <div className="impact-left-panel">
            <div className="image-container">
              <img
                src={storyImg}
                alt="Impact Story Illustration"
                className="impact-illustration"
              />
            </div>
          </div>

          <div className="impact-right-panel">
            <div className="form-header">
              <FileText size={24} className="form-header-icon" />
              <h2 className="form-title">Create Your Impact Story</h2>
            </div>

            <div className="form-group">
              <label className="form-label">Story Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="Enter a compelling title for your story"
                value={story.title}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Story Description</label>
              <textarea
                name="description"
                className="form-textarea"
                placeholder="Describe the impact and positive change made..."
                rows="5"
                value={story.description}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Additional Information (Optional)
              </label>
              <input
                type="text"
                name="additionalData"
                className="form-input"
                placeholder="Statistics, dates, or other relevant details"
                value={story.additionalData}
                onChange={handleChange}
              />
            </div>

            <div className="form-actions">
              <button className="generate-btn" onClick={handleGenerate}>
                <Sparkles size={16} />
                Generate Story
              </button>
              <button className="post-btn" onClick={handlePost}>
                <Send size={16} />
                Post Story
              </button>
            </div>
          </div>
        </div>
      </div>

      <button className="view-stories-btn">
        <BookOpen size={20} />
        View Published Stories
      </button>
    </div>
  );
};

export default ImpactStoryForm;
