const Feedback = require('../models/Feedback');
const Complaint = require('../models/Complaint');

exports.submitFeedback = async (req, res, next) => {
  try {
    const { complaintId } = req.params;
    const { rating, comments } = req.body;

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) {
      res.status(404);
      throw new Error('Complaint not found');
    }

    if (complaint.userId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the complaint creator can submit feedback');
    }

    if (!['Resolved', 'Closed'].includes(complaint.status)) {
      res.status(400);
      throw new Error('Feedback can only be submitted once complaint is Resolved or Closed');
    }

    const existing = await Feedback.findOne({ complaintId });
    if (existing) {
      res.status(400);
      throw new Error('Feedback already submitted for this complaint');
    }

    const feedback = await Feedback.create({
      complaintId,
      userId: req.user._id,
      agentId: complaint.assignedAgentId,
      rating,
      comments,
    });

    res.status(201).json(feedback);
  } catch (err) {
    next(err);
  }
};
