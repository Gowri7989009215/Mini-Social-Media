import React, { useState } from "react";
import axios from "axios";
import { FaSearch, FaUserPlus } from "react-icons/fa";
import "./Search.css";

export default function Search() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("username");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length >= 3) {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/search?query=${value}&filter=${filter}`
        );
        setResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    } else {
      setResults([]);
    }
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setQuery("");
    setResults([]);
  };

  const handleConnect = async (user) => {
    try {
      const senderEmail = localStorage.getItem("userEmail");
      if (!senderEmail) {
        alert("❌ You must be logged in to send a request");
        return;
      }

      const receiverEmail = user.email;

      const res = await axios.post("http://localhost:5000/friends/request", {
        senderEmail,
        receiverEmail,
      });

      alert(`✅ Friend request sent to ${user.username}!`);
    } catch (err) {
      console.error("Connection error:", err);
      alert("❌ Failed to send friend request. Please try again.");
    }
  };

  return (
    <div className="search-container">
      <div className="search-bg"></div>
      <div className="search-content">
        <div className="search-header">
          <h1 className="search-title">Discover Connections</h1>
          <p className="search-subtitle">Find and connect with amazing people</p>
        </div>

        <div className="search-form">
          <div className="search-controls">
            <select
              value={filter}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="username">Search by Username</option>
              <option value="email">Search by Email</option>
            </select>

            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={`Search ${filter}...`}
                className="search-input"
              />
            </div>
          </div>

          <div className="search-results">
            {loading ? (
              <div className="search-loading">
                <div className="loading-spinner"></div>
                <span>Searching...</span>
              </div>
            ) : results.length > 0 ? (
              <>
                <h3 className="results-header">Search Results</h3>
                <ul className="results-list">
                  {results.map((user) => (
                    <li key={user._id} className="result-item">
                      <div className="result-avatar">
                        {user.username?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div className="result-info">
                        <div className="result-username">{user.username}</div>
                        <div className="result-email">{user.email}</div>
                      </div>
                      <button
                        onClick={() => handleConnect(user)}
                        className="connect-btn"
                      >
                        <FaUserPlus style={{ marginRight: '0.5rem' }} />
                        Connect
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : query.length >= 3 && !loading ? (
              <div className="no-results">
                <p>No users found matching "{query}"</p>
                <p>Try a different search term or filter</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
