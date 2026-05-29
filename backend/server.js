const cors = require("cors");
const adminMiddleware = require("./middleware/adminMiddleware");
const authMiddleware = require("./middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();
const Task = require("./models/Task");
const express = require("express");
const connectDB = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

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
      return res.send("User not found");
    }

    const isMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!isMatch) {
      return res.send("Invalid Password");
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
      email: user.email
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

    const allTasks = await Task.find();

    res.send(allTasks);
});

app.get(
  "/admin/users",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {

    const users = await User.find();

    res.send(users);
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

