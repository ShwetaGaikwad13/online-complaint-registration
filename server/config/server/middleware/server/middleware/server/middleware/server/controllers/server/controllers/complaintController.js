const Complaint = require('../models/Complaint');
const sendEmail = require('../config/mailer');

const canAccessComplaint = (complaint, user) => {
  const isOwner = complaint.userId.toString() === user._id.toString();
  const isAgent =
    complaint.assignedAgentId &&
    complaint.assignedAgentId.toString() === user._id.toString();
  const isAdmin = user.role === 'ADMIN';
  return isOwner || isAgent || isAdmin;
};

exports.createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, attachments } = req.body;
    const complaint = await Complaint.create({
      userId: req.user._id,
      title,
      description,
      category,
      attachments: attachments || [],
    });

    await sendEmail({
      to: req.user.email,
      subject: `Complaint Registered: ${complaint.title}`,
      text: `Your complaint (ID: ${complaint._id}) has been submitted with status "${complaint.status}".`,
    });

    res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
};

exports.getMyComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ userId: req.user._id })
      .populate('assignedAgentId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

exports.getAssignedComplaints = async (req, res, next) => {
  try {
    const complaints = await Complaint.find({ assignedAgentId: req.user._id })
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

exports.getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('userId', 'name email phone')
      .populate('assignedAgentId', 'name email phone')
      .populate('messages.senderId', 'name role');

    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    if (!canAccessComplaint(complaint, req.user)) {
      res.status(403);
      throw new Error('Access denied');
    }

    res.json(complaint);
  } catch (err) {
    next(err);
  }
};

exports.updateComplaintStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'];
    if (!validStatuses.includes(status)) {
      res.status(400);
      throw new Error('Invalid status');
    }

    const complaint = await Complaint.findById(req.params.id).populate('userId', 'email name');
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    if (!canAccessComplaint(complaint, req.user) || req.user.role === 'USER') {
      res.status(403);
      throw new Error('Only assigned agent or admin can update status');
    }

    complaint.status = status;
    await complaint.save();

    await sendEmail({
      to: complaint.userId.email,
      subject: `Complaint Status Updated: ${complaint.title}`,
      text: `Hello ${complaint.userId.name}, your complaint status is now "${status}".`,
    });

    res.json(complaint);
  } catch (err) {
    next(err);
  }
};

exports.deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    const isOwner = complaint.userId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'ADMIN';
    if (!isOwner && !isAdmin) {
      res.status(403);
      throw new Error('Not authorized to delete this complaint');
    }

    await complaint.deleteOne();
    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.addMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      res.status(400);
      throw new Error('Message text is required');
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    if (!canAccessComplaint(complaint, req.user)) {
      res.status(403);
      throw new Error('Access denied');
    }

    complaint.messages.push({
      senderId: req.user._id,
      senderRole: req.user.role,
      text: text.trim(),
    });

    await complaint.save();
    res.status(201).json(complaint.messages);
  } catch (err) {
    next(err);
  }
};
