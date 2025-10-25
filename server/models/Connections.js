// models/Connections.js
import mongoose from "mongoose";

const connectionsSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  connections: { type: [String], default: [] }, // array of connected emails
});

export default mongoose.model("Connections", connectionsSchema);
