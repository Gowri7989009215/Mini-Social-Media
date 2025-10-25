import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";

export default function ShareThoughts() {
  return (
    <div className="feature-page">
      {/* Hero Section */}
      <div
        className="feature-hero position-relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529333166437-7750a6dd5a70')",
        }}
      >
        <div className="overlay d-flex flex-column justify-content-center align-items-center text-center text-white">
          <h1 className="display-3 fw-bold animate-heading">
            Share Your Thoughts
          </h1>
          <p className="lead animate-subtitle">
            Let your voice be heard. Inspire, connect, and engage.
          </p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="container py-5 text-center">
        <p className="mb-4 fs-5 fade-in">
          In the digital age, your words can travel across the globe in
          seconds. This feature allows you to post updates, ideas, opinions, or
          even just a simple "hello" to your network. It's your space to speak
          and be heard.
        </p>
      </div>

      {/* Info Cards Section */}
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1485217988980-11786ced9454"
                alt="Inspire Others"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Inspire Others</h4>
              <p>
                Your words can motivate and inspire. Share your journey,
                achievements, or even your struggles.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1515378791036-0648a3ef77b2"
                alt="Start Conversations"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Start Conversations</h4>
              <p>
                Engage with your community. Ask questions, share opinions, and
                spark discussions that matter to you.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1503264116251-35a269479413"
                alt="Build Connections"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Build Connections</h4>
              <p>
                Sharing your thoughts is the first step toward finding like-minded
                people and building lasting connections.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-5 fade-in">
        <h2 className="fw-bold mb-3">Ready to share your first thought?</h2>
        <Link to="/" className="btn btn-lg btn-gradient">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
