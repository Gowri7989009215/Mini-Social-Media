import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  email: String,
  caption: String,
  likes: [String], // Array of emails who liked the post
  comments: Array,
  image: {
    data: Buffer,
    contentType: String,
  },
}, { timestamps: true });

export default mongoose.model("Post", postSchema);
