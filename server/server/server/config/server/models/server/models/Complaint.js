const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['USER', 'AGENT', 'ADMIN'], required: true },
  text: { type: String, required: true, trim: true },
  createdAt: { type: Date, default: Date.now },
});

const complaintSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Technical', 'Billing', 'Service', 'General'],
      required: true,
    },
    attachments: [{ type: String }],
    status: {
      type: String,
      enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'],
      default: 'Pending',
      index: true,
    },
    messages: [messageSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
