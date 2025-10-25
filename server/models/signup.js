import mongoose from "mongoose";

const signupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // store hashed password
  dob: { type: Date },
  gender: { type: String },
  bio: { type: String },
  image: {
    data: Buffer,
    contentType: String,
  },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
});

const Signup = mongoose.model("Signup", signupSchema); // collection = 'signups'
export default Signup;
