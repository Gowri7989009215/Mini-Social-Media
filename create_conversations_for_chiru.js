// Test script to create conversations for Chiru
// Run this in your browser console or as a separate API call

// Method 1: Using fetch API in browser console
fetch('http://localhost:5000/api/messages/create-conversations-for-friendships', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'chiru@example.com' // Replace with Chiru's actual email
  })
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
})
.catch(error => {
  console.error('Error:', error);
});

// Method 2: Direct MongoDB commands (run in MongoDB shell)
/*
use msm_pro

// Get Chiru's friends
var chiruConnections = db.connections.findOne({ email: "chiru@example.com" });
print("Chiru's friends:", chiruConnections.connections);

// Create conversations for each friend
chiruConnections.connections.forEach(function(friendEmail) {
  var conversationId = ["chiru@example.com", friendEmail].sort().join('_');
  var existingConv = db.conversations.findOne({ conversationId: conversationId });
  
  if (!existingConv) {
    db.conversations.insertOne({
      participants: ["chiru@example.com", friendEmail],
      conversationId: conversationId,
      lastMessage: null,
      unreadCount: 0,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    print("Created conversation between chiru@example.com and " + friendEmail);
  } else {
    print("Conversation already exists between chiru@example.com and " + friendEmail);
  }
});

// Verify conversations were created
print("\n=== Chiru's Conversations ===");
db.conversations.find({ participants: "chiru@example.com" }).forEach(function(conv) {
  print("Conversation ID: " + conv.conversationId);
  print("Participants: " + conv.participants);
  print("---");
});
*/
