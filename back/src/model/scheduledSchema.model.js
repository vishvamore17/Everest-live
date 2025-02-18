const mongoose = require("mongoose");
const scheduledEventSchema = new mongoose.Schema({
  subject: {
    type: String,
    // required: true,
  },
  assignedUser: {
    type: String,
    // required: true,
  },
  customer: {
    type: String,
    // required: true,
  },
  location: {
    type: String,
    // required: true,
  },
  status: {
    type: String,
    enum: ["Scheduled", "Completed", "Cancelled", "Postpone"],
    // required: true,
  },
  eventType: {
    type: String,
    enum: [
      "call",
      "Call",
      "Meeting",
      "meeting",
      "Demo",
      "demo",
      "Follow-Up",
      "follow-up",
    ],
    // required: true,
    // default: "call",
  },
  priority: {
    type: String,
    enum: ["Low", "low", "Medium", "medium", "High", "high"],
    // required: true,
  },
  description: {
    type: String,
  },
  reminder: {
    type: Number,
  },
  recurrence: {
    type: String,
    enum: ["one-time", "Daily", "Weekly", "Monthly", "Yearly"],
  },
  date: {
    type: String,
    // required: true,
  },
});

const Scheduled = mongoose.model("scheduledevents", scheduledEventSchema);

module.exports = Scheduled;
