import express from "express";
import crypto from "crypto";
import Message from "../models/Message.js";
import Conversation from "../models/Conversation.js";
import Friend from "../models/Friend.js";
import Connections from "../models/Connections.js";
import Signup from "../models/signup.js";

// Encryption key (must match Message.js)
const ENCRYPTION_KEY = process.env.MESSAGE_ENCRYPTION_KEY || "your-32-character-secret-key-here!";

// Helper to get 32-byte key buffer
const getKeyBuffer = (key) => {
  const buf = Buffer.alloc(32);
  const keyBuf = Buffer.from(key);
  if (keyBuf.length > 32) {
    keyBuf.copy(buf, 0, 0, 32);
  } else {
    keyBuf.copy(buf, 0);
  }
  return buf;
};

const keyBuffer = getKeyBuffer(ENCRYPTION_KEY);

const router = express.Router();

// Get all conversations for a user
router.get("/conversations/:email", async (req, res) => {
  try {
    const { email } = req.params;
    
    // First, get user's connections (friends)
    const userConnections = await Connections.findOne({ email });
    if (!userConnections) {
      return res.json([]);
    }
    
    // Create conversations for all friends if they don't exist
    for (const friendEmail of userConnections.connections) {
      const conversationId = [email, friendEmail].sort().join('_');
      const existingConv = await Conversation.findOne({ conversationId });
      
      if (!existingConv) {
        await Conversation.create({
          participants: [email, friendEmail],
          conversationId,
          lastMessage: null,
          unreadCount: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        console.log(`Created conversation between ${email} and ${friendEmail}`);
      }
    }
    
    // Now get all conversations where the user is a participant
    const conversations = await Conversation.find({
      participants: email,
      isActive: true
    })
    .sort({ updatedAt: -1 })
    .lean();

    // Populate conversation details with friend info
    const conversationsWithDetails = await Promise.all(
      conversations.map(async (conv) => {
        // Find the other participant (not the current user)
        const otherParticipant = conv.participants.find(p => p !== email);
        
        // Get friend details
        const friend = await Signup.findOne({ email: otherParticipant });
        
        return {
          ...conv,
          friend: {
            email: otherParticipant,
            username: friend?.username || otherParticipant.split('@')[0],
            name: friend?.name || otherParticipant.split('@')[0],
            image: friend?.image ? `data:${friend.image.contentType};base64,${friend.image.data.toString("base64")}` : null
          }
        };
      })
    );

    res.json(conversationsWithDetails);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Failed to fetch conversations" });
  }
});

// Get messages for a specific conversation
router.get("/messages/:email1/:email2", async (req, res) => {
  try {
    const { email1, email2 } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const messages = await Message.getConversationMessages(
      email1, 
      email2, 
      parseInt(limit)
    );

    // Decrypt messages for the client
    const decryptedMessages = messages.map(msg => ({
      ...msg,
      message: msg.encryptedMessage ?
        (() => {
          try {
            const textParts = msg.encryptedMessage.split(':');
            const iv = Buffer.from(textParts.shift(), 'hex');
            const encryptedData = textParts.join(':');
            const crypto = require('crypto');
            const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(process.env.MESSAGE_ENCRYPTION_KEY || "your-32-character-secret-key-here!"), iv);
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
          } catch (error) {
            console.error("Decryption error:", error);
            return msg.message; // Fallback to original message
          }
        })() : msg.message
    }));

    res.json(decryptedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// Send a new message
router.post("/send", async (req, res) => {
  try {
    const { senderEmail, receiverEmail, message, messageType = 'text' } = req.body;

    if (!senderEmail || !receiverEmail || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if users are friends using Connections collection
    const senderConnections = await Connections.findOne({ email: senderEmail });
    const receiverConnections = await Connections.findOne({ email: receiverEmail });
    
    if (!senderConnections || !receiverConnections) {
      return res.status(403).json({ error: "User connections not found" });
    }
    
    if (!senderConnections.connections.includes(receiverEmail) || 
        !receiverConnections.connections.includes(senderEmail)) {
      return res.status(403).json({ error: "Users are not friends" });
    }

    // Create conversation if it doesn't exist
    const conversation = await Conversation.getOrCreateConversation(senderEmail, receiverEmail);

    // Create new message
    const newMessage = new Message({
      senderEmail,
      receiverEmail,
      message,
      messageType,
      conversationId: conversation.conversationId
    });

    await newMessage.save();

    // Update conversation with last message
    await conversation.updateLastMessage(message, senderEmail);

    // Increment unread count for receiver
    await conversation.incrementUnread();

    res.json({
      success: true,
      message: {
        _id: newMessage._id,
        senderEmail: newMessage.senderEmail,
        receiverEmail: newMessage.receiverEmail,
        message: newMessage.message,
        messageType: newMessage.messageType,
        timestamp: newMessage.timestamp,
        conversationId: newMessage.conversationId
      }
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Mark messages as read
router.put("/mark-read", async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.body;

    if (!senderEmail || !receiverEmail) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Mark messages as read
    await Message.markAsRead(senderEmail, receiverEmail);

    // Reset unread count in conversation
    const conversation = await Conversation.findOne({
      conversationId: [senderEmail, receiverEmail].sort().join('_')
    });

    if (conversation) {
      await conversation.resetUnread();
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error marking messages as read:", error);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
});

// Get unread message count for a user
router.get("/unread-count/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const unreadCount = await Message.countDocuments({
      receiverEmail: email,
      isRead: false,
      isDeleted: false
    });

    res.json({ unreadCount });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ error: "Failed to get unread count" });
  }
});

// Delete a message
router.delete("/message/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { userEmail } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only sender can delete their message
    if (message.senderEmail !== userEmail) {
      return res.status(403).json({ error: "Unauthorized to delete this message" });
    }

    // Soft delete
    message.isDeleted = true;
    message.deletedAt = new Date();
    await message.save();

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Failed to delete message" });
  }
});

// Edit a message
router.put("/message/:messageId", async (req, res) => {
  try {
    const { messageId } = req.params;
    const { newMessage, userEmail } = req.body;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // Only sender can edit their message
    if (message.senderEmail !== userEmail) {
      return res.status(403).json({ error: "Unauthorized to edit this message" });
    }

    // Update message
    message.message = newMessage;
    message.isEdited = true;
    message.editedAt = new Date();
    await message.save();

    res.json({ success: true, message });
  } catch (error) {
    console.error("Error editing message:", error);
    res.status(500).json({ error: "Failed to edit message" });
  }
});

// Helper function to create conversations for all existing friendships
router.post("/create-conversations-for-friendships", async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Get user's connections
    const userConnections = await Connections.findOne({ email });
    if (!userConnections) {
      return res.status(404).json({ error: "User connections not found" });
    }

    const createdConversations = [];

    // Create conversations for all friends
    for (const friendEmail of userConnections.connections) {
      const conversationId = [email, friendEmail].sort().join('_');
      const existingConv = await Conversation.findOne({ conversationId });
      
      if (!existingConv) {
        const newConversation = await Conversation.create({
          participants: [email, friendEmail],
          conversationId,
          lastMessage: null,
          unreadCount: 0,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        createdConversations.push(newConversation);
        console.log(`Created conversation between ${email} and ${friendEmail}`);
      }
    }

    res.json({
      success: true,
      message: `Created ${createdConversations.length} new conversations`,
      createdConversations: createdConversations.length
    });
  } catch (error) {
    console.error("Error creating conversations:", error);
    res.status(500).json({ error: "Failed to create conversations" });
  }
});

export default router;
