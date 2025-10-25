import mongoose from "mongoose";

const friendSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
});

// Ensure unique requests
friendSchema.index({ senderEmail: 1, receiverEmail: 1 }, { unique: true });

export default mongoose.model("Friend", friendSchema);
