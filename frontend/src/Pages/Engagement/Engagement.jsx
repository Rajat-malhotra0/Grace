import React, { useState, useEffect } from "react";
import "./Engagement.css";

const Engagement = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newActivity, setNewActivity] = useState(null);
    const [activeUsers, setActiveUsers] = useState(0);

    useEffect(async () => {
        const posts = await fetch("/api/posts").then((res) => res.json());
        const samplePosts = [
            {
                id: 1,
                user: "Sarah",
                content: "Volunteering at food bank! ",
                likes: 156,
                comments: 42,
                shares: 29,
                category: "Volunteer",
                timestamp: new Date(Date.now() - 2 * 3600000),
            },
            {
                id: 2,
                user: "Mike",
                content: "Art therapy with kids! ",
                likes: 203,
                comments: 58,
                shares: 34,
                category: "Education",
                timestamp: new Date(Date.now() - 5 * 3600000),
            },
            {
                id: 3,
                user: "Emily",
                content: "Reading to children ",
                likes: 89,
                comments: 23,
                shares: 15,
                category: "Education",
                timestamp: new Date(Date.now() - 8 * 3600000),
            },
            {
                id: 4,
                user: "BookLover",
                content: "Poetry collection complete! ",
                likes: 198,
                comments: 55,
                shares: 47,
                category: "Arts",
                timestamp: new Date(Date.now() - 12 * 3600000),
            },
            {
                id: 5,
                user: "Crafty",
                content: "DIY for community center ",
                likes: 124,
                comments: 28,
                shares: 19,
                category: "Community",
                timestamp: new Date(Date.now() - 15 * 3600000),
            },
        ];
        setPosts(samplePosts);
        setLoading(false);

        const updateInterval = setInterval(() => {
            setPosts((prev) =>
                prev.map((post) => ({
                    ...post,
                    likes: post.likes + Math.floor(Math.random() * 3),
                    comments: post.comments + Math.floor(Math.random() * 2),
                    shares: post.shares + Math.floor(Math.random() * 1),
                }))
            );

            setActiveUsers(Math.floor(Math.random() * 50) + 20);

            if (Math.random() > 0.7) {
                const messages = [
                    "New like!",
                    "New comment!",
                    "Post shared!",
                    "Engagement up!",
                ];
                setNewActivity(
                    messages[Math.floor(Math.random() * messages.length)]
                );
                setTimeout(() => setNewActivity(null), 2000);
            }
        }, 3000);

        const newPostInterval = setInterval(() => {
            if (Math.random() > 0.8) {
                const users = ["Alex", "Sam", "Jordan", "Casey"];
                const contents = [
                    "Community cleanup! ",
                    "Shelter visit! ",
                    "Teaching kids! ",
                    "Art workshop! ",
                ];
                const categories = [
                    "Community",
                    "Volunteer",
                    "Education",
                    "Arts",
                ];

                const newPost = {
                    id: Date.now(),
                    user: users[Math.floor(Math.random() * users.length)],
                    content:
                        contents[Math.floor(Math.random() * contents.length)],
                    likes: Math.floor(Math.random() * 20) + 5,
                    comments: Math.floor(Math.random() * 10) + 2,
                    shares: Math.floor(Math.random() * 5) + 1,
                    category:
                        categories[
                            Math.floor(Math.random() * categories.length)
                        ],
                    timestamp: new Date(),
                };

                setPosts((prev) => [newPost, ...prev.slice(0, 7)]);
                setNewActivity(`New post by ${newPost.user}!`);
                setTimeout(() => setNewActivity(null), 3000);
            }
        }, 15000);

        return () => {
            clearInterval(updateInterval);
            clearInterval(newPostInterval);
        };
    }, []);

    const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments, 0);
    const totalShares = posts.reduce((sum, post) => sum + post.shares, 0);
    const avgEngagement =
        posts.length > 0
            ? Math.round(
                  (totalLikes + totalComments + totalShares) / posts.length
              )
            : 0;

    const topPosts = [...posts]
        .map((post) => ({
            ...post,
            engagement: post.likes + post.comments + post.shares,
        }))
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 3);

    if (loading) return <div className="loading">Loading...</div>;

    return (
        <div className="engagement-page">
            {newActivity && (
                <div className="activity-notification">{newActivity}</div>
            )}

            <div className="engagement-header">
                <h1>Engagement Insights</h1>
                <p>Real-time post performance tracking</p>
                <div className="live-indicator">
                    <span className="live-dot"></span>
                    {activeUsers} users online
                </div>
            </div>

            <div className="metrics-grid">
                <div className="metric-card">
                    <h3>Total Posts</h3>
                    <span className="metric-number">{posts.length}</span>
                </div>
                <div className="metric-card">
                    <h3>Total Likes</h3>
                    <span className="metric-number">{totalLikes}</span>
                </div>
                <div className="metric-card">
                    <h3>Total Comments</h3>
                    <span className="metric-number">{totalComments}</span>
                </div>
                <div className="metric-card">
                    <h3>Avg Engagement</h3>
                    <span className="metric-number">{avgEngagement}</span>
                </div>
            </div>

            <div className="insights-section">
                <h2>
                    Top Posts <span className="live-badge">LIVE</span>
                </h2>
                <div className="posts-list">
                    {topPosts.map((post, index) => (
                        <div key={post.id} className="post-item">
                            <div className="post-rank">#{index + 1}</div>
                            <div className="post-content">
                                <strong>{post.user}</strong>
                                <p>{post.content}</p>
                            </div>
                            <div className="post-stats">
                                <span>❤️ {post.likes}</span>
                                <span>💬 {post.comments}</span>
                                <span>🔄 {post.shares}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="insights-section">
                <h2>
                    Live Feed <span className="live-badge">LIVE</span>
                </h2>
                <div className="activity-feed">
                    {posts.slice(0, 5).map((post, index) => (
                        <div
                            key={post.id}
                            className={`feed-item ${
                                index === 0 ? "latest" : ""
                            }`}
                        >
                            <div className="feed-user">{post.user}</div>
                            <div className="feed-content">{post.content}</div>
                            <div className="feed-stats">
                                <span>❤️ {post.likes}</span>
                                <span>💬 {post.comments}</span>
                                <span>🔄 {post.shares}</span>
                            </div>
                            <div className="feed-time">
                                {post.timestamp.getTime() > Date.now() - 60000
                                    ? "Now"
                                    : `${Math.floor(
                                          (Date.now() - post.timestamp) /
                                              3600000
                                      )}h ago`}
                            </div>
                            {index === 0 && (
                                <div className="new-badge">NEW</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Engagement;
