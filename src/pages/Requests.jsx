// src/pages/Requests.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Requests.css";

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const email = localStorage.getItem("userEmail"); // logged in user email

  useEffect(() => {
    if (email) {
      axios
        .get(`http://localhost:5000/friends/requests/${email}`)
        .then((res) => setRequests(res.data))
        .catch((err) => console.error("Error fetching requests:", err));
    }
  }, [email]);

  const handleAccept = (senderEmail) => {
    axios
      .post("http://localhost:5000/friends/accept", {
        senderEmail,
        receiverEmail: email,
      })
      .then(() => {
        setRequests((prev) =>
          prev.filter((req) => req.senderEmail !== senderEmail)
        );
      })
      .catch((err) => console.error("Error accepting request:", err));
  };

  const handleDecline = (senderEmail) => {
    axios
      .post("http://localhost:5000/friends/decline", {
        senderEmail,
        receiverEmail: email,
      })
      .then(() => {
        setRequests((prev) =>
          prev.filter((req) => req.senderEmail !== senderEmail)
        );
      })
      .catch((err) => console.error("Error declining request:", err));
  };

  return (
    <div className="requests-page">
      <h2>Friend Requests</h2>
      <div className="requests-list">
        {requests.length === 0 ? (
          <p>No new requests</p>
        ) : (
          requests.map((req) => (
            <div className="request-card" key={req._id}>
              <div className="request-info">
                <img
                  src={`https://api.dicebear.com/8.x/avataaars/svg?seed=${req.senderEmail}`}
                  alt="avatar"
                  className="request-avatar"
                />
                <div>
                  <h3>{req.senderEmail.split("@")[0]}</h3>
                  <p>Wants to connect with you</p>
                </div>
              </div>
              <div className="request-actions">
                <button
                  className="accept-btn"
                  onClick={() => handleAccept(req.senderEmail)}
                >
                  Accept
                </button>
                <button
                  className="decline-btn"
                  onClick={() => handleDecline(req.senderEmail)}
                >
                  Decline
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
