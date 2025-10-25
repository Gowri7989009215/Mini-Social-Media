import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

export default function ConnectPeople() {
  return (
    <div className="feature-page">
      {/* Hero Section */}
      <div
        className="feature-hero position-relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1502720705749-3c8d0e4b2a2c')",
        }}
      >
        <div className="overlay d-flex flex-column justify-content-center align-items-center text-center text-white">
          <h1 className="display-3 fw-bold animate-heading shadow-text">
            Connect with People
          </h1>
          <p className="lead animate-subtitle shadow-text">
            Find and connect with friends, discover new people, and build your social network.
          </p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="container py-5 text-center fade-in">
        <p className="mb-4 fs-5">
          Building connections is the foundation of social media. 
          Find people who share your interests, discover new perspectives, and create 
          meaningful relationships. Each connection opens doors to new experiences and 
          opportunities for growth.
        </p>
      </div>

      {/* Info Cards */}
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1515169067865-5387ec356754"
                alt="Show Appreciation"
                className="img-fluid rounded mb-3 shadow-img"
              />
              <h4 className="fw-bold">Find Friends</h4>
              <p>
                Search for people you know or discover new friends based on 
                shared interests and mutual connections.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1520974735194-8d95a730d0f0"
                alt="Join the Conversation"
                className="img-fluid rounded mb-3 shadow-img"
              />
              <h4 className="fw-bold">Send Requests</h4>
              <p>
                Send friend requests to people you'd like to connect with 
                and start building your social network.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29"
                alt="Build Connections"
                className="img-fluid rounded mb-3 shadow-img"
              />
              <h4 className="fw-bold">Build Your Network</h4>
              <p>
                Grow your social circle by connecting with people who share 
                your passions and expand your community.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-5 fade-in">
        <h2 className="fw-bold mb-3">Start connecting with people today!</h2>
        <Link to="/dashboard" className="btn btn-lg btn-gradient shadow-btn">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
