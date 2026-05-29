import { toast } from "react-toastify";
import "./Chat.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const API_URL = process.env.REACT_APP_API_URL || "https://teamtask-backend-pdvc.onrender.com";

const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id;
  } catch {
    return null;
  }
};

function Chat() {
  const [contacts, setContacts] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [unreadCounts, setUnreadCounts] = useState({});
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const currentUserId = getUserIdFromToken();

  // Connect to socket on mount
  useEffect(() => {
    const newSocket = io(API_URL);
    setSocket(newSocket);

    if (currentUserId) {
      newSocket.emit("join", currentUserId);
    }

    return () => {
      newSocket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for new messages
  useEffect(() => {
    if (!socket) return;

    socket.on("new_message", (message) => {
      const senderId = message.sender?._id;
      const receiverId = message.receiver?._id;

      // Check if message belongs to current conversation
      const isCurrentChat =
        selectedContact &&
        ((senderId === selectedContact._id && receiverId === currentUserId) ||
         (senderId === currentUserId && receiverId === selectedContact._id));

      if (isCurrentChat) {
        setMessages((prev) => [...prev, message]);

        // If we're viewing this chat, mark the incoming message as read immediately
        // (don't increment unread count for our own chat)
        if (senderId !== currentUserId) {
          markAsRead(selectedContact._id, false);
        }
      } else if (senderId !== currentUserId) {
        // Message from someone else — increment unread count
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1
        }));
      }

      // Update conversations list in background
      fetchConversations();
    });

    return () => {
      socket.off("new_message");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, selectedContact]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch contacts (all users except current)
  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { authorization: token }
      });
      if (Array.isArray(response.data)) {
        setContacts(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch conversations (for last message previews + unread counts)
  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/conversations`, {
        headers: { authorization: token }
      });
      if (Array.isArray(response.data)) {
        setConversations(response.data);
        // Build unread count map from conversations
        const counts = {};
        response.data.forEach((conv) => {
          if (conv.unreadCount > 0) {
            counts[conv._id] = conv.unreadCount;
          }
        });
        setUnreadCounts(counts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Mark messages from a contact as read
  const markAsRead = async (contactId, showToast = true) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_URL}/api/messages/read/${contactId}`, {}, {
        headers: { authorization: token }
      });
      // Clear unread count for this contact locally
      setUnreadCounts((prev) => {
        const updated = { ...prev };
        delete updated[contactId];
        return updated;
      });
    } catch (error) {
      if (showToast) {
        console.log("Failed to mark messages as read");
      }
    }
  };

  // Fetch data on mount
  useEffect(() => {
    fetchContacts();
    fetchConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Go back to contacts list on mobile
  const goBackToContacts = () => {
    setShowMobileChat(false);
  };

  // Fetch messages between current user and selected contact
  const selectContact = async (contact) => {
    setSelectedContact(contact);
    setLoadingMessages(true);
    // On mobile, switch to chat view
    setShowMobileChat(true);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/api/messages/${contact._id}`, {
        headers: { authorization: token }
      });
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load messages");
    }

    setLoadingMessages(false);

    // Mark messages from this contact as read
    markAsRead(contact._id);
  };

  // Send a message
  const sendMessage = async () => {
    const text = newMessage.trim();
    if (!text || !selectedContact) return;

    setNewMessage("");

    // Create optimistic message object
    const optimisticMessage = {
      _id: "temp_" + Date.now(),
      sender: { _id: currentUserId, name: "You" },
      receiver: { _id: selectedContact._id, name: selectedContact.name },
      text,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    // Emit via socket — server saves to DB and forwards to receiver
    if (socket) {
      socket.emit("send_message", {
        senderId: currentUserId,
        receiverId: selectedContact._id,
        text
      });
    }
  };

  // Handle Enter key to send
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format message time
  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format conversation time (show date if older than today)
  const formatConversationTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();

    if (isToday) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    return date.toLocaleDateString([], { day: "numeric", month: "short" });
  };

  // Check if a contact has a conversation (has messages)
  const getConversationForContact = (contactId) => {
    return conversations.find((c) => c._id === contactId);
  };

  // Merge contacts with conversation data for sorting
  const sortedContacts = [...contacts].sort((a, b) => {
    const convA = getConversationForContact(a._id);
    const convB = getConversationForContact(b._id);

    // Contacts with conversations come first
    if (convA && !convB) return -1;
    if (!convA && convB) return 1;

    // Sort by last message time
    if (convA && convB) {
      return new Date(convB.lastMessageTime) - new Date(convA.lastMessageTime);
    }

    // Alphabetical for contacts with no messages
    return (a.name || a.email).localeCompare(b.name || b.email);
  });

  // Filter contacts by search
  const filteredContacts = sortedContacts.filter((contact) => {
    const q = searchTerm.toLowerCase();
    return (
      (contact.name || "").toLowerCase().includes(q) ||
      (contact.email || "").toLowerCase().includes(q)
    );
  });

  // Get user's own name
  const currentUserName = localStorage.getItem("userName") || "You";

  return (
    <div className={`chat-layout${showMobileChat ? " mobile-chat-open" : ""}`}>
      {/* ===== CONTACTS PANEL ===== */}
      <div className="chat-contacts-panel">
        <div className="chat-contacts-header">
          <h2 className="chat-contacts-title">💬 Chats</h2>
        </div>

        <div className="chat-search-box">
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="chat-search-input"
          />
        </div>

        <div className="chat-contacts-list">
          {filteredContacts.length === 0 ? (
            <div className="chat-no-contacts">
              {searchTerm ? "No contacts match your search" : "No other users found"}
            </div>
          ) : (
            filteredContacts.map((contact) => {
              const conv = getConversationForContact(contact._id);
              const isSelected = selectedContact?._id === contact._id;

              const unread = unreadCounts[contact._id] || 0;

              return (
                <div
                  key={contact._id}
                  className={`chat-contact-item ${isSelected ? "chat-contact-active" : ""}`}
                  onClick={() => selectContact(contact)}
                >
                  <div className="chat-contact-avatar">
                    {(contact.name || contact.email).charAt(0).toUpperCase()}
                  </div>
                  <div className="chat-contact-info">
                    <div className="chat-contact-top">
                      <span className="chat-contact-name">
                        {contact.name || "Unnamed"}
                        {unread > 0 && (
                          <span className="chat-unread-dot" />
                        )}
                      </span>
                      {conv && (
                        <span className="chat-contact-time">
                          {formatConversationTime(conv.lastMessageTime)}
                        </span>
                      )}
                    </div>
                    <div className="chat-contact-preview">
                      {conv ? (
                        <>
                          <span className="chat-preview-sender">
                            {conv.lastMessageFromMe ? "You: " : ""}
                          </span>
                          <span className="chat-preview-text">{conv.lastMessage}</span>
                        </>
                      ) : (
                        <span className="chat-preview-text chat-preview-empty">No messages yet</span>
                      )}
                    </div>
                  </div>
                  {unread > 0 && (
                    <div className="chat-unread-badge">
                      {unread > 99 ? "99+" : unread}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ===== CHAT PANEL ===== */}
      <div className="chat-messages-panel">
        {!selectedContact ? (
          <div className="chat-empty-state">
            <div className="chat-empty-icon">💬</div>
            <h3 className="chat-empty-title">TeamTask Chat</h3>
            <p className="chat-empty-desc">
              Select a contact from the left to start chatting
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="chat-messages-header">
              <div className="chat-messages-header-left">
                <button className="chat-back-btn" onClick={goBackToContacts} aria-label="Back to contacts">
                  ←
                </button>
                <div className="chat-contact-avatar chat-header-avatar">
                  {(selectedContact.name || selectedContact.email).charAt(0).toUpperCase()}
                </div>
                <div className="chat-header-info">
                  <span className="chat-header-name">{selectedContact.name || "Unnamed"}</span>
                  <span className="chat-header-email">{selectedContact.email}</span>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="chat-messages-area">
              {loadingMessages ? (
                <div className="chat-loading-msg">
                  <span className="chat-spinner" />
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-no-messages">
                  <p>No messages yet. Say hello! 👋</p>
                </div>
              ) : (
                <>
                  {messages.map((msg) => {
                    const isMine = msg.sender?._id === currentUserId;

                    return (
                      <div
                        key={msg._id}
                        className={`chat-msg-row ${isMine ? "chat-msg-mine" : "chat-msg-theirs"}`}
                      >
                        <div className={`chat-msg-bubble ${isMine ? "bubble-mine" : "bubble-theirs"}`}>
                          <div className="chat-msg-text">{msg.text}</div>
                          <div className="chat-msg-time">
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <div className="chat-input-bar">
              <input
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="chat-input"
              />
              <button
                className={`chat-send-btn ${!newMessage.trim() ? "chat-send-disabled" : ""}`}
                onClick={sendMessage}
                disabled={!newMessage.trim()}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Chat;
