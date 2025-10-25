import express from "express";
import Signup from "../models/signup.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { query, filter } = req.query;
    if (!query || query.trim() === "") return res.json([]);

    let searchCondition = {};
    if (filter === "email") {
      searchCondition = { email: { $regex: query, $options: "i" } };
    } else {
      searchCondition = { username: { $regex: query, $options: "i" } };
    }

    const users = await Signup.find(searchCondition).select("username email");
    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
