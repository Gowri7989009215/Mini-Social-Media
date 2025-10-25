import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../index.css";
import "./LoginPage.css";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1); // 1: email, 2: otp, 3: new password
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/forgot-password", {
        email,
      });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      console.error("Forgot password error:", err);
      setError(
        err.response?.data?.error || "Something went wrong. Try again!"
      );
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/verify-otp", {
        email,
        otp,
      });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      console.error("Verify OTP error:", err);
      setError(
        err.response?.data?.error || "Something went wrong. Try again!"
      );
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/reset-password", {
        email,
        otp,
        newPassword,
      });
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);
      setError(
        err.response?.data?.error || "Something went wrong. Try again!"
      );
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center">
      <div className="login-card p-5 shadow-lg rounded">
        <h1 className="mb-4 fw-bold text-center text-gradient animate-heading">
          Forgot Password
        </h1>
        <p className="text-center mb-4 text-light">
          {step === 1 && "Enter your email to receive OTP"}
          {step === 2 && "Enter the OTP sent to your email"}
          {step === 3 && "Enter your new password"}
        </p>

        {step === 1 && (
          <form onSubmit={handleSendOTP}>
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

            {error && <p className="text-danger">{error}</p>}
            {message && <p className="text-success">{message}</p>}

            <button type="submit" className="btn btn-purple btn-lg w-100 mt-3">
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="mb-3">
              <label className="form-label fw-semibold">OTP</label>
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
                maxLength="6"
              />
            </div>

            {error && <p className="text-danger">{error}</p>}
            {message && <p className="text-success">{message}</p>}

            <button type="submit" className="btn btn-purple btn-lg w-100 mt-3">
              Verify OTP
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-3">
              <label className="form-label fw-semibold">New Password</label>
              <input
                type="password"
                className="form-control form-control-lg"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-danger">{error}</p>}
            {message && <p className="text-success">{message}</p>}

            <button type="submit" className="btn btn-purple btn-lg w-100 mt-3">
              Reset Password
            </button>
          </form>
        )}

        <p className="mt-4 text-center">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-decoration-none fw-semibold text-light"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
