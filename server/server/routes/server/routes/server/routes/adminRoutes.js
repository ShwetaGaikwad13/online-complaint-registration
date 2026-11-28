const router = require('express').Router();
const {
  getAllComplaints,
  getAllUsers,
  getAllAgents,
  assignAgent,
  getAnalytics,
} = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect, authorizeRoles('ADMIN'));
router.get('/complaints', getAllComplaints);
router.get('/users', getAllUsers);
router.get('/agents', getAllAgents);
router.patch('/assign/:id', assignAgent);
router.get('/analytics', getAnalytics);

module.exports = router;
