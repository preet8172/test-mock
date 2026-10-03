const mongoose = require('mongoose');
const Complaint = require('../models/Complaint');

// Helper to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// 1. Create a new complaint
exports.createComplaint = async (req, res) => {
  try {
    const { studentName, email, title, description, category, priority, location } = req.body;

    if (!studentName || !email || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: studentName, email, title, description',
      });
    }

    const complaint = await Complaint.create({
      studentName,
      email,
      title,
      description,
      category,
      priority,
      location,
    });

    res.status(201).json({
      success: true,
      message: 'Complaint registered successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 2. Get all complaints (with filtering and search)
exports.getComplaints = async (req, res) => {
  try {
    const { status, category, priority, search } = req.query;
    let query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { title: { $regex: search,$options: 'i' } },
        { studentName: { $regex: search,$options: 'i' } },
      ];
    }

    const complaints = await Complaint.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: complaints.length,
      data: complaints,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Get complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Complaint ID format' });
    }

    const complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Update complaint details
exports.updateComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Complaint ID format' });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedComplaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint updated successfully',
      data: updatedComplaint,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// 5. Update complaint status only
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Complaint ID format' });
    }

    const validStatuses = ['Open', 'In Progress', 'Resolved', 'Rejected'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status value. Allowed values: ${validStatuses.join(', ')}`,
      });
    }

    const complaint = await Complaint.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Delete complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Complaint ID format' });
    }

    const complaint = await Complaint.findByIdAndDelete(id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Complaint deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};