// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { getImageSrc } from "../utils/image";
import { useNavigate } from "react-router-dom";
// import "./Home.css";
import "../index.css";
import likeCommentImg from "../like and comment.jpg";

export default function Home() {
  const [feedPosts, setFeedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [commentInputs, setCommentInputs] = useState({}); // track input per post

  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();

  useEffect(() => {
    if (!email) return;

    const fetchFeed = async () => {
      try {
        setLoading(true);

        // 1️⃣ Get friends
        const friendsRes = await axios.get(
          `http://localhost:5000/connections/${email}`
        );
        const friends = friendsRes.data.connections || [];

        if (friends.length === 0) {
          setFeedPosts([]);
          setLoading(false);
          return;
        }

        // 2️⃣ Get posts from friends
        const postsRes = await axios.get(`http://localhost:5000/posts/friends`, {
          params: { friends: friends.join(",") },
        });

        // Ensure only friend posts are shown (defensive)
        const filtered = (postsRes.data || []).filter(p => friends.includes(p.email));

        // 3️⃣ Sort posts by createdAt descending
        const sortedPosts = filtered.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setFeedPosts(sortedPosts);
      } catch (err) {
        console.error("Error fetching feed:", err);
        setError("Failed to load feed. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, [email]);

  // Handle Like
  const handleLike = async (postId) => {
    try {
      const res = await axios.put(`http://localhost:5000/posts/${postId}/like`, {
        email: email
      });
      setFeedPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data : post))
      );
    } catch (err) {
      console.error("Error liking post:", err);
      alert(err.response?.data?.error || "Failed to like post");
    }
  };

  // Handle Comment input change
  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
  };

  // Handle Comment submit
  const handleCommentSubmit = async (postId) => {
    const comment = commentInputs[postId];
    if (!comment || comment.trim() === "") return;

    try {
      const res = await axios.put(`http://localhost:5000/posts/${postId}/comment`, {
        comment: { email, text: comment.trim() },
      });
      setFeedPosts((prev) =>
        prev.map((post) => (post._id === postId ? res.data : post))
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Error commenting on post:", err);
    }
  };

  if (loading) {
    return (
      <div className="home-loading-container">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
          <h3>Loading your feed...</h3>
          <p>Fetching the latest posts from your friends</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-error-container">
        <div className="error-content">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (feedPosts.length === 0) {
    return (
      <div className="home-empty-container">
        <div className="empty-content">
          <div className="empty-icon">📱</div>
          <h3>Your feed is empty</h3>
          <p>Connect with friends to see their posts here!</p>
          <div className="empty-actions">
            <button className="action-btn primary" onClick={() => navigate('/connect-people')}>Find Friends</button>
            <button className="action-btn secondary" onClick={() => navigate('/express-yourself')}>Create Post</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-feed-container">
      <div className="feed-header">
        <h1 className="feed-title">
          <span className="title-icon">🏠</span>
          Your Feed
        </h1>
        <p className="feed-subtitle">Latest posts from your friends</p>
      </div>

      <div className="posts-container">
        {feedPosts.map((post, index) => (
          <div 
            key={post._id} 
            className="post-card"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="post-header">
              <div className="author-info">
                <div className="author-avatar">
                  {post.email.split("@")[0].charAt(0).toUpperCase()}
                </div>
                <div className="author-details">
                  <h4 className="author-name">{post.email.split("@")[0]}</h4>
                  <span className="post-time">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {post.image?.data && (
              <div className="post-image-container">
                <img
                  src={getImageSrc(post.image)}
                  alt="Post"
                  className="post-image"
                />
              </div>
            )}

            <div className="post-content">
              <p className="post-caption">{post.caption}</p>
            </div>

            <div className="post-actions">
              <button
                className={`action-btn like-btn ${post.likes.includes(email) ? 'liked' : ''}`}
                onClick={() => handleLike(post._id)}
              >
                <span className="btn-icon">{post.likes.includes(email) ? '❤️' : '🤍'}</span>
                <span className="btn-text">Like ({post.likes.length})</span>
              </button>
              
              <button className="action-btn comment-btn">
                <span className="btn-icon">💬</span>
                <span className="btn-text">
                  {post.comments.length} {post.comments.length === 1 ? 'Comment' : 'Comments'}
                </span>
              </button>
            </div>

            <div className="comments-section">
              {post.comments.length > 0 && (
                <div className="comments-list">
                  {post.comments.map((comment, idx) => (
                    <div key={idx} className="comment-item">
                      <div className="comment-author">
                        <strong>{comment.email.split("@")[0]}</strong>
                      </div>
                      <div className="comment-text">{comment.text}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="add-comment-section">
                <div className="comment-input-container">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentInputs[post._id] || ""}
                    onChange={(e) => handleCommentChange(post._id, e.target.value)}
                    className="comment-input"
                  />
                  <button 
                    className="comment-submit-btn"
                    onClick={() => handleCommentSubmit(post._id)}
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
