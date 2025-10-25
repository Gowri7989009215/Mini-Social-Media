import mongoose from "mongoose";
import crypto from "crypto";

// Encryption key (in production, use environment variables)
const ENCRYPTION_KEY = process.env.MESSAGE_ENCRYPTION_KEY || "your-32-character-secret-key-here!";
const ALGORITHM = 'aes-256-cbc';

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

// Encryption function
const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, keyBuffer, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

// Decryption function
const decrypt = (encryptedText) => {
  const textParts = encryptedText.split(':');
  const iv = Buffer.from(textParts.shift(), 'hex');
  const encryptedData = textParts.join(':');
  const decipher = crypto.createDecipheriv(ALGORITHM, keyBuffer, iv);
  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

const messageSchema = new mongoose.Schema({
  senderEmail: { type: String, required: true },
  receiverEmail: { type: String, required: true },
  message: { type: String, required: true },
  encryptedMessage: { type: String },
  messageType: { 
    type: String, 
    enum: ['text', 'image', 'file'], 
    default: 'text' 
  },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date },
  conversationId: { type: String, required: true }, // Unique ID for each conversation
  timestamp: { type: Date, default: Date.now },
  editedAt: { type: Date },
  isEdited: { type: Boolean, default: false },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date }
});

// Pre-save middleware to encrypt message
messageSchema.pre('save', function(next) {
  if (this.isModified('message') && !this.encryptedMessage) {
    this.encryptedMessage = encrypt(this.message);
  }
  next();
});

// Virtual for decrypted message
messageSchema.virtual('decryptedMessage').get(function() {
  return this.encryptedMessage ? decrypt(this.encryptedMessage) : this.message;
});

// Index for efficient queries
messageSchema.index({ conversationId: 1, timestamp: -1 });
messageSchema.index({ senderEmail: 1, receiverEmail: 1 });
messageSchema.index({ isRead: 1, receiverEmail: 1 });

// Static method to get conversation ID
messageSchema.statics.getConversationId = function(email1, email2) {
  return [email1, email2].sort().join('_');
};

// Static method to get messages for a conversation
messageSchema.statics.getConversationMessages = async function(email1, email2, limit = 50) {
  const conversationId = this.getConversationId(email1, email2);
  return this.find({ 
    conversationId,
    isDeleted: false 
  })
  .sort({ timestamp: -1 })
  .limit(limit)
  .lean();
};

// Static method to mark messages as read
messageSchema.statics.markAsRead = async function(senderEmail, receiverEmail) {
  const conversationId = this.getConversationId(senderEmail, receiverEmail);
  return this.updateMany(
    { 
      conversationId,
      senderEmail,
      receiverEmail,
      isRead: false 
    },
    { 
      isRead: true, 
      readAt: new Date() 
    }
  );
};

export default mongoose.model("Message", messageSchema);
