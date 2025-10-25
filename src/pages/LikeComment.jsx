import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

export default function LikeComment() {
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
          <h1 className="display-3 fw-bold animate-heading">Like & Comment</h1>
          <p className="lead animate-subtitle">
            Engage with content you love and connect through conversation.
          </p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="container py-5 text-center">
        <p className="mb-4 fs-5 fade-in">
          With likes and comments, you can appreciate the creativity of others
          and join in meaningful discussions. Every like spreads positivity, and
          every comment builds community.
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
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Show Appreciation</h4>
              <p>
                A simple tap on the heart lets your friends know you value
                their posts, photos, and updates.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1520974735194-8d95a730d0f0"
                alt="Join the Conversation"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Join the Conversation</h4>
              <p>
                Leave thoughtful comments to spark discussions and share your
                perspective with others.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29"
                alt="Build Connections"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Build Connections</h4>
              <p>
                Interacting with posts fosters deeper connections with people
                who share your passions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-5 fade-in">
        <h2 className="fw-bold mb-3">Start liking and commenting today!</h2>
        <Link to="/" className="btn btn-lg btn-gradient">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
