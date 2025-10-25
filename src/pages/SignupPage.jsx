import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    dob: "",
    gender: "",
    bio: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files[0]) {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
      setFileName(file.name);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });

      const response = await axios.post("http://localhost:5000/signup", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert(response.data.message);
      setFormData({
        name: "",
        email: "",
        username: "",
        password: "",
        dob: "",
        gender: "",
        bio: "",
        image: null,
      });
      setImagePreview(null);
      setFileName("");
      
      // Redirect to login page after successful signup
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      console.error("Axios error:", err);
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-wrapper">
        <div className="signup-header">
          <h2>Create Account</h2>
        </div>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          <select name="gender" value={formData.gender} onChange={handleChange}>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          <textarea
            name="bio"
            placeholder="Bio (Optional)"
            value={formData.bio}
            onChange={handleChange}
            rows="3"
          />
          
          <div className="file-input-container">
            <label htmlFor="image-upload" className="file-input-label">
              Choose Profile Picture
            </label>
            <input
              id="image-upload"
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="file-input"
            />
            {fileName && <span className="file-name">{fileName}</span>}
          </div>

          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="image-preview"
            />
          )}
        </form>

        <div className="signup-footer">
          <button type="submit" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}