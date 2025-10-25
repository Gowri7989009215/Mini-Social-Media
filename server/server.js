import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import bcrypt from "bcrypt";
import http from "http";
import { Server } from "socket.io";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
// Load environment variables
dotenv.config();

import Signup from "./models/signup.js";
import Post from "./models/Post.js";
import Friend from "./models/Friend.js";
import Connections from "./models/Connections.js";
import Message from "./models/Message.js";
import Conversation from "./models/Conversation.js";

// Import routes
import messageRoutes from "./routes/messages.js";

const app = express();
app.use(cors());
app.use(express.json());

// ================= MONGODB CONNECTION =================
mongoose
  .connect("mongodb://127.0.0.1:27017/msm_pro", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= MULTER SETUP =================
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ================= EMAIL TRANSPORTER SETUP =================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'chinthagowrishankar18@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'kprs ftno jrkh uhcp' // Use environment variable
  }
});

// ================= SIGNUP ROUTE =================
app.post("/signup", upload.single("image"), async (req, res) => {
  try {
    const { name, email, username, password, dob, gender, bio } = req.body;
    if (!name || !email || !username || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, username, and password are required." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Signup({
      name,
      email,
      username,
      password: hashedPassword,
      dob,
      gender,
      bio,
      image: req.file
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : undefined,
    });
    await newUser.save();
    await Connections.create({ email: newUser.email, connections: [] });
    res.json({ message: "✅ Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    if (err.code === 11000) {
      return res
        .status(400)
        .json({ error: "Email or username already exists." });
    }
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

// ================= LOGIN ROUTE =================
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required." });
    const user = await Signup.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "Invalid email or password." });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid email or password." });
    res.json({
      message: "✅ Login successful!",
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// ================= FORGOT PASSWORD ROUTE =================
app.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required." });

    const user = await Signup.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found." });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenExpiry = Date.now() + 600000; // 10 minutes

    await Signup.updateOne(
      { email },
      { resetToken: otp, resetTokenExpiry }
    );

    const mailOptions = {
      from: 'chinthagowrishankar18@gmail.com',
      to: email,
      subject: 'Password Reset OTP',
      html: `
        <h2>Password Reset OTP</h2>
        <p>You requested a password reset for your Mini Social Media account.</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP sent to your email successfully." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to send OTP." });
  }
});

// ================= VERIFY OTP ROUTE =================
app.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required." });

    const user = await Signup.findOne({
      email,
      resetToken: otp,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    // OTP verified successfully - keep it for password reset step
    res.json({ message: "OTP verified successfully." });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ error: "Failed to verify OTP." });
  }
});

// ================= RESET PASSWORD ROUTE =================
app.post("/reset-password", async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ error: "Email, OTP, and new password are required." });
    }

    const user = await Signup.findOne({
      email,
      resetToken: otp,
      resetTokenExpiry: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await Signup.updateOne(
      { _id: user._id },
      {
        password: hashedPassword,
        resetToken: undefined,
        resetTokenExpiry: undefined
      }
    );

    res.json({ message: "Password reset successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "Failed to reset password." });
  }
});

// ================= ROOT ROUTE =================
app.get("/", (req, res) => {
  res.send("Mini Social Media API is running.");
});

// ================= USER PROFILE ROUTES =================
app.get("/user/:email", async (req, res) => {
  try {
    const user = await Signup.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      user: {
        username: user.username,
        gender: user.gender,
        email: user.email,
        bio: user.bio,
        dob: user.dob,
        image: user.image
          ? {
              contentType: user.image.contentType,
              data: user.image.data.toString("base64"),
            }
          : null,
      },
    });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/user/by-username/:username", async (req, res) => {
  try {
    const user = await Signup.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      user: {
        username: user.username,
        gender: user.gender,
        email: user.email,
        bio: user.bio,
        dob: user.dob,
        image: user.image
          ? {
              contentType: user.image.contentType,
              data: user.image.data.toString("base64"),
            }
          : null,
      },
    });
  } catch (err) {
    console.error("Error fetching user by username:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/user/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const { bio, gender, dob } = req.body;
    const updatedUser = await Signup.findOneAndUpdate(
      { email },
      {
        $set: {
          ...(bio !== undefined && { bio }),
          ...(gender !== undefined && { gender }),
          ...(dob !== undefined && { dob }),
        },
      },
      { new: true, runValidators: true }
    );
    if (!updatedUser) return res.status(404).json({ error: "User not found" });
    res.json({
      message: "✅ Profile updated successfully!",
      user: {
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        gender: updatedUser.gender,
        dob: updatedUser.dob,
        image: updatedUser.image
          ? {
              contentType: updatedUser.image.contentType,
              data: updatedUser.image.data.toString("base64"),
            }
          : null,
      },
    });
  } catch (err) {
    console.error("Error updating user profile:", err);
    res.status(500).json({ error: "Failed to update profile", details: err.message });
  }
});

// ================= POSTS ROUTES =================
app.post("/posts", upload.single("image"), async (req, res) => {
  try {
    const { email, caption } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });
    const newPost = new Post({
      email,
      caption,
      likes: [],
      comments: [],
      image: req.file
        ? { data: req.file.buffer, contentType: req.file.mimetype }
        : undefined,
    });
    await newPost.save();
    res.status(201).json({ message: "✅ Post created successfully", post: newPost });
  } catch (err) {
    console.error("Error creating post:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/posts/:id/like", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    // Ensure likes is an array (for backward compatibility)
    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }
    // Ensure all likes are strings
    post.likes = post.likes.filter(like => typeof like === 'string');

    // Check if user is trying to like their own post
    if (post.email === email) {
      return res.status(400).json({ error: "You cannot like your own post" });
    }

    // Check if the liker is friends with the post owner
    const postOwnerConnections = await Connections.findOne({ email: post.email });
    if (!postOwnerConnections || !postOwnerConnections.connections.includes(email)) {
      return res.status(403).json({ error: "You can only like posts from friends" });
    }

    // Toggle the like
    const likeIndex = post.likes.indexOf(email);
    if (likeIndex > -1) {
      // Remove the like
      post.likes.splice(likeIndex, 1);
    } else {
      // Add the like
      post.likes.push(email);
    }
    await post.save();
    res.json(post);
  } catch (err) {
    console.error("Error liking post:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/posts/:id/comment", async (req, res) => {
  try {
    const { comment } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    post.comments.push(comment);
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/posts/user/:email", async (req, res) => {
  try {
    const posts = await Post.find({ email: req.params.email }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user posts" });
  }
});

// ================= SEARCH USERS =================
app.get("/api/search", async (req, res) => {
  try {
    const { query, filter } = req.query;
    if (!query || query.length < 3) {
      return res.json([]);
    }
    let filterQuery = {};
    if (filter === "email") {
      filterQuery = { email: { $regex: query, $options: "i" } };
    } else {
      filterQuery = { username: { $regex: query, $options: "i" } };
    }
    const users = await Signup.find(filterQuery).select("username email");
    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

// ================= FRIENDSHIP ROUTES =================
app.post("/friends/request", async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.body;
    if (!senderEmail || !receiverEmail) {
      return res.status(400).json({ error: "Both emails are required" });
    }
    if (senderEmail === receiverEmail) {
      return res.status(400).json({ error: "You cannot send a request to yourself" });
    }
    const existing = await Friend.findOne({ senderEmail, receiverEmail });
    if (existing) {
      return res.status(400).json({ error: "Request already exists" });
    }
    const newRequest = new Friend({
      senderEmail,
      receiverEmail,
      status: "pending",
    });
    await newRequest.save();
    res.json({ message: "✅ Friend request sent!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send request", details: err.message });
  }
});

app.get("/friends/requests/:email", async (req, res) => {
  try {
    const { email } = req.params;
    const requests = await Friend.find({
      receiverEmail: email,
      status: "pending",
    });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch requests", details: err.message });
  }
});

app.post("/friends/accept", async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.body;
    const request = await Friend.findOne({
      senderEmail,
      receiverEmail,
      status: "pending",
    });
    if (!request) return res.status(404).json({ error: "Friend request not found" });
    await request.deleteOne();
    await Connections.updateOne(
      { email: senderEmail },
      { $addToSet: { connections: receiverEmail } }
    );
    await Connections.updateOne(
      { email: receiverEmail },
      { $addToSet: { connections: senderEmail } }
    );
    res.json({ message: "✅ Friend request accepted and connections updated!" });
  } catch (err) {
    res.status(500).json({ error: "Failed to accept request", details: err.message });
  }
});

app.get("/friends/:email", async (req, res) => {
  try {
    const connections = await Connections.findOne({ email: req.params.email });
    if (!connections) return res.json([]);
    
    const friendsData = await Signup.find({ email: { $in: connections.connections } })
      .select("username email -_id");
    
    res.json(friendsData);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

app.get("/connections/:email", async (req, res) => {
  try {
    const userConnections = await Connections.findOne({ email: req.params.email });
    if (!userConnections) return res.json({ connections: [] });
    res.json({ connections: userConnections.connections });
  } catch (err) {
    res.status(500).json({ connections: [] });
  }
});

app.get("/posts/friends", async (req, res) => {
  try {
    const friendsQuery = req.query.friends;
    if (!friendsQuery) return res.json([]);
    const friendsArray = friendsQuery.split(",");
    const posts = await Post.find({ email: { $in: friendsArray } }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json([]);
  }
});

app.get("/messages/:email1/:email2", async (req, res) => {
  const { email1, email2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { senderEmail: email1, receiverEmail: email2 },
        { senderEmail: email2, receiverEmail: email1 },
      ],
    }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.post("/messages", async (req, res) => {
  const { senderEmail, receiverEmail, message } = req.body;
  try {
    const senderConn = await Connections.findOne({ email: senderEmail });
    const receiverConn = await Connections.findOne({ email: receiverEmail });
    if (!senderConn || !receiverConn || !senderConn.connections.includes(receiverEmail) || !receiverConn.connections.includes(senderEmail)) {
      return res.status(403).json({ error: "You can only message friends" });
    }
    const timestamp = new Date();
    const msg = new Message({ senderEmail, receiverEmail, message, timestamp });
    await msg.save();
    res.json({ message: "Message sent", msg });
  } catch (err) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// ================= MESSAGE ROUTES =================
app.use("/api/messages", messageRoutes);

// ================= SOCKET.IO SETUP =================
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Store active users
const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("🔗 User connected:", socket.id);

  // Handle user login
  socket.on("userLogin", (userEmail) => {
    activeUsers.set(socket.id, userEmail);
    socket.userEmail = userEmail;
    console.log(`User ${userEmail} logged in`);
  });

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage", async (messageData) => {
    const { senderEmail, receiverEmail, message, timestamp } = messageData;
    try {
      // Just broadcast the message to the room - don't save again
      // The API already saved it to the database
      const room = [senderEmail, receiverEmail].sort().join("-");
      
      // Emit to all users in the room
      io.to(room).emit("receiveMessage", {
        senderEmail,
        receiverEmail,
        message,
        timestamp: timestamp || new Date()
      });
      
      console.log(`Message broadcasted to room: ${room}`);
    } catch (err) {
      console.error("Error broadcasting message:", err);
      socket.emit("error", "Failed to broadcast message");
    }
  });

  // Handle typing indicators
  socket.on("typing", (data) => {
    const { receiverEmail, isTyping } = data;
    const room = [socket.userEmail, receiverEmail].sort().join("-");
    socket.to(room).emit("userTyping", {
      senderEmail: socket.userEmail,
      isTyping
    });
  });

  // Handle message read status
  socket.on("markAsRead", async (data) => {
    try {
      const { senderEmail, receiverEmail } = data;
      await Message.markAsRead(senderEmail, receiverEmail);
      
      // Update conversation unread count
      const conversation = await Conversation.findOne({
        conversationId: [senderEmail, receiverEmail].sort().join('_')
      });
      
      if (conversation) {
        await conversation.resetUnread();
      }
      
      // Notify sender that messages were read
      const room = [senderEmail, receiverEmail].sort().join("-");
      io.to(room).emit("messagesRead", {
        senderEmail,
        receiverEmail,
        readAt: new Date()
      });
      
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
    if (socket.userEmail) {
      activeUsers.delete(socket.id);
      console.log(`User ${socket.userEmail} logged out`);
    }
  });
});



const PORT = 5000;
server.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
