const router = require('express').Router();
const {
  createComplaint,
  getMyComplaints,
  getAssignedComplaints,
  getComplaintById,
  updateComplaintStatus,
  deleteComplaint,
  addMessage,
} = require('../controllers/complaintController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { complaintRules } = require('../validators/rules');

router.post('/', protect, authorizeRoles('USER'), complaintRules, validate, createComplaint);
router.get('/my', protect, authorizeRoles('USER'), getMyComplaints);
router.get('/assigned', protect, authorizeRoles('AGENT'), getAssignedComplaints);
router.get('/:id', protect, getComplaintById);
router.patch('/:id/status', protect, authorizeRoles('AGENT', 'ADMIN'), updateComplaintStatus);
router.delete('/:id', protect, authorizeRoles('USER', 'ADMIN'), deleteComplaint);
router.post('/:id/messages', protect, addMessage);

module.exports = router;
