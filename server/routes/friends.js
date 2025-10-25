// Send Friend Request (already in your routes/friends.js)
router.post("/request", async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.body;

    if (senderEmail === receiverEmail) {
      return res.status(400).json({ message: "You cannot send request to yourself" });
    }

    const existing = await Friend.findOne({ senderEmail, receiverEmail });
    if (existing) {
      return res.status(400).json({ message: "Request already exists" });
    }

    const request = new Friend({ senderEmail, receiverEmail, status: "pending" });
    await request.save();

    res.json({ message: "Friend request sent", request });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
