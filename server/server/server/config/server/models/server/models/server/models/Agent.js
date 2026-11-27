const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    department: { type: String, required: true, trim: true },
    assignedComplaints: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Agent', agentSchema);
