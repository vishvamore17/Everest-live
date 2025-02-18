const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  subject: { type: String },
  name: { type: String },
  relatedTo: { type: String },
  dueDate: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Resolved", "In Progress"],
    default: "Pending",
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  assigned: { type: String },
  lastReminderDate: { type: Date },
  lastReminder: { type: String },
});

const Task = mongoose.model("tasks", taskSchema);

module.exports = Task;
