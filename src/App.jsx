import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

import ShareThoughts from "./pages/ShareThoughts";
import UploadPhotos from "./pages/UploadPhotos";
import LikeComment from "./pages/LikeComment";
import ConnectPeople from "./pages/ConnectPeople";
import ChatPrivately from "./pages/ChatPrivately";
import ExpressYourself from "./pages/ExpressYourself";
import FeedPage from "./pages/FeedPage"; // ✅ New Feed Page
import SignupPage from "./pages/SignupPage"; // ✅ add import
import LoginPage from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import Message from "./pages/Message";
// import UserProfile from "./pages/UserProfile";
import Dashboard from "./pages/DashBoard";
// import Dem from "./dem";
export default function App() {
  const features = [
    { title: "Share Your Thoughts", icon: "bi-pencil-square", img: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70", path: "/share-thoughts" },
    { title: "Upload Your Photos", icon: "bi-camera-fill", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e", path: "/upload-photos" },
    { title: "Like & Comment", icon: "bi-heart-fill", img: "like and comment.jpg", path: "/like-comment" },
    { title: "Connect with People", icon: "bi-people-fill", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330", path: "/connect-people" },
    { title: "Chat Privately", icon: "bi-chat-dots-fill", img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61", path: "/chat-privately" },
    { title: "Express Yourself to the World", icon: "bi-megaphone-fill", img: "https://images.unsplash.com/photo-1508780709619-79562169bc64", path: "/express-yourself" }
  ];

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={
          <div className="landing-page">
            {/* Animated Background */}
            <div className="animated-bg">
              <div className="floating-shapes">
                <div className="shape shape-1"></div>
                <div className="shape shape-2"></div>
                <div className="shape shape-3"></div>
                <div className="shape shape-4"></div>
                <div className="shape shape-5"></div>
                <div className="shape shape-6"></div>
                <div className="shape shape-7"></div>
                <div className="shape shape-8"></div>
              </div>
            </div>

            {/* Hero Section */}
            <section className="hero d-flex align-items-center justify-content-center text-center position-relative">
              <div className="container">
                <div className="hero-content">
                  <div className="hero-badge animate-badge">
                    <span className="badge-text">✨ Welcome to the Future</span>
                  </div>
                  
                  <h1 className="display-2 fw-bold hero-title animate-title">
                    <span className="gradient-text">Mini Social Media</span>
                    <br />
                    <span className="hero-subtitle">Your Digital Universe</span>
                  </h1>
                  
                  <p className="lead hero-description animate-subtitle">
                    Connect, share, and explore in a beautiful digital space designed for modern social interaction.
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="hero-actions mt-5 animate-buttons">
                    <Link to="/signup" className="btn btn-primary btn-lg me-3 hero-btn primary-btn">
                      <span className="btn-text">Get Started</span>
                      <i className="bi bi-arrow-right ms-2"></i>
                    </Link>
                    <a href="#features" className="btn btn-outline-light btn-lg hero-btn secondary-btn">
                      <span className="btn-text">Explore Features</span>
                      <i className="bi bi-grid-3x3-gap ms-2"></i>
                    </a>
                  </div>
                  
                  {/* Login Link */}
                  <div className="mt-4 animate-login">
                    <Link to="/login" className="login-link">
                      <i className="bi bi-person-circle me-2"></i>
                      Already have an account? <span className="login-text">Sign In</span>
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Scroll Indicator */}
              <div className="scroll-indicator animate-scroll">
                <div className="scroll-arrow">
                  <i className="bi bi-chevron-down"></i>
                </div>
                <span className="scroll-text">Scroll to explore</span>
              </div>
            </section>

            {/* Features Section */}
            <section id="features" className="features-section py-5">
              <div className="container">
                <div className="section-header text-center mb-5">
                  <h2 className="section-title animate-section-title">
                    <span className="title-highlight">Amazing Features</span>
                  </h2>
                  <p className="section-subtitle animate-section-subtitle">
                    Discover the powerful tools that make social networking beautiful and intuitive
                  </p>
                </div>
                
                <div className="features-grid">
                  {features.map((f, i) => (
                    <div key={i} className="feature-card-wrapper animate-feature" style={{ animationDelay: `${i * 0.1}s` }}>
                      <Link to={f.path} className="feature-link">
                        <div className="feature-card glass-card">
                          <div className="feature-image-container">
                            <div className="feature-img" style={{ backgroundImage: `url(${f.img})` }}>
                              <div className="feature-overlay">
                                <div className="feature-icon-container">
                                  <i className={`bi ${f.icon} feature-icon`}></i>
                                </div>
                              </div>
                            </div>
                            <div className="feature-badge">
                              <span className="badge-number">{i + 1}</span>
                            </div>
                          </div>
                          <div className="feature-content">
                            <h5 className="feature-title">{f.title}</h5>
                            <p className="feature-description">
                              {f.title === "Share Your Thoughts" && "Express yourself with beautiful posts"}
                              {f.title === "Upload Your Photos" && "Share your memories with stunning visuals"}
                              {f.title === "Like & Comment" && "Engage with your community"}
                              {f.title === "Connect with People" && "Build meaningful relationships"}
                              {f.title === "Chat Privately" && "Connect one-on-one with friends"}
                              {f.title === "Express Yourself to the World" && "Share your voice with the world"}
                            </p>
                            <div className="feature-arrow">
                              <i className="bi bi-arrow-right"></i>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section py-5">
              <div className="container">
                <div className="row text-center">
                  <div className="col-md-3 col-6 mb-4">
                    <div className="stat-item animate-stat" style={{ animationDelay: '0.1s' }}>
                      <div className="stat-number">10K+</div>
                      <div className="stat-label">Active Users</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-4">
                    <div className="stat-item animate-stat" style={{ animationDelay: '0.2s' }}>
                      <div className="stat-number">50K+</div>
                      <div className="stat-label">Posts Shared</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-4">
                    <div className="stat-item animate-stat" style={{ animationDelay: '0.3s' }}>
                      <div className="stat-number">100K+</div>
                      <div className="stat-label">Connections Made</div>
                    </div>
                  </div>
                  <div className="col-md-3 col-6 mb-4">
                    <div className="stat-item animate-stat" style={{ animationDelay: '0.4s' }}>
                      <div className="stat-number">99%</div>
                      <div className="stat-label">User Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA Section */}
            <section className="cta-section py-5">
              <div className="container text-center">
                <div className="cta-content animate-cta">
                  <h3 className="cta-title">Ready to Join Our Community?</h3>
                  <p className="cta-description">Join thousands of users who are already sharing their stories</p>
                  <div className="cta-buttons">
                    <Link to="/signup" className="btn btn-primary btn-lg cta-btn">
                      Start Your Journey
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        } />

        {/* Feed Page */}
        <Route path="/feed" element={<FeedPage />} />

        {/* Feature Pages */}
        <Route path="/share-thoughts" element={<ShareThoughts />} />
        <Route path="/upload-photos" element={<UploadPhotos />} />
        <Route path="/like-comment" element={<LikeComment />} />
        <Route path="/connect-people" element={<ConnectPeople />} />
        <Route path="/chat-privately" element={<ChatPrivately />} />
        <Route path="/express-yourself" element={<ExpressYourself />} />
        <Route path="/message" element={<Message />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* <Route path="/dem" element={<Dem />} /> */}
          {/* <Route path="/userprofile" element={<UserProfile />} /> */}
        <Route path="/dashboard/*" element={<Dashboard />} />


      </Routes>
    </Router>
  );
}
