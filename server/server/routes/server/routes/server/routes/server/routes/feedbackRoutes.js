const router = require('express').Router();
const { submitFeedback } = require('../controllers/feedbackController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { feedbackRules } = require('../validators/rules');

router.post('/:complaintId', protect, authorizeRoles('USER'), feedbackRules, validate, submitFeedback);

module.exports = router;
