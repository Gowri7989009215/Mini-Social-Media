import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

export default function ExpressYourself() {
  return (
    <div className="feature-page">
      {/* Hero Section */}
      <div
        className="feature-hero position-relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1508780709619-79562169bc64')",
        }}
      >
        <div className="overlay d-flex flex-column justify-content-center align-items-center text-center text-white">
          <h1 className="display-3 fw-bold animate-heading">
            Express Yourself to the World
          </h1>
          <p className="lead animate-subtitle">
            Unleash your creativity without limits.
          </p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="container py-5 text-center">
        <p className="mb-4 fs-5 fade-in">
          Share art, music, videos, and thoughts — whatever defines you. This is
          your stage, make it count. Inspire others with your creations and let
          your imagination shine.
        </p>
      </div>

      {/* Info Cards */}
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29"
                alt="Share Your Art"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Share Your Art</h4>
              <p>
                Post your drawings, paintings, and designs to connect with other
                creatives worldwide.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
                alt="Share Music & Videos"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Music & Videos</h4>
              <p>
                Upload your performances, vlogs, or short films and let the
                world experience your talent.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1475724017904-b712052c192a"
                alt="Inspire the World"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Inspire the World</h4>
              <p>
                Use your creativity to make a positive impact and encourage
                others to share their own stories.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-5 fade-in">
        <h2 className="fw-bold mb-3">Start expressing yourself today!</h2>
        <Link to="/dashboard/post" className="btn btn-lg btn-gradient">
          Create Your First Post
        </Link>
      </div>
    </div>
  );
}
