import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{ type: String, required: true }], // Array of email addresses
  conversationId: { type: String, required: true, unique: true },
  lastMessage: {
    content: String,
    senderEmail: String,
    timestamp: { type: Date, default: Date.now }
  },
  unreadCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Static method to get or create conversation
conversationSchema.statics.getOrCreateConversation = async function(email1, email2) {
  const conversationId = [email1, email2].sort().join('_');
  
  let conversation = await this.findOne({ conversationId });
  
  if (!conversation) {
    conversation = new this({
      participants: [email1, email2],
      conversationId,
      lastMessage: null,
      unreadCount: 0
    });
    await conversation.save();
  }
  
  return conversation;
};

// Method to update last message
conversationSchema.methods.updateLastMessage = async function(content, senderEmail) {
  this.lastMessage = {
    content,
    senderEmail,
    timestamp: new Date()
  };
  this.updatedAt = new Date();
  await this.save();
};

// Method to increment unread count
conversationSchema.methods.incrementUnread = async function() {
  this.unreadCount += 1;
  await this.save();
};

// Method to reset unread count
conversationSchema.methods.resetUnread = async function() {
  this.unreadCount = 0;
  await this.save();
};

// Index for efficient queries
conversationSchema.index({ participants: 1 });
conversationSchema.index({ conversationId: 1 });
conversationSchema.index({ updatedAt: -1 });

export default mongoose.model("Conversation", conversationSchema);
