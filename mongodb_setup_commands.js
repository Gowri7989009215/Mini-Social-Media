// MongoDB Shell Commands for Mini Social Media Messaging System
// Run these commands in MongoDB shell (mongosh)

// Switch to the database
use msm_pro

// Create collections
db.createCollection("messages")
db.createCollection("conversations")
db.createCollection("users")
db.createCollection("posts")
db.createCollection("friends")
db.createCollection("connections")

// Create indexes for messages collection
db.messages.createIndex({ "conversationId": 1, "timestamp": -1 })
db.messages.createIndex({ "senderEmail": 1, "receiverEmail": 1 })
db.messages.createIndex({ "isRead": 1, "receiverEmail": 1 })
db.messages.createIndex({ "conversationId": 1, "timestamp": -1, "isDeleted": 1 })
db.messages.createIndex({ "senderEmail": 1, "status": 1 })

// Create indexes for conversations collection
db.conversations.createIndex({ "participants": 1 })
db.conversations.createIndex({ "conversationId": 1 })
db.conversations.createIndex({ "updatedAt": -1 })
db.conversations.createIndex({ "participants": 1, "updatedAt": -1 })

// Create indexes for users collection
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "name": "text", "username": "text", "bio": "text" })

// Create indexes for friends collection
db.friends.createIndex({ "senderEmail": 1, "receiverEmail": 1 }, { unique: true })
db.friends.createIndex({ "status": 1 })
db.friends.createIndex({ "senderEmail": 1, "status": 1 })
db.friends.createIndex({ "receiverEmail": 1, "status": 1 })

// Create indexes for connections collection
db.connections.createIndex({ "email": 1 }, { unique: true })

// Create indexes for posts collection
db.posts.createIndex({ "email": 1, "createdAt": -1 })
db.posts.createIndex({ "createdAt": -1 })

// Insert sample users (with hashed passwords)
db.users.insertMany([
  {
    name: "John Doe",
    email: "john@example.com",
    username: "johndoe",
    password: "$2b$10$rQZ8K9mN2pL3oI4uY5vW6eR7tY8uI9oP0qA1sB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4",
    bio: "Hello, I'm John! Welcome to my profile.",
    gender: "Male",
    dob: new Date("1990-01-15"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Jane Smith",
    email: "jane@example.com", 
    username: "janesmith",
    password: "$2b$10$rQZ8K9mN2pL3oI4uY5vW6eR7tY8uI9oP0qA1sB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4",
    bio: "Nice to meet you! I love connecting with new people.",
    gender: "Female",
    dob: new Date("1992-05-20"),
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    name: "Mike Johnson",
    email: "mike@example.com",
    username: "mikej",
    password: "$2b$10$rQZ8K9mN2pL3oI4uY5vW6eR7tY8uI9oP0qA1sB2cD3eF4gH5iJ6kL7mN8oP9qR0sT1uV2wX3yZ4",
    bio: "Tech enthusiast and social media lover!",
    gender: "Male",
    dob: new Date("1988-12-10"),
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

// Insert sample connections (friendships)
db.connections.insertMany([
  {
    email: "john@example.com",
    connections: ["jane@example.com", "mike@example.com"],
    createdAt: new Date()
  },
  {
    email: "jane@example.com", 
    connections: ["john@example.com", "mike@example.com"],
    createdAt: new Date()
  },
  {
    email: "mike@example.com",
    connections: ["john@example.com", "jane@example.com"],
    createdAt: new Date()
  }
])

// Insert sample friend requests
db.friends.insertMany([
  {
    senderEmail: "john@example.com",
    receiverEmail: "jane@example.com",
    status: "accepted",
    createdAt: new Date()
  },
  {
    senderEmail: "jane@example.com",
    receiverEmail: "john@example.com",
    status: "accepted",
    createdAt: new Date()
  },
  {
    senderEmail: "john@example.com",
    receiverEmail: "mike@example.com",
    status: "accepted",
    createdAt: new Date()
  },
  {
    senderEmail: "mike@example.com",
    receiverEmail: "john@example.com",
    status: "accepted",
    createdAt: new Date()
  },
  {
    senderEmail: "jane@example.com",
    receiverEmail: "mike@example.com",
    status: "accepted",
    createdAt: new Date()
  },
  {
    senderEmail: "mike@example.com",
    receiverEmail: "jane@example.com",
    status: "accepted",
    createdAt: new Date()
  }
])

// Insert sample conversations
db.conversations.insertMany([
  {
    participants: ["john@example.com", "jane@example.com"],
    conversationId: "jane@example.com_john@example.com",
    lastMessage: {
      content: "Hey Jane! How are you doing?",
      senderEmail: "john@example.com",
      timestamp: new Date()
    },
    unreadCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    participants: ["john@example.com", "mike@example.com"],
    conversationId: "john@example.com_mike@example.com",
    lastMessage: {
      content: "Great to connect with you Mike!",
      senderEmail: "john@example.com",
      timestamp: new Date()
    },
    unreadCount: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    participants: ["jane@example.com", "mike@example.com"],
    conversationId: "jane@example.com_mike@example.com",
    lastMessage: {
      content: "Thanks for the friend request!",
      senderEmail: "jane@example.com",
      timestamp: new Date()
    },
    unreadCount: 0,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
])

// Insert sample messages (encrypted)
db.messages.insertMany([
  {
    senderEmail: "john@example.com",
    receiverEmail: "jane@example.com",
    message: "Hey Jane! How are you doing?",
    encryptedMessage: "encrypted_message_content_here",
    messageType: "text",
    isRead: true,
    readAt: new Date(),
    conversationId: "jane@example.com_john@example.com",
    timestamp: new Date(),
    isEdited: false,
    isDeleted: false
  },
  {
    senderEmail: "jane@example.com",
    receiverEmail: "john@example.com",
    message: "Hi John! I'm doing great, thanks for asking!",
    encryptedMessage: "encrypted_message_content_here",
    messageType: "text",
    isRead: true,
    readAt: new Date(),
    conversationId: "jane@example.com_john@example.com",
    timestamp: new Date(),
    isEdited: false,
    isDeleted: false
  },
  {
    senderEmail: "john@example.com",
    receiverEmail: "mike@example.com",
    message: "Great to connect with you Mike!",
    encryptedMessage: "encrypted_message_content_here",
    messageType: "text",
    isRead: false,
    conversationId: "john@example.com_mike@example.com",
    timestamp: new Date(),
    isEdited: false,
    isDeleted: false
  },
  {
    senderEmail: "jane@example.com",
    receiverEmail: "mike@example.com",
    message: "Thanks for the friend request!",
    encryptedMessage: "encrypted_message_content_here",
    messageType: "text",
    isRead: true,
    readAt: new Date(),
    conversationId: "jane@example.com_mike@example.com",
    timestamp: new Date(),
    isEdited: false,
    isDeleted: false
  }
])

// Insert sample posts
db.posts.insertMany([
  {
    email: "john@example.com",
    caption: "Beautiful sunset today! 🌅",
    likes: 5,
    comments: [
      {
        email: "jane@example.com",
        text: "Amazing shot!",
        timestamp: new Date()
      }
    ],
    createdAt: new Date()
  },
  {
    email: "jane@example.com",
    caption: "Coffee and coding ☕️💻",
    likes: 8,
    comments: [
      {
        email: "john@example.com",
        text: "Same here!",
        timestamp: new Date()
      }
    ],
    createdAt: new Date()
  },
  {
    email: "mike@example.com",
    caption: "New project in the works! 🚀",
    likes: 12,
    comments: [],
    createdAt: new Date()
  }
])

// Verify collections and indexes
print("=== Collections Created ===")
db.getCollectionNames().forEach(collection => {
  print(`✓ ${collection}`)
})

print("\n=== Indexes Created ===")
db.messages.getIndexes().forEach(index => {
  print(`✓ messages: ${index.name}`)
})

db.conversations.getIndexes().forEach(index => {
  print(`✓ conversations: ${index.name}`)
})

db.users.getIndexes().forEach(index => {
  print(`✓ users: ${index.name}`)
})

db.friends.getIndexes().forEach(index => {
  print(`✓ friends: ${index.name}`)
})

db.connections.getIndexes().forEach(index => {
  print(`✓ connections: ${index.name}`)
})

db.posts.getIndexes().forEach(index => {
  print(`✓ posts: ${index.name}`)
})

print("\n=== Sample Data Inserted ===")
print(`✓ Users: ${db.users.countDocuments()}`)
print(`✓ Connections: ${db.connections.countDocuments()}`)
print(`✓ Friends: ${db.friends.countDocuments()}`)
print(`✓ Conversations: ${db.conversations.countDocuments()}`)
print(`✓ Messages: ${db.messages.countDocuments()}`)
print(`✓ Posts: ${db.posts.countDocuments()}`)

print("\n🎉 Database setup completed successfully!")
print("You can now start your messaging application!")
