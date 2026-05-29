const cors = require("cors");
const adminMiddleware = require("./middleware/adminMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();
const Task = require("./models/Task");
const Message = require("./models/Message");
const mongoose = require("mongoose");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

connectDB();

// Socket.io - handle real-time chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join user to their personal room (userId)
  socket.on("join", (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Handle sending message
  socket.on("send_message", async (data) => {
    try {
      const { senderId, receiverId, text } = data;

      if (!senderId || !receiverId || !text) return;

      // Save message to DB
      const message = new Message({
        sender: senderId,
        receiver: receiverId,
        text
      });
      await message.save();

      const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name email")
        .populate("receiver", "name email");

      // Emit only to receiver — sender already has optimistic message on their end
      io.to(receiverId).emit("new_message", populatedMessage);

    } catch (error) {
      console.log("Socket send_message error:", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Backend Server Running");
});

// app.get("/tasks", (req, res) => {
//   res.send("TeamTask Backend Running");
// });

app.post("/tasks", authMiddleware, async (req, res) => {
  try {
    const newTask = new Task({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      projectName: req.body.projectName,
      user: req.user.id
    });

    await newTask.save();

    res.send("Task Saved Successfully");

  } catch (error) {
    console.log(error.message);

    res.status(400).send(error.message);
  }
});

app.get("/tasks", authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id
    });

    res.send(tasks);

  } catch (error) {
    console.log(error.message);

    res.status(500).send(error.message);
  }
});

app.put("/tasks/:id", async (req, res) => {

  try {

    await Task.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    res.send("Task Updated");

  } catch (error) {

    console.log(error.message);

    res.status(500).send(error.message);

  }

});

app.delete("/tasks/:id", async (req, res) => {
  try {

    await Task.findByIdAndDelete(req.params.id);

    res.send("Task Deleted");

  } catch (error) {
    console.log(error.message);

    res.status(500).send(error.message);
  }
});

app.post("/signup", async (req, res) => {
  try {

    const existingUser = await User.findOne({
      email: req.body.email
    });

    if (existingUser) {
      return res.send("User already exists");
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      10
    );

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    await newUser.save();

    res.send("User Registered Successfully");

  } catch (error) {

    console.log(error.message);

    res.status(500).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {

    const user = await User.findOne({
      email: req.body.email
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    res.send({
      message: "Login Successful",
      token: token,
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {

    console.log(error.message);

    res.status(500).send(error.message);
  }
});

app.get(
  "/admin/tasks",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    const allTasks = await Task.find().populate("user", "name email");

    res.send(allTasks);
});

app.get(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    const users = await User.find().select("-password");

    res.send(users);
});

app.delete(
  "/admin/users/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      // Delete user and all their tasks
      await Task.deleteMany({ user: req.params.id });
      await User.findByIdAndDelete(req.params.id);
      res.send("User and their tasks deleted");
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
});

app.post(
  "/admin/tasks",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { title, user, priority, status, dueDate } = req.body;

      if (!title || !user) {
        return res.status(400).json({ message: "Title and assigned user are required" });
      }

      const assignedUser = await User.findById(user);
      if (!assignedUser) {
        return res.status(400).json({ message: "Assigned user not found" });
      }

      const newTask = new Task({
        title,
        user: assignedUser._id,
        priority: priority || "Medium",
        status: status || "Pending",
        dueDate: dueDate || "",
        createdByAdmin: true
      });

      await newTask.save();

      res.status(201).json({ message: "Task created successfully", task: newTask });

    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
});

app.delete(
  "/admin/tasks/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      await Task.findByIdAndDelete(req.params.id);
      res.send("Task deleted by admin");
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
});

app.post(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        name,
        email,
        password: hashedPassword,
        role: "user"
      });

      await newUser.save();

      const { password: _, ...userData } = newUser.toObject();

      res.status(201).json({ message: "User created successfully", user: userData });

    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: error.message });
    }
});

app.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.send({
      name: user.name,
      email: user.email,
      role: user.role
    });

  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// ========== CHAT API ENDPOINTS ==========

app.get("/api/users", authMiddleware, async (req, res) => {
  try {
    // Return all users except the current user
    const users = await User.find({ _id: { $ne: req.user.id } }).select("-password");
    res.send(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.get("/api/messages/:userId", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    // Get messages between current user and the other user
    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.send(messages);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.get("/api/conversations", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;

    // Find all unique conversations for the current user
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { sender: new mongoose.Types.ObjectId(currentUserId) },
            { receiver: new mongoose.Types.ObjectId(currentUserId) }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: null,
          messages: { $push: "$$ROOT" }
        }
      },
      { $unwind: "$messages" },
      {
        $replaceRoot: { newRoot: "$messages" }
      }
    ]);

    // Group by the other user and get last message per conversation
    const conversationMap = new Map();

    for (const msg of messages) {
      const otherUserId = msg.sender.toString() === currentUserId
        ? msg.receiver.toString()
        : msg.sender.toString();

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          otherUserId,
          lastMessage: msg.text,
          lastMessageTime: msg.createdAt,
          lastMessageSender: msg.sender.toString()
        });
      }
    }

    // Get unread counts: count messages sent TO current user that are unread, grouped by sender
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          receiver: new mongoose.Types.ObjectId(currentUserId),
          read: false
        }
      },
      {
        $group: {
          _id: "$sender",
          count: { $sum: 1 }
        }
      }
    ]);

    const unreadMap = new Map();
    for (const entry of unreadCounts) {
      unreadMap.set(entry._id.toString(), entry.count);
    }

    // Get user details for each conversation
    const conversations = [];
    for (const [userId, conv] of conversationMap) {
      const user = await User.findById(userId).select("name email");
      if (user) {
        conversations.push({
          _id: userId,
          name: user.name,
          email: user.email,
          lastMessage: conv.lastMessage,
          lastMessageTime: conv.lastMessageTime,
          lastMessageFromMe: conv.lastMessageSender === currentUserId,
          unreadCount: unreadMap.get(userId) || 0
        });
      }
    }

    // Sort by last message time (most recent first)
    conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.send(conversations);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.post("/api/messages", authMiddleware, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: "Receiver and text are required" });
    }

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      text
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate("sender", "name email")
      .populate("receiver", "name email");

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// Mark messages from a specific user as read
app.put("/api/messages/read/:userId", authMiddleware, async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const otherUserId = req.params.userId;

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: currentUserId,
        read: false
      },
      { read: true }
    );

    res.json({ message: "Messages marked as read" });
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

// Seed admin user on startup
const seedAdmin = async () => {
  try {
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("123456", 10);
      await new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin"
      }).save();
      console.log("Admin user created: admin@gmail.com / 123456");
    } else {
      console.log("Admin user already exists");
    }
  } catch (error) {
    console.log("Error seeding admin:", error.message);
  }
};

const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  await seedAdmin();
  console.log(`Server running on port ${PORT}`);
});

