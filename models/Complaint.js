const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    category: {
      type: String,
      enum: ['Infrastructure', 'IT', 'Cleanliness', 'Security', 'Other'],
      default: 'Other',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    location: {
      type: String,
      trim: true,
      default: 'Campus Premises',
    },
    status: {
      type: String,
      enum: ['Open', 'In Progress', 'Resolved', 'Rejected'],
      default: 'Open',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);