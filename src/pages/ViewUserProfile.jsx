// Read-only profile view by username
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { getImageSrc } from "../utils/image";
import "./UserProfile.css";

export default function ViewUserProfile() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // get user by username
        const userRes = await axios.get(`http://localhost:5000/user/by-username/${username}`);
        const u = userRes.data.user || userRes.data;
        setUser(u);
        // get posts by user email
        const postsRes = await axios.get(`http://localhost:5000/posts/user/${u.email}`);
        setPosts(postsRes.data || []);
      } catch (e) {
        setError("Could not load profile");
      } finally {
        setLoading(false);
      }
    };
    if (username) fetchData();
  }, [username]);

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <p>{error || "User not found"}</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-wall-container">
      <div className="profile-header-section">
        <div className="profile-header-card">
          <div className="profile-avatar-section">
            {user.image?.data ? (
              <div className="profile-avatar">
                <img src={getImageSrc(user.image)} alt="Profile" className="avatar-img" />
                <div className="avatar-ring"></div>
              </div>
            ) : (
              <div className="profile-avatar">
                <div className="avatar-placeholder">{user.username?.charAt(0) || "U"}</div>
                <div className="avatar-ring"></div>
              </div>
            )}
          </div>
          <div className="profile-info-section">
            <h1 className="profile-name">{user.username}</h1>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="profile-details-section">
        <div className="details-card">
          <h2 className="section-title">About</h2>
          <p className="bio-text">{user.bio || "No bio available."}</p>
          <div className="profile-details-grid">
            <div className="detail-item">
              <label>Gender</label>
              <span>{user.gender || "Not specified"}</span>
            </div>
            <div className="detail-item">
              <label>DOB</label>
              <span>{user.dob ? new Date(user.dob).toLocaleDateString() : "Not specified"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="wall-section">
        <div className="wall-header">
          <h2 className="wall-title"><span className="wall-icon">📸</span> Posts</h2>
          <p className="wall-subtitle">Recent posts by {user.username}</p>
        </div>
        {posts.length > 0 ? (
          <div className="wall-container">
            <div className="wall-posts">
              {posts.map((post, index) => (
                <div key={post._id} className={`wall-post post-${index+1}`} style={{animationDelay: `${index*0.1}s`}}>
                  <div className="post-pin"></div>
                  <div className="post-content">
                    {post.image?.data && (
                      <div className="post-image">
                        <img src={getImageSrc(post.image)} alt="Post" className="post-img" />
                      </div>
                    )}
                    <div className="post-details">
                      <p className="post-caption">{post.caption}</p>
                      <div className="post-date">{new Date(post.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="empty-wall">
            <div className="empty-wall-content">
              <div className="empty-icon">📷</div>
              <h3>No posts yet</h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}



