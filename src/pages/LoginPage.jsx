import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import "./LoginPage.css";
import axios from "axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      alert(res.data.message);

      // Save email in localStorage
      localStorage.setItem("userEmail", res.data.user.email);

      // Navigate to dashboard (no need to pass state)
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || "Something went wrong. Try again!"
      );
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-card p-5 shadow-lg rounded">
        <h1 className="mb-4 fw-bold text-center text-gradient animate-heading">
          Welcome Back
        </h1>
        <p className="text-center mb-4 text-light">
          Log in to continue your journey
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email address</label>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control form-control-lg"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-danger">{error}</p>}

          <button type="submit" className="btn btn-purple btn-lg w-100 mt-3">
            Log In
          </button>
        </form>

        <p className="mt-4 text-center">
          <Link
            to="/forgot-password"
            className="text-decoration-none fw-semibold text-light"
          >
            Forgot Password?
          </Link>
        </p>
        <p className="mt-2 text-center">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-decoration-none fw-semibold text-light"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
