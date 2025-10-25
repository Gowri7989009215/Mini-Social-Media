import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import io from "socket.io-client";
import "./Message.css";

const socket = io("http://localhost:5000");

export default function Message() {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const userEmail = localStorage.getItem("userEmail");

  useEffect(() => {
    if (!userEmail) return;

    // Login user to socket
    socket.emit("userLogin", userEmail);

    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/messages/conversations/${userEmail}`);
        setConversations(response.data);
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [userEmail]);

  useEffect(() => {
    // Join all conversation rooms proactively
    conversations.forEach(conv => {
      const room = [userEmail, conv.friend.email].sort().join("-");
      socket.emit("joinRoom", room);
    });
  }, [conversations, userEmail]);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        console.log("Fetching messages for:", selectedConversation.friend.email);
        
        const response = await axios.get(
          `http://localhost:5000/api/messages/messages/${userEmail}/${selectedConversation.friend.email}`
        );
        
        console.log("Messages fetched:", response.data);
        setMessages(response.data.reverse());
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedConversation, userEmail]);

  useEffect(() => {
    // Socket event listeners
    socket.on("receiveMessage", (message) => {
      console.log("Received message via socket:", message);

      // Skip if it's our own message
      if (message.senderEmail === userEmail) return;

      // Update conversations list with new last message
      setConversations(prevConversations =>
        prevConversations.map(conv => {
          if (
            (conv.friend.email === message.senderEmail && message.receiverEmail === userEmail) ||
            (conv.friend.email === message.receiverEmail && message.senderEmail === userEmail)
          ) {
            return {
              ...conv,
              lastMessage: {
                content: message.message,
                timestamp: message.timestamp
              },
              unreadCount: conv.conversationId === selectedConversation?.conversationId ? 0 : conv.unreadCount + 1
            };
          }
          return conv;
        })
      );

      // Add to messages if it's the current conversation
      if (
        (message.senderEmail === userEmail && message.receiverEmail === selectedConversation?.friend.email) ||
        (message.senderEmail === selectedConversation?.friend.email && message.receiverEmail === userEmail)
      ) {
        // Check if message already exists to prevent duplicates
        setMessages(prev => {
          const exists = prev.some(msg => msg._id === message._id);
          if (!exists) {
            return [...prev, message];
          }
          return prev;
        });
        scrollToBottom();
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [selectedConversation, userEmail]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleConversationSelect = async (conversation) => {
    console.log("Selecting conversation:", conversation);

    // Clear current messages first
    setMessages([]);

    // Set the new conversation
    setSelectedConversation(conversation);

    // Join the room for this conversation
    const room = [userEmail, conversation.friend.email].sort().join("-");
    socket.emit("joinRoom", room);
    console.log("Joined room:", room);

    // Mark messages as read
    try {
      await axios.put("http://localhost:5000/api/messages/mark-read", {
        senderEmail: conversation.friend.email,
        receiverEmail: userEmail
      });

      // Update local conversations state to reset unread count
      setConversations(prevConversations =>
        prevConversations.map(conv =>
          conv.conversationId === conversation.conversationId
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sendingMessage) return;

    const messageText = newMessage.trim();
    console.log("Sending message:", { 
      senderEmail: userEmail,
      receiverEmail: selectedConversation.friend.email, 
      message: messageText 
    });
    
    setNewMessage("");
    setSendingMessage(true);

    try {
      // Send message via API (this will save to database and handle encryption)
      const response = await axios.post("http://localhost:5000/api/messages/send", {
        senderEmail: userEmail,
        receiverEmail: selectedConversation.friend.email,
        message: messageText,
        messageType: 'text'
      });

      console.log("API Response:", response.data);

      if (response.data.success) {
        // Add message to local state immediately for better UX
        const newMessageObj = {
          _id: response.data.message._id,
          senderEmail: userEmail,
          receiverEmail: selectedConversation.friend.email,
          message: messageText,
          timestamp: response.data.message.timestamp,
          conversationId: response.data.message.conversationId,
          isRead: false
        };
        
        setMessages(prev => [...prev, newMessageObj]);
        scrollToBottom();
        
        // Also emit to socket for real-time delivery
        socket.emit("sendMessage", {
          senderEmail: userEmail,
          receiverEmail: selectedConversation.friend.email,
          message: messageText,
          timestamp: new Date(),
          _id: response.data.message._id
        });

        // Update conversations list with new last message and reset unread count for current conversation
        setConversations(prevConversations =>
          prevConversations.map(conv =>
            conv.conversationId === selectedConversation.conversationId
              ? { ...conv, lastMessage: { content: messageText, timestamp: new Date() }, unreadCount: 0 }
              : conv
          )
        );
        
        console.log("Message sent successfully!");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      console.error("Error details:", error.response?.data);
      setNewMessage(messageText); // Restore message on error
      
      // Better error messages
      if (error.response?.status === 403) {
        alert("You can only message your friends. Please add this person as a friend first.");
      } else if (error.response?.status === 400) {
        alert("Invalid message. Please check your input.");
      } else {
        alert("Failed to send message. Please try again.");
      }
    } finally {
      setSendingMessage(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const formatLastMessage = (message) => {
    if (!message) return "No messages yet";
    return message.length > 50 ? message.substring(0, 50) + "..." : message;
  };

  const filteredConversations = conversations.filter(conv =>
    conv.friend.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="messaging-container">
        <div className="messaging-bg"></div>
        <div className="chat-loading">
          <div className="loading-spinner"></div>
          <span>Loading conversations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="messaging-container">
      <div className="messaging-bg"></div>
      
      {/* Chat List Sidebar */}
      <div className="chat-list-container">
        <div className="chat-list-header">
          <h2 className="chat-list-title">Messages</h2>
          <div className="chat-search">
            <span className="chat-search-icon">🔍</span>
            <input
              type="text"
              className="chat-search-input"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="chat-list">
          {filteredConversations.length === 0 ? (
            <div className="empty-chat">
              <div className="empty-chat-icon">💬</div>
              <div className="empty-chat-title">No conversations</div>
              <div className="empty-chat-subtitle">
                {searchQuery ? "No conversations match your search" : "Start a conversation with your friends"}
              </div>
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.conversationId}
                className={`chat-item ${selectedConversation?.conversationId === conversation.conversationId ? 'active' : ''}`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="chat-avatar">
                  {conversation.friend.image ? (
                    <img src={conversation.friend.image} alt={conversation.friend.name} />
                  ) : (
                    <span className="chat-avatar-initial">
                      {(conversation.friend.username?.charAt(0) || conversation.friend.name?.charAt(0) || "?").toUpperCase()}
                    </span>
                  )}
                  <div className="online-indicator"></div>
                </div>
                <div className="chat-info">
                  <div className="chat-name">{conversation.friend.name || conversation.friend.username}</div>
                  <div className="chat-last-message">
                    {formatLastMessage(conversation.lastMessage?.content)}
                  </div>
                  <div className="chat-meta">
                    <span className="chat-time">
                      {conversation.lastMessage?.timestamp ? formatTime(conversation.lastMessage.timestamp) : ""}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="unread-badge">{conversation.unreadCount}</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {selectedConversation ? (
          <>
            <div className="chat-header">
              <div className="chat-header-avatar">
                {selectedConversation.friend.image ? (
                  <img src={selectedConversation.friend.image} alt={selectedConversation.friend.name} />
                ) : (
                  <span className="chat-avatar-initial">
                    {(selectedConversation.friend.username?.charAt(0) || selectedConversation.friend.name?.charAt(0) || "?").toUpperCase()}
                  </span>
                )}
              </div>
              <div className="chat-header-info">
                <div className="chat-header-name">
                  {selectedConversation.friend.name || selectedConversation.friend.username}
                </div>
                <div className="chat-header-status">
                  <div className="status-dot"></div>
                  <span>Online</span>
                </div>
              </div>
              <div className="chat-actions">
                <button className="chat-action-btn" title="Call">
                  📞
                </button>
                <button className="chat-action-btn" title="Video Call">
                  📹
                </button>
                <button className="chat-action-btn" title="More">
                  ⋮
                </button>
              </div>
            </div>

            <div className="messages-container">
              {loadingMessages ? (
                <div className="chat-loading">
                  <div className="loading-spinner"></div>
                  <span>Loading messages...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="empty-chat">
                  <div className="empty-chat-icon">💬</div>
                  <div className="empty-chat-title">Start the conversation</div>
                  <div className="empty-chat-subtitle">
                    Send a message to {selectedConversation.friend.name || selectedConversation.friend.username}
                  </div>
                </div>
              ) : (
                messages.map((message, index) => (
                  <div
                    key={message._id || index}
                    className={`message ${message.senderEmail === userEmail ? 'sent' : 'received'}`}
                  >
                    <div className="message-content">{message.message}</div>
                    <div className="message-time">{formatTime(message.timestamp)}</div>
                    {message.senderEmail === userEmail && (
                      <div className="message-status">
                        <span className={`status-icon ${message.isRead ? 'read' : ''}`}>
                          {message.isRead ? '✓✓' : '✓'}
                        </span>
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="message-input-container">
              <div className="message-input-wrapper">
              <input
                  ref={inputRef}
                type="text"
                  className="message-input"
                  placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sendingMessage}
                />
                <button
                  className="message-send-btn"
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendingMessage}
                >
                  {sendingMessage ? "⏳" : "➤"}
              </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-chat">
            <div className="empty-chat-icon">💬</div>
            <div className="empty-chat-title">Welcome to Messages</div>
            <div className="empty-chat-subtitle">
              Select a conversation to start chatting with your friends
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
