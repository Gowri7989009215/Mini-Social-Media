import mongoose from "mongoose";
import Signup from "./models/signup.js";
import Connections from "./models/Connections.js";

// ================= MONGODB CONNECTION =================
mongoose
  .connect("mongodb://127.0.0.1:27017/msm_pro", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

async function initializeConnections() {
  try {
    const allUsers = await Signup.find();

    for (const user of allUsers) {
      const exists = await Connections.findOne({ email: user.email });

      if (!exists) {
        await Connections.create({ email: user.email, connections: [] });
        console.log(`✅ Connections initialized for ${user.email}`);
      } else {
        console.log(`ℹ️ Connections already exist for ${user.email}`);
      }
    }

    console.log("🎉 All users processed!");
    mongoose.connection.close(); // Close DB connection
  } catch (err) {
    console.error("Error initializing connections:", err);
  }
}

// Run the function
initializeConnections();
