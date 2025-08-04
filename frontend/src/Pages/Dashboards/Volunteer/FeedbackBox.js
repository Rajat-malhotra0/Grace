import React, { useState } from "react";
import {
  MessageSquare,
  Star,
  Send,
  CheckCircle,
  ThumbsUp,
  ThumbsDown,
  AlertCircle,
  Lightbulb,
  Heart,
} from "lucide-react";
import "./FeedbackBox.css";

const FeedbackBox = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [feedbackType, setFeedbackType] = useState("general");
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackTypes = [
    { id: "general", label: "General Feedback", icon: MessageSquare },
    { id: "bug", label: "Report Bug", icon: AlertCircle },
    { id: "feature", label: "Feature Request", icon: Lightbulb },
    { id: "compliment", label: "Compliment", icon: Heart },
    { id: "complaint", label: "Complaint", icon: ThumbsDown },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsSubmitting(false);

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setMessage("");
        setRating(0);
        setFeedbackType("general");
        setIsExpanded(false);
      }, 3000);
    }, 1000);
  };

  const handleRatingClick = (value) => {
    setRating(value);
  };

  if (isSubmitted) {
    return (
      <div className="feedback-box submitted">
        <div className="feedback-success">
          <CheckCircle size={48} className="success-icon" />
          <h3>Thank You!</h3>
          <p>
            Your feedback has been submitted successfully. We appreciate your
            input!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`feedback-box ${isExpanded ? "expanded" : ""}`}>
      <div className="feedback-header">
        <div className="feedback-title">
          <MessageSquare size={24} />
          <h3>Share Your Feedback</h3>
        </div>
        <button
          className="expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={
            isExpanded ? "Collapse feedback form" : "Expand feedback form"
          }
        >
          {isExpanded ? "−" : "+"}
        </button>
      </div>

      {!isExpanded && (
        <div className="feedback-preview">
          <p>We'd love to hear your thoughts about your volunteer experience</p>
          <button
            className="quick-feedback-btn"
            onClick={() => setIsExpanded(true)}
          >
            Give Feedback
          </button>
        </div>
      )}

      {isExpanded && (
        <form onSubmit={handleSubmit} className="feedback-form">
          <div className="feedback-type-section">
            <label className="section-label">What type of feedback?</label>
            <div className="feedback-type-grid">
              {feedbackTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    className={`feedback-type-btn ${
                      feedbackType === type.id ? "active" : ""
                    }`}
                    onClick={() => setFeedbackType(type.id)}
                  >
                    <IconComponent size={20} />
                    <span>{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rating-section">
            <label className="section-label">
              How would you rate your experience?
            </label>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${star <= rating ? "active" : ""}`}
                  onClick={() => handleRatingClick(star)}
                  aria-label={`Rate ${star} star${star !== 1 ? "s" : ""}`}
                >
                  <Star
                    size={24}
                    fill={star <= rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <span className="rating-text">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </span>
            )}
          </div>

          <div className="message-section">
            <label htmlFor="feedback-message" className="section-label">
              Your Message
            </label>
            <textarea
              id="feedback-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us about your experience, suggestions, or any issues you've encountered..."
              className="feedback-textarea"
              rows={5}
              required
            />
            <div className="character-count">{message.length}/500</div>
          </div>

          <div className="feedback-actions">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setIsExpanded(false);
                setMessage("");
                setRating(0);
                setFeedbackType("general");
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-btn"
              disabled={!message.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FeedbackBox;
