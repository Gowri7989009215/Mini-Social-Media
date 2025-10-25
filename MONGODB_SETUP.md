# MongoDB Database Setup for Mini Social Media Messaging System

## Prerequisites
- MongoDB installed and running on your system
- Node.js and npm installed

## Database Setup Steps

### 1. Install MongoDB
If you haven't installed MongoDB yet:

**Windows:**
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the setup wizard
3. Start MongoDB service: `net start MongoDB`

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb/brew/mongodb-community
```

**Linux (Ubuntu/Debian):**
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 2. Create Database and Collections

Connect to MongoDB using MongoDB Compass or MongoDB Shell:

```bash
mongosh
```

Create the database and collections:

```javascript
// Switch to the database
use msm_pro

// Create collections with proper indexes
db.createCollection("messages")
db.createCollection("conversations")
db.createCollection("users")
db.createCollection("posts")
db.createCollection("friends")
db.createCollection("connections")

// Create indexes for optimal performance
db.messages.createIndex({ "conversationId": 1, "timestamp": -1 })
db.messages.createIndex({ "senderEmail": 1, "receiverEmail": 1 })
db.messages.createIndex({ "isRead": 1, "receiverEmail": 1 })

db.conversations.createIndex({ "participants": 1 })
db.conversations.createIndex({ "conversationId": 1 })
db.conversations.createIndex({ "updatedAt": -1 })

db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })

db.friends.createIndex({ "senderEmail": 1, "receiverEmail": 1 }, { unique: true })
db.friends.createIndex({ "status": 1 })

db.connections.createIndex({ "email": 1 }, { unique: true })
```

### 3. Environment Variables Setup

Create a `.env` file in your server directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://127.0.0.1:27017/msm_pro

# Message Encryption Key (32 characters)
MESSAGE_ENCRYPTION_KEY=your-32-character-secret-key-here!

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret (if using JWT authentication)
JWT_SECRET=your-jwt-secret-key-here
```

### 4. Database Schema Overview

#### Messages Collection
```javascript
{
  _id: ObjectId,
  senderEmail: String,
  receiverEmail: String,
  message: String,
  encryptedMessage: String,
  messageType: String, // 'text', 'image', 'file'
  isRead: Boolean,
  readAt: Date,
  conversationId: String,
  timestamp: Date,
  editedAt: Date,
  isEdited: Boolean,
  isDeleted: Boolean,
  deletedAt: Date
}
```

#### Conversations Collection
```javascript
{
  _id: ObjectId,
  participants: [String], // Array of email addresses
  conversationId: String,
  lastMessage: {
    content: String,
    senderEmail: String,
    timestamp: Date
  },
  unreadCount: Number,
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  username: String,
  password: String, // Hashed
  dob: Date,
  gender: String,
  bio: String,
  image: Object, // Multer file object
  createdAt: Date,
  updatedAt: Date
}
```

#### Friends Collection
```javascript
{
  _id: ObjectId,
  senderEmail: String,
  receiverEmail: String,
  status: String, // 'pending', 'accepted', 'rejected'
  createdAt: Date
}
```

#### Connections Collection
```javascript
{
  _id: ObjectId,
  email: String,
  connections: [String] // Array of friend emails
}
```

### 5. Sample Data Insertion

Insert some sample data for testing:

```javascript
// Sample users
db.users.insertMany([
  {
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    password: "$2b$10$hashedpassword", // Use bcrypt to hash
    bio: "Hello, I'm John!",
    createdAt: new Date()
  },
  {
    name: "Jane Smith",
    email: "jane@example.com", 
    username: "janesmith",
    password: "$2b$10$hashedpassword",
    bio: "Nice to meet you!",
    createdAt: new Date()
  }
])

// Sample connections
db.connections.insertMany([
  {
    email: "john@example.com",
    connections: ["jane@example.com"]
  },
  {
    email: "jane@example.com", 
    connections: ["john@example.com"]
  }
])

// Sample conversation
db.conversations.insertOne({
  participants: ["john@example.com", "jane@example.com"],
  conversationId: "john@example.com_jane@example.com",
  lastMessage: {
    content: "Hello Jane!",
    senderEmail: "john@example.com",
    timestamp: new Date()
  },
  unreadCount: 0,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### 6. Database Backup and Restore

**Create Backup:**
```bash
mongodump --db msm_pro --out ./backup
```

**Restore Backup:**
```bash
mongorestore --db msm_pro ./backup/msm_pro
```

### 7. Performance Optimization

Add these additional indexes for better performance:

```javascript
// Compound indexes
db.messages.createIndex({ "conversationId": 1, "timestamp": -1, "isDeleted": 1 })
db.conversations.createIndex({ "participants": 1, "updatedAt": -1 })
db.friends.createIndex({ "senderEmail": 1, "status": 1 })
db.friends.createIndex({ "receiverEmail": 1, "status": 1 })

// Text search index for user search
db.users.createIndex({ "name": "text", "username": "text", "bio": "text" })
```

### 8. Security Considerations

1. **Encryption**: Messages are encrypted using AES-256-CBC before storage
2. **Authentication**: Implement proper user authentication
3. **Authorization**: Only friends can message each other
4. **Input Validation**: Validate all inputs on both client and server
5. **Rate Limiting**: Implement rate limiting for message sending

### 9. Monitoring and Maintenance

**Check database status:**
```javascript
db.stats()
db.messages.countDocuments()
db.conversations.countDocuments()
```

**Clean up old messages (optional):**
```javascript
// Delete messages older than 1 year
db.messages.deleteMany({
  timestamp: { $lt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) }
})
```

### 10. Troubleshooting

**Common Issues:**

1. **Connection refused**: Make sure MongoDB is running
2. **Authentication failed**: Check your connection string
3. **Index errors**: Drop and recreate indexes if needed
4. **Memory issues**: Monitor MongoDB memory usage

**Useful Commands:**
```bash
# Check MongoDB status
sudo systemctl status mongod

# View MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Connect to MongoDB shell
mongosh --host localhost --port 27017
```

## API Endpoints for Messaging

The following API endpoints are available:

- `GET /api/messages/conversations/:email` - Get all conversations
- `GET /api/messages/messages/:email1/:email2` - Get messages between two users
- `POST /api/messages/send` - Send a new message
- `PUT /api/messages/mark-read` - Mark messages as read
- `GET /api/messages/unread-count/:email` - Get unread message count
- `DELETE /api/messages/message/:messageId` - Delete a message
- `PUT /api/messages/message/:messageId` - Edit a message

## Socket.io Events

- `userLogin` - User logs in
- `joinRoom` - Join a conversation room
- `sendMessage` - Send a message
- `receiveMessage` - Receive a message
- `typing` - Typing indicator
- `markAsRead` - Mark messages as read
- `userTyping` - User is typing
- `messagesRead` - Messages were read

This setup provides a complete, secure, and scalable messaging system for your Mini Social Media application!
