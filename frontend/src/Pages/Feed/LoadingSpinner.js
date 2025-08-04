/* This is just a small but significant file, which consists of a loading spinner and a normal text, while the user is waiting.  */
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
