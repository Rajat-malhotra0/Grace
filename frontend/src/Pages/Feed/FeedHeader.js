import React from "react";
import "./FeedHeader.css";

function FeedHeader({ onShareClick }) {
    return (
        <div className="feed-header">
            <h1>Grace Feed</h1>
            <p>Share your moments of grace and impact</p>

            <button className="share-moment-btn" onClick={onShareClick}>
                Share a Moment
            </button>
        </div>
    );
}

export default FeedHeader;
