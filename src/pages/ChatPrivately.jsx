import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

export default function ChatPrivately() {
  return (
    <div className="feature-page">
      {/* Hero Section */}
      <div
        className="feature-hero position-relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1522075469751-3a6694fb2f61')",
        }}
      >
        <div className="overlay d-flex flex-column justify-content-center align-items-center text-center text-white">
          <h1 className="display-3 fw-bold animate-heading">Chat Privately</h1>
          <p className="lead animate-subtitle">
            Secure conversations, just between you and them.
          </p>
        </div>
      </div>

      {/* Intro Text */}
      <div className="container py-5 text-center">
        <p className="mb-4 fs-5 fade-in">
          Our private messaging feature allows you to connect directly with your
          friends in a safe, encrypted environment. Share your thoughts,
          memories, and moments without worrying about unwanted eyes.
        </p>
      </div>

      {/* Info Cards */}
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1580894894513-541e068a2c36"
                alt="Secure Messaging"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Secure Messaging</h4>
              <p>
                End-to-end encryption keeps your conversations private and safe
                from intruders.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1601412436009-d964bd02edbc"
                alt="Share Media"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Share Media</h4>
              <p>
                Send photos, videos, and voice notes to make your chats more
                personal and lively.
              </p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="info-card glass-card p-4 text-center h-100 hover-zoom">
              <img
                src="https://images.unsplash.com/photo-1525186402429-b4ff38bedec6"
                alt="Real-Time Conversations"
                className="img-fluid rounded mb-3"
              />
              <h4 className="fw-bold">Real-Time Conversations</h4>
              <p>
                Enjoy instant messaging with read receipts and typing indicators
                for a true chat experience.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center py-5 fade-in">
        <h2 className="fw-bold mb-3">Start chatting privately now!</h2>
        <Link to="/" className="btn btn-lg btn-gradient">
          Back to Home
        </Link>
      </div>
    </div>
  );
}
