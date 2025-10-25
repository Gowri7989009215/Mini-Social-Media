import React, { useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

export default function FeedPage() {
  // Dummy posts
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "Gowri",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9",
      text: "Loving this new social platform ❤️",
      likes: 12,
      comments: ["Wow, looks amazing!", "I agree with you!"]
    },
    {
      id: 2,
      author: "John",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      image: "https://images.unsplash.com/photo-1502720705749-3c8d0e4b2a2c",
      text: "Beautiful sunset today 🌅",
      likes: 25,
      comments: ["That's stunning!", "Where is this place?"]
    }
  ]);

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
  };

  return (
    <div className="feed-page container py-4" style={{background: 'linear-gradient(135deg, #8a2be2 0%, #dda0dd 100%)', minHeight: '100vh'}}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold" style={{color: 'white'}}>Your Feed</h2>
        <Link to="/" className="btn btn-outline-light">
          <i className="bi bi-house-door-fill"></i> Home
        </Link>
      </div>

      {posts.map(post => (
        <div key={post.id} className="card shadow-sm mb-4 feed-card" style={{background: 'rgba(138, 43, 226, 0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(138, 43, 226, 0.2)'}}>
          <div className="card-header d-flex align-items-center" style={{background: 'rgba(138, 43, 226, 0.1)', color: 'white'}}>
            <img src={post.avatar} alt={post.author} className="rounded-circle me-3" width="50" height="50" />
            <h6 className="mb-0 fw-bold">{post.author}</h6>
          </div>
          <img src={post.image} alt="Post" className="card-img-top post-img" />
          <div className="card-body" style={{color: 'white'}}>
            <p className="card-text">{post.text}</p>
            <div className="d-flex align-items-center mb-2">
              <button
                className="btn btn-sm me-2"
                style={{background: 'linear-gradient(45deg, #8a2be2, #dda0dd)', color: 'white', border: 'none'}}
                onClick={() => handleLike(post.id)}
              >
                <i className="bi bi-heart-fill"></i> Like ({post.likes})
              </button>
            </div>
            <h6 className="fw-bold">Comments</h6>
            <ul className="list-unstyled">
              {post.comments.map((c, i) => (
                <li key={i} className="comment-item" style={{color: 'rgba(255, 255, 255, 0.8)'}}>
                  <i className="bi bi-chat-dots"></i> {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}
