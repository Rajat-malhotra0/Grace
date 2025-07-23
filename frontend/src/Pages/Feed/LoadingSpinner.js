import React from "react";
import './LoadingSpinner.css';

function LoadingSpinner() {
  return (
    <div className="feed-loading">
      <div className="loading-spinner"></div>
      <p>Loading your graceful feed...</p>
    </div>
  );
}

export default LoadingSpinner;
