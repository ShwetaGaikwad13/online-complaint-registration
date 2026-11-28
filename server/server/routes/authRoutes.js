const router = require('express').Router();
const { register, login, logout, getProfile } = require('../../config/server/middleware/server/middleware/server/middleware/server/controllers/authController');
```[cite: 7, 8]
const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');
const { registerRules, loginRules } = require('../validators/rules');

router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getProfile);

module.exports = router;
