const Complaint = require('../models/Complaint');
const Agent = require('../models/Agent');
const User = require('../models/User');
const Feedback = require('../models/Feedback');

exports.getAllComplaints = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.category) filter.category = req.query.category;

    const complaints = await Complaint.find(filter)
      .populate('userId', 'name email')
      .populate('assignedAgentId', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (err) {
    next(err);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    next(err);
  }
};

exports.getAllAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find()
      .populate('userId', 'name email phone role')
      .populate('assignedComplaints', 'title status category');
    res.json(agents);
  } catch (err) {
    next(err);
  }
};

exports.assignAgent = async (req, res, next) => {
  try {
    const { agentUserId } = req.body;

    const agentUser = await User.findById(agentUserId);
    if (!agentUser || agentUser.role !== 'AGENT') {
      res.status(400);
      throw new Error('Valid agent user ID is required');
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    complaint.assignedAgentId = agentUser._id;
    complaint.status = 'Assigned';
    await complaint.save();

    await Agent.findOneAndUpdate(
      { userId: agentUser._id },
      { $addToSet: { assignedComplaints: complaint._id } },
      { upsert: true }
    );

    res.json(complaint);
  } catch (err) {
    next(err);
  }
};

exports.getAnalytics = async (req, res, next) => {
  try {
    const [totalComplaints, byStatus, byCategory, ratingStats] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
      Feedback.aggregate([
        { $group: { _id: null, avgRating: { $avg: '$rating' }, totalFeedback: { $sum: 1 } } },
      ]),
    ]);

    res.json({
      totalComplaints,
      byStatus,
      byCategory,
      feedbackSummary: ratingStats[0] || { avgRating: 0, totalFeedback: 0 },
    });
  } catch (err) {
    next(err);
  }
};
