// src/pages/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUserFriends } from "react-icons/fa";
import { getImageSrc } from "../utils/image";
import "./UserProfile.css";
import "../index.css";

export default function UserProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail");

  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const [friendsLoading, setFriendsLoading] = useState(false);
  const [friendsError, setFriendsError] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [saveMessage, setSaveMessage] = useState("");

  // Fetch user data + posts + friends
  useEffect(() => {
    if (!email) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/user/${email}`);
        const user = res.data.user || res.data;
        setUserData(user);

        setEditedData({
          bio: user.bio || "",
          gender: user.gender || "",
          dob: user.dob || "",
        });

        localStorage.setItem(`userProfile_${email}`, JSON.stringify(user));
      } catch (err) {
        console.error("API fetch failed, loading from localStorage:", err);
        const savedData = localStorage.getItem(`userProfile_${email}`);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          setUserData(parsedData);
          setEditedData({
            bio: parsedData.bio || "",
            gender: parsedData.gender || "",
            dob: parsedData.dob || "",
          });
        } else {
          setError("Failed to load user profile. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchUserPosts = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/posts/user/${email}`);
        setUserPosts(res.data);
      } catch (err) {
        console.error("Error fetching user posts:", err);
      }
    };

    const fetchFriends = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/friends/${email}`);
        setFriendsList(res.data);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setFriendsList([]);
      }
    };

    fetchUser();
    fetchUserPosts();
    fetchFriends();
  }, [email, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSaveMessage("");
  };

  const handleInputChange = (field, value) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setSaveMessage("Saving changes...");

      try {
        await axios.put(`http://localhost:5000/user/${email}`, editedData);
        setUserData((prev) => ({ ...prev, ...editedData }));
        setSaveMessage("Profile updated successfully!");
        localStorage.setItem(
          `userProfile_${email}`,
          JSON.stringify({ ...userData, ...editedData })
        );
      } catch {
        const updatedData = { ...userData, ...editedData };
        localStorage.setItem(`userProfile_${email}`, JSON.stringify(updatedData));
        setUserData(updatedData);
        setSaveMessage("Profile updated locally!");
      }

      setIsEditing(false);
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaveMessage("Error saving changes. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditedData({
      bio: userData.bio || "",
      gender: userData.gender || "",
      dob: userData.dob || "",
    });
    setIsEditing(false);
    setSaveMessage("");
  };

  // ✅ Fetch friends
  const handleShowFriends = async () => {
    if (!showFriends) {
      // Toggling on: fetch friends
      setFriendsLoading(true);
      setFriendsError("");
      console.log("Fetching friends for email:", email);
      try {
        const res = await axios.get(`http://localhost:5000/friends/${email}`);
        console.log("Friends fetched:", res.data);
        setFriendsList(res.data);
        setShowFriends(true);
      } catch (err) {
        console.error("Error fetching friends:", err);
        setFriendsError("Failed to load friends. Please try again.");
        setFriendsList([]);
      } finally {
        setFriendsLoading(false);
      }
    } else {
      // Toggling off: just close
      setShowFriends(false);
    }
  };

  // ✅ Navigate to friend's profile
  const handleFriendClick = (friendEmail, friendUsername) => {
    if (friendUsername) {
      navigate(`/dashboard/user/${friendUsername}`);
    } else {
      navigate("/user-profile", { state: { email: friendEmail } });
    }
  };

  if (loading && !isEditing) {
    return (
      <div className="profile-loading">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <p>User not found!</p>
          <button onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  const displayData = {
    bio: editedData.bio ?? userData.bio,
    gender: editedData.gender ?? userData.gender,
    dob: editedData.dob ?? userData.dob,
  };

  return (
    <div className="profile-wall-container">
      {/* Animated Background */}
      <div className="wall-background">
        <div className="wall-pattern"></div>
        <div className="floating-elements">
          <div className="element element-1"></div>
          <div className="element element-2"></div>
          <div className="element element-3"></div>
        </div>
      </div>

      {/* Profile Header Section */}
      <div className="profile-header-section">
        {saveMessage && (
          <div className={`save-message ${saveMessage.includes("Error") ? "error" : "success"}`}>
            {saveMessage}
          </div>
        )}

        <div className="profile-header-card">
          <div className="profile-avatar-section">
            {userData.image && getImageSrc(userData.image) ? (
              <div className="profile-avatar">
                <img
                  src={getImageSrc(userData.image)}
                  alt="Profile"
                  className="avatar-img"
                />
                <div className="avatar-ring"></div>
              </div>
            ) : (
              <div className="profile-avatar">
                <div className="avatar-placeholder">
                  {userData.username?.charAt(0) || "U"}
                </div>
                <div className="avatar-ring"></div>
              </div>
            )}
          </div>

          <div className="profile-info-section">
            <h1 className="profile-name">{userData.username || "User"}</h1>
            <p className="profile-email">{userData.email}</p>
            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-number">{userPosts.length}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{friendsList.length}</span>
                <span className="stat-label">Friends</span>
              </div>
            </div>
          </div>

          <div className="profile-actions-section">
            <button className="friends-btn" onClick={handleShowFriends}>
              <FaUserFriends className="btn-icon" />
              <span>Friends</span>
              <span className="friends-count">{friendsList.length}</span>
            </button>

            {!isEditing ? (
              <button className="edit-btn" onClick={handleEditToggle}>
                <span className="btn-icon">✏️</span>
                <span>Edit Profile</span>
              </button>
            ) : (
              <button className="cancel-btn" onClick={handleCancel}>
                <span className="btn-icon">✕</span>
                <span>Cancel</span>
              </button>
            )}
          </div>
        </div>

        {/* Friends Dropdown */}
        {showFriends && (
          <div className="friends-dropdown modal-overlay">
            <div className="friends-header">
              <h3>Friends</h3>
              <div className="friends-subcount">{friendsList.length} total</div>
              <button className="close-friends" onClick={() => setShowFriends(false)}>✕</button>
            </div>
            <div className="friends-list">
              {friendsLoading ? (
                <div className="friends-loading">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading friends...</span>
                  </div>
                  <p>Loading friends...</p>
                </div>
              ) : friendsError ? (
                <p className="friends-error">{friendsError}</p>
              ) : friendsList.length > 0 ? (
                friendsList.map((friend) => (
                  <div
                    key={friend.email}
                    className="friend-item"
                    onClick={() => handleFriendClick(friend.email, friend.username)}
                  >
                    <div className="friend-avatar">
                      {friend.username?.charAt(0) || "F"}
                    </div>
                    <span className="friend-name">{friend.username}</span>
                  </div>
                ))
              ) : (
                <p className="no-friends">No friends yet</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Details Section */}
      <div className="profile-details-section">
        <div className="details-card">
          <h2 className="section-title">About Me</h2>
          {isEditing ? (
            <textarea
              className="bio-textarea"
              value={displayData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              placeholder="Tell us about yourself..."
              rows="4"
            />
          ) : (
            <p className="bio-text">{displayData.bio || "No bio available."}</p>
          )}

          <div className="profile-details-grid">
            <div className="detail-item">
              <label>Gender</label>
              {isEditing ? (
                <select
                  className="detail-select"
                  value={displayData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              ) : (
                <span>{displayData.gender || "Not specified"}</span>
              )}
            </div>

            <div className="detail-item">
              <label>Date of Birth</label>
              {isEditing ? (
                <input
                  type="date"
                  className="detail-input"
                  value={displayData.dob?.split("T")[0] || ""}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                />
              ) : (
                <span>{displayData.dob ? new Date(displayData.dob).toLocaleDateString() : "Not specified"}</span>
              )}
            </div>
          </div>

          {isEditing && (
            <div className="save-actions">
              <button className="save-btn" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wall of Posts Section */}
      <div className="wall-section">
        <div className="wall-header">
          <h2 className="wall-title">
            <span className="wall-icon">📸</span>
            Wall of Memories
          </h2>
          <p className="wall-subtitle">Your posts displayed like posters on a wall</p>
        </div>

        {userPosts.length > 0 ? (
          <div className="wall-container">
            <div className="wall-posts">
              {userPosts.map((post, index) => (
                <div 
                  key={post._id} 
                  className={`wall-post post-${index + 1}`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="post-pin"></div>
                  <div className="post-content">
                    {post.image?.data && (
                      <div className="post-image">
                        <img
                          src={getImageSrc(post.image)}
                          alt="Post"
                          className="post-img"
                        />
                      </div>
                    )}
                    <div className="post-details">
                      <p className="post-caption">{post.caption}</p>
                      <div className="post-stats">
                        <div className="stat">
                          <span className="stat-icon">❤️</span>
                          <span className="stat-count">{post.likes}</span>
                        </div>
                        <div className="stat">
                          <span className="stat-icon">💬</span>
                          <span className="stat-count">{post.comments.length}</span>
                        </div>
                      </div>
                      <div className="post-date">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
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
              <h3>Your wall is empty</h3>
              <p>Start sharing your memories to see them here!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
