const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  dueDate: {
    type: String
  },

  priority: {
    type: String,
    default: "Medium"
  },

  status: {
    type: String,
    default: "Pending"
  },

  projectName: {
    type: String
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }


});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;