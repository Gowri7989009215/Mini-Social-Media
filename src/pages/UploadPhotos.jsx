import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

export default function UploadPhotos() {
  return (
    <div className="feature-page">
      {/* Hero Section */}
      <div
        className="feature-hero position-relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e')",
        }}
      >
        <div className="overlay d-flex flex-column justify-content-center align-items-center text-center text-white">
          <h1 className="display-3 fw-bold animate-heading">
            Upload Your Photos
          </h1>
          <p className="lead animate-subtitle">
            Turn your moments into timeless memories.
          </p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="container py-5 text-center">
        <p className="mb-4 fs-5 fade-in">
          Capture the essence of your adventures, celebrations, and everyday
          life. With our photo-sharing feature, you can store your memories
          forever and share them with your friends and followers instantly.
        </p>
      </div>

      {/* Info Cards */}
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1511765224389-37f0e77cf0eb"
                alt="Capture Moments"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Capture Moments</h4>
              <p>
                From sunsets to smiles, freeze every precious moment with a
                single click and keep it forever.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1487412912498-0447578fcca8"
                alt="Share Instantly"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Share Instantly</h4>
              <p>
                Post your photos in seconds and let your friends and followers
                join in your story as it happens.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1520975698519-59c07e02f1d4"
                alt="Build Your Gallery"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Build Your Gallery</h4>
              <p>
                Create a personal gallery that reflects your personality and
                showcases your favorite moments.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-5 fade-in">
        <h2 className="fw-bold mb-3">Start sharing your world today!</h2>
        <Link to="/" className="btn btn-lg btn-gradient">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
