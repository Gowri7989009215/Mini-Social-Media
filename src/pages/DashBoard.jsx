// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Routes, Route, Link } from "react-router-dom";
import "./DashBoard.css";
import {
  FaHome,
  FaSearch,
  FaPlusCircle,
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
  FaUserFriends,
} from "react-icons/fa";

// Import pages
import Home from "./Home";
import Search from "./Search";
import Post from "./Post";
import Message from "./Message.jsx";
import UserProfile from "./UserProfile";
import Requests from "./Requests"; // NEW PAGE
import ViewUserProfile from "./ViewUserProfile";

export default function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || sessionStorage.getItem("userEmail") || localStorage.getItem("userEmail");
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!email) {
      navigate("/login");
    } else {
      const nameFromEmail = email.split("@")[0];
      setUsername(nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1));
    }
  }, [email, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("userToken");
    sessionStorage.removeItem("userEmail");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      {/* Animated Background */}
      <div className="dashboard-bg">
        <div className="floating-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
        </div>
      </div>

      {/* Modern Sidebar */}
      <div className="modern-sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">🌐</div>
            <div className="logo-text">
              <span className="logo-title">Mini Social</span>
              <span className="logo-subtitle">Dashboard</span>
            </div>
          </div>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            <span>{username.charAt(0)}</span>
          </div>
          <div className="user-details">
            <span className="user-name">{username}</span>
            <span className="user-status">Online</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-menu">
            <li className="nav-item">
              <Link to="/dashboard/home" className="nav-link">
                <div className="nav-icon">
                  <FaHome />
                </div>
                <span className="nav-text">Home</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard/search" className="nav-link">
                <div className="nav-icon">
                  <FaSearch />
                </div>
                <span className="nav-text">Search</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard/post" className="nav-link">
                <div className="nav-icon">
                  <FaPlusCircle />
                </div>
                <span className="nav-text">Create Post</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard/message" className="nav-link">
                <div className="nav-icon">
                  <FaEnvelope />
                </div>
                <span className="nav-text">Messages</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard/requests" className="nav-link">
                <div className="nav-icon">
                  <FaUserFriends />
                </div>
                <span className="nav-text">Requests</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/dashboard/profile" className="nav-link">
                <div className="nav-icon">
                  <FaUser />
                </div>
                <span className="nav-text">Profile</span>
                <div className="nav-indicator"></div>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <div className="logout-icon">
              <FaSignOutAlt />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content-area">
        <div className="content-wrapper">
          <Routes>
            <Route index element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="post" element={<Post />} />
            <Route path="message" element={<Message />} />
            <Route path="requests" element={<Requests />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="user/:username" element={<ViewUserProfile />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
