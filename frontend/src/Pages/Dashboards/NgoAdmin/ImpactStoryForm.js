import React, { useState, useContext } from "react";
import { BookOpen, FileText, Sparkles, Send } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthContext";
import "./ImpactStoryForm.css";
import storyImg from "../../../assets/Strory.jpg";

const ImpactStoryForm = () => {
    const { user } = useContext(AuthContext);

    const [story, setStory] = useState({
        title: "",
        description: "",
        additionalData: "",
    });

    const [isGenerating, setIsGenerating] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [aiGenerated, setAiGenerated] = useState(false);

    const handleChange = (e) => {
        setStory({ ...story, [e.target.name]: e.target.value });
        // Reset AI generated flag if user manually changes the description
        if (e.target.name === "description" && aiGenerated) {
            setAiGenerated(false);
        }
    };

    const handleGenerate = async () => {
        if (!story.title) {
            alert("Please fill in the title first");
            return;
        }

        if (!user || !user._id) {
            alert("User information not found. Please login again.");
            return;
        }

        setIsGenerating(true);

        try {
            const response = await axios.post(
                "http://localhost:3001/api/impact-stories/generate-description",
                {
                    userInput: `Title: ${story.title}. Additional context: ${
                        story.additionalData ||
                        "No additional context provided."
                    }`,
                }
            );

            if (response.data.success) {
                const aiResult = response.data.result;
                setStory((prev) => ({
                    ...prev,
                    title: aiResult.title || prev.title, // Use AI title if provided, otherwise keep user's title
                    description: aiResult.content,
                    category: aiResult.category,
                }));
                setAiGenerated(true);
                alert("AI description generated successfully!");
            }
        } catch (error) {
            console.error("Error generating AI description:", error);
            alert("Failed to generate AI description. Please try again.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePost = async () => {
        if (!story.title || !story.description) {
            alert("Please fill in the title and description");
            return;
        }

        if (!user || !user._id) {
            alert("User information not found. Please login again.");
            return;
        }

        setIsPosting(true);

        try {
            const storyData = {
                title: story.title,
                content: story.description,
                category: story.category || "",
                createdBy: user._id,
            };

            const response = await axios.post(
                "http://localhost:3001/api/impact-stories",
                storyData
            );

            if (response.data.success) {
                alert("Story posted successfully!");

                // Reset form after successful post
                setStory({
                    title: "",
                    description: "",
                    additionalData: "",
                });
                setAiGenerated(false);
            }
        } catch (error) {
            console.error("Error posting story:", error);
            alert("Failed to post story. Please try again.");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className="impact-story-form-container">
            <div className="impact-story-header">
                <BookOpen size={32} className="header-icon" />
                <h1 className="impact-story-title">Impact Story Creator</h1>
                <p className="impact-story-subtitle">
                    Create compelling stories to showcase your organization's
                    impact
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
                            <h2 className="form-title">
                                Create Your Impact Story
                            </h2>
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
                            <label className="form-label">
                                Story Description
                            </label>
                            <textarea
                                name="description"
                                className={`form-textarea ${
                                    aiGenerated ? "ai-generated" : ""
                                }`}
                                placeholder={
                                    aiGenerated
                                        ? "AI generated description will appear here..."
                                        : "Describe the impact and positive change made..."
                                }
                                rows="5"
                                value={story.description}
                                onChange={handleChange}
                            />
                            {aiGenerated && (
                                <small className="ai-indicator">
                                    Generated by AI
                                </small>
                            )}
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
                            <button
                                className="generate-btn"
                                onClick={handleGenerate}
                                disabled={isGenerating}
                            >
                                <Sparkles size={16} />
                                {isGenerating
                                    ? "Generating..."
                                    : "Generate AI Description"}
                            </button>
                            <button
                                className="post-btn"
                                onClick={handlePost}
                                disabled={isPosting}
                            >
                                <Send size={16} />
                                {isPosting ? "Posting..." : "Post Story"}
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
