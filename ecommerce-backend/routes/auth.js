const router = require('express').Router();
const { register, login, logout, sendEmail } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/authMiddleware');

// User routes
router.post('/register', register);
router.post('/login', login);
router.post('/logout', authMiddleware, logout);

// Contact / Send Email
router.post('/send-email', sendEmail);

module.exports = router;
