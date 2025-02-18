const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  contactNumber: {
    type: String,
  },
  caseStatus: {
    type: String,
    enum: ['Pending', 'Resolved', 'In Progress'],
    default: 'Pending',
  },
  caseOrigin: {
    type: String,
  },
  subject: {
    type: String,
  
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  date: {
    type: Date,
  },
  time: {
    type: String,
  
  },
  complainerName: {
    type: String,
  },
}, { timestamps: true });

const Complaint = mongoose.model('complaints', complaintSchema);

module.exports = Complaint;
