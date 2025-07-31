// AdminImpactStoryForm.js
import React, { useState } from 'react';
import './ImpactStoryForm.css';
import storyImg from '../../assets/Strory.jpg';
const ImpactStoryForm = () => {
  const [story, setStory] = useState({
    title: '',
    description: '',
    additionalData: ''
  });

  const handleChange = (e) => {
    setStory({ ...story, [e.target.name]: e.target.value });
  };

  const handleGenerate = () => {
    if (!story.title || !story.description) return;
    alert('📖 Story generated successfully!');
  };

  const handlePost = () => {
    if (!story.title || !story.description) return;
    console.log('Posting story to DB:', story);
    alert('✅ Story posted successfully!');
  };

  return (
    <div className="impact-story-wrapper">
    <div className="impact-story-container">
      <div className="impact-left-panel">
        <img src={storyImg} alt="Welcome Illustration" className="impact-illustration" />
       
      </div>

      <div className="impact-right-panel">
        <h2 className="form-header">Make Stories of Your Impact</h2>

        <input
          type="text"
          name="title"
          placeholder="Story Title"
          value={story.title}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={story.description}
          onChange={handleChange}
        />

        <input
          type="text"
          name="additionalData"
          placeholder="Additional Data (optional)"
          value={story.additionalData}
          onChange={handleChange}
        />

        <button className="generate-btn" onClick={handleGenerate}>Generate Story</button>
        <button className="post-btn" onClick={handlePost}>Post Story</button>
      </div>
    </div>
    </div>
  );
};

export default ImpactStoryForm;